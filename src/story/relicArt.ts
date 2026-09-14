import type { EndingRelic } from './types'

const illustrated = new Set([
  'named-roll', 'sealed-page', 'school-roster',
  'signed-prescription', 'anonymous-dose', 'prison-thread',
  'stop-wrench', 'joint-drawing', 'maintenance-card',
  'shared-roster', 'old-badge', 'film-strip',
  'unexecuted-will', 'cut-red-cord', 'worker-ledger',
])

/** Match the object actually issued by an ending, including mutually exclusive variants. */
export function relicArt(relic: EndingRelic): string | undefined {
  if (['local-recording', 'two-person-timeline', 'public-protocol'].includes(relic.id)) return `/art/relics/${relic.id}.png`
  if (!illustrated.has(relic.id)) return undefined
  let key = relic.id
  if (relic.id === 'named-roll') {
    if (relic.name.includes('联署')) key = 'cosigned-rules'
    else if (relic.name.includes('规则')) key = 'signed-rules'
  }
  if (relic.id === 'film-strip' && relic.name.includes('考核')) key = 'assessment-record'
  return `/art/relics/${key}.webp`
}
