import type { EpisodeDefinition, EpisodeNode } from '../types'

// These are memories of this chapter's choices, not a new scoring system.
export function withReturnHomeConsequences(episode: EpisodeDefinition): EpisodeDefinition {
  const nodes: Record<string, EpisodeNode> = Object.fromEntries(Object.entries(episode.nodes).map(([id, node]) => [id, {
    ...node,
    choices: node.choices?.map((choice) => ({
      ...choice,
      effects: choice.effects.map((effect) => ({ ...effect })),
      requiresTags: choice.requiresTags ? [...choice.requiresTags] : undefined,
      requiresRelics: choice.requiresRelics ? [...choice.requiresRelics] : undefined,
      requiresAnyRelics: choice.requiresAnyRelics ? [...choice.requiresAnyRelics] : undefined,
      grantsTags: choice.grantsTags ? [...choice.grantsTags] : undefined,
    })),
    bodyByTag: node.bodyByTag?.map((entry) => ({ ...entry })),
    endingFeedbackByTag: node.endingFeedbackByTag?.map((entry) => ({ ...entry })),
    replaceBodyByTag: node.replaceBodyByTag?.map((entry) => ({ ...entry })),
  }]))
  const remember = (ids: string[], tag: string, body: string, unlessTag?: string) => {
    for (const id of ids) {
      const key = nodes[id].stage === 'ending' ? 'endingFeedbackByTag' : 'bodyByTag'
      nodes[id][key] = [...(nodes[id][key] ?? []), { tag, body, ...(unlessTag ? { unlessTag } : {}) }]
    }
  }

  remember(['q3-compete'], 'balancedTest', '克拉拉翻着你们各出一半的题纸：“题目分好了。我的邮局工作，谁出的题能保住？”')
  remember(['q3-compete'], 'warRecordTest', '前线临修那道题没有入选，比阿特丽斯把它留给你。晚饭时，克拉拉将审查信放到考核表旁，碗只好往边上挪。')
  remember(['q4-compete'], 'balancedTest', '比阿特丽斯指向共同出题时查过的传动轴：“这段我拆检，你确认夜班停机顺序。成绩上，两人的活分开写。”')
  nodes['q4-compete'].choices!.push({
    id: 'home-compete-q4-joint', label: '按共同出题时核对的分工合修',
    riskHint: '两名熟练维修者分头处理，贡献共同记名；不能再以独修速度争功。',
    gain: '', cost: '', effects: [], requiresTags: ['balancedTest'], grantsTags: ['jointRepair'],
    nextId: 'result-home-compete-q4-joint',
  })
  nodes['result-home-compete-q4-joint'] = {
    id: 'result-home-compete-q4-joint', stage: 'consequence', speaker: episode.protagonist,
    art: nodes['q4-compete'].art, nextId: 'q5-compete',
    body: '你切断总闸，确认断电、设备停稳后守住开关；比阿特丽斯按核对过的设备结构拆检。她退开后，你们复核并试车。厂长想把成绩填进一人的栏里，她按住笔：“两人共同记名。谁做了哪一步，都写上。”',
  }
  remember(['q5-compete'], 'soloRepair', '厂长圈出你的恢复生产用时，准备把速度算作录用依据。比阿特丽斯核对自己的考核页，没有在你的成绩下签名。')
  remember(['q5-compete'], 'workersFirst', '疏散扣掉的速度分还在。工人递来无人受伤的记录，厂长翻完你的四年夜班履历，仍肯谈录用，却又拿出了原来的声明。')
  remember(['q5-compete'], 'jointRepair', '考核表上并排写着两人的处置。厂长肯算你的流程与停机工作，却划掉“独自抢修”的加分。比阿特丽斯拿回自己的那份记录：“合作这一次，不等于我退出。”')
  remember(['q5-compete'], 'claraKeepsJob', '克拉拉把餐桌上的信转正：“你答应不拿我的辞职换岗位。签字在这里，你看清楚。”她没替你拿笔。')
  remember(['q5-compete'], 'exceptionPlanned', '克拉拉问起你说过的例外申请。厂长翻到最后一页，那里仍只有家属岗位复核栏。她把房贷账单收回包里，等你决定。')
  remember(['q5-compete'], 'letterPublic', '比阿特丽斯把你公开的审查信放回成绩表旁：“这条规定我反对。考核里属于我的成绩，也请保留。”')
  remember(['home-end-one'], 'claraKeepsJob', '克拉拉看完声明，把邮局钥匙放进自己的包：“你答应过不让我辞职，还是签了。”她独自去交复核申诉，没有接你递来的新工牌。')
  remember(['home-end-film'], 'claraKeepsJob', '克拉拉从信封里抽出复印纸，替自己留下一份：“这次你守住了答应我的事。房贷还得一起想办法。”她明早仍去邮局，你的任命没有恢复。')
  remember(['home-end-one'], 'exceptionPlanned', '克拉拉把没有例外栏的表推回来：“你说赢了再申请。现在写给谁？”新职位已经是你的，她的复核仍需单独申诉。')
  remember(['home-end-film'], 'exceptionPlanned', '克拉拉把准考证背面的房贷数目抄进账本。你们没等到例外，今晚先商量下一期怎么还。')
  remember(['home-end-one', 'home-end-film'], 'soloRepair', '独修的用时留在成绩单上。比阿特丽斯另留自己的考核页，关于哪套经验该被算进去，你们还没有谈完。')
  remember(['home-end-one', 'home-end-film'], 'workersFirst', '被疏散的夜班工人把停机时刻写进值班簿。她们记得你先让人退开，计时表上的扣分也没有被擦掉。')
  remember(['home-end-one', 'home-end-film'], 'jointRepair', '比阿特丽斯取走共同检修页的副本。两人的签名还在，任命的取舍没有把那次合修变成谁一个人的功劳。')

  remember(['q3-share'], 'sharedHandoff', '克拉拉指着重叠的一小时：“这段谁去接人？”比阿特丽斯取出妹妹的复健便笺，交接表往餐桌中间又挪了一点。')
  remember(['q3-share'], 'splitAreas', '跨区停机让两人都晚回家。比阿特丽斯折起分区图：“下次同时叫到场，得先告诉家里几点能回。”')
  remember(['q3-share'], 'rotatingLead', '比阿特丽斯看着下周轮到自己的那格：“这周我接。妹妹的复健不能跟着每周重约，下周得定早些。”')
  remember(['q4-share'], 'fixedRoster', '比阿特丽斯带来固定三天的表，问导演能不能拍到周日那格。导演只把工牌挪到灯下，没有回答谁来付那一小时。')
  // Old careVisible saves predate the explicit consent conversation.
  nodes['q3-share'].choices!.find((choice) => choice.id === 'home-share-q3-care')!.grantsTags!.push('careConsentConfirmed')
  nodes['result-home-share-q3-care'].replaceBodyByTag = [...(nodes['result-home-share-q3-care'].replaceBodyByTag ?? []), {
    tag: 'careConsentConfirmed',
    body: '你询问克拉拉，比阿特丽斯回家询问妹妹。两人都只同意登记不能临时调班的时段，不公开姓名和病情。次日，你们把这些时段另附一页，请排班员照此安排。',
  }]
  remember(['q4-share'], 'careConsentConfirmed', '比阿特丽斯把获准登记的照护时段收进内部附页，姓名、病情都空着：“排班员可以看，镜头不行。”')
  remember(['q4-share'], 'careVisible', '比阿特丽斯收起照护备注：“先问她们愿意让谁看。现在别把这一页举到镜头前。”', 'careConsentConfirmed')
  remember(['q5-share'], 'fixedRoster', '比阿特丽斯在固定的三天旁签名，笔尖到了周日便停住：“这些班我来。空着的一格，还没谈工钱。”')
  remember(['q5-share'], 'careConsentConfirmed', '排班员要抄照护备注，你递去只有班次的表。获准登记的照护时段，仍由排班员留在内部附页。')
  remember(['q5-share'], 'careVisible', '排班员伸手要照护备注，你把它留在桌边。能交给谁看的答复尚未确认，待签的公开表先只列工作班次。', 'careConsentConfirmed')
  remember(['home-end-shared', 'home-end-roster'], 'fixedRoster', '固定的三天让两家能提前约好接送。周日那格仍画着圈，比阿特丽斯没有让签名替代那段未付的工时。')
  remember(['home-end-shared', 'home-end-roster'], 'careConsentConfirmed', '流转的表只写工作班次；当事人允许登记的照护时段由排班员另存。有人追问妹妹的病情，比阿特丽斯把附页合上：“她没同意公开。”')
  remember(['home-end-shared', 'home-end-roster'], 'careVisible', '有人来抄照护备注，比阿特丽斯先把那页盖住：“这部分还要问她们。”公开流转的表只留下工作班次。', 'careConsentConfirmed')
  remember(['home-end-shared', 'home-end-roster'], 'hiddenCare', '厂长拿不到你们的家庭说明，克拉拉却仍须在每天晚饭前确认谁能回家。那份整洁的表没有替你们安排好这些时间。')

  remember(['q3-home'], 'signedProcess', '署名说明又被退回。克拉拉把银行来信挨着放下：“这一封也让你找有资格的人代办。”两封信占了同一块桌面。')
  remember(['q3-home'], 'refusedInvisibleWork', '报纸上的六小时停机还摆在桌边。旧同事又来敲门，你隔着门请她先去找当班主管，克拉拉等脚步声远了才拿出账户来信。')
  remember(['q3-home'], 'secretReturn', '克拉拉看见你袖口的油迹：“侧门这次也没记工时？”你把没有署名的报告放到银行来信旁。')
  nodes['q4-home'].replaceBodyByTag = [...(nodes['q4-home'].replaceBodyByTag ?? []), {
    tag: 'signedProcess',
    body: '你应摄影队的邀请到了工厂，尚在布景旁，车间警报就响了。比阿特丽斯翻到工人抄来的夜班说明，来电问其中一处阀门次序。纸上有步骤，现场尚未照它完成过这项故障处置。',
  }]
  remember(['q4-home'], 'refusedInvisibleWork', '电话里，比阿特丽斯先说姓名：“我负责现场。上次停了六小时，这次需要你讲清次序。”你先前拒绝的无偿回厂，她没有代你答应。')
  remember(['q4-home'], 'secretReturn', '来电的旧同事压低声音，让你仍走侧门。你听见电话那边的警报，这次镜头也在门外。')
  remember(['q4-home'], 'acceptedFilm', '围裙已经系好。导演指着面包，刚提到换取半年津贴的拍摄约定，车间警报就盖过了她的声音。')
  remember(['q4-home'], 'accountChallenge', '你带着银行的拒绝说明来现场，想让摄影队听见账户的事。导演把围裙递来，你还没有接。')
  remember(['q4-home'], 'processOnFilm', '记者把拍过的署名页藏回包里，顺着警报声转过镜头。')
  remember(['q5-home'], 'signedProcess', '比阿特丽斯把那封有日期的说明摆到志愿书旁：“这不是今天临时想出来的办法。”厂长没有收走它，只把工牌推得更近。')
  remember(['q5-home'], 'refusedInvisibleWork', '志愿书从今天写起，没有提你曾拒绝无偿回厂，也没有提六小时停机。你把那期报纸折好，放在签字处旁。')
  remember(['q5-home'], 'secretReturn', '志愿书想把侧门那次来访也一并算进去。旧同事低头看着你曾沾满油的袖口，等你落笔。')
  remember(['q5-home'], 'acceptedFilm', '导演拿出半年津贴的拍摄约定，指着厨房那场戏。如今她还要你在另一张纸上认下“志愿帮助”，原来的约定没有这一句。')
  remember(['q5-home'], 'accountChallenge', '克拉拉带来银行仍未答复的独立账户申请。她看了看工牌：“复职能改变工资从哪来，银行还欠你一个答复。”')
  remember(['home-end-badge'], 'signedProcess', '比阿特丽斯把旧说明的署名页还给你。你收进新岗位的抽屉，志愿档案没有使那个日期消失。')
  remember(['home-end-unbroadcast'], 'signedProcess', '记者把署名说明附在胶片盒里，观众可以对照：警报响起以前，方法已经寄回厂里。')
  remember(['home-end-badge'], 'refusedInvisibleWork', '旧同事这次从正门来找你，请你以当班人员身份签工单。你曾拒绝的无名来访没有成为新的上班办法。')
  remember(['home-end-unbroadcast'], 'refusedInvisibleWork', '旧同事再次求助时，你请她先写清报酬与责任。那六小时停机的报纸也留进盒里，帮助过一次没有替你许下以后每一次。')
  remember(['home-end-badge', 'home-end-unbroadcast'], 'secretReturn', '侧门那次没有留下正式工时。旧同事仍记得你来过，你请她把自己看见的日期写下来。')
  remember(['home-end-badge', 'home-end-unbroadcast'], 'acceptedFilm', '你把半年津贴的拍摄约定收好。导演要的厨房片段与后来响起的警报，终于可以按同一天的先后说清。')
  remember(['home-end-badge', 'home-end-unbroadcast'], 'accountChallenge', '克拉拉和你又到银行，把上次未答复的申请放到柜台。两人仍要求独立账户，柜员还得找出能受理的手续。')
  remember(['home-end-badge', 'home-end-unbroadcast'], 'liveReturn', '比阿特丽斯在现场记录写下你赶到的时间，再签自己的处置；镜头里的来回有了对应的工单。')
  remember(['home-end-badge', 'home-end-unbroadcast'], 'remoteHandoff', '比阿特丽斯签下现场操作，把电话核对页附在后面：“你报的流程，我动的手。各留一份。”')
  return { ...episode, nodes }
}
