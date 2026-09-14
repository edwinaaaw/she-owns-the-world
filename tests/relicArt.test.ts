import { describe, expect, it } from 'vitest'
/// <reference types="vite/client" />
import { relicArt } from '../src/story/relicArt'
import { EPISODES } from '../src/story/episodes'

describe('relic artwork', () => {
  it('uses separate objects for factual outcome variants', () => {
    const art = (episode: number, ending: string) => relicArt(EPISODES[episode].nodes[ending].relic!)
    expect(art(0, 'exam-end-exception')).toBe('/art/relics/named-roll.webp')
    expect(art(0, 'exam-end-rules')).toBe('/art/relics/signed-rules.webp')
    expect(art(0, 'exam-end-cosigned')).toBe('/art/relics/cosigned-rules.webp')
    expect(art(3, 'home-end-film')).toBe('/art/relics/assessment-record.webp')
    expect(art(3, 'home-end-unbroadcast')).toBe('/art/relics/film-strip.webp')
  })
  it('has a local illustration for every first-five-life ending', () => {
    for (const episode of EPISODES.slice(0, 5)) {
      for (const ending of Object.values(episode.nodes).filter(node => node.stage === 'ending')) {
        const path = relicArt(ending.relic!)
        expect(path, ending.id).toMatch(/^\/art\/relics\/.+\.webp$/)
        const assets = import.meta.glob('../public/art/relics/*.webp', { query: '?url', import: 'default' })
        expect(`../public${path}` in assets, ending.id).toBe(true)
      }
    }
  })
  it('gives final-life objects their own local images rather than borrowing earlier relics', () => {
    const assets = import.meta.glob('../public/art/relics/*.png', { query: '?url', import: 'default' })
    const paths = new Set<string>()
    for (const ending of Object.values(EPISODES[5].nodes).filter(node => node.stage === 'ending')) {
      const path = relicArt(ending.relic!)
      expect(path).toBe('/art/relics/' + ending.relic!.id + '.png')
      expect('../public' + path in assets).toBe(true)
      paths.add(path!)
    }
    expect(paths.size).toBe(3)
    expect(relicArt({ id: 'unknown', name: '未知', description: '', echo: '', pattern: 'record' })).toBeUndefined()
  })
})
