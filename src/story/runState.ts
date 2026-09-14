import { EPISODES } from './episodes'
import { advance, choose, createInitialState, eligibleChoices, presentNode } from './episodeMachine'
import type { EndingRelic, EpisodeState } from './types'

export const SAVE_KEY = 'she-rules-world:run'
export interface ChoiceMemory {
  choiceId: string
  round: number
  label: string
  outcome: string
  before: EpisodeState
  usedRelicId?: string
}
export interface CompletedLife {
  episodeIndex: number
  endingId: string
  relic: EndingRelic
  usedRelicId?: string
  choices?: ChoiceMemory[]
  endingText?: string
  logComplete?: boolean
}
export interface RunState {
  version: 2
  episodeIndex: number
  state: EpisodeState
  entered: boolean
  complete: boolean
  completed: CompletedLife[]
  usedRelicId?: string
  acknowledgedAwards: string[]
  acknowledgedOpportunities: string[]
  notice?: string
  choiceLog?: ChoiceMemory[]
  logComplete?: boolean
  // Transient recovery data: save it separately before replacing the active save.
  unrecognizedSave?: string
}
export type RunAction = { type: 'enter' } | { type: 'advance' } | { type: 'continue' } | { type: 'choose'; choiceId: string } | { type: 'replay'; episodeIndex: number } | { type: 'acknowledge-award' } | { type: 'acknowledge-opportunity' }

export function createRun(): RunState {
  return { version: 2, episodeIndex: 0, state: createInitialState(EPISODES[0]), entered: false, complete: false, completed: [], acknowledgedAwards: [], acknowledgedOpportunities: [], choiceLog: [], logComplete: true }
}
export const awardPromptId = (run: RunState) => `${run.episodeIndex}:${run.state.nodeId}`
export const opportunityPromptId = (run: RunState, relic: EndingRelic) => `${run.episodeIndex}:${run.state.nodeId}:${relic.id}`
export function activeRelic(run: RunState): EndingRelic | undefined {
  return run.completed.find((item) => item.episodeIndex === run.episodeIndex - 1)?.relic
}
function collectEnding(run: RunState): RunState {
  const node = EPISODES[run.episodeIndex].nodes[run.state.nodeId]
  if (node.stage !== 'ending' || !node.relic) return run
  const recorded = run.completed.find((entry) => entry.episodeIndex === run.episodeIndex && entry.endingId === node.id)
  return { ...run, completed: [...run.completed.filter((item) => item.episodeIndex < run.episodeIndex), {
    episodeIndex: run.episodeIndex, endingId: node.id, relic: node.relic, usedRelicId: run.usedRelicId,
    choices: run.choiceLog ?? [], logComplete: run.logComplete === true,
    endingText: recorded?.endingText ?? (run.choiceLog?.some((choice) => choice.round === 5) ? presentNode(EPISODES[run.episodeIndex], run.state).body : undefined),
  }] }
}
export function transitionRun(run: RunState, action: RunAction): RunState {
  const episode = EPISODES[run.episodeIndex]
  const node = episode.nodes[run.state.nodeId]
  if (action.type === 'enter') return { ...run, entered: true }
  if (action.type === 'acknowledge-award') {
    if (node.stage !== 'ending' || !node.relic) return run
    const id = awardPromptId(run)
    return run.acknowledgedAwards.includes(id) ? run : { ...run, acknowledgedAwards: [...run.acknowledgedAwards, id] }
  }
  if (action.type === 'acknowledge-opportunity') {
    const relic = activeRelic(run)
    if (node.stage !== 'choice' || !relic) return run
    const eligible = eligibleChoices(node, { tags: run.state.tags, relicIds: run.usedRelicId ? [] : [relic.id] })
    if (!eligible.some((choice) => choice.relicId === relic.id)) return run
    const id = opportunityPromptId(run, relic)
    return run.acknowledgedOpportunities.includes(id) ? run : { ...run, acknowledgedOpportunities: [...run.acknowledgedOpportunities, id] }
  }
  if (action.type === 'replay') {
    if (!Number.isInteger(action.episodeIndex) || action.episodeIndex < 0 || action.episodeIndex > run.episodeIndex) return run
    return { ...createRun(), entered: true, episodeIndex: action.episodeIndex, state: createInitialState(EPISODES[action.episodeIndex]), completed: run.completed.filter((item) => item.episodeIndex < action.episodeIndex), acknowledgedAwards: run.acknowledgedAwards.filter((id) => Number(id.split(':')[0]) < action.episodeIndex), acknowledgedOpportunities: run.acknowledgedOpportunities.filter((id) => Number(id.split(':')[0]) < action.episodeIndex), unrecognizedSave: run.unrecognizedSave }
  }
  if (run.complete) return run
  if (action.type === 'continue') {
    if (node.stage !== 'ending') return run
    if (run.episodeIndex === EPISODES.length - 1) return { ...collectEnding(run), complete: true }
    return { ...collectEnding(run), episodeIndex: run.episodeIndex + 1, state: createInitialState(EPISODES[run.episodeIndex + 1]), usedRelicId: undefined, choiceLog: [], logComplete: true }
  }
  if (action.type === 'advance') return collectEnding({ ...run, state: advance(episode, run.state) })
  const relic = activeRelic(run)
  const choice = eligibleChoices(node, { tags: run.state.tags, relicIds: relic && !run.usedRelicId ? [relic.id] : [] }).find((item) => item.id === action.choiceId)
  if (!choice) return run
  const nextState = choose(episode, run.state, choice.id)
  const memory: ChoiceMemory = {
    choiceId: choice.id, round: node.round ?? 1, label: choice.label,
    outcome: presentNode(episode, nextState).body,
    before: structuredClone(run.state), usedRelicId: run.usedRelicId,
  }
  return collectEnding({ ...run, state: nextState, usedRelicId: choice.relicId ?? run.usedRelicId, choiceLog: [...(run.choiceLog ?? []), memory] })
}

