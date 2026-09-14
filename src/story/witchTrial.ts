import type { Choice, Effect, EpisodeDefinition, EpisodeNode } from './types'

type Route = 'teacher' | 'research' | 'deny'
type TerminalFamily = 'license' | 'hearing' | 'knowledge' | 'verdict'
type Q4Kind = 'bells-box' | 'bells-copy' | 'bells-oral' | 'marta' | 'bargain' | 'rewritten' | 'mother' | 'mother-free'

interface OptionSpec {
  id: string
  label: string
  hint: string
  result: string
  nextId: string
  effect?: string
}

interface DecisionSpec {
  id: string
  round: 1 | 2 | 3 | 4
  title: string
  body: string
  art: string
  options: OptionSpec[]
}

const nodes: Record<string, EpisodeNode> = {}

const effect = (label: string): Effect => ({ key: label, delta: 1, label })

function addDecision(spec: DecisionSpec) {
  const choices: Choice[] = spec.options.map((item) => {
    const resultId = `wt-result-${item.id}`
    nodes[resultId] = {
      id: resultId,
      stage: 'consequence',
      speaker: '伊莱亚斯',
      body: item.result,
      art: spec.art,
      nextId: item.nextId,
    }
    return {
      id: item.id,
      label: item.label,
      riskHint: item.hint,
      gain: item.hint,
      cost: '选择会改变后续场景',
      nextId: resultId,
      effects: [effect(item.effect ?? item.hint)],
    }
  })

  nodes[spec.id] = {
    id: spec.id,
    stage: 'choice',
    round: spec.round,
    speaker: '伊莱亚斯',
    title: spec.title,
    body: spec.body,
    art: spec.art,
    choices,
  }
}

function addTerminal(
  id: string,
  title: string,
  body: string,
  art: string,
  options: Array<Omit<OptionSpec, 'result'>>,
) {
  nodes[id] = {
    id,
    stage: 'choice',
    round: 5,
    speaker: '伊莱亚斯',
    title,
    body,
    art,
    choices: options.map((item) => ({
      id: item.id,
      label: item.label,
      riskHint: item.hint,
      gain: item.hint,
      cost: '这是本局最后一次选择',
      nextId: item.nextId,
      effects: [effect(item.effect ?? item.hint)],
    })),
  }
}

function addEnding(id: string, title: string, body: string, art: string) {
  nodes[id] = { id, stage: 'ending', speaker: '结局', title, body, art }
}

const endingIds: Record<Route, [string, string, string]> = {
  teacher: ['wt-ending-teacher-exception', 'wt-ending-teacher-rules', 'wt-ending-teacher-book'],
  research: ['wt-ending-research-exception', 'wt-ending-research-rules', 'wt-ending-research-book'],
  deny: ['wt-ending-deny-exception', 'wt-ending-deny-rules', 'wt-ending-deny-book'],
}

addEnding(
  endingIds.teacher[0],
  '获准存在的男巫',
  '三个月后，伊莱亚斯把个人许可证钉在诊室门上。玛塔已经获释，行医徽章却仍锁在教会的柜子里。她替下一名男学徒敲门时，门房只看了看伊莱亚斯那张独一份的许可，摇了摇头。',
  '/art/worlds/witch-trial/licensed-exception.jpg',
)
addEnding(
  endingIds.teacher[1],
  '两个人的药典',
  '公开听证撤销了对玛塔的指控，也把行医徽章还给她。入冬后的第一场考试，她在考卷上并排写下自己和伊莱亚斯的名字。门外等着的学徒里，第一次有了男人。',
  '/art/worlds/witch-trial/reveal-secret.jpg',
)
addEnding(
  endingIds.teacher[2],
  '没有作者的草药书',
  '玛塔获释后仍不能挂牌行医。那年冬天，两人把药方分成薄册，托病人的家属带出城。册子没有作者，第一页只画着两片并排的叶子。',
  '/art/worlds/witch-trial/hidden-herb-book.jpg',
)
addEnding(
  endingIds.research[0],
  '唯一被核准的研究者',
  '续审后的第三天，伊莱亚斯领到一张只写着自己姓名的研究许可。教会把他的原稿收入档案，却在申请簿上继续划掉其他男人的名字。',
  '/art/worlds/witch-trial/licensed-exception.jpg',
)
addEnding(
  endingIds.research[1],
  '可以复核的名字',
  '书记员重抄卷宗时，按伊莱亚斯的要求在每张处方旁写下日期、病例和修改人。后来再有人指控男研究者使用巫术，旁听席先问的已不是他的性别，而是记录能否对上。',
  '/art/worlds/witch-trial/reveal-secret.jpg',
)
addEnding(
  endingIds.research[2],
  '离开教会的剂量',
  '药方离开修院后被一页页传抄。伊莱亚斯要求改动剂量的人在页边留下病例和日期。他的姓名渐渐淹没在笔迹里，但一处错药很快被下一位抄写者圈了出来。',
  '/art/worlds/witch-trial/hidden-herb-book.jpg',
)
addEnding(
  endingIds.deny[0],
  '被默许的行医者',
  '审判庭把所有争议压成一张只写着伊莱亚斯姓名的许可证。它没有替其他男人打开医学院，也没有删去卷宗中那句“药箱不属于我”。他重新开门行医时，门外仍只有他一个例外。',
  '/art/worlds/witch-trial/licensed-exception.jpg',
)
addEnding(
  endingIds.deny[1],
  '卷宗里的矛盾',
  '正式判决没有删去第一轮的否认，也逐日写下此后药箱、病人与证人遭遇了什么。伊莱亚斯第一次以医生的身份在末页签名。那句最难回答的话也进了卷宗：审判庭为何只在需要他的药时，才肯相信一个男人懂得医术？',
  '/art/worlds/witch-trial/reveal-secret.jpg',
)
addEnding(
  endingIds.deny[2],
  '三片叶子的暗号',
  '几个月后，城里的人不再只靠审判庭的卷宗寻找医生。他们在可靠的药方角落画三片叶子，沿街传递。夜里有人循着这个记号敲门，门后不再只有伊莱亚斯。',
  '/art/worlds/witch-trial/hidden-herb-book.jpg',
)

