import { BrandMark } from './BrandMark'

interface WorldIntroProps {
  onEnter: () => void
}

const lives = [
  '假扮女人参加科举',
  '因为会配药而被当成男巫',
  '发明机器，却不能写下自己的名字',
  '战争结束后，被要求把工作还给女人',
  '为了替家里还债，与死去的女人成婚',
  '深夜打车时，用隐私换取安全',
]

export function WorldIntro({ onEnter }: WorldIntroProps) {
  return (
    <main className="phone-stage world-intro-stage">
      <div className="world-intro-grain" aria-hidden="true" />

      <header className="world-intro-brand">
        <BrandMark />
      </header>

      <section className="world-intro-copy" aria-labelledby="world-intro-title">
        <p className="world-intro-kicker">世界总序</p>
        <h1 id="world-intro-title">
          <span className="headline-line">女性是</span>
          <span className="headline-line">第一性的天</span>
        </h1>

        <p>在这些世界里，掌权、继承家产、参加考试和外出工作的，通常是女人。</p>
        <p>男人更适合照顾家庭。至少，人们一直这样说。他们要保护名节，服从安排；有时也能进入权力中心，前提是足够漂亮、温顺，或者幸运。</p>

        <p className="world-intro-lead">你将成为六个时代里的六个男人：</p>
        <ul className="world-intro-lives">
          {lives.map((life) => <li key={life}>{life}</li>)}
        </ul>

        <p className="world-intro-note">这些故事不是历史。每段人生都会留下一件东西。下一生带走的不是实物，而是它留下的记忆。你可以沿用那种做法，也可以拒绝重蹈覆辙。</p>
        <p className="world-intro-question">轮到你时，你准备怎么活下去？</p>
      </section>

      <footer className="world-intro-actions">
        <button className="primary-action" onClick={onEnter}>进入第一段人生</button>
      </footer>
    </main>
  )
}
