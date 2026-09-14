import { describe, expect, it } from 'vitest'
import { activeRelic, createRun, loadRun, saveRun, transitionRun, SAVE_KEY } from '../src/story/runState'
import { EPISODES } from '../src/story/episodes'
import { eligibleChoices } from '../src/story/episodeMachine'

function finish(run = createRun()) {
  run = transitionRun(run, { type: 'enter' })
  for (let guard = 0; guard < 20; guard++) {
    const node = EPISODES[run.episodeIndex].nodes[run.state.nodeId]
    if (node.stage === 'ending') return run
    if (node.stage === 'choice') {
      const choices = eligibleChoices(node, { tags: run.state.tags, relicIds: activeRelic(run) ? [activeRelic(run)!.id] : [] })
      run = transitionRun(run, { type: 'choose', choiceId: choices[0].id })
    } else run = transitionRun(run, { type: 'advance' })
  }
  throw new Error('Story failed to terminate')
}

describe('persisted relic run', () => {
  it('awards the ending relic before continuing and restores that ending', () => {
    const run = finish()
    expect(run.completed).toHaveLength(1)
    expect(run.completed[0].endingId).toBe('exam-end-exception')
    window.localStorage.clear()
    expect(saveRun(window.localStorage, run)).toBe(true)
    const restored = loadRun(window.localStorage)
    expect(restored.state.nodeId).toBe('exam-end-exception')
    expect(restored.completed).toHaveLength(1)
  })
  it('activates only the immediately previous relic, keeping older ones archived', () => {
    const one = finish()
    const two = finish(transitionRun(one, { type: 'continue' }))
    const three = transitionRun(two, { type: 'continue' })
    expect(three.completed).toHaveLength(2)
    expect(activeRelic(three)?.id).toBe(two.completed[1].relic.id)
  })
  it('replay removes the selected result and all downstream results', () => {
    const run = finish(transitionRun(finish(), { type: 'continue' }))
    const replay = transitionRun(run, { type: 'replay', episodeIndex: 0 })
    expect(replay.completed).toEqual([])
    expect(replay.state.nodeId).toBe('feed-hook')
    expect(replay.episodeIndex).toBe(0)
    expect(activeRelic(replay)).toBeUndefined()
    expect(finish(replay).completed).toHaveLength(1)
  })
  it('persists prompt acknowledgments and replay clears only target and downstream acknowledgments', () => {
    let run = finish()
    run = transitionRun(run, { type: 'acknowledge-award' })
    run = transitionRun(run, { type: 'continue' })
    run = transitionRun(run, { type: 'advance' })
    run = transitionRun(run, { type: 'advance' })
    run = transitionRun(run, { type: 'choose', choiceId: 'witch-q1-research' })
    run = transitionRun(run, { type: 'advance' })
    run = transitionRun(run, { type: 'acknowledge-opportunity' })

    expect(run.acknowledgedAwards).toEqual(['0:exam-end-exception'])
    expect(run.acknowledgedOpportunities).toEqual(['1:q2-research:named-roll'])
    expect(saveRun(window.localStorage, run)).toBe(true)
    expect(loadRun(window.localStorage).acknowledgedOpportunities).toEqual(['1:q2-research:named-roll'])

    const replaySecond = transitionRun(run, { type: 'replay', episodeIndex: 1 })
    expect(replaySecond.acknowledgedAwards).toEqual(['0:exam-end-exception'])
    expect(replaySecond.acknowledgedOpportunities).toEqual([])
  })
  it('loads old version-two saves without acknowledgment fields', () => {
    const run = finish()
    const oldSave = { ...run } as Partial<typeof run>
    delete oldSave.acknowledgedAwards
    delete oldSave.acknowledgedOpportunities
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(oldSave))
    const restored = loadRun(window.localStorage)
    expect(restored.acknowledgedAwards).toEqual([])
    expect(restored.acknowledgedOpportunities).toEqual([])
  })
  it('restores used relic tags and never consumes the collected object', () => {
    let run = transitionRun(finish(), { type: 'continue' })
    run = transitionRun(run, { type: 'advance' })
    run = transitionRun(run, { type: 'advance' })
    run = transitionRun(run, { type: 'choose', choiceId: 'witch-q1-research' })
    run = transitionRun(run, { type: 'advance' })
    const incoming = activeRelic(run)!
    const choices = eligibleChoices(EPISODES[1].nodes[run.state.nodeId], { tags: run.state.tags, relicIds: [incoming.id] })
    const offer = choices.find((choice) => choice.relicId === incoming.id)!
    expect(offer).toBeDefined()
    run = transitionRun(run, { type: 'choose', choiceId: offer.id })
    expect(run.usedRelicId).toBe(incoming.id)
    expect(run.completed).toHaveLength(1)
    expect(saveRun(window.localStorage, run)).toBe(true)
    const restored = loadRun(window.localStorage)
    expect(restored.usedRelicId).toBe(incoming.id)
    expect(restored.state.tags).toEqual(run.state.tags)
    expect(activeRelic(restored)?.id).toBe(incoming.id)
    expect(restored.state.nodeId).toBe(run.state.nodeId)
  })
  it('rejects a hidden or unavailable choice rather than granting its tags', () => {
    let run = createRun()
    run = transitionRun(run, { type: 'advance' })
    run = transitionRun(run, { type: 'advance' })
    const invalid = transitionRun(run, { type: 'choose', choiceId: 'witch-teacher-q2-echo' })
    expect(invalid.state.nodeId).toBe('q1')
    expect(invalid.state.tags).toEqual([])
  })
  it('recovers a confirmed legacy ending but never guesses from an inventory name', () => {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify({ episodeIndex: 0, state: { nodeId: 'exam-end-sealed' } }))
    expect(loadRun(window.localStorage).completed[0].endingId).toBe('exam-end-sealed')
    window.localStorage.setItem(SAVE_KEY, JSON.stringify({ relics: [{ id: 'sealed-page' }] }))
    const unknown = loadRun(window.localStorage)
    expect(unknown.completed).toEqual([])
    expect(unknown.notice).toBeTruthy()
  })
  it('does not claim success when storage fails and handles malformed saves', () => {
    expect(saveRun({ setItem: () => { throw new Error('quota') } }, createRun())).toBe(false)
    window.localStorage.setItem(SAVE_KEY, '{broken')
    expect(loadRun(window.localStorage).notice).toBeTruthy()
    window.localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 2, episodeIndex: 100, state: { nodeId: 'fake' } }))
    expect(loadRun(window.localStorage).episodeIndex).toBe(0)
  })
  it('notices unknown completed entries and backs up their raw save before replacing it', () => {
    const confirmed = finish()
    const run = transitionRun(confirmed, { type: 'continue' })
    const raw = JSON.stringify({ ...run, completed: [...run.completed, { episodeIndex: 1, endingId: 'unrecognized-old-ending', relic: { id: 'unknown' } }] })
    window.localStorage.setItem(SAVE_KEY, raw)

    const restored = loadRun(window.localStorage)
    expect(restored.notice).toContain('部分结局记录无法确认')
    expect(restored.completed).toEqual(confirmed.completed)
    expect(activeRelic(restored)?.id).toBe(confirmed.completed[0].relic.id)
    expect(saveRun(window.localStorage, restored)).toBe(true)
    expect(window.localStorage.getItem(`${SAVE_KEY}:unrecognized-backup`)).toBe(raw)
    expect(JSON.parse(window.localStorage.getItem(SAVE_KEY)!).completed).toHaveLength(1)
    expect(loadRun(window.localStorage).completed).toEqual(confirmed.completed)
  })
  it('keeps the original save if its unrecognized-data backup cannot be written', () => {
    const run = transitionRun(finish(), { type: 'continue' })
    const raw = JSON.stringify({ ...run, completed: [...run.completed, null] })
    window.localStorage.setItem(SAVE_KEY, raw)
    const restored = loadRun(window.localStorage)
    const storage = { setItem: (key: string, value: string) => {
      if (key === `${SAVE_KEY}:unrecognized-backup`) throw new Error('quota')
      window.localStorage.setItem(key, value)
    } }
    expect(saveRun(storage, restored)).toBe(false)
    expect(window.localStorage.getItem(SAVE_KEY)).toBe(raw)
  })
})
