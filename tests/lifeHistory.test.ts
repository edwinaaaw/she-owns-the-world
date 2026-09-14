import { describe, expect, it } from 'vitest'
import { createRun, loadRun, transitionRun } from '../src/story/runState'
import { createTrial, seasonEchoes } from '../src/story/lifeHistory'
import { EPISODES } from '../src/story/episodes'
import { eligibleChoices } from '../src/story/episodeMachine'

function firstChoice() {
  let run = transitionRun(createRun(), { type: 'enter' })
  while (EPISODES[run.episodeIndex].nodes[run.state.nodeId].stage !== 'choice') run = transitionRun(run, { type: 'advance' })
  return run
}
function finish(initial = firstChoice()) {
  let run = initial
  for (let n = 0; n < 30; n++) {
    const node = EPISODES[run.episodeIndex].nodes[run.state.nodeId]
    if (node.stage === 'ending') return run
    if (node.stage === 'choice') run = transitionRun(run, { type: 'choose', choiceId: eligibleChoices(node, { tags: run.state.tags, relicIds: [] })[0].id })
    else run = transitionRun(run, { type: 'advance' })
  }
  throw new Error('No ending')
}
describe('actual choice memories', () => {
  it('keeps the recorded ending text on reload and leaves an old unrecorded ending unknown', () => {
    const ended = finish()
    ended.completed[0].endingText = '当时保存的结语'
    expect(loadRun({ getItem: () => JSON.stringify(ended) }).completed[0].endingText).toBe('当时保存的结语')
    const old = { ...ended, choiceLog: undefined, completed: ended.completed.map(({ choices, endingText, ...entry }) => entry) }
    expect(loadRun({ getItem: () => JSON.stringify(old) }).completed[0].endingText).toBeUndefined()
  })
  it('records the selected action and pre-choice facts, not an unselected action', () => {
    const before = firstChoice()
    const after = transitionRun(before, { type: 'choose', choiceId: 'exam-q1-record' })
    expect(after.choiceLog).toHaveLength(1)
    expect(after.choiceLog![0]).toMatchObject({ choiceId: 'exam-q1-record', round: 1, before: { nodeId: 'q1', tags: [] } })
    expect(after.choiceLog![0].label).toContain('真名')
    expect(after.choiceLog![0].outcome).toContain('林昭')
    expect(before.choiceLog).toEqual([])
    expect(transitionRun(after, { type: 'choose', choiceId: 'not-real' }).choiceLog).toHaveLength(1)
  })
  it('keeps all five memories and the ending across chapters and reload', () => {
    const ended = finish()
    expect(ended.completed[0].choices).toHaveLength(5)
    expect(ended.completed[0].endingText).toBeTruthy()
    const next = transitionRun(ended, { type: 'continue' })
    const loaded = loadRun({ getItem: () => JSON.stringify(next) })
    expect(loaded.choiceLog).toEqual([])
    expect(loaded.completed[0].choices).toEqual(ended.choiceLog)
  })
  it('does not reconstruct missing old choices', () => {
    const ended = finish()
    const old = { ...ended, choiceLog: undefined, logComplete: undefined, completed: ended.completed.map(({ choices, endingText, logComplete, ...entry }) => entry) }
    const loaded = loadRun({ getItem: () => JSON.stringify(old) })
    expect(loaded.choiceLog).toEqual([])
    expect(loaded.logComplete).toBe(false)
    expect(loaded.completed[0].choices ?? []).toEqual([])
    expect(seasonEchoes(loaded.completed)).toEqual([])
  })
})
describe('independent trial', () => {
  it('restores relic availability before use but preserves its use before a later decision', () => {
    let run = transitionRun(finish(), { type: 'continue' })
    const toChoice = () => {
      for (let n = 0; n < 10 && EPISODES[run.episodeIndex].nodes[run.state.nodeId].stage !== 'choice'; n++)
        run = transitionRun(run, { type: 'advance' })
    }
    toChoice()
    run = transitionRun(run, { type: 'choose', choiceId: 'witch-q1-teacher' })
    toChoice()
    const relicId = run.completed[0].relic.id
    const relicChoice = eligibleChoices(EPISODES[1].nodes[run.state.nodeId], { tags: run.state.tags, relicIds: [relicId] }).find((choice) => choice.relicId)!
    run = transitionRun(run, { type: 'choose', choiceId: relicChoice.id })
    toChoice()
    const thirdChoice = eligibleChoices(EPISODES[1].nodes[run.state.nodeId], { tags: run.state.tags, relicIds: [] })[0]
    run = transitionRun(run, { type: 'choose', choiceId: thirdChoice.id })
    const beforeUse = createTrial(run, 1, 1)!
    expect(beforeUse.usedRelicId).toBeUndefined()
    expect(transitionRun(beforeUse, { type: 'choose', choiceId: relicChoice.id }).usedRelicId).toBe(relicId)
    const afterUse = createTrial(run, 1, 2)!
    expect(afterUse.usedRelicId).toBe(relicId)
    expect(afterUse.state.tags).toEqual(run.choiceLog![2].before.tags)
    const replayed = transitionRun(run, { type: 'replay', episodeIndex: 0 })
    expect(replayed.choiceLog).toEqual([])
    expect(replayed.completed).toEqual([])
  })
  it('starts at a recorded choice with only the facts known before it', () => {
    const original = finish()
    const snapshot = JSON.stringify(original)
    const trial = createTrial(original, 0, 1)!
    expect(trial.state.nodeId).toBe('q2-record')
    expect(trial.state.tags).toContain('routeRecord')
    expect(trial.state.tags).not.toContain('authorshipRecorded')
    expect(trial.choiceLog).toHaveLength(1)
    const changed = transitionRun(trial, { type: 'choose', choiceId: 'exam-record-q2-witness' })
    expect(changed.state.tags).toContain('shenWitness')
    expect(JSON.stringify(original)).toBe(snapshot)
  })
  it('rejects unknown chapters and unknown decision points', () => {
    const run = firstChoice()
    expect(createTrial(run, 1)).toBeNull()
    expect(createTrial(run, 0, 9)).toBeNull()
    expect(createTrial(run, 0)?.state.nodeId).toBe('feed-hook')
  })
  it('uses actual stored labels for season recall, no personality score', () => {
    const run = finish()
    const echoes = seasonEchoes(run.completed)
    expect(echoes.length).toBeGreaterThan(0)
    expect(echoes.join('')).toContain(run.completed[0].choices![4].label)
  })
})
