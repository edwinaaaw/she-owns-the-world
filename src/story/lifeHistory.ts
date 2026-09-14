import { createRun, type CompletedLife, type RunState } from './runState'
import { EPISODES } from './episodes'
import { createInitialState, eligibleChoices } from './episodeMachine'

/** Trial is a detached in-memory run. The caller must never persist it as the official run. */
export function createTrial(run: RunState, index: number, decision?: number): RunState | null {
  if (!Number.isInteger(index) || index < 0 || index > run.episodeIndex) return null
  const episode = EPISODES[index]
  const completed = run.completed.filter((entry) => entry.episodeIndex < index)
  const entry = run.completed.find((item) => item.episodeIndex === index)
  const choices = index === run.episodeIndex ? run.choiceLog ?? [] : entry?.choices ?? []
  const trial: RunState = { ...createRun(), entered: true, episodeIndex: index, state: createInitialState(episode), completed: structuredClone(completed) }
  if (decision === undefined) return trial
  if (!Number.isInteger(decision) || decision < 0 || !choices[decision]) return null
  const record = choices[decision]
  const node = episode.nodes[record.before.nodeId]
  const incoming = completed.find((item) => item.episodeIndex === index - 1)?.relic
  if (!node || !eligibleChoices(node, { tags: record.before.tags, relicIds: incoming && !record.usedRelicId ? [incoming.id] : [] }).some((choice) => choice.id === record.choiceId)) return null
  return { ...trial, state: structuredClone(record.before), choiceLog: structuredClone(choices.slice(0, decision)), usedRelicId: record.usedRelicId, logComplete: index === run.episodeIndex ? run.logComplete : entry?.logComplete }
}

export function seasonEchoes(completed: CompletedLife[]): string[] {
  const known = completed.flatMap((entry) => {
    const last = entry.choices?.find((choice) => choice.round === 5)
    return last ? [{ name: EPISODES[entry.episodeIndex].protagonist, label: last.label }] : []
  })
  const echoes: string[] = []
  for (let i = 0; i < known.length && echoes.length < 3; i += 2) {
    const first = known[i], second = known[i + 1]
    echoes.push(second
      ? first.name + '的最后一次选择，是“' + first.label + '”；后来轮到' + second.name + '，你选择了“' + second.label + '”。'
      : first.name + '的最后一次选择，是“' + first.label + '”。')
  }
  return echoes
}
