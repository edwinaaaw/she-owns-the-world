import { BrandMark } from './BrandMark'
import type { EndingRelic } from '../story/types'

interface SeasonCompleteProps {
  echoes?: string[]
  relics: EndingRelic[]
  coda: string
  onRestart: () => void
}

export function SeasonComplete({ relics, coda, onRestart, echoes = [] }: SeasonCompleteProps) {
  return (
    <main className="phone-stage season-complete">
      <BrandMark />
      <section>
        <p className="ending-kicker">SEASON ONE · COMPLETE</p>
        <h1>六段人生，<br />已经走完。</h1>
        <p>{coda}</p>
        {echoes.length > 0 && <section className="season-echoes" aria-label="这一次的选择"><h2>这一次，你这样走过</h2>{echoes.map((echo, index) => <p key={index}>{echo}</p>)}</section>}
        <ol className="season-relics" aria-label="六段人生遗物">
          {relics.map((relic) => (
            <li key={relic.id}>
              <strong>{relic.name}</strong>
              <span>{relic.echo}</span>
            </li>
          ))}
        </ol>
      </section>
      <button className="primary-action" onClick={onRestart}>从第一段人生重新开始</button>
    </main>
  )
}