export function saveRun(storage: Pick<Storage, 'setItem'>, run: RunState): boolean {
  try {
    const { unrecognizedSave, ...persisted } = run
    if (unrecognizedSave) storage.setItem(`${SAVE_KEY}:unrecognized-backup`, unrecognizedSave)
    storage.setItem(SAVE_KEY, JSON.stringify(persisted))
    return true
  } catch { return false }
}
const isObject = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value))
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === 'string')
function readMemories(value: unknown, index: number): ChoiceMemory[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item): ChoiceMemory[] => {
    if (!isObject(item) || typeof item.choiceId !== 'string' || typeof item.label !== 'string' || typeof item.outcome !== 'string'
      || !Number.isInteger(item.round) || Number(item.round) < 1 || Number(item.round) > 5 || !isObject(item.before)) return []
    const before = item.before
    if (typeof before.nodeId !== 'string' || !strings(before.tags) || !strings(before.history)) return []
    const node = EPISODES[index].nodes[before.nodeId]
    if (node?.stage !== 'choice' || !node.choices?.some((choice) => choice.id === item.choiceId)) return []
    return [{ choiceId: item.choiceId, round: Number(item.round), label: item.label, outcome: item.outcome,
      before: { ...createInitialState(EPISODES[index]), nodeId: before.nodeId, tags: before.tags, history: before.history },
      usedRelicId: typeof item.usedRelicId === 'string' ? item.usedRelicId : undefined }]
  }).slice(0, 5)
}

export function loadRun(storage: Pick<Storage, 'getItem'>): RunState {
  const fallback = (notice: string) => ({ ...createRun(), notice })
  try {
    const raw = storage.getItem(SAVE_KEY)
    if (!raw) return createRun()
    const data: unknown = JSON.parse(raw)
    if (!isObject(data)) return fallback('无法确认旧存档中的结局，未补发遗物。')
    const index = data.episodeIndex
    if (typeof index !== 'number' || !Number.isInteger(index) || !EPISODES[index] || !isObject(data.state)) return fallback('存档无法识别，未补发遗物。')
    const episode = EPISODES[index]
    const nodeId = data.state.nodeId
    if (typeof nodeId !== 'string' || !episode.nodes[nodeId]) return fallback('存档中的剧情节点无法确认，未补发遗物。')
    if (data.version !== 2) {
      if (episode.nodes[nodeId].stage !== 'ending') return fallback('旧存档没有可确认的结局，未补发遗物。')
      return collectEnding({ ...createRun(), entered: true, episodeIndex: index, state: { ...createInitialState(episode), nodeId }, logComplete: false, notice: '已根据可确认的结局恢复遗物；更早的人生与使用记录无法确认。' })
    }
    if (!strings(data.state.history) || !strings(data.state.tags) || !Array.isArray(data.completed)) return fallback('存档不完整，未补发无法确认的遗物。')
    const completed: CompletedLife[] = []
    let rejectedCompleted = false
    for (const entry of data.completed) {
      if (!isObject(entry) || typeof entry.episodeIndex !== 'number' || !Number.isInteger(entry.episodeIndex) || entry.episodeIndex < 0 || entry.episodeIndex > index || typeof entry.endingId !== 'string') {
        rejectedCompleted = true
        continue
      }
      const ending = EPISODES[entry.episodeIndex]?.nodes[entry.endingId]
      if (ending?.stage !== 'ending' || !ending.relic || completed.some((item) => item.episodeIndex === entry.episodeIndex)) {
        rejectedCompleted = true
        continue
      }
      completed.push({ episodeIndex: entry.episodeIndex, endingId: ending.id, relic: ending.relic, usedRelicId: typeof entry.usedRelicId === 'string' ? entry.usedRelicId : undefined,
        choices: readMemories(entry.choices, entry.episodeIndex), endingText: typeof entry.endingText === 'string' ? entry.endingText : undefined, logComplete: entry.logComplete === true })
    }
    const restored: RunState = { version: 2, entered: Boolean(data.entered), complete: Boolean(data.complete) && index === 5 && episode.nodes[nodeId].stage === 'ending', episodeIndex: index,
      state: { ...createInitialState(episode), nodeId, history: data.state.history.filter((id) => Boolean(episode.nodes[id])), tags: data.state.tags },
      completed: completed.sort((a,b) => a.episodeIndex - b.episodeIndex), usedRelicId: typeof data.usedRelicId === 'string' ? data.usedRelicId : undefined,
      choiceLog: readMemories(data.choiceLog, index), logComplete: data.logComplete === true,
      acknowledgedAwards: strings(data.acknowledgedAwards) ? data.acknowledgedAwards : [], acknowledgedOpportunities: strings(data.acknowledgedOpportunities) ? data.acknowledgedOpportunities : [],
      notice: rejectedCompleted ? '部分结局记录无法确认，仅恢复可确认的结局，未补发未知遗物。保存进度前会先备份原始存档。' : typeof data.notice === 'string' ? data.notice : undefined,
      unrecognizedSave: rejectedCompleted ? raw : undefined }
    return collectEnding(restored)
  } catch { return fallback('无法读取存档。旧数据未被用于补发遗物。') }
}
