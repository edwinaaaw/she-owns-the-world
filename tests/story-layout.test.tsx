import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ChoiceScene } from '../src/components/ChoiceScene'
import { StoryScene } from '../src/components/StoryScene'
import type { EpisodeNode } from '../src/story/types'

describe('story typography', () => {
  afterEach(cleanup)

  it('shows the scene identity only once', () => {
    const node: EpisodeNode = {
      id: 'intro', stage: 'scene', speaker: '林昭 · 架空世界', body: '开场', art: '/scene.jpg', nextId: 'choice-1',
    }

    render(<StoryScene node={node} episodeNumber={1} episodeTitle="男人不能参加科举" onAdvance={vi.fn()} />)

    expect(screen.getAllByText('林昭 · 架空世界')).toHaveLength(1)
  })

  it('keeps the final phrase of a choice prompt together', () => {
    const node: EpisodeNode = {
      id: 'choice-3', stage: 'choice', round: 3, speaker: '伊莱亚斯',
      title: '病人的秘密，能不能成为你的证据？', body: '审判仍在继续。', art: '/scene.jpg', choices: [],
    }

    const { container } = render(<ChoiceScene node={node} protagonist="伊莱亚斯" onChoose={vi.fn()} />)

    expect(container.querySelector('.no-orphan')).toHaveTextContent('的证据？')
  })

  it('renders only the eligible choices supplied by the story machine', () => {
    const node: EpisodeNode = {
      id: 'choice-4', stage: 'choice', round: 4, speaker: '伊莱亚斯',
      title: '现在怎么做？', body: '审判仍在继续。', art: '/scene.jpg',
      choices: [
        { id: 'plain', label: '普通行动', riskHint: '人人可见', gain: '', cost: '', nextId: 'done', effects: [] },
        { id: 'echo', label: '上一生的回响', riskHint: '需要遗物', gain: '', cost: '', nextId: 'done', effects: [] },
      ],
    }

    render(<ChoiceScene node={node} choices={[node.choices![0]]} protagonist="伊莱亚斯" onChoose={vi.fn()} />)

    expect(screen.getByRole('button', { name: /普通行动/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /上一生的回响/ })).not.toBeInTheDocument()
  })
})
