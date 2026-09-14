import { buildAuthoredEpisode, type AuthoredOption, type AuthoredRound, type EndingDraft } from '../authoredEpisode'
import type { EndingRelic, RelicPattern } from '../types'
import { withSpinningJennyConsequences } from './spinningJennyConsequences'

const o = (id: string, label: string, hint: string, result: string, tag: string, extra: Partial<AuthoredOption> = {}): AuthoredOption => ({ id, label, hint, result, tag, ...extra })
const r = (title: string, body: string, art: string, options: AuthoredOption[]): AuthoredRound => ({ title, body, art, options })
const relic = (id: string, name: string, description: string, echo: string, pattern: RelicPattern): EndingRelic => ({ id, name, description, echo, pattern, useHint: ({ 'stop-wrench': '工厂发生故障时，确认断电并禁止复机，再安排检修。', 'joint-drawing': '分别记录两人交接职责，作为提出双人分工方案的依据。', 'maintenance-card': '写下维修步骤，监督另一工人实际完成，留下培训能力的证据。' } as Record<string, string>)[id] })
const end = (id: string, title: string, body: string, art: string, item: EndingRelic, unresolvedEcho: string): EndingDraft => ({ id, title, body, art, relic: item, unresolvedEcho, nextLifeTeaser: '一百八十年后，一名男工刚交还战时工牌。工厂仍在使用他制定的流程。' })
const stopWrench = relic('stop-wrench', '有缺口的停机扳手', '事故后的停机检查在扳手上留下缺口，不能据此推断是谁完成了现场救援。', '安全规则应该在事故前由谁决定？', 'procedure')
const jointDrawing = relic('joint-drawing', '三方签名的图纸', '托马斯、埃莉诺与鲁思分别在设计、资金和操作栏落名。', '共同拥有是否也意味着共同负责？', 'people')
const maintenanceCard = relic('maintenance-card', '被抄旧的维护卡', '纸角沾着不同工坊的油污，停机步骤仍然清楚。', '公开方法以后，谁来承担执行成本？', 'record')