const terminalTitles: Record<TerminalFamily, string> = {
  license: '墨迹未干的许可证',
  hearing: '旁听席的门开了',
  knowledge: '抄写页越过院墙',
  verdict: '封蜡正在变软',
}

for (const route of ['teacher', 'research', 'deny'] as Route[]) {
  const [exceptionEnding, rulesEnding, bookEnding] = endingIds[route]
  const routeLabel = route === 'teacher'
    ? '玛塔的名字也在卷宗首页。书记员把笔停在她的指控旁，等你说最后一句话。'
    : route === 'research'
      ? '原稿、副本和病例摊满长桌。书记员等你决定哪些姓名与日期写进定稿。'
      : '你开庭时留下的否认仍在卷宗第一页。书记员翻到那句供词，等你留下最后一句话。'
  const terminalLead: Record<TerminalFamily, string> = {
    license: '海伦娜把一张只写着“伊莱亚斯”的羊皮纸推过证物桌，墨迹还没有干。',
    hearing: '旁听席的门已经打开。海伦娜把现行行医考试卷放到你面前：你可以现在应试，也可以先质问这套规则。',
    knowledge: '第一张抄写页已经越过修院外墙，书记员手里还压着其余副本。',
    verdict: '书记员举着印章，封蜡正在烛火上变软。海伦娜说，只要你放弃追问，她可以把判决改成个人赦免。',
  }

  addTerminal(`wt-q5-${route}-license`, terminalTitles.license, `${terminalLead.license}${routeLabel}`, '/art/worlds/witch-trial/licensed-exception.jpg', [
    { id: `q5-${route}-license-keep`, label: '签下自己的名字，收起许可证', hint: '你能行医，其他男人仍被挡在门外', nextId: exceptionEnding },
    { id: `q5-${route}-license-challenge`, label: '划掉“仅限伊莱亚斯”', hint: '拒绝只救自己', nextId: rulesEnding },
    { id: `q5-${route}-license-open`, label: '不签字，把药方交给门外的人', hint: '放弃特许，让药方先流出去', nextId: bookEnding },
  ])
  addTerminal(`wt-q5-${route}-hearing`, terminalTitles.hearing, `${terminalLead.hearing}${routeLabel}`, '/art/worlds/witch-trial/reveal-secret.jpg', [
    { id: `q5-${route}-hearing-exam`, label: '坐到应试席，接受现有考试', hint: '先让自己取得资格', nextId: exceptionEnding },
    { id: `q5-${route}-hearing-rules`, label: '把考试条文逐条念给旁听者', hint: '要求同一套标准适用于所有人', nextId: rulesEnding },
    { id: `q5-${route}-hearing-publish`, label: '让书记员抄出全部病例', hint: '不独占证据与解释', nextId: bookEnding },
  ])
  addTerminal(`wt-q5-${route}-knowledge`, terminalTitles.knowledge, `${terminalLead.knowledge}${routeLabel}`, '/art/worlds/witch-trial/hidden-herb-book.jpg', [
    { id: `q5-${route}-knowledge-license`, label: '追回抄本，补上自己的署名', hint: '用作者身份申请个人许可', nextId: exceptionEnding },
    { id: `q5-${route}-knowledge-rules`, label: '在每页边角写明病例和日期', hint: '让后来的人能够查错', nextId: rulesEnding },
    { id: `q5-${route}-knowledge-open`, label: '擦掉姓名，继续分发', hint: '保住传播，放弃作者位置', nextId: bookEnding },
  ])
  addTerminal(`wt-q5-${route}-verdict`, terminalTitles.verdict, `${terminalLead.verdict}${routeLabel}`, '/art/worlds/witch-trial/confession.jpg', [
    { id: `q5-${route}-verdict-confess`, label: '接过赦免书，只为自己辩护', hint: '保住眼前的一条路', nextId: exceptionEnding },
    { id: `q5-${route}-verdict-record`, label: '按住印章，要求书记员读完证词', hint: '让矛盾留在正式判决里', nextId: rulesEnding },
    { id: `q5-${route}-verdict-share`, label: '趁落印前把剩余药方递向旁听席', hint: '让知识先离开审判庭', nextId: bookEnding },
  ])
}

