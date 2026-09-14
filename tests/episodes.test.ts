import { describe, expect, it } from 'vitest'
import { EPISODES } from '../src/story/episodes'

describe('playable season', () => {
  it('contains six episodes in the approved order', () => {
    expect(EPISODES.map((episode) => episode.id)).toEqual([
      'exam', 'witch-trial', 'spinning-jenny', 'return-home', 'ghost-marriage', 'male-safety',
    ])
  })

  it('offers at least five authored endings per life', () => {
    for (const episode of EPISODES) {
      const nodes = Object.values(episode.nodes)
      expect(nodes.filter((node) => node.stage === 'ending').length, episode.id).toBeGreaterThanOrEqual(5)
    }
  })

  it('keeps every node transition inside its episode', () => {
    for (const episode of EPISODES) {
      for (const node of Object.values(episode.nodes)) {
        if (node.nextId) expect(episode.nodes[node.nextId], `${episode.id}:${node.id}`).toBeDefined()
        for (const choice of node.choices ?? []) {
          expect(episode.nodes[choice.nextId], `${episode.id}:${node.id}:${choice.id}`).toBeDefined()
        }
      }
    }
  })
})