export const spinningJenny = withSpinningJennyConsequences(buildAuthoredEpisode({
  id: 'spinning-jenny', number: 3, title: '男人不能拥有发明', protagonist: '托马斯', rule: '男人不能申请专利',
  headline: ['机器是你发明的，', '名字却不是你的。'], hook: '公开演示还有一小时，工人已经堵住工坊门。',
  feedArt: '/art/worlds/spinning-jenny.jpg', feedAlt: '男纺工被挡在多锭纺纱机之外',
  opening: '你叫托马斯。你画出的齿轮能让十六枚纱锭同时转动，法律却只许工坊主埃莉诺申请专利。你想亲手造出图纸上的机器，不再只是替别人的专利誊清稿纸。今天中午要向投资人演示，女工领班鲁思堵着门：机器若成功，三十六名手纺工下周就没工资。十五岁的学徒艾达正在内侧系最后一根皮带。',
  openingArt: '/art/worlds/spinning-jenny/thomas.jpg', firstTitle: '埃莉诺把声明和钥匙放在一起',
  firstBody: '签下“受雇改良”，你可以进机房完成演示；把图纸交给工人，演示可能立刻停止；现在公开图纸，则谁都能仿造。',
  firstArt: '/art/worlds/spinning-jenny/authorship-dispute.jpg',
  routes: [
    { id: 'owner', openingChoice: o('jenny-q1-owner', '签下声明，拿走机房钥匙', '获得职位与钥匙，专利仍只署埃莉诺的名字', '埃莉诺把你的名字写进工资册，没有写进专利。你进入机房时，鲁思隔着门问：“现在是谁能让它停下来？”', 'routeOwner'), rounds: [
      r('演示前只剩四十分钟', '艾达说皮带在高速时会偏移。埃莉诺不许延迟，也不愿让门外工人知道结构。', '/art/worlds/spinning-jenny/workshop.jpg', [
        o('jenny-owner-q2-guard', '临时加装护罩', '先挡住误入的手臂，薄铁皮不能修正皮带偏移', '护罩挡住手臂，也遮住了偏移的皮带。你把停机扳手留在自己腰间。', 'guardAdded'),
        o('jenny-owner-q2-drill', '暂停装配，教艾达停机', '演示时间会推迟十分钟', '艾达练习两次，记住先松动力轴再拉总闸。埃莉诺在门外不断看表。', 'adaTrained'),
        o('jenny-owner-q2-key', '把备用钥匙交给鲁思', '让反对运行的鲁思也能进入机房处理险情', '鲁思接过钥匙：“我反对它运行，不代表我要看着里面的人受伤。”', 'ruthHasKey'),
      ]),
      r('机器启动，门外的手纺纱被倒在地上', '鲁思要求投资人先看工资与裁员名单。埃莉诺命你继续加速，以产量结束争论。', '/art/worlds/spinning-jenny/ruth.jpg', [
        o('jenny-owner-q3-speed', '把机器升到演示速度', '展示产量，偏移的皮带也将随机器加速', '十六枚纱锭同时转动，投资人鼓掌。偏移声被机器盖住。', 'fullSpeed'),
        o('jenny-owner-q3-open-door', '打开机房，让鲁思进来', '埃莉诺可以立刻解除你的职位', '鲁思先看停机处，再看艾达站的位置。她要求把演示改成安全检查。', 'ruthInside'),
        o('jenny-owner-q3-list', '先把裁员名单递给投资人', '让投资人看到裁员安排，也越过埃莉诺给你的职权', '演示厅第一次安静下来。埃莉诺说你越过了自己的职权。', 'layoffsShown'),
      ]),
      r('皮带断裂，艾达的袖口被卷住', '总闸在门外，停机扳手在机房。所有人都看见了事故，却不是每个人都能碰机器。', '/art/worlds/spinning-jenny/opened-door.jpg', [
        o('jenny-owner-q4-wrench', '用扳手撬开动力轴', '直接解除卡住艾达的动力轴，你也须靠近转动部件', '机器停下时，扳手划破你的掌心。艾达保住了手，血留在齿轮和扳手上。', 'adaSavedByWrench'),
        o('jenny-owner-q4-power', '呼叫门外人员切断动力，你托住艾达', '须让有权限的人立即回应', '埃莉诺听见呼救，冲到总闸切断动力。你托住艾达，等齿轮停稳后解开袖口；她的手臂已经勒伤。', 'adaSavedByPowerCut'),
        o('jenny-owner-q4-ada', '让艾达按练习顺序停机', '可用她练过的松轴步骤；门外总闸仍需要另有人及时切断', '艾达没有等你的命令，先松轴再拉闸。机器停下，她的手臂留下了一圈勒痕。', 'adaSelfStopped', { requiresTags: ['adaTrained'] }),
        o('jenny-owner-q4-ruth', '让鲁思从外面打开总闸', '鲁思可用备用钥匙进入断电位置；须先让门外的她听清求助', '鲁思冲过封锁线切断动力。她救下艾达，也证明被挡在门外的人同样承担风险。', 'ruthStopped', { requiresTags: ['ruthHasKey'] }),
      ]),
      r('投资人要求在天黑前确定责任人', '签下“学徒操作失误”，资金继续；承认结构问题，所有机器必须召回。艾达坐在隔壁，能听见你们说话。', '/art/worlds/spinning-jenny/hidden-partnership.jpg', [
        { ...o('jenny-owner-q5-blame', '签下操作失误报告', '资金与职位继续；报告将责任归给艾达，她未因此同意', '', 'blamedAda'), endingId: 'jenny-end-owner' },
        { ...o('jenny-owner-q5-recall', '签发召回并公开事故记录', '第一批订单会全部取消', '', 'recalledMachines'), endingId: 'jenny-end-standard' },
      ]),
    ] },
    { id: 'workers', openingChoice: o('jenny-q1-workers', '把机房钥匙交给鲁思', '让工人进入机房了解结构；你将与她们共同面对工坊主的追问', '鲁思没有砸机器。她让工人分组进入，只看结构，不碰动力。埃莉诺宣布演示照常，并警告损坏由你赔偿。', 'routeWorkers'), rounds: [
      r('工人发现机器省下的不是力气，而是岗位', '鲁思要在投资人到场前提出条件。有人主张毁掉齿轮，有人想学会维护后留下。', '/art/worlds/spinning-jenny/ruth.jpg', [
        o('jenny-workers-q2-terms', '写下培训、同薪与工伤赔偿', '把培训、同薪与赔偿写成可谈的条件；需要工人先逐项取得共识', '三十六人逐项表决。鲁思把通过的三条写到机器旁的黑板上。', 'workerTerms'),
        o('jenny-workers-q2-dismantle', '拆下关键齿轮阻止演示', '只有你知道齿轮如何复原', '工人拆下齿轮，没有砸毁它。埃莉诺叫来警察，演示厅的门被锁住。', 'gearRemoved'),
        o('jenny-workers-q2-train', '先教所有人停机与维护', '这会暴露你的全部结构', '鲁思让最反对机器的人先学停机。艾达把步骤抄在十二张纸上。', 'workersTrained'),
      ]),
      r('埃莉诺同意让鲁思陈述三分钟', '她只答应不立即裁员，没有答应培训或赔偿。工人是否放行，将决定演示能否开始。', '/art/worlds/spinning-jenny/workshop.jpg', [
        o('jenny-workers-q3-conditional', '按黑板三条逐项要求签字', '当面要求逐条承诺；埃莉诺可以只答应部分，工人也须决定是否接受', '埃莉诺只签了培训，拒绝同薪和赔偿。工人内部第一次出现分歧。', 'partialAgreement', { requiresTags: ['workerTerms'] }),
        o('jenny-workers-q3-test', '允许低速演示，不交付机器', '允许低速验证纱线，不交付机器；仍须有人守住总闸并监督限速', '机器开始转动。工人站在总闸旁，投资人第一次必须隔着她们观看。', 'workerControlledTest'),
        o('jenny-workers-q3-refuse', '继续封锁，要求取消演示', '继续阻止演示；封锁要面对工坊主与到场警察的压力', '埃莉诺命艾达从侧门独自启动备用动力轴。没有人注意到她的袖口。', 'hiddenStartup'),
      ]),
      r('备用动力轴突然咬住艾达的袖口', '她在机房内，鲁思与工人在总闸旁。拆掉的齿轮、停机训练和封锁位置会决定谁能靠近。', '/art/worlds/spinning-jenny/opened-door.jpg', [
        o('jenny-workers-q4-stop', '由受训工人依次停机', '由练过的工人分工停机；须协调松轴、断闸与扶人各步', '第一人松轴，第二人拉闸，第三人托住艾达。机器在没有托马斯命令时停下。', 'collectiveStop', { requiresTags: ['workersTrained'] }),
        o('jenny-workers-q4-break', '砸断外露动力杆', '机器会报废，艾达还在里面', '鲁思抡下铁锤。动力杆断裂，艾达获救，整台机器向一侧倒下。', 'machineBroken'),
        o('jenny-workers-q4-direct', '报出总闸位置，请鲁思断开备用动力', '她就在闸旁，需要先分清备用轴的开关', '你逐项指出备用轴开关，鲁思切断动力，等机器停稳后与你解开袖口。艾达获救，工人也看见缺少标识曾拖慢救援。', 'directedStop'),
        o('jenny-workers-q4-restore', '装回齿轮，反向松开袖口', '只有你能在转动中对准齿槽', '你把齿轮装回半圈，鲁思拉住艾达。机器保住了，所有人也看见结构仍依赖你的知识。', 'gearRestored', { requiresTags: ['gearRemoved'] }),
      ]),
      r('艾达包扎后，工坊门仍被两边堵住', '埃莉诺愿意把一成收益交给工人委员会；鲁思要求工人拥有停机权和事故调查权。', '/art/worlds/spinning-jenny/worker-alliance.jpg', [
        { ...o('jenny-workers-q5-share', '接受收益分成与工人委员会', '获得一成收益与委员会席位；停机权和事故调查权仍需另谈', '', 'sharedOwnership'), endingId: 'jenny-end-joint' },
        { ...o('jenny-workers-q5-control', '拒绝开机，直到工人拥有停机权', '投资人会撤走订单', '', 'workerControl'), endingId: 'jenny-end-door' },
      ]),
    ] },
    { id: 'open', openingChoice: o('jenny-q1-open', '把完整图纸贴到工坊外墙', '任何人都可以抄走', '鲁思先抄停机结构，投资人的机械师抄齿轮比例。埃莉诺撕下一张时，街上已经有了第二份。', 'routeOpen'), rounds: [
      r('图纸传播得比解释更快', '一个小工坊照图仿制，却把昂贵的制动器删掉。中午前，它也要公开开机。', '/art/worlds/spinning-jenny/open-plans.jpg', [
        o('jenny-open-q2-note', '补发一张强制安全页', '你无法收回已经抄走的版本', '艾达把安全页钉到每个街口，但没有人能确认所有仿制者都看见。', 'safetyPage'),
        o('jenny-open-q2-visit', '带鲁思去检查仿制机', '埃莉诺的正式演示将无人调试', '仿制者允许你们看机器，却拒绝停机：“图纸既然公开，你凭什么管？”', 'copyInspected'),
        o('jenny-open-q2-withhold', '藏起制动器的最后一项尺寸', '保留制动器尺寸作为谈判筹码；仿制者仍拿不到完整安全结构', '安全结构重新变成你的筹码。鲁思问这和埃莉诺锁起图纸有何不同。', 'brakeWithheld'),
      ]),
      r('两台机器被安排同时演示', '投资人想比较产量，围观者挤满两间工坊。你只能站在其中一台旁边。', '/art/worlds/spinning-jenny/workshop.jpg', [
        o('jenny-open-q3-original', '留在埃莉诺的原机旁', '可直接照看原机与艾达；仿制机的状态要靠那边的人回报', '原机转速稳定。隔街忽然传来金属撞击声。', 'stayedOriginal'),
        o('jenny-open-q3-copy', '去没有制动器的仿制机旁', '可当面指出仿制机问题；原机交给鲁思，你无法同时照看两处', '你要求降速，仿制者拒绝。原机与仿制机几乎同时启动。', 'stayedCopy'),
        o('jenny-open-q3-cancel', '公开宣布两场演示都不安全', '你没有法律权力叫停', '埃莉诺继续开机，仿制者也不肯落后。围观者只听见你说出了风险。', 'warnedPublic'),
      ]),
      r('仿制机的皮带抽伤学徒，原机也开始偏移', '两处事故相隔一条街。你无法同时亲手停下两台机器，只能让公开出去的方法发挥作用。', '/art/worlds/spinning-jenny/opened-door.jpg', [
        o('jenny-open-q4-card', '让拿到安全页的人照步骤停机', '让仿制工坊在场者核对步骤后断电；你仍须另问原机的处置', '陌生工人撕下安全页跑进仿制工坊。她们在你赶到前已经切断动力。', 'publicStop', { requiresTags: ['safetyPage'] }),
        o('jenny-open-q4-ruth', '高喊制动结构，让鲁思停原机', '让鲁思确认开关后停原机；仿制机仍须由另一处的人处置', '鲁思停下原机，隔街的仿制机仍在转。你第一次看清公开一张图不等于建立一套规则。', 'oneMachineStopped'),
        o('jenny-open-q4-copy', '赶到仿制机旁指明动力入口，请工人断开', '你只能指挥这一处，原机仍要靠在场的人处置', '仿制工坊的工人按你指出的位置切断动力，受伤学徒被扶出来。鲁思在另一头呼喊原机也须停下，你还不知道那边的结果。', 'copyMachineStopped'),
      ]),
      r('报纸把事故称为“男人公开危险图纸”', '你可以收回图纸主张控制权，也可以发布带版本号的安全标准，让任何修改都必须留下记录。', '/art/worlds/spinning-jenny/open-plans.jpg', [
        { ...o('jenny-open-q5-control', '登记图纸并授权合格工坊使用', '法律仍不允许写你的名字', '', 'licensedOpen'), endingId: 'jenny-end-card' },
        { ...o('jenny-open-q5-standard', '公开版本号、停机步骤和事故记录', '让使用者对照版本与事故记录；你无权强制各工坊如实标注删改', '', 'versionedStandard'), endingId: 'jenny-end-maintenance' },
      ]),
    ] },
  ],
  endings: [
    end('jenny-end-owner', '终于刻上去的名字', '铜牌刻上“托马斯，首席机械师”，正是你想过的位置。事故后断电拆检动力接头，停机扳手崩出一个缺口，你把它收进抽屉。艾达递来写着“学徒失误”的报告，包扎的手停在签名处：“先生，这个也要我签吗？”你还没有把铜牌挂上去。', '/art/worlds/spinning-jenny/hidden-engineer.jpg', stopWrench, '拥有名字的人，也可能替制度抹去另一个名字。'),
    end('jenny-end-standard', '第一批被召回的机器', '订单全部取消，埃莉诺解雇了你。离厂前，你在断电拆检中松开受损动力接头，扳手崩出缺口，随召回记录留下。三个月后，一间陌生工坊的学徒先拉停机绳，再伸手换皮带。那根绳的高度，与召回图上一样。', '/art/worlds/spinning-jenny/open-plans.jpg', stopWrench, '规则救下陌生人时，制定者未必在场。'),
    end('jenny-end-joint', '三种署名', '新合同附着三方签名的图纸：托马斯签设计，埃莉诺签出资，鲁思签操作，各留一份。第一批利润很薄，鲁思仍反对扩产，埃莉诺仍嫌她难缠。艾达听见“开机”，手先停在杆旁，等另外两方答复——现在谁都不能独自下令。', '/art/worlds/spinning-jenny/worker-alliance.jpg', jointDrawing, '共同拥有不会消灭冲突，只会让冲突必须被听见。'),
    end('jenny-end-door', '没有按时打开的工坊门', '投资人带走订单，工坊停了六周。检修时，你把扳手崩出一个缺口，鲁思留下它做训练实物。第七周，埃莉诺签下停机权与事故调查条款。门终于打开，鲁思点训练人数；你站在第一列，等她点到“托马斯”。', '/art/worlds/spinning-jenny/worker-alliance.jpg', stopWrench, '拒绝生产的代价，由谁承担得最多？'),
    end('jenny-end-card', '合法图纸上的陌生名字', '安全版本获准生产，登记人仍是埃莉诺。每张维护卡底部写着托马斯，专利上没有。艾达把卡折进工具袋：“机器坏的时候，我们看这张。”油手印正落在你的名字旁。', '/art/worlds/spinning-jenny/open-plans.jpg', maintenanceCard, '使用者记得的方法，是否比法律记得的作者更重要？'),
    end('jenny-end-maintenance', '被抄旧的第七码', '第七码公开后，城里出现十二种改版。每张卡都必须标出删改之处。托马斯没有得到专利；一年内，也再没有工坊能把缺失的制动器说成原设计。', '/art/worlds/spinning-jenny/open-plans.jpg', maintenanceCard, '开放不是放弃控制，而是让改动无法躲藏。'),
  ],
}))
