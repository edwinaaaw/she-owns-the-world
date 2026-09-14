import { describe, expect, it } from 'vitest'
import { advance, choose, createInitialState, eligibleChoices, restart, presentNode } from '../src/story/episodeMachine'
import { EPISODES } from '../src/story/episodes'

describe('episodeMachine', () => {
  it('replaces an unsafe event only after the safe procedure actually happened', () => {
    const episode = { ...EPISODES[0], nodes: { event: { id: 'event', stage: 'consequence' as const, body: '机器仍在运转，你伸手维修。', art: '', replaceBodyByTag: [{ tag: 'powerOff', body: '断电已经确认，你在停机后维修。' }] } } }
    const state = { ...createInitialState(episode), nodeId: 'event' }
    expect(presentNode(episode, state).body).toContain('仍在运转')
    expect(presentNode(episode, { ...state, tags: ['powerOff'] }).body).not.toContain('仍在运转')
    expect(presentNode(episode, { ...state, tags: ['powerOff'] }).body).toContain('断电已经确认')
  })
  it('reports the actual follow-through instead of both performed and abandoned versions', () => {
    const episode = { ...EPISODES[0], nodes: { end: { id: 'end', stage: 'ending' as const, body: '结束。', art: '', endingFeedbackByTag: [{ tag: 'used', unlessTag: 'followed', body: '副本保留，但没有提出追问。' }, { tag: 'followed', body: '副本用于追問。' }] } } }
    const state = { ...createInitialState(episode), nodeId: 'end', tags: ['used', 'followed'] }
    expect(presentNode(episode, state).body).not.toContain('没有提出追问')
    expect(presentNode(episode, { ...state, tags: ['used'] }).body).toContain('没有提出追问')
    expect(presentNode(episode, { ...state, tags: [] }).body).not.toContain('副本')
  })
  it('starts at the feed hook and advances to the male introduction', () => {
    const initial = createInitialState(EPISODES[0])
    const next = advance(EPISODES[0], initial)

    expect(initial).toEqual({ nodeId: 'feed-hook', history: [], effects: [], recentEffects: [], tags: [] })
    expect(next.nodeId).toBe('intro')
  })

  it('clears the latest effects when advancing from a consequence', () => {
    const state = {
      nodeId: 'result-q1-record', history: ['q1'], effects: [],
      recentEffects: [{ key: 'test', delta: 1, label: 'test' }], tags: ['routeRecord'],
    }
    const next = advance(EPISODES[0], state)

    expect(next.nodeId).toBe('q2-record')
    expect(next.recentEffects).toEqual([])
    expect(next.tags).toEqual(['routeRecord'])
  })

  it('restarts from a clean initial state', () => {
    expect(restart(EPISODES[1])).toEqual(createInitialState(EPISODES[1]))
  })

  it('persists concrete facts granted by a choice', () => {
    const episode = {
      ...EPISODES[0],
      nodes: {
        gate: {
          id: 'gate', stage: 'choice' as const, body: 'test', art: '/test.jpg', round: 1 as const,
          choices: [{
            id: 'leave-record', label: '留下记录', riskHint: '书记员正在看', gain: '', cost: '',
            nextId: 'done', effects: [], grantsTags: ['recordPreserved'],
          }],
        },
        done: { id: 'done', stage: 'ending' as const, body: 'done', art: '/test.jpg' },
      },
    }

    const result = choose(episode, { nodeId: 'gate', history: [], effects: [], recentEffects: [], tags: [] }, 'leave-record')

    expect(result.tags).toEqual(['recordPreserved'])
  })

  it('shows a conditional choice only when episode facts and season relics satisfy it', () => {
    const node = {
      id: 'gate', stage: 'choice' as const, body: 'test', art: '/test.jpg', round: 4 as const,
      choices: [
        { id: 'plain', label: '普通行动', riskHint: '人人可见', gain: '', cost: '', nextId: 'done', effects: [] },
        { id: 'fact', label: '使用副本', riskHint: '需要副本', gain: '', cost: '', nextId: 'done', effects: [], requiresTags: ['madeCopy'] },
        { id: 'echo', label: '上一生的回响', riskHint: '想起榜单', gain: '', cost: '', nextId: 'done', effects: [], requiresRelics: ['named-roll'] },
        { id: 'any-echo', label: '另一种回响', riskHint: '想起任何旧物', gain: '', cost: '', nextId: 'done', effects: [], requiresAnyRelics: ['sealed-page', 'school-roster'] },
      ],
    }

    expect(eligibleChoices(node, { tags: [], relicIds: [] }).map((choice) => choice.id)).toEqual(['plain'])
    expect(eligibleChoices(node, { tags: ['madeCopy'], relicIds: ['named-roll'] }).map((choice) => choice.id)).toEqual(['plain', 'fact', 'echo'])
    expect(eligibleChoices(node, { tags: [], relicIds: ['school-roster'] }).map((choice) => choice.id)).toEqual(['plain', 'any-echo'])
  })
})
