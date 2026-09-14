import { describe, expect, it } from 'vitest'
import { EPISODES } from '../src/story/episodes'
import { advance, choose, createInitialState, eligibleChoices, presentNode } from '../src/story/episodeMachine'
import { createRun, loadRun, saveRun } from '../src/story/runState'
import type { EpisodeState } from '../src/story/types'
import { withReturnHomeConsequences } from '../src/story/episodes/returnHomeConsequences'

const episode = EPISODES.find((entry) => entry.id === 'return-home')!
function settle(state: EpisodeState): EpisodeState {
  while (!['choice', 'ending'].includes(episode.nodes[state.nodeId].stage)) state = advance(episode, state)
  return state
}
function pick(state: EpisodeState, id: string, relicIds: string[] = []): EpisodeState {
  expect(eligibleChoices(episode.nodes[state.nodeId], { tags: state.tags, relicIds }).map((choice) => choice.id)).toContain(id)
  return settle(choose(episode, state, id))
}
function play(ids: string[]): EpisodeState {
  return ids.reduce((state, id) => pick(state, id), settle(createInitialState(episode)))
}
const body = (state: EpisodeState) => presentNode(episode, state).body
const compete = (third = 'clara', second = 'both') => play(['home-q1-compete', `home-compete-q2-${second}`, `home-compete-q3-${third}`])
const competeFinal = (third = 'clara', fourth = 'alone', second = 'both') => pick(compete(third, second), `home-compete-q4-${fourth}`)
const homeFinal = (second: string, third: string, fourth = 'call') => play(['home-q1-home', `home-home-q2-${second}`, `home-home-q3-${third}`, `home-home-q4-${fourth}`])

