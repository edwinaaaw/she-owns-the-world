import { BrandMark } from './BrandMark'
import { assetUrl } from '../assetUrl'
import type { EpisodeDefinition } from '../story/types'

interface FeedCardProps {
  episode: EpisodeDefinition
  onEnter: () => void
}

export function FeedCard({ episode, onEnter }: FeedCardProps) {
  return (
    <main className="phone-stage feed-stage">
      <img className="scene-cover slow-push" src={assetUrl(episode.feedArt)} alt={episode.feedAlt} />
      <div className="feed-shade" />
      <header className="feed-brand">
        <BrandMark compact />
        <span className="episode-mark">第 {episode.number} 集</span>
      </header>

      <section className="feed-copy" aria-labelledby="feed-rule">
        <p id="feed-rule" className="world-rule">{episode.rule}</p>
        <h1 className="feed-headline">
          <span className="headline-line">{episode.headline[0]}</span>
          <span className="headline-line">{episode.headline[1]}</span>
        </h1>
        <p className="hook-note">{episode.hook}</p>
      </section>

      <footer className="feed-actions">
        <button className="primary-action" onClick={onEnter}>进入此局</button>
      </footer>
    </main>
  )
}
