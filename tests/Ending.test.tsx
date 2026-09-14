import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Ending } from '../src/components/Ending'
import type { EpisodeNode } from '../src/story/types'

const endingNode: EpisodeNode = {
  id: 'test-ending',
  stage: 'ending',
  speaker: '结局',
  title: '测试结局',
  body: '故事在这里结束。',
  art: '/art/test-ending.jpg',
  relic: {
    id: 'test-relic', name: '测试遗物', description: '它保存了选择留下的痕迹。',
    echo: '这件事还没有真正结束。', pattern: 'record',
  },
  unresolvedEcho: '一个尚未回答的问题。',
  nextLifeTeaser: '下一段人生正在等待。',
}

describe('Ending', () => {
  afterEach(cleanup)

  it('shows the earned relic and unresolved echo instead of strategy totals', () => {
    render(
      <Ending
        node={endingNode}
        isFinalEpisode={false}
        onContinue={() => {}}
        onRestart={() => {}}
      />,
    )

    expect(screen.queryByText(/保全自己/)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '测试结局' })).toBeInTheDocument()
    expect(screen.getByText('测试遗物')).toBeInTheDocument()
    expect(screen.getByText('一个尚未回答的问题。')).toBeInTheDocument()
    expect(screen.getByText('下一段人生正在等待。')).toBeInTheDocument()
  })

  it('does not show a next-life teaser on the final life', () => {
    render(
      <Ending
        node={endingNode}
        isFinalEpisode
        onContinue={() => {}}
        onRestart={() => {}}
      />,
    )

    expect(screen.queryByText('下一段人生正在等待。')).not.toBeInTheDocument()
  })
})