describe('fourth-life choices are remembered by the actual later scene', () => {
  // Removing the promise condition must lose the reminder and differentiated relationship outcome.
  it('reminds before signing, permits betrayal, and keeps the awarded position', () => {
    const final = competeFinal()
    expect(body(final)).toMatch(/克拉拉[\s\S]*答应/)
    expect(eligibleChoices(episode.nodes[final.nodeId], { tags: final.tags, relicIds: [] }).map((choice) => choice.id)).toEqual(['home-compete-q5-sign', 'home-compete-q5-contest'])
    const betrayed = pick(final, 'home-compete-q5-sign')
    expect(betrayed.nodeId).toBe('home-end-one')
    expect(body(betrayed)).toMatch(/工牌[\s\S]*克拉拉[\s\S]*答应[\s\S]*(签|声明)/)
    const noPromise = pick(competeFinal('job'), 'home-compete-q5-sign')
    expect(body(noPromise)).not.toMatch(/你答应|答应过|承诺过/)
    expect(body(noPromise)).not.toBe(body(betrayed))
  })

  it('returns Clara’s kept promise response without reversing the lost appointment', () => {
    const kept = pick(competeFinal(), 'home-compete-q5-contest')
    expect(kept.nodeId).toBe('home-end-film')
    expect(body(kept)).toMatch(/取消任命/)
    expect(body(kept)).toMatch(/克拉拉[\s\S]*(守|答应|信封)/)
    expect(body(kept)).not.toBe(body(pick(competeFinal('job'), 'home-compete-q5-contest')))
  })

  // A missing eligibility gate would invent cooperation from a one-sided exam.
  it('opens a skilled joint repair only after both candidates designed the exam', () => {
    const balanced = compete()
    const joint = pick(balanced, 'home-compete-q4-joint')
    expect(joint.nodeId).toBe('q5-compete')
    expect(joint.tags).toContain('jointRepair')
    const result = presentNode(episode, choose(episode, balanced, 'home-compete-q4-joint'))
    expect(result.body).toMatch(/断电/)
    expect(result.body).toMatch(/比阿特丽斯/)
    expect(result.body).toMatch(/(共同|两人|各自).*(记|署|签)/)
    expect(joint.tags).not.toContain('trainedWorkerHandled')
    const unilateral = compete('clara', 'war')
    expect(eligibleChoices(episode.nodes[unilateral.nodeId], { tags: unilateral.tags, relicIds: [] }).map((choice) => choice.id)).not.toContain('home-compete-q4-joint')
    expect(eligibleChoices(episode.nodes[joint.nodeId], { tags: joint.tags, relicIds: [] })).toHaveLength(2)
  })

  it('makes evacuation and solo speed distinct negotiation evidence, not identical fixed scores', () => {
    const solo = competeFinal('job', 'alone', 'war')
    const safe = competeFinal('job', 'stopfilm', 'war')
    expect(body(solo)).not.toBe(body(safe))
    expect(body(solo)).toMatch(/(用时|速度|抢修|恢复生产)/)
    expect(body(safe)).toMatch(/(疏散|无人受伤|安全)/)
    expect(body(safe)).not.toContain('分数接近')
    for (const state of [solo, safe]) {
      expect(pick(state, 'home-compete-q5-sign').nodeId).toBe('home-end-one')
      expect(pick(state, 'home-compete-q5-contest').nodeId).toBe('home-end-film')
    }
    expect(body(pick(solo, 'home-compete-q5-sign'))).not.toBe(body(pick(safe, 'home-compete-q5-sign')))
  })

  it('carries handoff design into the family scheduling conversation', () => {
    const overlap = play(['home-q1-share', 'home-share-q2-roster'])
    const areas = play(['home-q1-share', 'home-share-q2-split'])
    expect(body(overlap)).not.toBe(body(areas))
    expect(body(overlap)).toMatch(/(重叠|一小时)/)
    expect(body(areas)).toMatch(/(跨区|两区)/)
  })

  it('asks each affected person before recording care, and carries that limit into the ending', () => {
    const before = play(['home-q1-share', 'home-share-q2-roster'])
    const careResult = choose(episode, before, 'home-share-q3-care')
    expect(body(careResult)).toMatch(/克拉拉[\s\S]*妹妹[\s\S]*(同意|允许)/)
    expect(body(careResult)).toMatch(/(病情|诊断|姓名).*(不|留|删)|不.*(病情|诊断|姓名)/)
    const care = pick(settle(careResult), 'home-share-q4-stage')
    const fixed = play(['home-q1-share', 'home-share-q2-roster', 'home-share-q3-fixed', 'home-share-q4-stage'])
    expect(body(care)).not.toBe(body(fixed))
    for (const [id, target] of [['home-share-q5-trial', 'home-end-shared'], ['home-share-q5-workers', 'home-end-roster']]) {
      const careEnding = pick(care, id)
      const fixedEnding = pick(fixed, id)
      expect(careEnding.nodeId).toBe(target)
      expect(fixedEnding.nodeId).toBe(target)
      expect(body(careEnding)).not.toBe(body(fixedEnding))
      expect(body(careEnding)).toMatch(/(同意|允许|病情)/)
    }
  })

  it('makes signed instructions and refusal playable, without treating a copy as worker training', () => {
    const signed = play(['home-q1-home', 'home-home-q2-letter', 'home-home-q3-joint'])
    const refused = play(['home-q1-home', 'home-home-q2-refuse', 'home-home-q3-joint'])
    expect(body(signed)).not.toBe(body(refused))
    expect(body(signed)).toMatch(/(抄|说明)/)
    expect(body(signed)).not.toContain('没有见过')
    expect(body(refused)).toMatch(/六小时/)
    for (const state of [signed, refused]) {
      expect(eligibleChoices(episode.nodes[state.nodeId], { tags: state.tags, relicIds: [] }).some((choice) => choice.grantsTags?.includes('trainedWorkerHandled'))).toBe(false)
      const restored = pick(pick(state, 'home-home-q4-call'), 'home-home-q5-badge')
      expect(restored.nodeId).toBe('home-end-badge')
      expect(body(restored)).toContain('工牌回到胸前')
    }
  })

  it('distinguishes a film participant from an invited account challenger through the final choice', () => {
    const account = homeFinal('letter', 'joint')
    const film = homeFinal('refuse', 'film')
    const accountFourth = play(['home-q1-home', 'home-home-q2-letter', 'home-home-q3-joint'])
    expect(body(accountFourth)).not.toMatch(/继续切面包|你系着围裙|你已签.*拍摄/)
    expect(body(account)).not.toBe(body(film))
    for (const id of ['home-home-q5-badge', 'home-home-q5-film']) {
      expect(body(pick(account, id))).toMatch(/(银行|账户)/)
      expect(body(pick(film, id))).toMatch(/(半年津贴|拍摄约定)/)
      expect(body(pick(account, id))).not.toBe(body(pick(film, id)))
    }
  })

  it('preserves the promise through a real midchapter save and has no fresh-run phantom promise', () => {
    const state = compete()
    const values = new Map<string, string>()
    const storage = { setItem: (key: string, value: string) => { values.set(key, value) }, getItem: (key: string) => values.get(key) ?? null }
    expect(saveRun(storage, { ...createRun(), episodeIndex: 3, state, entered: true })).toBe(true)
    const loaded = loadRun(storage)
    const finish = (start: EpisodeState) => pick(pick(start, 'home-compete-q4-alone'), 'home-compete-q5-sign')
    expect(body(finish(loaded.state))).toBe(body(finish(state)))
    expect(body(finish(loaded.state))).toMatch(/克拉拉[\s\S]*答应/)
    expect(createInitialState(episode).tags).toEqual([])
    expect(body(pick(competeFinal('job'), 'home-compete-q5-sign'))).not.toMatch(/你答应|答应过|承诺过/)
  })

  it('restores a legacy side-door save without offering that third ordinary choice in a new run', () => {
    const legacy = { ...createRun(), episodeIndex: 3, entered: true, state: {
      nodeId: 'q3-home', history: ['feed-hook', 'intro', 'q1', 'result-q1-home', 'q2-home', 'result-home-home-q2-secret'],
      tags: ['routeHome', 'secretReturn'], effects: [], recentEffects: [],
    } }
    const loaded = loadRun({ getItem: () => JSON.stringify(legacy) })
    expect(body(loaded.state)).toMatch(/侧门/)
    const restored = pick(pick(pick(loaded.state, 'home-home-q3-joint'), 'home-home-q4-call'), 'home-home-q5-badge')
    expect(restored.nodeId).toBe('home-end-badge')
    expect(body(restored)).toMatch(/侧门/)
    const fresh = play(['home-q1-home'])
    expect(eligibleChoices(episode.nodes[fresh.nodeId], { tags: fresh.tags, relicIds: [] }).map((choice) => choice.id)).toEqual(['home-home-q2-letter', 'home-home-q2-refuse'])
  })

  it('does not share mutable memory or choice arrays with the supplied chapter', () => {
    const decorated = withReturnHomeConsequences(episode)
    decorated.nodes['q4-compete'].choices![0].grantsTags!.push('test-only')
    decorated.nodes['q5-compete'].bodyByTag![0].body = 'test-only'
    expect(episode.nodes['q4-compete'].choices![0].grantsTags).not.toContain('test-only')
    expect(body(competeFinal())).not.toContain('test-only')
  })

  it('does not treat the old careVisible save tag as recorded consent', () => {
    const legacy = { ...createRun(), episodeIndex: 3, entered: true, state: {
      nodeId: 'q4-share', history: ['q1', 'result-q1-share', 'q2-share', 'result-home-share-q2-roster', 'q3-share', 'result-home-share-q3-care'],
      tags: ['routeShare', 'sharedHandoff', 'careVisible'], effects: [], recentEffects: [],
    } }
    const loaded = loadRun({ getItem: () => JSON.stringify(legacy) })
    expect(body(loaded.state)).toMatch(/(先问|尚未确认)/)
    const ending = pick(pick(loaded.state, 'home-share-q4-stage'), 'home-share-q5-trial')
    expect(body(ending)).not.toMatch(/当事人允许|当事人同意|获准登记/)
  })

  it('loads an old care consequence without inventing the newer consent conversation', () => {
    const legacy = { ...createRun(), episodeIndex: 3, entered: true, state: {
      nodeId: 'result-home-share-q3-care', history: ['q1', 'result-q1-share', 'q2-share', 'result-home-share-q2-roster', 'q3-share'],
      tags: ['routeShare', 'sharedHandoff', 'careVisible'], effects: [], recentEffects: [],
    } }
    const loaded = loadRun({ getItem: () => JSON.stringify(legacy) })
    expect(loaded.state.nodeId).toBe('result-home-share-q3-care')
    expect(body(loaded.state)).not.toMatch(/两人都只同意|获准登记|当事人允许/)
    expect(body(loaded.state)).toMatch(/(尚未确认|还要问|先问)/)
    expect(body(settle(loaded.state))).toMatch(/先问/)

    const fresh = play(['home-q1-share', 'home-share-q2-roster'])
    const result = choose(episode, fresh, 'home-share-q3-care')
    expect(result.tags).toContain('careConsentConfirmed')
    expect(body(result)).toMatch(/克拉拉[\s\S]*妹妹[\s\S]*同意/)
    expect(body(settle(result))).toMatch(/获准登记/)
  })

  for (const relic of ['joint-drawing', 'maintenance-card']) {
    it(`${relic}: remembers handoff without inventing an accepted film contract or withdrawing restored work`, () => {
      let state = play(['home-q1-home'])
      state = pick(state, `use-return-home-home-${relic}`, [relic])
      state = pick(state, `follow-return-home-home-${relic}`)
      expect(body(state)).not.toMatch(/继续切面包|你系着围裙/)
      const final = pick(state, 'home-home-q4-run')
      const restored = pick(final, 'home-home-q5-badge')
      expect(body(restored)).toContain('工牌回到胸前')
      expect(body(restored)).not.toMatch(/工资与名额仍停|岗位仍卡|复职仍未获准/)
    })
  }

  for (const route of ['compete', 'share', 'home']) for (const relic of ['', 'stop-wrench', 'joint-drawing', 'maintenance-card']) {
    it(`${route}/${relic || 'no relic'}: every reachable path has five choices, valid targets, and no invented promise`, () => {
      const start = play([`home-q1-${route}`])
      const walk = (state: EpisodeState, used: boolean, decisions: number) => {
        const node = episode.nodes[state.nodeId]
        expect(node).toBeDefined()
        if (node.stage === 'ending') {
          expect(decisions).toBe(5)
          if (!state.tags.includes('claraKeepsJob')) expect(body(state)).not.toMatch(/你答应|答应过|承诺过/)
          return
        }
        const choices = eligibleChoices(node, { tags: state.tags, relicIds: relic && !used ? [relic] : [] })
        expect(choices.filter((choice) => !choice.relicId)).toHaveLength(2)
        expect(choices.filter((choice) => choice.relicId).length).toBeLessThanOrEqual(1)
        for (const choice of choices) {
          expect(episode.nodes[choice.nextId]).toBeDefined()
          walk(settle(choose(episode, state, choice.id)), used || Boolean(choice.relicId), decisions + 1)
        }
      }
      walk(start, false, 1)
    })
  }
})