function q5(route: Route, family: TerminalFamily) {
  return `wt-q5-${route}-${family}`
}

function addRoundFour(id: string, kind: Q4Kind, route: Route, primary: TerminalFamily) {
  const rescueTarget = primary === 'verdict' ? q5(route, 'knowledge') : q5(route, primary)
  const specs: Record<Q4Kind, Omit<DecisionSpec, 'id' | 'round'>> = {
    'bells-box': {
      title: '东翼传来第七声钟响',
      body: '教会药房每隔一刻钟敲钟催人。学徒跑回审判厅：孩子已经抽搐，第八声前若再没有医生过去，就来不及了。海伦娜不准其他人离席；药箱还在你手边，东翼药房离这里不过两道回廊。',
      art: '/art/worlds/witch-trial/prove-medicine.jpg',
      options: [
        { id: `${id}-treat`, label: '伊莱亚斯提起药箱，跑向东翼', hint: '救人，也当众承认自己行医', result: '你赶在第八声前把药喂下。孩子的抽搐停了，追来的守卫随即堵住药房门。', nextId: rescueTarget },
        { id: `${id}-record`, label: '带书记员去东翼，边治边记', hint: '耽误片刻，留下完整证据', result: '书记员在床边记下每一味药和孩子的反应。天亮前，体温终于降了。', nextId: q5(route, 'hearing') },
        { id: `${id}-stay`, label: '留在座位上，继续为自己辩护', hint: '不再增加非法行医证据', result: '第八声钟响后，药房学徒没有再回来。孩子没能活下来。', nextId: q5(route, 'verdict') },
      ],
    },
    'bells-copy': {
      title: '东翼传来第七声钟响',
      body: '教会药房每隔一刻钟敲钟催人。学徒跑回审判厅：孩子已经抽搐，第八声前必须用药。药箱被守卫扣住，但门口的药房女医师愿意执行一张写清剂量的处方。',
      art: '/art/worlds/witch-trial/prove-medicine.jpg',
      options: [
        { id: `${id}-copy`, label: '把剂量交给门口的药房女医师', hint: '她去救人，记录不会写你的名字', result: '她带着剂量跑向东翼。第八声没有响，回来时只说孩子退烧了。药房簿上写的是她的名字。', nextId: rescueTarget },
        { id: `${id}-publish`, label: '让书记员带副本随女医师去东翼', hint: '留下来源与执行过程', result: '副本和床边记录一起被封存。孩子活了下来，两份纸上的时间也对得上。', nextId: q5(route, 'hearing') },
        { id: `${id}-stay`, label: '把副本收回袖中', hint: '保住作者证据，不交出剂量', result: '第八声钟响过很久，东翼才有人回来报丧。副本仍在你手里。', nextId: q5(route, 'verdict') },
      ],
    },
    'bells-oral': {
      title: '东翼传来第七声钟响',
      body: '教会药房每隔一刻钟敲钟催人。学徒跑回审判厅：孩子开始抽搐，第八声前必须用药。药箱和原稿都被没收，门口的药房女医师只能凭你口述配药。',
      art: '/art/worlds/witch-trial/prove-medicine.jpg',
      options: [
        { id: `${id}-oral`, label: '对药房女医师口述完整剂量', hint: '先救人，处方来源难以证明', result: '她复述一遍，转身跑向东翼。孩子退烧了，药房簿上没有你的名字。', nextId: q5(route, 'knowledge') },
        { id: `${id}-witness`, label: '让家属跟着女医师记住每一步', hint: '留下能在庭外复述的证人', result: '家属边跑边背诵剂量。第八声没有响；天亮前，她把救治过程一字不差地写了下来。', nextId: rescueTarget },
        { id: `${id}-stay`, label: '拒绝开口，留在审判庭', hint: '不再留下行医证据', result: '第八声钟响后，药房学徒低着头回来。孩子没有活下来。', nextId: q5(route, 'verdict') },
      ],
    },
    marta: {
      title: '玛塔被带进地下牢房',
      body: '你们从东翼回来时，孩子已经退烧。海伦娜随即以“停医期间配药”和“继续指导男徒”两项罪名收监玛塔。隔着牢门，她只来得及问你：接下来，谁来讲完这段师承？',
      art: '/art/worlds/witch-trial/marta.jpg',
      options: [
        { id: `${id}-joint`, label: '要求与玛塔共同受审', hint: '共同承担，风险最高', result: '两个名字进入同一份起诉书，也留在同一份医术记录上。', nextId: q5(route, 'hearing') },
        { id: `${id}-save`, label: '设法保存她的证词', hint: '玛塔仍被关押，师承不会消失', result: '证词被送出牢房，教会无法再说她从未承认你。', nextId: rescueTarget },
        { id: `${id}-deny`, label: '劝她否认教过你', hint: '争取她获释，牺牲师承', result: '玛塔离开牢房，执照仍被冻结，你的师承从记录中消失。', nextId: q5(route, 'verdict') },
      ],
    },
    bargain: {
      title: '处方被收走以后',
      body: '入夜前，玛塔已经离开牢房，从侧门回了家，行医徽章却仍被海伦娜扣着。旧处方也已被收回，交换没有写进卷宗。现在公开追问，可能撕毁交易；沉默，玛塔以后就只能以普通人的身份生活。',
      art: '/art/worlds/witch-trial/marta.jpg',
      options: [
        { id: `${id}-honor`, label: '遵守交易，停止追问', hint: '保住玛塔，接受个人特许', result: '玛塔回到诊室门外，执照仍被冻结。你得到一张只保护自己的许可证。', nextId: q5(route, 'license') },
        { id: `${id}-copy`, label: '凭记忆重写那份剂量', hint: '保住知识，也撕开交易', result: '你在空白纸上重新写下剂量，托旁听者带走。海伦娜能收回旧处方，收不回你记住的方法。', nextId: q5(route, 'knowledge') },
        { id: `${id}-expose`, label: '当庭公开这笔交换', hint: '重新打开案件，风险最高', result: '交易内容被书记员写入卷宗。玛塔没有重新被关押，听证却再也无法私下结束。', nextId: q5(route, 'hearing') },
      ],
    },
    rewritten: {
      title: '三日后的续审',
      body: '续审开始前，书记员送来药典的新誊本。三天前救下孩子的剂量已经写在其中，署名却换成三位合法女医师；你的当庭治疗记录还封在证物袋里。',
      art: '/art/worlds/witch-trial/hidden-herb-book.jpg',
      options: [
        { id: `${id}-record`, label: '公开当庭治疗记录', hint: '证明时间顺序', result: '两份记录被贴在一起，教会无法解释谁先写下剂量。', nextId: q5(route, 'hearing') },
        { id: `${id}-correct`, label: '不争署名，只纠正错误', hint: '先保护病人', result: '下一版药典修正了剂量，没有写出是谁发现错误。', nextId: q5(route, 'knowledge') },
        { id: `${id}-deal`, label: '用沉默换回个人研究资格', hint: '成为唯一例外', result: '你的名字被允许进入附录，其他男人仍不能提交研究。', nextId: rescueTarget },
      ],
    },
    mother: {
      title: '莉娅的女儿站在门外',
      body: '高烧孩子已经得救，替你藏药的莉娅却仍在牢里。她成年的女儿安娜带着一张旧收据来到审判厅：去年冬天，是你救了她弟弟，莉娅才答应把药箱藏在家中。',
      art: '/art/worlds/witch-trial/confession.jpg',
      options: [
        { id: `${id}-child`, label: '让安娜进庭作证', hint: '公开旧病例，也暴露全家', result: '安娜说出弟弟生病的日期，也拿出藏药的收据。莉娅的案子第一次进入公开审查。', nextId: q5(route, 'hearing') },
        { id: `${id}-trade`, label: '接受私人交换救出莉娅', hint: '没有公开记录', result: '莉娅在夜里获释，交换条件没有进入卷宗。', nextId: q5(route, 'license') },
        { id: `${id}-protect`, label: '让安娜带着收据离开', hint: '保护家人，莉娅继续被关押', result: '安娜从侧门离开。旧病例没有公开，莉娅也失去了一次申辩机会。', nextId: rescueTarget },
      ],
    },
    'mother-free': {
      title: '没有进入卷宗的释放',
      body: '天亮前，莉娅已经从侧门回家。海伦娜履行了交换，卷宗却仍写着“藏药嫌疑人，待审”；只要没人留下另一份记录，她随时可能再次被传唤。',
      art: '/art/worlds/witch-trial/confession.jpg',
      options: [
        { id: `${id}-silence`, label: '遵守交易，保持沉默', hint: '保住眼前安全，没有公开记录', result: '莉娅回到家中，交换仍只存在于几个人的记忆里。', nextId: q5(route, 'license') },
        { id: `${id}-testimony`, label: '让莉娅记录交换经过', hint: '留下证词，重新承担风险', result: '她写下被捕、交换与获释的时间。卷宗第一次出现另一种说法。', nextId: q5(route, 'hearing') },
        { id: `${id}-network`, label: '凭记忆把剂量重写给病人', hint: '保住知识，放弃公开追责', result: '你在空白纸上重写剂量。纸页离开审判庭，在诊室和家庭之间继续被抄写。', nextId: q5(route, 'knowledge') },
      ],
    },
  }

  addDecision({ id, round: 4, ...specs[kind] })
}

