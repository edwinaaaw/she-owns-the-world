import { describe, expect, it } from 'vitest'
import { paths, verifyPaths, verifyClone } from './helpers/storyPaths'
import { withWitchTrialConsequences } from '../src/story/episodes/witchTrialConsequences'
it('decorator does not mutate supplied chapter or nested memories', () => verifyClone(episode, withWitchTrialConsequences))
const { episode, play, pick, body, result, legacy } = paths('witch-trial')
describe('medical choices keep time, privacy and execution distinct', () => {
  it('reopens the original allegation for a protected mother who stayed in court, without inventing a box delivery', () => {
    const final = play(['witch-q1-patient', 'witch-patient-q2-blame', 'witch-patient-q3-boundary', 'witch-patient-q4-witness'])
    expect(body(final)).toMatch(/重新调查最初藏药/)
    expect(body(final)).not.toContain('仍协助本次处置')
    const box = play(['witch-q1-patient', 'witch-patient-q2-blame', 'witch-patient-q3-boundary', 'witch-patient-q4-box'])
    expect(body(box)).toMatch(/这次.*带走/)
    expect(body(box)).not.toContain('尚未取得新的知情证据')
  })
  it('uses the already delivered dose as follow-up, not another first delivery', () => {
    const sent = play(['witch-q1-teacher', 'witch-teacher-q2-dose', 'witch-teacher-q3-private'])
    expect(body(sent)).toMatch(/已.*送/)
    expect(body(sent)).not.toContain('需要完整剂量')
    expect(body(result(sent, 'witch-teacher-q4-copy'))).toMatch(/(补记|核对已|不再追加)/)
    const end = pick(pick(sent, 'witch-teacher-q4-copy'), 'witch-teacher-q5-share')
    expect(body(end)).toMatch(/第五声|先前送/)
    expect(body(end)).toMatch(/身份封存，只准按限制查阅/)
    expect(body(play(['witch-q1-teacher', 'witch-teacher-q2-testify']))).toMatch(/六年.*(证词|师承)/)
  })
  it('has no imaginary fresh copy after method explanation and retains left-hand delay in both endings', () => {
    const before = play(['witch-q1-research', 'witch-research-q2-method', 'witch-research-q3-license'])
    expect(body(before)).not.toContain('你的庭审副本')
    expect(body(before)).toMatch(/(没有|未).*重写/)
    const delayed = pick(before, 'witch-research-q4-license')
    const timely = pick(before, 'witch-research-q4-release')
    expect(body(delayed)).toMatch(/左手/)
    for (const id of ['witch-research-q5-credit', 'witch-research-q5-open']) {
      expect(body(pick(delayed, id))).toMatch(/莉维娅[\s\S]*左手/)
      expect(body(pick(timely, id))).not.toMatch(/左手|因延误/)
      expect(body(pick(delayed, id))).toMatch(/许可/)
    }
  })
  it('returns the mother’s earlier protection and the cost of asking her to testify again', () => {
    const protectedState = play(['witch-q1-patient', 'witch-patient-q2-blame'])
    expect(body(result(protectedState, 'witch-patient-q3-witness'))).toMatch(/移出.*被告|替.*担/)
    const fourth = pick(protectedState, 'witch-patient-q3-boundary')
    expect(body(result(fourth, 'witch-patient-q4-witness'))).not.toContain('留在被告栏')
    const fifth = pick(fourth, 'witch-patient-q4-witness')
    expect(body(fifth)).toMatch(/重新调查最初藏药/)
    const end = pick(fifth, 'witch-patient-q5-hearing')
    expect(body(end)).toMatch(/隐私|病史/)
    expect(body(end)).toMatch(/女药师.*(执行|送药)/)
    expect(body(end)).toMatch(/重新|新.*指控/)
  })
  it('legacy delivered-dose consequence also describes follow-up and no new consent', () => {
    for (const id of ['q4-teacher', 'result-witch-teacher-q4-copy']) {
      expect(body(legacy(id, ['routeTeacher', 'doseSent', 'scarPrivate']))).toMatch(/已.*(送|执行)|补记/)
    }
  })
  for (const relic of ['', 'named-roll', 'sealed-page', 'school-roster']) {
    it(`all routes with ${relic || 'no relic'} keep five decisions`, () => verifyPaths(episode, relic))
  }
  for (const route of ['teacher', 'research', 'patient']) it(`${route}: real trained pharmacist alternative does not invent ordinary decisions`, () => {
    let state = play([`witch-q1-${route}`])
    state = pick(state, `use-witch-trial-${route}-school-roster`, ['school-roster'])
    state = pick(state, `follow-witch-trial-${route}-school-roster`)
    state = pick(state, `execute-witch-trial-${route}-school-roster`)
    expect(state.tags).not.toContain('doseSent')
    expect(state.tags).not.toContain('scarPublic')
    expect(state.tags).not.toContain('doseRewritten')
    const end = pick(state, route === 'teacher' ? 'witch-teacher-q5-share' : route === 'research' ? 'witch-research-q5-credit' : 'witch-patient-q5-hearing')
    expect(body(end)).toMatch(/女药师.*(执行|配药)/)
    if (route !== 'teacher') expect(body(end)).not.toContain('玛塔当庭核对')
  })
})
