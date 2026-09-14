import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'
import App from '../src/App'
import { createRun, SAVE_KEY, transitionRun, type RunState } from '../src/story/runState'
import { EPISODES } from '../src/story/episodes'
import { eligibleChoices } from '../src/story/episodeMachine'

afterEach(cleanup)
function ending(): RunState {
  let run = transitionRun(createRun(), { type: 'enter' })
  for (let n = 0; n < 30; n++) {
    const node = EPISODES[0].nodes[run.state.nodeId]
    if (node.stage === 'ending') return run
    run = node.stage === 'choice' ? transitionRun(run, { type: 'choose', choiceId: eligibleChoices(node, { tags: run.state.tags, relicIds: [] })[0].id }) : transitionRun(run, { type: 'advance' })
  }
  throw new Error('no ending')
}
it('lets the player read the ending before showing the already-saved relic', async () => {
  const run = ending()
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(run))
  const user = userEvent.setup()
  render(<App />)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByRole('heading', { name: EPISODES[0].nodes[run.state.nodeId].title })).toBeInTheDocument()
  expect(JSON.parse(window.localStorage.getItem(SAVE_KEY)!).completed).toHaveLength(1)
  await user.click(screen.getByRole('button', { name: '记住这段人生' }))
  expect(screen.getByRole('dialog', { name: '获得人生遗物' })).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: '收好遗物' }))
  expect(screen.getByRole('button', { name: '进入下一段人生' })).toBeInTheDocument()
})
it('shows real past choices and tries another route without writing the official run', async () => {
  const run = ending()
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(run))
  const user = userEvent.setup()
  const view = render(<App />)
  const official = window.localStorage.getItem(SAVE_KEY)
  await user.click(screen.getByRole('button', { name: '人生回顾' }))
  const history = screen.getByRole('dialog', { name: '人生回顾' })
  expect(history).toHaveTextContent(run.choiceLog![0].label)
  await user.click(within(history).getAllByRole('button', { name: '从这次选择试读' })[0])
  expect(screen.getByText('独立试读 · 不覆盖正式人生')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /请沈砚秋把你藏进内档室/ }))
  expect(window.localStorage.getItem(SAVE_KEY)).toBe(official)
  await user.click(screen.getByRole('button', { name: '退出试读' }))
  expect(screen.getByRole('heading', { name: EPISODES[0].nodes[run.state.nodeId].title })).toBeInTheDocument()
  expect(window.localStorage.getItem(SAVE_KEY)).toBe(official)
  await user.click(screen.getByRole('button', { name: '人生回顾' }))
  await user.click(screen.getByRole('button', { name: '从本关开头试读' }))
  view.unmount()
  render(<App />)
  expect(screen.queryByText('独立试读 · 不覆盖正式人生')).not.toBeInTheDocument()
  expect(screen.getByRole('heading', { name: EPISODES[0].nodes[run.state.nodeId].title })).toBeInTheDocument()
})
it('puts ordinary options beside the relic opportunity without selecting one', async () => {
  let run = transitionRun(ending(), { type: 'continue' })
  for (let n = 0; n < 5; n++) {
    const node = EPISODES[1].nodes[run.state.nodeId]
    if (node.id === 'q2-research') break
    run = node.stage === 'choice' ? transitionRun(run, { type: 'choose', choiceId: 'witch-q1-research' }) : transitionRun(run, { type: 'advance' })
  }
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(run))
  const user = userEvent.setup()
  render(<App />)
  const dialog = screen.getByRole('dialog', { name: '上一生的记忆，在此刻回应' })
  const ordinary = eligibleChoices(EPISODES[1].nodes[run.state.nodeId], { tags: run.state.tags, relicIds: [] })
  for (const choice of ordinary) expect(dialog).toHaveTextContent(choice.label)
  await user.click(within(dialog).getByRole('button', { name: '查看所有做法' }))
  expect(JSON.parse(window.localStorage.getItem(SAVE_KEY)!).usedRelicId).toBeUndefined()
  expect(screen.getByRole('button', { name: /使用上一生遗物/ })).not.toHaveFocus()
})

it('finishes an alternate ending and its award entirely inside trial', async () => {
  const run = ending()
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(run))
  const user = userEvent.setup()
  render(<App />)
  const official = window.localStorage.getItem(SAVE_KEY)
  await user.click(screen.getByRole('button', { name: '人生回顾' }))
  await user.click(screen.getAllByRole('button', { name: '从这次选择试读' })[4])
  const choices = document.querySelectorAll<HTMLButtonElement>('.docket-choice')
  await user.click(choices[1])
  await user.click(screen.getByRole('button', { name: '记住这段人生' }))
  expect(screen.getByRole('dialog', { name: '获得人生遗物' })).toHaveTextContent('试读所得，不计入正式收藏')
  await user.click(screen.getByRole('button', { name: '收好遗物' }))
  expect(window.localStorage.getItem(SAVE_KEY)).toBe(official)
  await user.click(screen.getByRole('button', { name: '结束试读，返回正式人生' }))
  expect(screen.getByRole('heading', { name: EPISODES[0].nodes[run.state.nodeId].title })).toBeInTheDocument()
  expect(window.localStorage.getItem(SAVE_KEY)).toBe(official)
})