interface ThirdOption {
  id: string
  label: string
  hint: string
  result: string
  terminal: TerminalFamily
  q4Kind?: Q4Kind
}

function addThird(
  id: string,
  title: string,
  body: string,
  route: Route,
  q4Kind: Q4Kind,
  options: ThirdOption[],
) {
  const decisionOptions = options.map((item) => {
    const q4Id = `wt-q4-${id.replace('wt-q3-', '')}-${item.id}`
    addRoundFour(q4Id, item.q4Kind ?? q4Kind, route, item.terminal)
    return { ...item, nextId: q4Id }
  })
  addDecision({ id, round: 3, title, body, art: '/art/worlds/witch-trial/helena.jpg', options: decisionOptions })
}

addThird(
  'wt-q3-teacher-testimony',
  '证人席上的旧伤',
  '守卫把玛塔从侧室带回证人席。海伦娜摘下左手手套，腕上露出十字形切口——去年冬天，正是玛塔亲手切开那处脓肿。伤疤能证明她见过这个病人；要证明你也参与治疗，还得说出当时的剂量。',
  'teacher',
  'bells-box',
  [
    { id: 'q3-teacher-testimony-public', label: '让玛塔作证，同时拿出旧处方', hint: '证据最完整，海伦娜的病史也会公开', result: '玛塔说出切口与日期，你从内衬取出处方，补上自己修改过的剂量。海伦娜无法否认。', terminal: 'hearing' },
    { id: 'q3-teacher-testimony-anonymous', label: '只证明切口出自她手', hint: '隐藏病人姓名', result: '玛塔证明病例真实，却没有说病人就是海伦娜。', terminal: 'hearing' },
    { id: 'q3-teacher-testimony-private', label: '拒绝谈论病人身份', hint: '保护医密，放弃证据', result: '玛塔把话停在诊断之前。你们保住了病人的秘密。', terminal: 'verdict' },
  ],
)
addThird(
  'wt-q3-teacher-fever',
  '外衣内衬里的处方',
  '共同救人回来后，玛塔已被押进地下牢房。海伦娜摘下左手手套，露出去年冬天的十字形切口。玛塔开庭前缝进你外衣内衬的旧处方还在；此刻只有你能拿出它。',
  'teacher',
  'marta',
  [
    { id: 'q3-teacher-fever-public', label: '拿出处方为玛塔辩护', hint: '公开海伦娜病史', result: '处方证明你与玛塔共同治疗过海伦娜，也把病人的秘密放上审判桌。', terminal: 'hearing' },
    { id: 'q3-teacher-fever-trade', label: '私下要求释放玛塔', hint: '用秘密换人', result: '海伦娜同意让玛塔离开牢房，但要求收回处方并终止公开追问。', terminal: 'license', q4Kind: 'bargain' },
    { id: 'q3-teacher-fever-private', label: '不使用这段病史', hint: '守住伦理', result: '你没有利用海伦娜的伤口。玛塔仍在牢里。', terminal: 'verdict' },
  ],
)
addThird(
  'wt-q3-teacher-signature',
  '被没收的病历',
  '玛塔在证物桌旁签完名字，就被守卫带回侧室。她的行医徽章和诊所病历全被扣下。海伦娜摘下左手手套时，书记员正好翻到一页无名病例：十字形切口、持续高烧，以及一行由你改过的剂量。',
  'teacher',
  'bells-box',
  [
    { id: 'q3-teacher-signature-open', label: '要求当庭打开完整病例', hint: '形成证据链', result: '病历、伤疤和共同署名互相印证，海伦娜的身份也被公开。', terminal: 'hearing' },
    { id: 'q3-teacher-signature-page', label: '只抢救共同署名页', hint: '保住作者身份', result: '你保住两个名字，却失去能证明病人身份的上下页。', terminal: 'knowledge' },
    { id: 'q3-teacher-signature-burn', label: '不阻止教会销毁病历', hint: '保护隐私，失去证据', result: '旧病历被投入火盆。玛塔的执照仍被吊销。', terminal: 'verdict' },
  ],
)
addThird(
  'wt-q3-research-records',
  '档案里的无名病人',
  '书记员核验原稿时留下了一份庭审副本。海伦娜摘下左手手套，腕上的十字形切口与副本中那名无名病人完全吻合；日期也正是去年冬天。缝在你外衣内衬的旧处方仍未被发现。',
  'research',
  'bells-copy',
  [
    { id: 'q3-research-records-chain', label: '把庭审副本与伤疤并列', hint: '形成完整证据链', result: '副本证明你的剂量早于教会药典，也公开了海伦娜的病史。', terminal: 'hearing' },
    { id: 'q3-research-records-anonymous', label: '只公开匿名剂量', hint: '证明方法，隐藏病人', result: '记录可以复核，却没有人能确认无名病人就是海伦娜。', terminal: 'hearing' },
    { id: 'q3-research-records-license', label: '用处方换个人许可证', hint: '成为制度例外', result: '海伦娜收回处方，承诺只认可你一个男人的研究资格。', terminal: 'license' },
  ],
)
addThird(
  'wt-q3-research-fever',
  '两份相同的剂量',
  '孩子退烧后，书记员把当庭治疗记录摊在桌上。海伦娜摘下左手手套；你从外衣内衬取出她去年冬天的旧处方。两张纸上的剂量完全相同，一次秘密救治和一次公开救治终于能互相印证。',
  'research',
  'rewritten',
  [
    { id: 'q3-research-fever-both', label: '公开两份记录', hint: '证明方法可重复', result: '两名病人的反应和剂量并排出现，教会很难再称之为偶然。', terminal: 'hearing' },
    { id: 'q3-research-fever-new', label: '只使用当庭治疗记录', hint: '保护海伦娜隐私', result: '新病例证明疗效，却无法证明这套方法来自长期研究。', terminal: 'knowledge' },
    { id: 'q3-research-fever-trade', label: '用旧处方换回研究资格', hint: '接受私人交易', result: '海伦娜保住秘密，你获得一张只属于自己的研究许可。', terminal: 'license' },
  ],
)
addThird(
  'wt-q3-research-people',
  '没有物证的病史',
  '地窖里的人已经从后巷撤走，药箱和原稿却落进教会手里。海伦娜摘下左手手套时，你摸到外衣内衬里的旧处方。它能证明你治过她，却证明不了那两年的研究。',
  'research',
  'bells-oral',
  [
    { id: 'q3-research-people-public', label: '公开仅存的处方', hint: '证明一次治疗', result: '海伦娜无法否认求医，却可以说那只是一次偶然。', terminal: 'hearing', q4Kind: 'bells-copy' },
    { id: 'q3-research-people-trade', label: '用处方换病人网络安全', hint: '保护病人，接受交易', result: '海伦娜承诺停止搜查地窖，处方从此不再公开。', terminal: 'license' },
    { id: 'q3-research-people-private', label: '不公开处方，只抄出退烧剂量', hint: '隐藏病人身份，留下可执行的副本', result: '海伦娜的名字仍是秘密。你把退烧剂量抄在另一张纸上，交给书记员保管。', terminal: 'knowledge', q4Kind: 'bells-copy' },
  ],
)
addThird(
  'wt-q3-deny-confess',
  '她也曾来过你的诊室',
  '你已经承认药箱，莉娅也被放出审判厅。海伦娜摘下左手手套时，你摸到外衣内衬里的旧处方。现在拿出来，不会再推翻一句新的否认，却会公开她曾向男医生求救。',
  'deny',
  'bells-box',
  [
    { id: 'q3-deny-confess-public', label: '公开海伦娜处方', hint: '补强行医证据', result: '处方证明连审判官也曾信任你的剂量。', terminal: 'hearing' },
    { id: 'q3-deny-confess-anonymous', label: '只让书记员匿名核验', hint: '留下弱证据', result: '书记员确认处方真实，但卷宗没有写出病人身份。', terminal: 'hearing' },
    { id: 'q3-deny-confess-private', label: '守住病史', hint: '争取病人信任', result: '你没有利用海伦娜。庭外病人开始相信你也会保护她们。', terminal: 'knowledge' },
  ],
)
addThird(
  'wt-q3-deny-fever',
  '一个秘密换另一个人',
  '高烧孩子已经退烧，你也当众暴露了医术；替你藏药的莉娅仍在牢里。海伦娜摘下左手手套时，你摸到外衣内衬里的旧处方。那张纸也许能换莉娅出来。',
  'deny',
  'mother',
  [
    { id: 'q3-deny-fever-public', label: '公开处方，要求正式释放莉娅', hint: '证据公开，风险最高', result: '海伦娜的病史和莉娅的案件同时进入卷宗。', terminal: 'hearing' },
    { id: 'q3-deny-fever-trade', label: '私下用处方换回莉娅', hint: '莉娅获释，没有记录', result: '莉娅在夜里获释，教会不承认交换发生过。', terminal: 'license', q4Kind: 'mother-free' },
    { id: 'q3-deny-fever-child', label: '不用病史，让莉娅的家人决定是否作证', hint: '保护海伦娜的秘密', result: '你把决定留给莉娅的女儿安娜；莉娅仍在牢里，安娜会在下一次开庭前答复。', terminal: 'knowledge' },
  ],
)
addThird(
  'wt-q3-deny-erase',
  '最后一张会暴露你的处方',
  '药箱上的三片叶子已经被刮掉，你也连续两次否认行医。海伦娜摘下左手手套时，你摸到外衣内衬里的旧处方——仅存的物证。只要拿出来，前两次供词就会当场崩塌。',
  'deny',
  'bells-oral',
  [
    { id: 'q3-deny-erase-public', label: '公开处方并承认撒谎', hint: '获得证据，彻底暴露', result: '你承认药箱与处方都属于自己，教会也必须解释海伦娜为何求医。', terminal: 'hearing', q4Kind: 'bells-copy' },
    { id: 'q3-deny-erase-anonymous', label: '匿名交给书记员', hint: '留下弱证据', result: '处方进入档案，没有署名；书记员仍可能从笔迹查到你。', terminal: 'knowledge', q4Kind: 'bells-copy' },
    { id: 'q3-deny-erase-burn', label: '销毁处方', hint: '继续否认', result: '最后一张物证化成灰。母亲和你的医术都失去证明。', terminal: 'verdict' },
  ],
)

