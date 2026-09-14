import { describe, expect, it } from 'vitest'
import { collectRelic, createSeasonState, seasonCoda } from '../src/story/seasonMachine'

const recordRelic = {
  id: 'named-roll',
  name: '被改过名字的榜单',
  description: '林昭让自己的名字留在榜尾。',
  echo: '留下记录，不等于记录会被执行。',
  pattern: 'record' as const,
}

describe('seasonMachine', () => {
  it('collects a relic once and keeps it for later lives', () => {
    const once = collectRelic(createSeasonState(), recordRelic)
    const twice = collectRelic(once, recordRelic)

    expect(twice.relics).toEqual([recordRelic])
  })

  it('derives the season coda from the most frequent relic pattern', () => {
    const state = {
      relics: [
        recordRelic,
        { ...recordRelic, id: 'dose-copy', name: '无名剂量副本' },
        { ...recordRelic, id: 'shared-roster', name: '共同排班表', pattern: 'people' as const },
      ],
    }

    expect(seasonCoda(state)).toContain('留下可以被后来者找到的记录')
  })
})
