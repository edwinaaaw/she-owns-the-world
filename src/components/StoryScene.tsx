import type { EpisodeNode } from '../story/types'

interface StorySceneProps {
  node: EpisodeNode
  episodeNumber: number
  episodeTitle: string
  onAdvance: () => void
}

export function StoryScene({ node, episodeNumber, episodeTitle, onAdvance }: StorySceneProps) {
  return (
    <main className="phone-stage story-stage">
      <img className="scene-cover" src={node.art} alt={`${node.speaker}的故事开场`} />
      <div className="story-vignette" />

      <header className="scene-header">
        <span>第 {episodeNumber} 集 · {episodeTitle}</span>
        <span className="progress-rule"><i /></span>
      </header>

      <section className="dialogue-panel">
        <p className="speaker">{node.speaker}</p>
        <p className="dialogue">{node.body}</p>
        <button className="continue-action" onClick={onAdvance}>
          继续 <span aria-hidden="true">→</span>
        </button>
      </section>
    </main>
  )
}
