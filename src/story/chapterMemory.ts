import type { EpisodeDefinition } from './types'

// Clone the chapter before adding local memories; no rules or state live here.
export function chapterMemory(episode: EpisodeDefinition) {
  const nodes = Object.fromEntries(Object.entries(episode.nodes).map(([id, node]) => [id, {
    ...node,
    relic: node.relic ? { ...node.relic } : undefined,
    choices: node.choices?.map((choice) => ({ ...choice,
      effects: choice.effects.map((effect) => ({ ...effect })),
      requiresTags: choice.requiresTags?.slice(), requiresRelics: choice.requiresRelics?.slice(),
      requiresAnyRelics: choice.requiresAnyRelics?.slice(), grantsTags: choice.grantsTags?.slice(),
    })),
    bodyByTag: node.bodyByTag?.map((entry) => ({ ...entry })),
    endingFeedbackByTag: node.endingFeedbackByTag?.map((entry) => ({ ...entry })),
    replaceBodyByTag: node.replaceBodyByTag?.map((entry) => ({ ...entry })),
  }]))
  const remember = (ids: string[], tag: string, body: string, unlessTag?: string) => {
    for (const id of ids) {
      const key = nodes[id].stage === 'ending' ? 'endingFeedbackByTag' : 'bodyByTag'
      nodes[id][key] = [...(nodes[id][key] ?? []), { tag, body, ...(unlessTag ? { unlessTag } : {}) }]
    }
  }
  const replace = (id: string, tag: string, body: string) => {
    nodes[id].replaceBodyByTag = [...(nodes[id].replaceBodyByTag ?? []), { tag, body }]
  }
  return { nodes, remember, replace }
}