addDecision({
  id: 'wt-q2-teacher', round: 2, title: '侧室里的人，还不是囚犯',
  body: '玛塔戴着腕铐，被两名守卫看在审判厅侧室；她尚未入狱。此时一名药房学徒闯进来：东翼有个陌生孩子高烧抽搐，值守女医师已经束手无策。海伦娜只准你在宣读下一项指控前，做一次公开行动。',
  art: '/art/worlds/witch-trial/marta.jpg',
  options: [
    { id: 'q2-teacher-testimony', label: '请守卫把玛塔带回证人席', hint: '共同陈述师承；东翼病人继续等待', result: '玛塔在证人席上说：“是我教的。”书记员把两个名字写进同一页证词，东翼药房开始敲钟催人。', nextId: 'wt-q3-teacher-testimony' },
    { id: 'q2-teacher-fever', label: '请求守卫押送你们去东翼救人', hint: '病人获救；玛塔将因违令受审', result: '两名守卫押着你们穿过回廊。孩子退烧后，海伦娜以停医期间配药、继续指导男徒为由，把玛塔正式押进牢房。', nextId: 'wt-q3-teacher-fever' },
    { id: 'q2-teacher-signature', label: '请玛塔到证物桌共同署名', hint: '留下两个人的名字；东翼病人继续等待', result: '书记员从药箱里取出一张未署名的退烧方。你先落笔，玛塔随后签在旁边。海伦娜随即扣下她的行医徽章，并命人封存她诊所里的全部病历。', nextId: 'wt-q3-teacher-signature' },
  ],
})
addDecision({
  id: 'wt-q2-research', round: 2, title: '三处门同时被推开',
  body: '你的两年原稿摊在证物桌上；药房学徒报告东翼有个孩子高烧抽搐，值守女医师已经束手无策；另一名守卫则说，她们找到地窖诊所的入口。海伦娜只给你一次行动。',
  art: '/art/worlds/witch-trial/evidence.jpg',
  options: [
    { id: 'q2-research-records', label: '把原稿逐页交给书记员核验', hint: '留下庭审副本；东翼病人继续等待', result: '书记员当庭编号、抄录，再把原稿封进证物袋。你留下一份庭审副本，东翼的钟声却已经响起。', nextId: 'wt-q3-research-records' },
    { id: 'q2-research-fever', label: '带着原稿去东翼照方救人', hint: '留下治疗记录；原稿随后被扣押', result: '你在守卫注视下配药，书记员记下剂量和反应。孩子退烧后，原稿与当庭治疗记录一起被带回审判厅。', nextId: 'wt-q3-research-fever' },
    { id: 'q2-research-people', label: '让地窖病人从后巷撤走', hint: '保住病人；失去药箱和原稿', result: '你对等在窗下的人打出暗号。地窖病人从后巷散去，守卫则把药箱和原稿全部没收；东翼仍在敲钟。', nextId: 'wt-q3-research-people' },
  ],
})
addDecision({
  id: 'wt-q2-deny', round: 2, title: '三个人都看着证物桌',
  body: '替你藏药的莉娅被守卫押在厅门旁；东翼药房学徒来报，一个陌生孩子高烧抽搐，值守女医师已经束手无策；刻着三片叶子的药箱就在海伦娜手边。你若继续否认，总要有人替你承担后果。',
  art: '/art/worlds/witch-trial/confession.jpg',
  options: [
    { id: 'q2-deny-confess', label: '承认药箱，让守卫放开莉娅', hint: '身份公开；东翼病人继续等待', result: '海伦娜示意守卫解开莉娅的绳索，又让另一名守卫站到你身后。东翼的第一声钟响了。', nextId: 'wt-q3-deny-confess' },
    { id: 'q2-deny-fever', label: '夺回药箱，跑去东翼救人', hint: '身份暴露；莉娅仍被关押', result: '你当着所有人的面配药，孩子的高烧退了。回到审判厅时，莉娅已被押进牢房。', nextId: 'wt-q3-deny-fever' },
    { id: 'q2-deny-erase', label: '刮掉三片叶子，继续否认', hint: '药箱被没收；莉娅和病人都无人相救', result: '叶形刻痕被刀尖刮成一片毛边。海伦娜收走药箱，莉娅被押去牢房，东翼的钟声一声接一声。', nextId: 'wt-q3-deny-erase' },
  ],
})

