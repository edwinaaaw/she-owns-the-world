import type { Choice, EndingRelic, EpisodeDefinition, EpisodeNode } from './types'

export interface AuthoredOption {
  id: string
  label: string
  hint: string
  result?: string
  tag: string
  requiresTags?: string[]
  requiresAnyRelics?: string[]
  endingId?: string
}

export interface AuthoredRound {
  title: string
  body: string
  art: string
  options: AuthoredOption[]
}

export interface RouteDraft {
  id: string
  openingChoice: AuthoredOption
  rounds: [AuthoredRound, AuthoredRound, AuthoredRound, AuthoredRound]
}

export interface EndingDraft {
  id: string
  title: string
  body: string
  art: string
  relic: EndingRelic
  unresolvedEcho: string
  nextLifeTeaser?: string
}

export interface AuthoredEpisodeDraft {
  id: string
  number: number
  title: string
  protagonist: string
  rule: string
  headline: [string, string]
  hook: string
  feedArt: string
  feedAlt: string
  opening: string
  openingArt: string
  firstTitle: string
  firstBody: string
  firstArt: string
  routes: [RouteDraft, RouteDraft, RouteDraft]
  endings: EndingDraft[]
}

function asChoice(option: AuthoredOption, nextId: string): Choice {
  return {
    id: option.id,
    label: option.label,
    riskHint: option.hint,
    gain: '',
    cost: '',
    nextId,
    effects: [],
    grantsTags: [option.tag],
    requiresTags: option.requiresTags,
    requiresAnyRelics: option.requiresAnyRelics,
  }
}

export function buildAuthoredEpisode(draft: AuthoredEpisodeDraft): EpisodeDefinition {
  const nodes: Record<string, EpisodeNode> = {
    'feed-hook': { id: 'feed-hook', stage: 'feed', body: draft.hook, art: draft.feedArt, nextId: 'intro' },
    intro: {
      id: 'intro', stage: 'scene', speaker: `${draft.protagonist} · 架空世界`, body: draft.opening,
      art: draft.openingArt, nextId: 'q1',
    },
    q1: {
      id: 'q1', stage: 'choice', round: 1, speaker: draft.protagonist, title: draft.firstTitle,
      body: draft.firstBody, art: draft.firstArt, choices: [],
    },
  }

  nodes.q1.choices = draft.routes.map((route) => {
    const resultId = `result-q1-${route.id}`
    nodes[resultId] = {
      id: resultId, stage: 'consequence', speaker: draft.protagonist,
      body: route.openingChoice.result ?? '', art: draft.firstArt, nextId: `q2-${route.id}`,
    }
    return asChoice(route.openingChoice, resultId)
  })

  for (const route of draft.routes) {
    route.rounds.forEach((round, index) => {
      const roundNumber = (index + 2) as 2 | 3 | 4 | 5
      const nodeId = `q${roundNumber}-${route.id}`
      nodes[nodeId] = {
        id: nodeId,
        stage: 'choice',
        round: roundNumber,
        speaker: draft.protagonist,
        title: round.title,
        body: round.body,
        art: round.art,
        choices: round.options.map((option) => {
          if (roundNumber === 5) {
            if (!option.endingId) throw new Error(`${draft.id}:${option.id} requires an endingId`)
            return asChoice(option, option.endingId)
          }

          const resultId = `result-${option.id}`
          nodes[resultId] = {
            id: resultId,
            stage: 'consequence',
            speaker: draft.protagonist,
            body: option.result ?? '',
            art: round.art,
            nextId: `q${roundNumber + 1}-${route.id}`,
          }
          return asChoice(option, resultId)
        }),
      }
    })
  }

  for (const ending of draft.endings) {
    nodes[ending.id] = {
      id: ending.id,
      stage: 'ending',
      speaker: '本段人生',
      title: ending.title,
      body: ending.body,
      art: ending.art,
      relic: ending.relic,
      unresolvedEcho: ending.unresolvedEcho,
      nextLifeTeaser: ending.nextLifeTeaser,
    }
  }

  return {
    id: draft.id,
    number: draft.number,
    title: draft.title,
    protagonist: draft.protagonist,
    rule: draft.rule,
    headline: draft.headline,
    hook: draft.hook,
    feedArt: draft.feedArt,
    feedAlt: draft.feedAlt,
    nodes,
  }
}
