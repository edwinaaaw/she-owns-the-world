import type { Choice, EndingRelic } from '../story/types'
import { relicArt } from '../story/relicArt'
import { Dialog } from './Dialog'

interface RelicPromptProps {
  ordinaryChoices?: Choice[]
  trial?: boolean
  kind: 'award' | 'opportunity'
  relic: EndingRelic
  source?: string
  choice?: Choice
  saved?: boolean | null
  isFinal?: boolean
  onClose: () => void
  onRetrySave?: () => void
}
export function RelicPrompt({ kind, relic, source, choice, saved, isFinal, onClose, onRetrySave, ordinaryChoices = [], trial = false }: RelicPromptProps) {
  const art = relicArt(relic)
  const title = kind === 'award' ? '获得人生遗物' : '上一生的记忆，在此刻回应'
  return <Dialog titleId="relic-prompt-title" onClose={onClose}>
    <article className="relic-prompt">
      <header><p className="relic-prompt-kicker">人生遗物</p><h2 id="relic-prompt-title">{title}</h2></header>
      {art && <img className="relic-prompt-image" src={art} alt={`${relic.name}的遗物图像`} />}
      <h3>{relic.name}</h3>
      {kind === 'award' ? <>
        <p>{relic.description}</p>
        {source && <p className="relic-source">来源结局：{source}</p>}
        {!isFinal && <p className="relic-next-use"><strong>下一生可用：</strong>{relic.useHint ?? relic.echo}</p>}
        <p role={saved === false ? 'alert' : 'status'}>{trial ? '试读所得，不计入正式收藏' : saved === true ? '已保存' : saved === false ? '尚未保存' : '等待保存确认'}</p>
        {saved === false && <button className="secondary-action" onClick={onRetrySave}>重试保存</button>}
        <button className="primary-action" onClick={onClose}>收好遗物</button>
      </> : <>
        <p>{relic.useHint ?? relic.echo}</p>
        {choice && <div className="relic-opportunity-copy"><strong>{choice.label}</strong><span>{choice.riskHint}</span></div>}
        {ordinaryChoices.length > 0 && <section className="ordinary-opportunities" aria-label="不用遗物也可以">
          <h4>不用遗物也可以</h4>
          {ordinaryChoices.map((ordinary) => <div className="relic-opportunity-copy" key={ordinary.id}><strong>{ordinary.label}</strong><span>{ordinary.riskHint}</span></div>)}
        </section>}
        <p className="relic-next-use">遗物提供额外的方法，不是推荐答案。</p>
        <p role={saved === false ? 'alert' : 'status'}>{trial ? '正在独立试读，不改写正式人生' : saved === true ? '已保存' : saved === false ? '尚未保存' : '等待保存确认'}</p>
        {saved === false && <button className="secondary-action" onClick={onRetrySave}>重试保存</button>}
        <button className="primary-action" onClick={onClose}>查看所有做法</button>
      </>}
    </article>
  </Dialog>
}
