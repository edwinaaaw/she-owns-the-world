import { assetUrl } from "../assetUrl"
import { EPISODES } from '../story/episodes'
import { relicArt } from '../story/relicArt'
import type { RunState } from '../story/runState'
import { Dialog } from './Dialog'

export function RelicJournal({ run, onClose, onReplay, trial = false }: { run: RunState; onClose: () => void; onReplay: (index: number) => void; trial?: boolean }) {
  return <Dialog titleId="journal-title" onClose={onClose}>
      <header><h2 id="journal-title">人生遗物</h2><button onClick={onClose}>关闭</button></header>
      <p>带到下一生的是记忆，不是实物。每件遗物只在紧接着的下一段人生提供一次做法，不消耗，也不保证好结局。</p>
      {run.completed.length === 0 && <p>还没有获得遗物。每段人生结束时会自动记录。</p>}
      {run.completed.map((entry) => {
        const active = entry.episodeIndex === run.episodeIndex - 1 && !run.complete
        const nextCompleted = run.completed.find((item) => item.episodeIndex === entry.episodeIndex + 1)
        const used = active ? Boolean(run.usedRelicId) : Boolean(nextCompleted?.usedRelicId)
        const status = active ? used ? '本关已使用，仍在收藏中' : run.state.history.some((id) => id.startsWith('q2-')) ? '本关未使用，机会已过' : '本关可用，尚未使用' : entry.episodeIndex === 5 ? '季终遗物，无下一关用途' : entry.episodeIndex === run.episodeIndex ? '下一段人生可用' : used ? '已使用，现仅收藏' : '未使用，现仅收藏'
        return <article className="relic-card" key={entry.episodeIndex}>
          {relicArt(entry.relic) && <img className="relic-thumbnail" src={assetUrl(relicArt(entry.relic))} alt={`${entry.relic.name}的遗物图像`} />}
          <span>第 {entry.episodeIndex + 1} 段 · {EPISODES[entry.episodeIndex].title}</span>
          <h3>{entry.relic.name}</h3><p>{entry.relic.description}</p>
          <p className="relic-status">{status}</p>
          {entry.episodeIndex < 5 && <p>{entry.relic.useHint ?? entry.relic.echo}</p>}
          <p>来源结局：{EPISODES[entry.episodeIndex].nodes[entry.endingId].title}</p>
          <button className="secondary-action" onClick={() => onReplay(entry.episodeIndex)}>{trial ? '试读' : '重玩'}第 {entry.episodeIndex + 1} 段人生</button>
        </article>
      })}
  </Dialog>
}
