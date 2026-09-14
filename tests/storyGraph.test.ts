import { describe, expect, it } from 'vitest'
import { eligibleChoices } from '../src/story/episodeMachine'
import { EPISODES } from '../src/story/episodes'
import type { Choice, EpisodeDefinition } from '../src/story/types'

const ALL_RELICS = [
  'named-roll', 'sealed-page', 'school-roster',
  'signed-prescription', 'anonymous-dose', 'prison-thread',
  'stop-wrench', 'joint-drawing', 'maintenance-card',
  'shared-roster', 'old-badge', 'film-strip',
  'unexecuted-will', 'cut-red-cord', 'worker-ledger',
]

interface RouteState {
  nodeId: string
  tags: string[]
  decisions: number
  path: string[]
}

function exhaust(episode: EpisodeDefinition): RouteState[] {
  const endings: RouteState[] = []
  const pending: RouteState[] = [{ nodeId: 'feed-hook', tags: [], decisions: 0, path: [] }]

  while (pending.length > 0) {
    const state = pending.pop()!
    const node = episode.nodes[state.nodeId]
    expect(node, `${episode.id}:${state.nodeId}`).toBeDefined()

    if (node.stage === 'ending') {
      endings.push(state)
      continue
    }

    if (node.stage === 'choice') {
      const choices = eligibleChoices(node, { tags: state.tags, relicIds: ALL_RELICS })
      expect(choices.length, `${episode.id}:${node.id} has no eligible choices`).toBeGreaterThan(0)
      for (const choice of choices) {
        pending.push({
          nodeId: choice.nextId,
          tags: [...new Set([...state.tags, ...(choice.grantsTags ?? [])])],
          decisions: state.decisions + 1,
          path: [...state.path, choice.id],
        })
      }
      continue
    }

    expect(node.nextId, `${episode.id}:${node.id} is a dead end`).toBeDefined()
    pending.push({ ...state, nodeId: node.nextId! })
  }

  return endings
}

function nextChoiceId(episode: EpisodeDefinition, choice: Choice): string {
  let node = episode.nodes[choice.nextId]
  while (node.stage !== 'choice' && node.stage !== 'ending') {
    expect(node.nextId, `${episode.id}:${node.id} is a dead end`).toBeDefined()
    node = episode.nodes[node.nextId!]
  }
  return node.id
}

describe('authored story graphs', () => {
  it('ends every reachable route after exactly five decisions and awards one relic', () => {
    for (const episode of EPISODES) {
      const endings = exhaust(episode)
      expect(endings.length, `${episode.id} has no endings`).toBeGreaterThan(0)
      for (const ending of endings) {
        expect(ending.decisions, `${episode.id}: ${ending.path.join(' > ')}`).toBe(5)
        expect(episode.nodes[ending.nodeId].relic, `${episode.id}:${ending.nodeId}`).toBeDefined()
      }
    }
  })

  it('sends each opening choice to a distinct second-round scene', () => {
    for (const episode of EPISODES) {
      const first = Object.values(episode.nodes).find((node) => node.stage === 'choice' && node.round === 1)
      expect(first, episode.id).toBeDefined()
      const destinations = first!.choices!.map((choice) => nextChoiceId(episode, choice))
      expect(new Set(destinations).size, `${episode.id}: ${destinations.join(', ')}`).toBe(destinations.length)
    }
  })

  it('uses concrete fact gates in every episode and relic echoes in lives two through six', () => {
    for (const [index, episode] of EPISODES.entries()) {
      const choices = Object.values(episode.nodes).flatMap((node) => node.choices ?? [])
      expect(choices.some((choice) => (choice.requiresTags?.length ?? 0) > 0), episode.id).toBe(true)
      if (index > 0) {
        expect(choices.some((choice) =>
          (choice.requiresRelics?.length ?? 0) > 0 || (choice.requiresAnyRelics?.length ?? 0) > 0,
        ), episode.id).toBe(true)
      }
    }
  })

  it('does not reveal outcomes as paired gain-cost subtitles', () => {
    for (const episode of EPISODES) {
      for (const node of Object.values(episode.nodes)) {
        for (const choice of node.choices ?? []) {
          expect(choice.riskHint, `${episode.id}:${choice.id}`).not.toMatch(/[·→]/)
        }
      }
    }
  })
})
