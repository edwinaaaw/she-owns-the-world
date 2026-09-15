import { assetUrl } from "../assetUrl"
import { useEffect, useRef } from 'react'
import { relicArt } from '../story/relicArt'
import type { Choice, EndingRelic, EpisodeNode } from '../story/types'

interface ChoiceSceneProps {
  relicName?: string
  relic?: EndingRelic
  focusRelicChoice?: boolean
  onRelicChoiceFocused?: () => void
  node: EpisodeNode
  choices?: Choice[]
  protagonist: string
  onChoose: (choiceId: string) => void
}

export function ChoiceScene({ node, choices = node.choices ?? [], relicName, relic, focusRelicChoice, onRelicChoiceFocused, protagonist, onChoose }: ChoiceSceneProps) {
  const relicButton = useRef<HTMLButtonElement>(null)
  const choiceGroup = useRef<HTMLElement>(null)
  useEffect(() => { if (focusRelicChoice) { choiceGroup.current?.focus(); onRelicChoiceFocused?.() } }, [focusRelicChoice, onRelicChoiceFocused])
  const titleCharacters = Array.from(node.title ?? '')
  const protectedSuffix = titleCharacters.splice(-4).join('')

  return (
    <main className="phone-stage choice-stage">
      <img className="scene-cover" src={assetUrl(node.art)} alt={`${protagonist}所在的场景`} />
      <div className="choice-shade" />

      <header className="choice-header">
        <span className="seal">{node.round}</span>
        <div>
          <p>{protagonist}的选择 · 第 {node.round}/5 轮</p>
          <h1>{titleCharacters.join('')}<span className="no-orphan">{protectedSuffix}</span></h1>
        </div>
      </header>

      <p className="choice-context">{node.body}</p>
      <section className="docket" aria-label="可选行动" tabIndex={-1} ref={choiceGroup}>
        {choices.map((choice: Choice, index) => (
          <button key={choice.id} ref={choice.relicId ? relicButton : undefined} data-relic-choice={choice.relicId || undefined} className={`docket-choice${choice.relicId ? ' relic-choice' : ''}`} onClick={() => onChoose(choice.id)}>
            <span className="choice-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="choice-copy">
              <strong>{choice.label}</strong>
              {choice.relicId && <span className="relic-choice-heading">{relic && relicArt(relic) && <img src={assetUrl(relicArt(relic))} alt="" />}<small className="relic-choice-label">使用上一生遗物 · {relic?.name ?? relicName}</small></span>}
              <small>{choice.riskHint}</small>
            </span>
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </section>
      <p className="choice-warning">{choices.some(choice => choice.relicId) ? '遗物提供额外的方法，不是推荐答案。' : '选择之后，还要面对对方的回应。'}</p>
    </main>
  )
}
