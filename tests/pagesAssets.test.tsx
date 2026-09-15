import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { FeedCard } from '../src/components/FeedCard'
import { RelicPrompt } from '../src/components/RelicPrompt'
import { EPISODES } from '../src/story/episodes'

afterEach(() => { cleanup(); vi.unstubAllEnvs() })

it('loads every chapter cover within the GitHub Pages project path', () => {
  vi.stubEnv('BASE_URL', '/sheownstheworld/')
  for (const episode of EPISODES) {
    const view = render(<FeedCard episode={episode} onEnter={() => {}} />)
    const src = view.container.querySelector('img')!.getAttribute('src')!
    expect(new URL(src, 'https://edwinaaaw.github.io/sheownstheworld/').pathname)
      .toBe('/sheownstheworld' + episode.feedArt)
    view.unmount()
  }
})

it('loads dynamically selected relic art inside the project path', () => {
  vi.stubEnv('BASE_URL', '/sheownstheworld/')
  const relic = Object.values(EPISODES[0].nodes).find(node => node.relic)!.relic!
  const view = render(<RelicPrompt kind="award" relic={relic} onClose={() => {}} />)
  const src = view.container.querySelector('img')!.getAttribute('src')!
  expect(src).toMatch(/^\/sheownstheworld\/art\/relics\/.+\.(webp|png)$/)
})

it('keeps root-hosted chapter covers working for local development', () => {
  vi.stubEnv('BASE_URL', '/')
  const view = render(<FeedCard episode={EPISODES[0]} onEnter={() => {}} />)
  expect(view.container.querySelector('img')).toHaveAttribute('src', EPISODES[0].feedArt)
})
