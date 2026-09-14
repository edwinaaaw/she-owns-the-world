import type { Choice, EpisodeNode } from './types'

const choice = (
  id: string,
  label: string,
  riskHint: string,
  gain: string,
  cost: string,
  nextId: string,
  effects: Choice['effects'],
): Choice => ({ id, label, riskHint, gain, cost, nextId, effects })

export const FIRST_EPISODE_NODES: Record<string, EpisodeNode> = {
  'feed-hook': {
    id: 'feed-hook', stage: 'feed',
    body: '大雍律：男子不得入贡院。\n今日的第一名，偏偏是个男人。',
    art: '/art/feed-exam.webp', nextId: 'exam-intro',
  },
  'exam-intro': {
    id: 'exam-intro', stage: 'scene', speaker: '林昭 · 心声',
    body: '你叫林昭。为了坐进贡院，你藏起长发，借用了亡姐的籍贯和名字。现在，你的文章被判为头名。',
    art: '/art/lin-anxious.webp', nextId: 'pin-falls',
  },
  'pin-falls': {
    id: 'pin-falls', stage: 'scene', speaker: '林昭 · 心声',
    body: '俯身拾卷时，木簪落在试卷上。长发从帽中散下。主考官沈砚秋看见了你，监察官魏瑾的脚步正在逼近。',
    art: '/art/feed-exam.webp', nextId: 'identity-choice',
  },
  'identity-choice': {
    id: 'identity-choice', stage: 'choice', round: 1, speaker: '林昭',
    title: '身份已经暴露，你怎么做？',
    body: '门在魏瑾身后。沈砚秋没有喊人，只用手压住了你的卷子。',
    art: '/art/lin-anxious.webp',
    choices: [
      choice('run', '立刻逃出贡院', '保住自由 · 永失头名', '暂时不被关押', '文章与考试资格全部失去', 'run-result', [
        { key: 'identityRisk', delta: -1, label: '身份风险 -1' },
        { key: 'authorship', delta: -2, label: '文章归属 -2' },
      ]),
      choice('ask-concealment', '请求沈砚秋隐瞒', '保留机会 · 命运交给她', '获得继续证明自己的机会', '沈砚秋从此握有你的秘密', 'concealment-result', [
        { key: 'examinerTrust', delta: 1, label: '沈砚秋信任 +1' },
        { key: 'identityRisk', delta: 1, label: '身份风险 +1' },
      ]),
      choice('confess', '主动向魏瑾承认', '夺回叙事 · 可能被捕', '承认文章和身份都属于你', '监察系统正式记录你的罪名', 'confession-result', [
        { key: 'authorship', delta: 1, label: '文章归属 +1' },
        { key: 'identityRisk', delta: 2, label: '身份风险 +2' },
      ]),
    ],
  },
  'run-result': {
    id: 'run-result', stage: 'consequence', speaker: '沈砚秋',
    body: '你冲到门前，卫士却已落下门闩。沈砚秋低声说：“现在逃，你的文章就会变成别人的。”',
    art: '/art/shen-neutral.webp', nextId: 'authorship-choice',
  },
  'concealment-result': {
    id: 'concealment-result', stage: 'consequence', speaker: '沈砚秋',
    body: '她拾起木簪，压在卷宗下面：“我可以让你留下，但从现在起，每一页纸都要先经过我。”',
    art: '/art/shen-neutral.webp', nextId: 'authorship-choice',
  },
  'confession-result': {
    id: 'confession-result', stage: 'consequence', speaker: '魏瑾',
    body: '“文章是你的，罪名也是。”魏瑾翻开名册。沈砚秋却在她落笔前抽走了那份头名卷。',
    art: '/art/wei-watchful.webp', nextId: 'authorship-choice',
  },
  'authorship-choice': {
    id: 'authorship-choice', stage: 'choice', round: 2, speaker: '林昭',
    title: '她愿意保住文章，但不能保住你的名字。',
    body: '沈砚秋提出：把头名记在一名女考生名下，你可以秘密进入她的幕府继续写作。',
    art: '/art/name-erased.jpg',
    choices: [
      choice('erase-name', '接受隐名代笔', '进入幕府 · 失去署名', '获得接近政务的机会', '你的文字将成为她人的功绩', 'name-erased-result', [
        { key: 'courtAccess', delta: 1, label: '权力入口 +1' },
        { key: 'authorship', delta: -2, label: '文章归属 -2' },
      ]),
      choice('keep-name', '坚持留下真名', '保住作品 · 再次暴露', '历史会知道文章出自林昭', '魏瑾可以据此追查你的身份', 'name-kept-result', [
        { key: 'authorship', delta: 1, label: '文章归属 +1' },
        { key: 'identityRisk', delta: 1, label: '身份风险 +1' },
      ]),
      choice('sealed-archive', '把真名封入内档', '暂不公开 · 留下证据', '未来仍有机会证明作者身份', '当下无人会承认你的才华', 'archive-result', [
        { key: 'authorship', delta: 1, label: '历史证据 +1' },
        { key: 'examinerTrust', delta: 1, label: '沈砚秋信任 +1' },
      ]),
    ],
  },
  'name-erased-result': {
    id: 'name-erased-result', stage: 'consequence', speaker: '林昭 · 心声',
    body: '你的文章进入朝堂，署名处却换成了一个从未见过的女人。三个月后，女帝召见了“真正的作者”。',
    art: '/art/name-erased.jpg', nextId: 'palace-choice',
  },
  'name-kept-result': {
    id: 'name-kept-result', stage: 'consequence', speaker: '沈砚秋',
    body: '“那就让她们看见这个名字。”她没有抹去林昭二字。三个月后，女帝点名要见你。',
    art: '/art/name-erased.jpg', nextId: 'palace-choice',
  },
  'archive-result': {
    id: 'archive-result', stage: 'consequence', speaker: '沈砚秋',
    body: '她把写有真名的一页封进内档：“今天救不了你，至少别让后世说你不存在。”女帝随后召你入宫。',
    art: '/art/name-erased.jpg', nextId: 'palace-choice',
  },
  'palace-choice': {
    id: 'palace-choice', stage: 'choice', round: 3, speaker: '林昭',
    title: '女帝欣赏你的文章，也要亲自挑选你的衣裳。',
    body: '宫人说，陛下喜欢温顺、漂亮、懂得感恩的男人。她可以给你官位，也可以让你只剩一张脸。',
    art: '/art/palace-mirror.jpg',
    choices: [
      choice('obey-gaze', '按她喜欢的样子赴宴', '获得亲近 · 接受规训', '更容易进入女帝的权力圈', '朝堂把你的能力归因于宠爱', 'obeyed-result', [
        { key: 'courtAccess', delta: 1, label: '权力入口 +1' },
        { key: 'objectification', delta: 1, label: '被性化 +1' },
      ]),
      choice('refuse-gaze', '穿考生旧袍面圣', '守住自我 · 冒犯女帝', '迫使她面对你的文章而非外貌', '你可能失去唯一一次召见', 'refused-result', [
        { key: 'objectification', delta: -1, label: '主体性 +1' },
        { key: 'identityRisk', delta: 1, label: '身份风险 +1' },
      ]),
      choice('use-gaze', '借她的目光上位', '接近权力 · 成为谈资', '更快获得实际影响力', '你主动强化了性化你的规则', 'used-gaze-result', [
        { key: 'courtAccess', delta: 2, label: '权力入口 +2' },
        { key: 'objectification', delta: 2, label: '被性化 +2' },
      ]),
    ],
  },
  'obeyed-result': {
    id: 'obeyed-result', stage: 'consequence', speaker: '女帝',
    body: '“文章好，人也清秀。”她让你坐在帘后参与政务。第二天，朝中只在议论你穿的颜色。',
    art: '/art/palace-mirror.jpg', nextId: 'reform-choice',
  },
  'refused-result': {
    id: 'refused-result', stage: 'consequence', speaker: '女帝',
    body: '“有脾气。”她笑着留下了你，却命宫人换掉旧袍。你的拒绝，也被解释成一种取悦。',
    art: '/art/palace-mirror.jpg', nextId: 'reform-choice',
  },
  'used-gaze-result': {
    id: 'used-gaze-result', stage: 'consequence', speaker: '林昭 · 心声',
    body: '你得到比预想更近的位置。你的奏议开始影响政令，画像也开始出现在民间艳本里。',
    art: '/art/palace-mirror.jpg', nextId: 'reform-choice',
  },
  'reform-choice': {
    id: 'reform-choice', stage: 'choice', round: 4, speaker: '林昭',
    title: '女帝准许男子参加恩科——每三年，只取三人。',
    body: '宫廷要把你的画像印在诏书上，证明大雍从未亏待男子。你终于得到改革，也成了制度最需要的例外。',
    art: '/art/three-seats.jpg',
    choices: [
      choice('accept-reform', '接受三名恩科名额', '留在朝中 · 成为样板', '获得继续推动改革的位置', '朝廷用你证明制度已经平等', 'inside-ending', [
        { key: 'courtAccess', delta: 1, label: '制度影响 +1' },
        { key: 'objectification', delta: 2, label: '样板化 +2' },
      ]),
      choice('reject-symbol', '拒绝登上平等诏书', '失去官位 · 留下记录', '拒绝为有限改革背书', '恩科名额可能随你一起被收回', 'legacy-ending', [
        { key: 'courtAccess', delta: -2, label: '权力入口 -2' },
        { key: 'legacy', delta: 2, label: '政治遗产 +2' },
      ]),
    ],
  },
  'inside-ending': {
    id: 'inside-ending', stage: 'ending', title: '最成功的例外', speaker: '结局一',
    body: '你留在女帝身边，成为大雍第一位公开任职的男官，也成为朝廷反复展示的平等样板。你可以递上更多奏议，却再也无法控制别人如何讲述你的成功。',
    art: '/art/exception-ending.jpg',
  },
  'legacy-ending': {
    id: 'legacy-ending', stage: 'ending', title: '没有署名的先声', speaker: '结局二',
    body: '你拒绝出现在诏书上，官位和恩科名额一同被收回。沈砚秋把你的奏议封进内档；你没能改变这一朝，却留下记录，让后来的人知道曾有人拒绝成为例外。',
    art: '/art/archive-ending.jpg',
  },
}
