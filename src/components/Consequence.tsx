import type { Effect, EpisodeNode } from '../story/types'

interface ConsequenceProps {
  node: EpisodeNode
  effects: Effect[]
  onContinue: () => void
  onRestart: () => void
}

export function Consequence({ node, effects, onContinue, onRestart }: ConsequenceProps) {
  return (
    <main className="phone-stage consequence-stage">
      <img className="scene-cover" src={node.art} alt={`${node.speaker}注视着你的决定`} />
      <div className="consequence-shade" />
      <header className="result-header">
        <span>选择已经发生</span>
        <span className="result-seal">录</span>
      </header>

      <section className="result-copy">
        <p className="speaker">{node.speaker}</p>
        <blockquote>{node.body}</blockquote>
        {effects.length > 0 && (
          <div className="effects" aria-label="本次选择的即时影响">
            {effects.map((effect) => <span key={`${effect.key}-${effect.delta}`}>{effect.label}</span>)}
          </div>
        )}
      </section>

      <footer className="result-actions">
        <button className="primary-action" type="button" onClick={onContinue}>继续</button>
        <button className="secondary-action" onClick={onRestart}>从头重选</button>
      </footer>
    </main>
  )
}
