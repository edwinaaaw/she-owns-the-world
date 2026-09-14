import { describe, expect, it } from 'vitest'
import { paths, verifyPaths, verifyClone } from './helpers/storyPaths'
import { withExamConsequences } from '../src/story/episodes/examConsequences'
it('decorator does not mutate supplied chapter or nested memories', () => verifyClone(episode, withExamConsequences))
const { episode, play, pick, body, result, legacy } = paths('exam')

describe('exam causal memory', () => {
  it('does not invent fresh portrait consent in old saves or immunity without accepting amnesty', () => {
    const old = legacy('exam-end-exception', ['routeRecord', 'nameSealed', 'portraitRefused', 'acceptedOffice'])
    expect(body(old)).not.toMatch(/你接受了连同画像|你改变了对任职/)
    const fresh = play(['exam-q1-record', 'exam-record-q2-witness', 'exam-record-q3-seal', 'exam-record-q4-refuse', 'exam-record-q5-office'])
    expect(body(fresh)).not.toContain('卷宗却没有记下')
    expect(body(fresh)).toMatch(/接受画像随任命公布/)
    const end = play(['exam-q1-outside', 'exam-outside-q2-name', 'exam-outside-q3-petition', 'exam-outside-q4-roster', 'exam-outside-q5-school'])
    expect(body(end)).not.toContain('核准四名')
    expect(body(end)).toMatch(/订成书院名册/)
  })
  it('carries recorded authorship versus sealed testimony into public action', () => {
    expect(body(play(['exam-q1-record', 'exam-record-q2-sign']))).toMatch(/供词.*作者|作者.*供词/)
    expect(body(play(['exam-q1-record', 'exam-record-q2-witness']))).toMatch(/证词.*留档.*未准许张贴/)
  })
  it('warns before reversing a refused portrait and remembers the earlier private name', () => {
    const final = play(['exam-q1-record', 'exam-record-q2-witness', 'exam-record-q3-seal', 'exam-record-q4-refuse'])
    expect(body(final)).toMatch(/拒绝.*画像/)
    expect(body(final)).toMatch(/任职.*(画像|改)/)
    const end = pick(final, 'exam-record-q5-office')
    expect(body(end)).toMatch(/(改变|改口|反悔)/)
    expect(body(end)).toMatch(/内档/)
  })
  it('never conjures a private contract on an actual clerk break, and recalls delivered copy', () => {
    const clerk = play(['exam-q1-patronage', 'exam-patronage-q2-accept', 'exam-patronage-q3-attend'])
    expect(body(result(clerk, 'exam-patronage-q4-break'))).not.toContain('私人契约')
    const copied = play(['exam-q1-patronage', 'exam-patronage-q2-copy', 'exam-patronage-q3-copy', 'exam-patronage-q4-break'])
    expect(body(copied)).toMatch(/衣内副本[\s\S]*抄件来路/)
    const sealed = pick(copied, 'exam-patronage-q5-seal')
    expect(body(sealed)).toMatch(/宫门外听见的作者身份.*传开/)
    expect(body(pick(pick(clerk, 'exam-patronage-q4-trust'), 'exam-patronage-q5-seal'))).toMatch(/推荐.*沈砚秋|沈砚秋.*推荐/)
  })
  it('distinguishes print risk, petitioners and reopening after amnesty', () => {
    expect(body(play(['exam-q1-outside', 'exam-outside-q2-name']))).toMatch(/刻板|追查/)
    expect(body(play(['exam-q1-outside', 'exam-outside-q2-anon']))).toMatch(/匿名/)
    const school = play(['exam-q1-outside', 'exam-outside-q2-anon', 'exam-outside-q3-school'])
    expect(body(result(school, 'exam-outside-q4-amnesty'))).not.toContain('四个')
    expect(body(result(school, 'exam-outside-q4-amnesty'))).not.toContain('四名')
    const end = pick(pick(school, 'exam-outside-q4-amnesty'), 'exam-outside-q5-school')
    expect(body(end)).toMatch(/重新开课|反悔/)
    expect(body(end)).toMatch(/自愿|同意/)
    const petition = play(['exam-q1-outside', 'exam-outside-q2-name', 'exam-outside-q3-petition'])
    expect(body(result(petition, 'exam-outside-q4-amnesty'))).toMatch(/四名/)
    expect(body(legacy('result-exam-patronage-q4-break', ['routePatronage', 'brokePatronage']))).not.toContain('私人契约')
  })
  it('keeps exactly five reachable choices', () => verifyPaths(episode, ''))
})
