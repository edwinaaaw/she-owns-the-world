import { expect } from 'vitest'
import { EPISODES } from '../../src/story/episodes'
import { advance, choose, createInitialState, eligibleChoices, presentNode } from '../../src/story/episodeMachine'
import type { EpisodeDefinition, EpisodeState } from '../../src/story/types'
import { createRun, loadRun } from '../../src/story/runState'

export function paths(id: string) {
  const episode = EPISODES.find((entry) => entry.id === id)!
  const settle = (initial: EpisodeState): EpisodeState => {
    let state = initial
    for (let n = 0; n < 20 && !['choice', 'ending'].includes(episode.nodes[state.nodeId].stage); n++) state = advance(episode, state)
    expect(['choice', 'ending']).toContain(episode.nodes[state.nodeId].stage)
    return state
  }
  const options = (state: EpisodeState, relicIds: string[] = []) => eligibleChoices(episode.nodes[state.nodeId], { tags: state.tags, relicIds })
  const pick = (state: EpisodeState, choiceId: string, relicIds: string[] = []) => {
    expect(options(state, relicIds).map((choice) => choice.id)).toContain(choiceId)
    return settle(choose(episode, state, choiceId))
  }
  const play = (ids: string[]) => ids.reduce((state, choiceId) => pick(state, choiceId), settle(createInitialState(episode)))
  const body = (state: EpisodeState) => presentNode(episode, state).body
  const result = (state: EpisodeState, id: string) => {
    expect(options(state).map((choice) => choice.id)).toContain(id)
    return choose(episode, state, id)
  }
  const legacy = (nodeId: string, tags: string[]): EpisodeState => {
    const run = { ...createRun(), entered: true, episodeIndex: EPISODES.indexOf(episode), state: { nodeId, tags, history: [], effects: [], recentEffects: [] } }
    const loaded = loadRun({ getItem: () => JSON.stringify(run) })
    expect(loaded.state.nodeId).toBe(nodeId)
    expect(loaded.state.tags).toEqual(tags)
    return loaded.state
  }
  return { episode, settle, pick, play, body, result, options, legacy }
}

export function verifyClone(episode: EpisodeDefinition, decorate: (episode: EpisodeDefinition) => EpisodeDefinition) {
  const original = JSON.stringify(episode)
  const clone = decorate(episode)
  clone.nodes.q1.choices![0].grantsTags!.push('test-only')
  clone.nodes.q1.choices![0].effects.push({ key: 'test-only', label: 'test-only', delta: 1 })
  const memory = Object.values(clone.nodes).find((node) => node.bodyByTag?.length)
  memory!.bodyByTag![0].body = 'test-only'
  expect(JSON.stringify(episode)).toBe(original)
}

export function verifyPaths(episode: EpisodeDefinition, relic: string) {
  const { settle, body, options } = paths(episode.id)
  let endings = 0
  const walk = (state: EpisodeState, decisions: number, used: boolean) => {
    const node = episode.nodes[state.nodeId]
    expect(node).toBeDefined()
    expect(body(state)).not.toContain('undefined')
    if (node.stage === 'ending') { expect(decisions).toBe(5); endings++; return }
    expect(decisions).toBeLessThan(5)
    const choices = options(state, relic && !used ? [relic] : [])
    const ordinary = choices.filter((choice) => !choice.relicId)
    if (decisions) {
      expect(ordinary.length).toBeGreaterThanOrEqual(1)
      expect(ordinary.length).toBeLessThanOrEqual(2)
      expect(choices.filter((choice) => choice.relicId).length).toBeLessThanOrEqual(1)
    } else expect(ordinary).toHaveLength(3)
    for (const choice of choices) {
      expect(episode.nodes[choice.nextId]).toBeDefined()
      const next = choose(episode, state, choice.id)
      const otherTags = ordinary.filter((other) => other.id !== choice.id).flatMap((other) => other.grantsTags ?? [])
      for (const tag of otherTags) if (!state.tags.includes(tag) && !choice.grantsTags?.includes(tag)) expect(next.tags).not.toContain(tag)
      walk(settle(next), decisions + 1, used || Boolean(choice.relicId))
    }
  }
  walk(settle(createInitialState(episode)), 0, false)
  expect(endings).toBeGreaterThan(20)
}
