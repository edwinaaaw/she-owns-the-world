import { describe, expect, it } from 'vitest'
import { FIRST_EPISODE_NODES } from '../src/story/episode'

describe('FIRST_EPISODE_NODES', () => {
  it('introduces the player as the male candidate Lin Zhao', () => {
    expect(FIRST_EPISODE_NODES['exam-intro'].body).toContain('你叫林昭')
    expect(FIRST_EPISODE_NODES['pin-falls'].speaker).toBe('林昭 · 心声')
    expect(FIRST_EPISODE_NODES['pin-falls'].nextId).toBe('identity-choice')
  })

  it('contains four consequential choice rounds', () => {
    const rounds = Object.values(FIRST_EPISODE_NODES)
      .filter((node) => node.stage === 'choice')
      .map((node) => node.round)

    expect(rounds).toEqual([1, 2, 3, 4])
  })

  it('offers trade-offs without marking a correct answer', () => {
    const choices = Object.values(FIRST_EPISODE_NODES).flatMap((node) => node.choices ?? [])

    expect(choices.length).toBe(11)
    expect(choices.every((choice) => choice.gain && choice.cost)).toBe(true)
    expect(JSON.stringify(choices)).not.toContain('正确选择')
  })

  it('ends in either limited reform or political legacy', () => {
    expect(FIRST_EPISODE_NODES['inside-ending'].stage).toBe('ending')
    expect(FIRST_EPISODE_NODES['legacy-ending'].stage).toBe('ending')
    expect(FIRST_EPISODE_NODES['inside-ending'].body).toContain('平等样板')
    expect(FIRST_EPISODE_NODES['legacy-ending'].body).toContain('留下记录')
  })
})
