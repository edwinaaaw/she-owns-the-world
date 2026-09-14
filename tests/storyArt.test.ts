import { describe, expect, it } from 'vitest'
import { EPISODES } from '../src/story/episodes'
import { relicArt } from '../src/story/relicArt'

const assets = import.meta.glob('../public/art/**/*.{jpg,jpeg,png,webp,svg}', { query: '?url', import: 'default' })
const exists = (path: string) => '../public' + path in assets

describe('all game image references', () => {
  it('provides a real local image for every scene in all six chapters', () => {
    const missing: string[] = []
    for (const episode of EPISODES) {
      if (!exists(episode.feedArt)) missing.push(episode.id + '/feed: ' + episode.feedArt)
      for (const node of Object.values(episode.nodes)) {
        if (node.art && !exists(node.art)) missing.push(episode.id + '/' + node.id + ': ' + node.art)
      }
    }
    expect(missing).toEqual([])
  })

  it('provides a real image for every ending relic, including generated links', () => {
    const missing: string[] = []
    for (const episode of EPISODES) for (const node of Object.values(episode.nodes)) {
      if (!node.relic) continue
      const path = relicArt(node.relic)
      if (!path || !exists(path)) missing.push(episode.id + '/' + node.id + ': ' + path)
    }
    expect(missing).toEqual([])
  })

  it('does not leave missing literal image paths in source or styles', () => {
    const sources = import.meta.glob('../src/**/*.{ts,tsx,css}', { query: '?raw', import: 'default', eager: true })
    const missing: string[] = []
    for (const [file, source] of Object.entries(sources)) {
      for (const match of String(source).matchAll(/\/art\/[A-Za-z0-9_./-]+\.(?:jpg|jpeg|png|webp|svg)/g)) {
        if (!exists(match[0])) missing.push(file + ': ' + match[0])
      }
    }
    expect(missing).toEqual([])
  })
})
