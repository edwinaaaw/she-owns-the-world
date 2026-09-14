import { describe, expect, it } from 'vitest'
import { EPISODES } from '../src/story/episodes'
import { eligibleChoices, presentNode } from '../src/story/episodeMachine'
import { witchTrial as authoredWitch } from '../src/story/episodes/witchTrial'

const links = [
  ['witch-trial', ['teacher', 'research', 'patient'], ['named-roll', 'sealed-page', 'school-roster']],
  ['spinning-jenny', ['owner', 'workers', 'open'], ['signed-prescription', 'anonymous-dose', 'prison-thread']],
  ['return-home', ['compete', 'share', 'home'], ['stop-wrench', 'joint-drawing', 'maintenance-card']],
  ['ghost-marriage', ['marriage', 'investigate', 'refuse'], ['shared-roster', 'old-badge', 'film-strip']],
  ['male-safety', ['comply', 'witness', 'private'], ['unexecuted-will', 'cut-red-cord', 'worker-ledger']],
] as const

describe('previous-life objects change this life', () => {
  for (const [episodeId, routes, relicIds] of links) {
    for (const route of routes) for (const relicId of relicIds) {
      it(`${episodeId}/${route}: ${relicId} opens one later action without adding a round`, () => {
        const episode = EPISODES.find((item) => item.id === episodeId)!
        const offers = [2, 3, 4, 5].flatMap((round) =>
          eligibleChoices(episode.nodes[`q${round}-${route}`], { tags: [], relicIds: [relicId] })
            .filter((choice) => choice.relicId === relicId))
        expect(offers).toHaveLength(1)
        const offer = offers[0]
        expect(eligibleChoices(episode.nodes[`q2-${route}`], { tags: [], relicIds: [] })).not.toContainEqual(offer)
        const result = episode.nodes[offer.nextId]
        expect(result.stage).toBe('consequence')
        expect(result.nextId).toBe(`q3-${route}`)
        const next = episode.nodes[result.nextId!]
        const before = eligibleChoices(next, { tags: [], relicIds: [relicId] })
        const after = eligibleChoices(next, { tags: offer.grantsTags ?? [], relicIds: [relicId] })
        const unlocked = after.filter((choice) => !before.some((old) => old.id === choice.id))
        expect(unlocked).toHaveLength(1)
        const follow = unlocked[0]
        expect(follow.relicId).toBeUndefined()
        expect(episode.nodes[follow.nextId].nextId).toBe(`q4-${route}`)
        const completeTag = follow.grantsTags![0]
        expect(episode.nodes[`q4-${route}`].bodyByTag?.some((entry) => entry.tag === completeTag)).toBe(true)
        for (const finalChoice of episode.nodes[`q5-${route}`].choices!) {
          const ending = episode.nodes[finalChoice.nextId]
          expect(ending.endingFeedbackByTag?.some((entry) => entry.tag === completeTag)).toBe(true)
          const partial = ending.endingFeedbackByTag?.find((entry) => entry.tag === offer.grantsTags![0])
          expect(partial?.unlessTag).toBe(completeTag)
          const base = { nodeId: ending.id, tags: offer.grantsTags!, history: [], effects: [], recentEffects: [] }
          expect(presentNode(episode, base).body).toContain(partial!.body)
          expect(presentNode(episode, { ...base, tags: [...base.tags, completeTag] }).body).not.toContain(partial!.body)
        }
      })
    }
  }

  it('keeps fault isolation available on every home route after using the wrench, even without the optional follow-up', () => {
    const home = EPISODES.find((item) => item.id === 'return-home')!
    for (const route of ['compete', 'share', 'home']) {
      const use = home.nodes[`q2-${route}`].choices!.find((choice) => choice.relicId === 'stop-wrench')!
      const choices = eligibleChoices(home.nodes[`q4-${route}`], { tags: use.grantsTags!, relicIds: [] })
      const isolate = choices.find((choice) => choice.grantsTags?.includes('powerIsolated'))
      expect(isolate).toBeDefined()
      const result = presentNode(home, { nodeId: isolate!.nextId, tags: [...use.grantsTags!, 'powerIsolated'], history: [], effects: [], recentEffects: [] })
      expect(result.body).toContain('确认断电')
      expect(result.nextId).toBe(`q5-${route}`)
    }
  })

  it('lets the pharmacist actually execute after her recorded repeat-back, without requiring the optional third-round check', () => {
    const witch = EPISODES.find((item) => item.id === 'witch-trial')!
    for (const route of ['teacher', 'research', 'patient']) {
      const use = witch.nodes[`q2-${route}`].choices!.find((choice) => choice.relicId === 'school-roster')!
      const fourth = witch.nodes[`q4-${route}`]
      expect(eligibleChoices(fourth, { tags: [], relicIds: [] }).some((choice) => choice.grantsTags?.includes('pharmacistExecuted'))).toBe(false)
      const execute = eligibleChoices(fourth, { tags: use.grantsTags!, relicIds: [] }).find((choice) => choice.grantsTags?.includes('pharmacistExecuted'))!
      expect(execute).toBeDefined()
      const result = witch.nodes[execute.nextId]
      expect(result.nextId).toBe(`q5-${route}`)
      expect(result.body).toContain('女药师')
      expect(result.body).toContain('第八声没有响')
      expect(result.body).toContain('没有因此取得行医资格')
    }
  })

  it('requires actual training, not merely the paper instructions, before workers can perform the independent stop', () => {
    const jenny = EPISODES.find((item) => item.id === 'spinning-jenny')!
    for (const route of ['owner', 'workers', 'open']) {
      const use = jenny.nodes[`q2-${route}`].choices!.find((choice) => choice.relicId === 'anonymous-dose')!
      const third = jenny.nodes[`q3-${route}`]
      const follow = eligibleChoices(third, { tags: use.grantsTags!, relicIds: [] }).find((choice) => choice.requiresTags?.includes(use.grantsTags![0]))!
      const fourth = jenny.nodes[`q4-${route}`]
      expect(eligibleChoices(fourth, { tags: use.grantsTags!, relicIds: [] }).some((choice) => choice.grantsTags?.includes('trainedOperatorsStopped'))).toBe(false)
      const trained = [...use.grantsTags!, ...follow.grantsTags!]
      const stop = eligibleChoices(fourth, { tags: trained, relicIds: [] }).find((choice) => choice.grantsTags?.includes('trainedOperatorsStopped'))!
      expect(stop).toBeDefined()
      expect(jenny.nodes[stop.nextId].nextId).toBe(`q5-${route}`)
    }
  })

  it('makes the signed responsibilities usable to dispute one-person blame on all machine routes', () => {
    const jenny = EPISODES.find((item) => item.id === 'spinning-jenny')!
    for (const route of ['owner', 'workers', 'open']) {
      const use = jenny.nodes[`q2-${route}`].choices!.find((choice) => choice.relicId === 'signed-prescription')!
      const fifth = jenny.nodes[`q5-${route}`]
      expect(eligibleChoices(fifth, { tags: [], relicIds: [] }).some((choice) => choice.grantsTags?.includes('sharedResponsibilityInvoked'))).toBe(false)
      const challenge = eligibleChoices(fifth, { tags: use.grantsTags!, relicIds: [] }).find((choice) => choice.grantsTags?.includes('sharedResponsibilityInvoked'))!
      expect(challenge).toBeDefined()
      expect(jenny.nodes[challenge.nextId].stage).toBe('ending')
      expect(challenge.nextId).not.toBe('jenny-end-owner')
      const ending = presentNode(jenny, { nodeId: challenge.nextId, tags: [...use.grantsTags!, ...challenge.grantsTags!], history: [], effects: [], recentEffects: [] })
      expect(ending.body).toContain('继续调查')
    }
  })

  it('keeps signed responsibilities effective even when the owner route still tries to blame Ada', () => {
    const jenny = EPISODES.find((item) => item.id === 'spinning-jenny')!
    const use = jenny.nodes['q2-owner'].choices!.find((choice) => choice.relicId === 'signed-prescription')!
    const ending = presentNode(jenny, { nodeId: 'jenny-end-owner', tags: use.grantsTags!, history: [], effects: [], recentEffects: [] })
    expect(ending.body).toContain('投资人记下异议')
    expect(ending.body).toContain('调查继续')
  })

  it('does not invent a road screenshot when the ledger action replaced the friend road-check choice', () => {
    const safety = EPISODES.find((item) => item.id === 'male-safety')!
    const use = safety.nodes['q2-witness'].choices!.find((choice) => choice.relicId === 'worker-ledger')!
    expect(safety.nodes[use.nextId].body).not.toContain('截图')
  })

  it('remembers the home-route handover and training before describing the later alarm', () => {
    const home = EPISODES.find((item) => item.id === 'return-home')!
    for (const relicId of ['joint-drawing', 'maintenance-card']) {
      const use = home.nodes['q2-home'].choices!.find((choice) => choice.relicId === relicId)!
      const fourth = presentNode(home, { nodeId: 'q4-home', tags: use.grantsTags!, history: [], effects: [], recentEffects: [] })
      expect(fourth.body).not.toContain('没有见过')
      expect(fourth.body).toContain('仍须')
    }
  })

  it('does not erase an already signed marriage when the player later submits the will and requests withdrawal', () => {
    const ghost = EPISODES.find((item) => item.id === 'ghost-marriage')!
    const state = { nodeId: 'ghost-end-will', tags: ['temporaryMarriage'], history: [], effects: [], recentEffects: [] }
    const ending = presentNode(ghost, state)
    expect(ending.body).toContain('婚书效力与顾家债务都没处理完')
    expect(ending.body).not.toContain('顾言没有成为丈夫')
    expect(presentNode(ghost, { ...state, tags: [] }).body).toContain('你没有成为丈夫')
  })

  it('awards the actual document variant and keeps authored exports undecorated', () => {
    const exam = EPISODES.find((item) => item.id === 'exam')!
    expect(exam.nodes['exam-end-exception'].relic?.name).toBe('留有真名的文书 · 榜单')
    expect(exam.nodes['exam-end-cosigned'].relic?.name).toBe('留有真名的文书 · 联署规则')
    const home = EPISODES.find((item) => item.id === 'return-home')!
    expect(home.nodes['home-end-film'].relic?.name).toBe('未删改的事实记录 · 考核材料')
    expect(home.nodes['home-end-unbroadcast'].relic?.name).toBe('未删改的事实记录 · 胶片')
    expect(authoredWitch.nodes['q2-teacher'].choices!.some((choice) => choice.relicId)).toBe(false)
    expect(Object.values(authoredWitch.nodes).some((node) => node.id.startsWith('result-use-'))).toBe(false)
  })

  it('leaves an unassisted five-decision path in every route', () => {
    for (const episode of EPISODES) for (const opening of episode.nodes.q1.choices!) {
      let node = episode.nodes[opening.nextId]
      let tags = opening.grantsTags ?? []
      let decisions = 1
      while (node.stage !== 'ending') {
        if (node.stage === 'choice') {
          const choice = eligibleChoices(node, { tags, relicIds: [] })[0]
          expect(choice).toBeDefined()
          tags = [...tags, ...(choice.grantsTags ?? [])]
          node = episode.nodes[choice.nextId]
          decisions++
        } else node = episode.nodes[node.nextId!]
      }
      expect(decisions).toBe(5)
      expect(node.relic).toBeDefined()
    }
  })
})
