import type { EpisodeNode } from '../story/types'
import { relicArt } from '../story/relicArt'

interface EndingProps {
  needsAward?: boolean
  trial?: boolean
  saved?: boolean | null
  node: EpisodeNode
  isFinalEpisode: boolean
  onContinue: () => void
  onRestart: () => void
}

export function Ending({ node, saved, isFinalEpisode, onContinue, onRestart, needsAward = false, trial = false }: EndingProps) {
  return (
    <main className="phone-stage ending-stage">
      <img className="scene-cover" src={node.art} alt="本段人生的结局" />
      <div className="ending-shade" />
      <header className="result-header">
        <span>{node.speaker}</span>
        <span className="result-seal">终</span>
      </header>
      <section className="ending-copy">
        <p className="ending-kicker">五次选择以后</p>
        <h1>{node.title}</h1>
        <p>{node.body}</p>
        {node.unresolvedEcho && <p className="unresolved-echo">{node.unresolvedEcho}</p>}
        {node.relic && !needsAward && (
          <article className="relic-card" aria-label="本段人生遗物">
            {relicArt(node.relic) && <img className="relic-thumbnail" src={relicArt(node.relic)} alt={`${node.relic.name}的遗物图像`} />}
            <span>已获得</span>
            <h2>{node.relic.name}</h2>
            <p>{node.relic.description}</p>
            <p role="status">{trial ? '试读所得，不计入正式收藏' : saved === true ? '已保存' : saved === false ? '尚未保存' : '等待保存确认'}</p>
          </article>
        )}
        {!isFinalEpisode && !needsAward && !trial && (node.relic?.useHint || node.nextLifeTeaser) && (
          <div className="next-life-teaser">
            <span>下一段人生</span>
            <p>{node.relic?.useHint ?? node.nextLifeTeaser}</p>
          </div>
        )}
      </section>
      <footer className="result-actions">
        <button className="primary-action" onClick={onContinue}>{needsAward ? '记住这段人生' : trial ? '结束试读，返回正式人生' : isFinalEpisode ? '完成这一季' : '进入下一段人生'}</button>
        <button className="secondary-action" onClick={onRestart}>换一条路重来</button>
      </footer>
    </main>
  )
}
