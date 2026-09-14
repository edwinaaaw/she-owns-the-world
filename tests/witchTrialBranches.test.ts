import { describe, expect, it } from 'vitest'
import { EPISODES } from '../src/story/episodes'
import { eligibleChoices } from '../src/story/episodeMachine'

const witch = EPISODES.find((episode) => episode.id === 'witch-trial')!

describe('witch-trial narrative continuity', () => {
  it('gives every option on a screen a unique interaction id', () => {
    for (const node of Object.values(witch.nodes)) {
      const ids = (node.choices ?? []).map((choice) => choice.id)
      expect(new Set(ids).size, node.id).toBe(ids.length)
    }
  })

  it('establishes all locations and the treatment deadline before the first choice', () => {
    const intro = witch.nodes.intro.body
    expect(intro).toContain('玛塔扣在侧室，尚未入狱')
    expect(intro).toContain('东翼药房')
    expect(intro).toContain('第八声')
    expect(intro).toContain('海伦娜左腕')
  })

  it('makes naming Marta turn her into a present co-defendant, not a remote rescuer', () => {
    const result = witch.nodes['result-q1-teacher']
    const second = witch.nodes['q2-teacher']
    const fourth = witch.nodes['q4-teacher']

    expect(result.body).toContain('共同嫌疑人')
    expect(result.body).toContain('庭内')
    expect(second.body).toContain('东翼')
    expect(fourth.body).toContain('玛塔被铐在被告席，不能离开')
    expect(fourth.body).toContain('女药师能执行处方')
  })

  it('explains Helena scar before allowing it to become evidence', () => {
    expect(witch.nodes.intro.body).toContain('去年冬天')
    for (const route of ['teacher', 'research', 'patient']) {
      const third = witch.nodes[`q3-${route}`]
      expect(`${third.title}${third.body}`).toContain('伤疤')
      expect(third.body).toMatch(/去年冬天|记录|莉维娅/)
    }
  })

  it('keeps the eighth-bell patient outcome consistent in research endings', () => {
    const delayed = witch.nodes['result-witch-research-q4-license'].body
    expect(delayed).toContain('约纳斯')
    expect(delayed).not.toContain('没有呼吸')
    expect(witch.nodes['witch-end-anonymous'].body).toContain('约纳斯活了下来')
  })

  it('settles Marta in both endings on the public-teacher route', () => {
    expect(witch.nodes['witch-end-joint'].body).toContain('玛塔')
    expect(witch.nodes['witch-end-thread'].body).toContain('玛塔')
  })

  it('offers each exam relic on all three routes and unlocks a route-local action', () => {
    for (const route of ['teacher', 'research', 'patient']) for (const relicId of ['named-roll', 'sealed-page', 'school-roster']) {
      const use = eligibleChoices(witch.nodes[`q2-${route}`], { tags: [], relicIds: [relicId] }).find((choice) => choice.relicId === relicId)!
      expect(use).toBeDefined()
      const later = eligibleChoices(witch.nodes[`q3-${route}`], { tags: use.grantsTags!, relicIds: [relicId] })
      expect(later.some((choice) => choice.requiresTags?.includes(use.grantsTags![0]))).toBe(true)
    }
  })
})
