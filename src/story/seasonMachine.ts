import type { EndingRelic, RelicPattern, SeasonState } from './types'

export function createSeasonState(): SeasonState {
  return { relics: [] }
}

export function collectRelic(state: SeasonState, relic: EndingRelic): SeasonState {
  if (state.relics.some((item) => item.id === relic.id)) return state
  return { relics: [...state.relics, relic] }
}

const CODAS: Record<RelicPattern, string> = {
  people: '六段人生里，你首先记住的总是具体的人。制度可以迟到，但你没有让身边的人独自支付代价。',
  record: '六段人生里，你反复留下可以被后来者找到的记录。你不相信一句承诺，却相信证据能穿过沉默。',
  procedure: '六段人生里，你不断把个人例外改成别人也能使用的程序。你留下的不是英雄故事，而是一种可重复的方法。',
  identity: '六段人生没有把你变成一种固定的人。你拒绝让胜利、牺牲或顺从中的任何一个词替你作答。',
}

export function seasonCoda(state: SeasonState): string {
  if (state.relics.length === 0) return '你还没有走完任何一段人生。'

  const counts = state.relics.reduce<Record<RelicPattern, number>>((result, relic) => {
    result[relic.pattern] += 1
    return result
  }, { people: 0, record: 0, procedure: 0, identity: 0 })
  const order: RelicPattern[] = ['people', 'record', 'procedure', 'identity']
  const pattern = order.reduce((best, candidate) => counts[candidate] > counts[best] ? candidate : best)
  return CODAS[pattern]
}
