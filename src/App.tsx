import { useCallback, useEffect, useState } from 'react'
import { ChoiceScene } from './components/ChoiceScene'
import { Consequence } from './components/Consequence'
import { FeedCard } from './components/FeedCard'
import { Ending } from './components/Ending'
import { StoryScene } from './components/StoryScene'
import { WorldIntro } from './components/WorldIntro'
import { SeasonComplete } from './components/SeasonComplete'
import { RelicJournal } from './components/RelicJournal'
import { Dialog } from './components/Dialog'
import { RelicPrompt } from './components/RelicPrompt'
import { LifeHistory } from './components/LifeHistory'
import { createTrial, seasonEchoes } from './story/lifeHistory'
import { EPISODES } from './story/episodes'
import { eligibleChoices, presentNode } from './story/episodeMachine'
import { activeRelic, awardPromptId, createRun, loadRun, opportunityPromptId, saveRun, transitionRun, type RunAction } from './story/runState'

export default function App() {
  const [officialRun, setRun] = useState(() => {
    try { return loadRun(window.localStorage) } catch { return { ...createRun(), notice: '浏览器不允许读取存档；本次进度可能无法保存。' } }
  })
  const [trial, setTrial] = useState<ReturnType<typeof createTrial>>(null)
  const run = trial ?? officialRun
  const [historyOpen, setHistoryOpen] = useState(false)
  const [awardRequested, setAwardRequested] = useState(false)
  const [saved, setSaved] = useState<boolean | null>(null)
  const [journalOpen, setJournalOpen] = useState(false)
  const [replayIndex, setReplayIndex] = useState<number | null>(null)
  const [focusRelicChoice, setFocusRelicChoice] = useState(false)
  useEffect(() => {
    if (!officialRun.entered) return
    try { setSaved(saveRun(window.localStorage, officialRun)) } catch { setSaved(false) }
  }, [officialRun])
  const dispatch = (action: RunAction) => {
    const next = transitionRun(run, action)
    if (next.state.nodeId !== run.state.nodeId) setAwardRequested(false)
    if (trial) { setTrial(next); return }
    // Persist in the event itself, before displaying the new ending.
    try { setSaved(saveRun(window.localStorage, next)) } catch { setSaved(false) }
    setRun(next)
  }
  const episode = EPISODES[run.episodeIndex]
  const node = presentNode(episode, run.state)
  const incoming = activeRelic(run)
  const relics = run.completed.map((item) => item.relic)
  const choices = node.stage === 'choice' ? eligibleChoices(node, { tags: run.state.tags, relicIds: incoming && !run.usedRelicId ? [incoming.id] : [] }) : []
  const relicChoice = incoming ? choices.find((choice) => choice.relicId === incoming.id) : undefined
  const awardPending = node.stage === 'ending' && Boolean(node.relic) && !run.acknowledgedAwards.includes(awardPromptId(run))
  const awardOpen = awardPending && awardRequested
  const opportunityOpen = !awardOpen && Boolean(relicChoice && incoming) && !run.acknowledgedOpportunities.includes(opportunityPromptId(run, incoming!))
  const promptOpen = awardOpen || opportunityOpen
  const clearFocusRequest = useCallback(() => setFocusRelicChoice(false), [])
  const exitTrial = () => { setTrial(null); setAwardRequested(false); setHistoryOpen(false); setJournalOpen(false); setFocusRelicChoice(false) }
  const startTrial = (index: number, decision?: number) => {
    const next = createTrial(officialRun, index, decision)
    if (!next) return
    setTrial(next); setHistoryOpen(false); setJournalOpen(false); setAwardRequested(false)
  }
  const restartEpisode = () => {
    if (trial) { setTrial(createTrial(officialRun, run.episodeIndex)); setAwardRequested(false) }
    else setReplayIndex(run.episodeIndex)
  }
  const continueEnding = () => {
    if (awardPending) setAwardRequested(true)
    else if (trial) exitTrial()
    else dispatch({ type: 'continue' })
  }
  let content
  if (!run.entered) content = <WorldIntro onEnter={() => dispatch({ type: 'enter' })} />
  else if (run.complete) content = <SeasonComplete relics={relics} echoes={seasonEchoes(run.completed)} coda="从贡院到深夜的车厢，你做过的选择留在这些物件里。再看一眼，也许会想起当时与你说话的那个人。" onRestart={() => setReplayIndex(0)} />
  else if (node.stage === 'feed') content = <FeedCard episode={episode} onEnter={() => dispatch({ type: 'advance' })} />
  else if (node.stage === 'choice') {
    content = <ChoiceScene node={node} choices={choices} relic={incoming} relicName={incoming?.name} focusRelicChoice={focusRelicChoice} onRelicChoiceFocused={clearFocusRequest} protagonist={episode.protagonist} onChoose={(choiceId) => dispatch({ type: 'choose', choiceId })} />
  } else if (node.stage === 'consequence') content = <Consequence node={node} effects={run.state.recentEffects} onContinue={() => dispatch({ type: 'advance' })} onRestart={restartEpisode} />
  else if (node.stage === 'ending') content = <Ending node={node} saved={trial ? null : saved} needsAward={awardPending} trial={Boolean(trial)} isFinalEpisode={run.episodeIndex === 5} onContinue={continueEnding} onRestart={restartEpisode} />
  else content = <StoryScene node={node} episodeNumber={episode.number} episodeTitle={episode.title} onAdvance={() => dispatch({ type: 'advance' })} />

  const retrySave = () => { if (trial) return; try { setSaved(saveRun(window.localStorage, officialRun)) } catch { setSaved(false) } }
  return <div className="run-shell">
    <div inert={promptOpen || journalOpen || historyOpen || replayIndex !== null ? true : undefined}>
    <div className="run-toolbar">
      <span>{run.entered ? `第 ${run.episodeIndex + 1} 段人生` : '六段人生'}</span>
      {run.entered && !trial && <button onClick={() => setHistoryOpen(true)}>人生回顾</button>}
      <button onClick={() => setJournalOpen(true)}>人生遗物</button>
    </div>
    {trial && <aside className="trial-bar"><span>独立试读 · 不覆盖正式人生</span><button onClick={exitTrial}>退出试读</button></aside>}
    {run.notice && <p className="save-notice" role="status">{run.notice}</p>}
    {saved === false && !awardOpen && !trial && <p className="save-notice" role="alert">保存失败，请勿刷新或关闭页面。<button onClick={retrySave}>重试保存</button></p>}
    {content}
    </div>
    {!promptOpen && historyOpen && <LifeHistory run={officialRun} onClose={() => setHistoryOpen(false)} onTrial={startTrial} />}
    {!promptOpen && journalOpen && replayIndex === null && <RelicJournal run={run} onClose={() => setJournalOpen(false)} onReplay={trial ? (index) => { setTrial(createTrial(officialRun, index)); setJournalOpen(false); setAwardRequested(false) } : setReplayIndex} trial={Boolean(trial)} />}
    {!promptOpen && replayIndex !== null && <Dialog titleId="replay-title" alert onClose={() => setReplayIndex(null)}>
        <h2 id="replay-title">重玩第 {replayIndex + 1} 段人生？</h2>
        <p>这会清除第 {replayIndex + 1} 段及之后的结局、遗物和进度，保留更早的人生。不能同时收藏互斥结局。</p>
        <button className="primary-action" onClick={() => setReplayIndex(null)}>取消</button>
        <button className="secondary-action" onClick={() => { dispatch({ type: 'replay', episodeIndex: replayIndex }); setReplayIndex(null); setJournalOpen(false) }}>确认重玩并重置后续</button>
    </Dialog>}
    {awardOpen && node.relic && <RelicPrompt kind="award" relic={node.relic} source={node.title} saved={trial ? null : saved} trial={Boolean(trial)} isFinal={run.episodeIndex === EPISODES.length - 1} onRetrySave={retrySave} onClose={() => { dispatch({ type: 'acknowledge-award' }); setAwardRequested(false) }} />}
    {opportunityOpen && incoming && relicChoice && <RelicPrompt kind="opportunity" relic={incoming} choice={relicChoice} ordinaryChoices={choices.filter((choice) => !choice.relicId)} saved={trial ? null : saved} trial={Boolean(trial)} onRetrySave={retrySave} onClose={() => { dispatch({ type: 'acknowledge-opportunity' }); setFocusRelicChoice(true) }} />}
  </div>
}
