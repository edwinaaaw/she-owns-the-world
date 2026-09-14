export type Stage = 'feed' | 'scene' | 'choice' | 'consequence' | 'ending'

export interface Effect {
  key: string
  delta: number
  label: string
}

export interface Choice {
  relicId?: string
  id: string
  label: string
  riskHint: string
  gain: string
  cost: string
  nextId: string
  effects: Effect[]
  requiresTags?: string[]
  requiresRelics?: string[]
  requiresAnyRelics?: string[]
  grantsTags?: string[]
}

export type RelicPattern = 'people' | 'record' | 'procedure' | 'identity'

export interface EndingRelic {
  useHint?: string
  id: string
  name: string
  description: string
  echo: string
  pattern: RelicPattern
}

export interface EpisodeNode {
  replaceBodyByTag?: Array<{ tag: string; body: string }>
  bodyByTag?: Array<{ tag: string; body: string; unlessTag?: string }>
  endingFeedbackByTag?: Array<{ tag: string; body: string; unlessTag?: string }>
  id: string
  stage: Stage
  speaker?: string
  body: string
  art: string
  choices?: Choice[]
  nextId?: string
  round?: 1 | 2 | 3 | 4 | 5
  title?: string
  relic?: EndingRelic
  unresolvedEcho?: string
  nextLifeTeaser?: string
}

export interface EpisodeDefinition {
  id: string
  number: number
  title: string
  protagonist: string
  rule: string
  headline: [string, string]
  hook: string
  feedArt: string
  feedAlt: string
  nodes: Record<string, EpisodeNode>
}

export interface EpisodeState {
  nodeId: string
  history: string[]
  effects: Effect[]
  recentEffects: Effect[]
  tags: string[]
  error?: 'invalid-choice'
}

export interface SeasonState {
  relics: EndingRelic[]
}
