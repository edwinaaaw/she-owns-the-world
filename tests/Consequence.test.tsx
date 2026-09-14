import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Consequence } from '../src/components/Consequence'

describe('Consequence', () => {
  afterEach(cleanup)

  it('does not render an empty effects region when a choice has no abstract score', () => {
    render(
      <Consequence
        node={{ id: 'result', stage: 'consequence', body: '具体后果。', art: '/scene.jpg', speaker: '林昭' }}
        effects={[]}
        onContinue={() => {}}
        onRestart={() => {}}
      />,
    )

    expect(screen.queryByLabelText('本次选择的即时影响')).not.toBeInTheDocument()
  })
})