addDecision({
  id: 'wt-q1', round: 1, title: '海伦娜问：这些草药是谁教你的？',
  body: '药箱摆在证物桌中央，玛塔坐在旁听席。厅门外，守卫扣着莉娅——去年你救过她的儿子，她便替你藏起药箱。海伦娜要你先解释：一个不能进医学院的男人，怎么会知道这些剂量？',
  art: '/art/worlds/witch-trial/evidence.jpg',
  options: [
    { id: 'q1-teacher', label: '转向玛塔，承认她教过你', hint: '师承有了证人，玛塔会被牵连', result: '玛塔起身承认。海伦娜摘下她的行医徽章，让两名守卫把她带到审判厅侧室看管；她尚未入狱，只是不能离开。', nextId: 'wt-q2-teacher' },
    { id: 'q1-research', label: '说出药箱夹层里的两年原稿', hint: '独自担责，地下研究将暴露', result: '书记员撬开夹层，把一摞写满日期和剂量的纸铺上证物桌。守卫立刻去查原稿里提到的地窖。', nextId: 'wt-q2-research' },
    { id: 'q1-deny', label: '否认药箱属于你', hint: '暂时藏住身份，莉娅会被追责', result: '守卫把莉娅押进厅内。药箱是在她家搜到的；只要你不认，她就是唯一能被指控的人。', nextId: 'wt-q2-deny' },
  ],
})

