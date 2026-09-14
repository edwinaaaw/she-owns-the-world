import type { Choice, EpisodeDefinition, EpisodeNode, EpisodeState } from './types'

export function createInitialState(_episode: EpisodeDefinition): EpisodeState {
  return { nodeId: 'feed-hook', history: [], effects: [], recentEffects: [], tags: [] }
}

export function advance(episode: EpisodeDefinition, state: EpisodeState): EpisodeState {
  const node = episode.nodes[state.nodeId]
  if (!node?.nextId) return state

  return {
    nodeId: node.nextId,
    history: [...state.history, state.nodeId],
    effects: state.effects,
    recentEffects: [],
    tags: state.tags,
  }
}

export function eligibleChoices(
  node: EpisodeNode,
  context: { tags: string[]; relicIds: string[] },
): Choice[] {
  const eligible = (node.choices ?? []).filter((choice) => {
    const hasTags = (choice.requiresTags ?? []).every((tag) => context.tags.includes(tag))
    const hasRelics = (choice.requiresRelics ?? []).every((relic) => context.relicIds.includes(relic))
    const hasAnyRelic = !choice.requiresAnyRelics?.length
      || choice.requiresAnyRelics.some((relic) => context.relicIds.includes(relic))
    return hasTags && hasRelics && hasAnyRelic
  })
  if (node.round === 1) return eligible
  const isRelic = (choice: Choice) => Boolean(choice.relicId || choice.requiresRelics?.length || choice.requiresAnyRelics?.length)
  const ordinary = eligible.filter((choice) => !isRelic(choice))
  const prioritized = [...ordinary].sort((a, b) => Number(Boolean(b.requiresTags?.length)) - Number(Boolean(a.requiresTags?.length))).slice(0, 2)
  const selected = new Set([...prioritized, ...eligible.filter(isRelic).slice(0, 1)])
  return eligible.filter((choice) => selected.has(choice))
}

export function presentNode(episode: EpisodeDefinition, state: EpisodeState): EpisodeNode {
  const node = episode.nodes[state.nodeId]
  const feedback = [...(node.bodyByTag ?? []), ...(node.stage === 'ending' ? node.endingFeedbackByTag ?? [] : [])]
    .filter((item) => state.tags.includes(item.tag) && (!item.unlessTag || !state.tags.includes(item.unlessTag))).map((item) => item.body)
  const replacements = (node.replaceBodyByTag ?? []).filter((item) => state.tags.includes(item.tag))
  const body = replacements.length ? replacements[replacements.length - 1].body : node.body
  return { ...node, body: [body, ...feedback].join('\n\n') }
}

export function choose(episode: EpisodeDefinition, state: EpisodeState, choiceId: string): EpisodeState {
  const node = episode.nodes[state.nodeId]
  const choice = node?.choices?.find((item) => item.id === choiceId)

  if (!choice) return { ...state, error: 'invalid-choice' }

  return {
    nodeId: choice.nextId,
    history: [...state.history, state.nodeId],
    effects: [...state.effects, ...choice.effects],
    recentEffects: choice.effects,
    tags: [...new Set([...state.tags, ...(choice.grantsTags ?? [])])],
  }
}

export function restart(episode: EpisodeDefinition): EpisodeState {
  return createInitialState(episode)
}
