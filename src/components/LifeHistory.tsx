import { EPISODES } from '../story/episodes'
import type { RunState } from '../story/runState'
import { Dialog } from './Dialog'

export function LifeHistory({ run, onClose, onTrial }: { run: RunState; onClose: () => void; onTrial: (index: number, decision?: number) => void }) {
  return <Dialog titleId="history-title" onClose={onClose}>
    <header><h2 id="history-title">人生回顾</h2><button onClick={onClose}>关闭</button></header>
    <p>这里保留你当时选择的做法。独立试读可以尝试另一条路，不改写正式人生；刷新或退出即结束试读。</p>
    {EPISODES.slice(0, run.episodeIndex + 1).map((episode, index) => {
      const completed = run.completed.find((entry) => entry.episodeIndex === index)
      const choices = index === run.episodeIndex ? run.choiceLog ?? [] : completed?.choices ?? []
      const complete = index === run.episodeIndex ? run.logComplete : completed?.logComplete
      return <section className="history-life" key={episode.id}>
        <h3>第 {index + 1} 段 · {episode.protagonist}</h3>
        {!complete && <p className="history-note">这段旧进度没有完整的选择记录，只展示已保存的部分。</p>}
        {complete && !choices.length && <p>这一生尚未作出选择。</p>}
        {choices.map((choice, decision) => <details className="history-choice" key={choice.choiceId}>
          <summary>第 {choice.round} 次 · {choice.label}</summary>
          <p>{choice.outcome}</p>
          <button className="secondary-action" onClick={() => onTrial(index, decision)}>从这次选择试读</button>
        </details>)}
        {completed && <div className="history-ending"><strong>{episode.nodes[completed.endingId].title}</strong>{completed.endingText && <p>{completed.endingText}</p>}</div>}
        <button className="secondary-action" onClick={() => onTrial(index)}>从本关开头试读</button>
      </section>
    })}
  </Dialog>
}