nodes['feed-hook'] = {
  id: 'feed-hook', stage: 'feed', body: '她们认定，男人懂得正确剂量，只可能因为巫术。',
  art: '/art/worlds/witch-trial.jpg', nextId: 'intro',
}
nodes.intro = {
  id: 'intro', stage: 'scene', speaker: '伊莱亚斯 · 架空世界',
  body: '你叫伊莱亚斯。这里的男人不能进医学院，也拿不到行医执照，所以你只在夜里替穷人看病。这个月，三个孩子用了你的药后退烧；教会顺着药包，在莉娅家搜出药箱。今天，审判官海伦娜把它放上证物桌。去年冬天，她的左腕感染，是玛塔切开脓肿、你改了药量，才保住那只手。开庭前，玛塔把那张旧处方的副本缝进你外衣内衬；海伦娜还不知道它在你身上。',
  art: '/art/worlds/witch-trial/elias.jpg', nextId: 'wt-q1',
}

export const witchTrial: EpisodeDefinition = {
  id: 'witch-trial', number: 2, title: '男人不能行医', protagonist: '伊莱亚斯', rule: '男人不能取得行医执照',
  headline: ['三个孩子退了烧，', '你却成了男巫。'], hook: '她们认定，男人懂得正确剂量，只可能因为巫术。',
  feedArt: '/art/worlds/witch-trial.jpg', feedAlt: '草药与药箱被放上审判庭的证物桌', nodes,
}
