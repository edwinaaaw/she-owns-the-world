import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { EPISODES } from '../src/story/episodes'
import { eligibleChoices } from '../src/story/episodeMachine'
import { activeRelic, createRun, SAVE_KEY, transitionRun } from '../src/story/runState'

describe('App', () => {
  afterEach(cleanup)
  async function finishCurrentEpisode(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole('button', { name: '进入此局' }))
    await user.click(screen.getByRole('button', { name: /继续/ }))
    for (let round = 1; round <= 5; round += 1) {
      const choices = document.querySelectorAll<HTMLButtonElement>('.docket-choice')
      await user.click(choices[0])
      if (round < 5) await user.click(screen.getByRole('button', { name: '继续' }))
    }
    expect(screen.queryByRole('dialog', { name: '获得人生遗物' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '记住这段人生' }))
  }
  function finishFirstLife(openingIndex = 0) {
    let run = transitionRun(createRun(), { type: 'enter' })
    let firstChoice = true
    for (let guard = 0; guard < 20; guard += 1) {
      const node = EPISODES[run.episodeIndex].nodes[run.state.nodeId]
      if (node.stage === 'ending') return run
      if (node.stage === 'choice') {
        const choices = eligibleChoices(node, { tags: run.state.tags, relicIds: [] })
        run = transitionRun(run, { type: 'choose', choiceId: choices[firstChoice ? openingIndex : 0].id })
        firstChoice = false
      } else run = transitionRun(run, { type: 'advance' })
    }
    throw new Error('first life did not finish')
  }
  function atSecondLifeRelicChoice(openingIndex = 0, route = 'research') {
    let run = transitionRun(finishFirstLife(openingIndex), { type: 'acknowledge-award' })
    run = transitionRun(run, { type: 'continue' })
    run = transitionRun(run, { type: 'advance' })
    run = transitionRun(run, { type: 'advance' })
    run = transitionRun(run, { type: 'choose', choiceId: `witch-q1-${route}` })
    return transitionRun(run, { type: 'advance' })
  }

  it('offers a working entry without suggesting unavailable feed actions', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: '进入第一段人生' }))
    expect(screen.queryByRole('button', { name: '收藏此局' })).not.toBeInTheDocument()
    expect(screen.queryByText(/上滑/)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '进入此局' }))
    expect(screen.getByRole('button', { name: /继续/ })).toBeInTheDocument()
  })

  it('keeps the concrete cost visible from the opportunity through the optional follow-up', async () => {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(atSecondLifeRelicChoice()))
    const user = userEvent.setup()
    render(<App />)
    const dialog = screen.getByRole('dialog', { name: '上一生的记忆，在此刻回应' })
    expect(dialog).toHaveTextContent(/无证.*证据/)
    expect(dialog).toHaveTextContent(/额外.*方法.*推荐/)
    await user.click(within(dialog).getByRole('button', { name: '查看所有做法' }))
    const offer = screen.getByRole('button', { name: /使用上一生遗物/ })
    expect(offer).toHaveTextContent(/无证.*证据/)
    await user.click(offer)
    await user.click(screen.getByRole('button', { name: '继续' }))
    expect(screen.getByRole('button', { name: /给三栏记录留副页/ })).toHaveTextContent(/无证.*证据/)
  })

  it('finishes the first life and continues directly to the second', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { name: '女性是第一性的天' })).toBeInTheDocument()
    expect(screen.getByText('SHE OWNS THE WORLD')).toBeInTheDocument()
    expect(screen.getByText('PLAYABLE LIVES')).toBeInTheDocument()
    expect(screen.queryByText('她主天下')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '进入第一段人生' }))
    expect(screen.getByText('男人不得进入贡院')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '你假扮成女人，考了第一名。' })).toBeInTheDocument()
    expect(screen.getByText('SHE OWNS THE WORLD')).toBeInTheDocument()

    await finishCurrentEpisode(user)
    expect(screen.getByRole('heading', { name: '榜首的那一个男人' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '收好遗物' }))
    expect(screen.getByRole('article', { name: '本段人生遗物' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '进入下一段人生' }))
    expect(screen.getByText('男人不得受训行医或配药')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '进入此局' }))
    await user.click(screen.getByRole('button', { name: /继续/ }))
    await user.click(screen.getByRole('button', { name: /说出玛塔的名字/ }))
    await user.click(screen.getByRole('button', { name: '继续' }))
    expect(screen.getByRole('dialog', { name: '上一生的记忆，在此刻回应' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '查看所有做法' }))
    expect(screen.getByRole('button', { name: /使用上一生遗物/ })).toBeInTheDocument()
  })

  it('renders one scene image on a choice page instead of duplicating the protagonist', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: '进入第一段人生' }))
    await user.click(screen.getByRole('button', { name: '进入此局' }))
    await user.click(screen.getByRole('button', { name: /继续/ }))

    expect(screen.getAllByRole('img')).toHaveLength(1)
    expect(screen.getByAltText('林昭所在的场景')).toHaveAttribute('src', '/art/lin-anxious.webp')
  })

  it('shows season completion after all six lives', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: '进入第一段人生' }))

    for (let episode = 1; episode <= 6; episode += 1) {
      await finishCurrentEpisode(user)
      await user.click(screen.getByRole('button', { name: '收好遗物' }))
      await user.click(screen.getByRole('button', { name: episode < 6 ? '进入下一段人生' : '完成这一季' }))
    }

    expect(screen.getByRole('heading', { name: '六段人生，已经走完。' })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: '六段人生遗物' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
  })

  it('saves the ending immediately and restores it after remount', async () => {
    const user = userEvent.setup()
    const first = render(<App />)
    await user.click(screen.getByRole('button', { name: '进入第一段人生' }))
    await finishCurrentEpisode(user)
    expect(within(screen.getByRole('dialog', { name: '获得人生遗物' })).getByText('已保存')).toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem(SAVE_KEY)!).completed).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: '收好遗物' }))
    first.unmount()
    render(<App />)
    expect(screen.getByRole('heading', { name: '榜首的那一个男人' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '人生遗物' }))
    expect(screen.getByRole('dialog', { name: '人生遗物' })).toBeInTheDocument()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: /重玩第 1 段人生/ })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: /重玩第 1 段人生/ }))
    expect(screen.getByText(/清除第 1 段及之后/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '取消' }))
    expect(JSON.parse(window.localStorage.getItem(SAVE_KEY)!).completed).toHaveLength(1)
  })
  it('shows illustrated award, saves acquisition immediately, and keeps dismissal after remount', async () => {
    const user = userEvent.setup()
    const first = render(<App />)
    await user.click(screen.getByRole('button', { name: '进入第一段人生' }))
    await finishCurrentEpisode(user)
    const dialog = screen.getByRole('dialog', { name: '获得人生遗物' })
    expect(dialog).toHaveTextContent('留有真名的文书')
    expect(within(dialog).getByRole('img', { name: /留有真名的文书/ })).toHaveAttribute('src', expect.stringContaining('/art/relics/'))
    expect(JSON.parse(window.localStorage.getItem(SAVE_KEY)!).completed).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: '收好遗物' }))
    first.unmount()
    render(<App />)
    expect(screen.queryByRole('dialog', { name: '获得人生遗物' })).not.toBeInTheDocument()
  })
  it('acknowledges an opportunity without choosing it and focuses all available actions', async () => {
    const run = atSecondLifeRelicChoice()
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(run))
    const user = userEvent.setup()
    const first = render(<App />)
    expect(screen.getByRole('dialog', { name: '上一生的记忆，在此刻回应' })).toHaveTextContent('请书记员分列你提出、药师核对和执行的职责')
    await user.click(screen.getByRole('button', { name: '查看所有做法' }))
    const relicChoice = screen.getByRole('button', { name: /使用上一生遗物 · 留有真名的文书/ })
    expect(relicChoice).not.toHaveFocus()
    expect(screen.getByRole('region', { name: '可选行动' })).toHaveFocus()
    const saved = JSON.parse(window.localStorage.getItem(SAVE_KEY)!)
    expect(saved.state.nodeId).toBe('q2-research')
    expect(saved.state.tags).toEqual(run.state.tags)
    expect(saved.usedRelicId).toBeUndefined()
    first.unmount()
    render(<App />)
    expect(screen.queryByRole('dialog', { name: '上一生的记忆，在此刻回应' })).not.toBeInTheDocument()
  })
  it.each([0, 1, 2].flatMap(opening => ['teacher', 'research', 'patient'].map(route => [opening, route] as const)))('shows the correct relic opportunity for opening %s and route %s', async (opening, route) => {
    const run = atSecondLifeRelicChoice(opening, route)
    const relic = activeRelic(run)!
    expect(relic.id).toBe(['named-roll', 'sealed-page', 'school-roster'][opening])
    const node = EPISODES[1].nodes[run.state.nodeId]
    const choice = eligibleChoices(node, { tags: run.state.tags, relicIds: [relic.id] }).find(item => item.relicId)!
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(run))
    const user = userEvent.setup()
    render(<App />)
    const dialog = screen.getByRole('dialog', { name: '上一生的记忆，在此刻回应' })
    expect(dialog).toHaveTextContent(relic.name)
    expect(dialog).toHaveTextContent(choice.label)
    expect(dialog).toHaveTextContent(choice.riskHint)
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', `/art/relics/${relic.id}.webp`)
    await user.click(within(dialog).getByRole('button', { name: '查看所有做法' }))
    expect(screen.getByRole('button', { name: new RegExp('使用上一生遗物 · ' + relic.name) })).not.toHaveFocus()
    expect(screen.getByRole('region', { name: '可选行动' })).toHaveFocus()
    expect(JSON.parse(window.localStorage.getItem(SAVE_KEY)!).usedRelicId).toBeUndefined()
  })
  it('retries a failed save inside the opportunity without dismissing or choosing', async () => {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(atSecondLifeRelicChoice()))
    const storage = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => { throw new Error('quota') })
    const user = userEvent.setup()
    render(<App />)
    const dialog = screen.getByRole('dialog', { name: '上一生的记忆，在此刻回应' })
    expect(within(dialog).getByText('尚未保存')).toBeInTheDocument()
    storage.mockRestore()
    await user.click(within(dialog).getByRole('button', { name: '重试保存' }))
    expect(within(dialog).getByText('已保存')).toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem(SAVE_KEY)!).usedRelicId).toBeUndefined()
  })
  it('ordinary choice does not record use while highlighted choice follows its authored consequence', async () => {
    const user = userEvent.setup()
    const ready = { ...atSecondLifeRelicChoice(), acknowledgedOpportunities: ['1:q2-research:named-roll'] }
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(ready))
    const first = render(<App />)
    await user.click(screen.getByRole('button', { name: /凭记忆重写全部剂量/ }))
    expect(JSON.parse(window.localStorage.getItem(SAVE_KEY)!).usedRelicId).toBeUndefined()
    first.unmount()
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(ready))
    render(<App />)
    await user.click(screen.getByRole('button', { name: /使用上一生遗物 · 留有真名的文书/ }))
    const saved = JSON.parse(window.localStorage.getItem(SAVE_KEY)!)
    expect(saved.usedRelicId).toBe(activeRelic(ready)?.id)
    expect(saved.state.nodeId).toBe('result-use-witch-trial-research-named-roll')
  })
  it('keeps the ending playable but never labels a failed save as saved', async () => {
    const storage = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => { throw new Error('quota') })
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: '进入第一段人生' }))
    await finishCurrentEpisode(user)
    const award = screen.getByRole('dialog', { name: '获得人生遗物' })
    expect(within(award).getByText('尚未保存')).toBeInTheDocument()
    expect(screen.queryByText('已保存')).not.toBeInTheDocument()
    storage.mockRestore()
    await user.click(within(award).getByRole('button', { name: '重试保存' }))
    expect(within(award).getByText('已保存')).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: '获得人生遗物' })).toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem(SAVE_KEY)!).completed).toHaveLength(1)
  })
})
