import { buildAuthoredEpisode, type AuthoredOption, type AuthoredRound, type EndingDraft } from '../authoredEpisode'
import type { EndingRelic, RelicPattern } from '../types'
import { withMaleSafetyConsequences } from './maleSafetyConsequences'

const o = (id: string, label: string, hint: string, result: string, tag: string, extra: Partial<AuthoredOption> = {}): AuthoredOption => ({ id, label, hint, result, tag, ...extra })
const r = (title: string, body: string, art: string, options: AuthoredOption[]): AuthoredRound => ({ title, body, art, options })
const relic = (id: string, name: string, description: string, echo: string, pattern: RelicPattern): EndingRelic => ({ id, name, description, echo, pattern, useHint: '留作本次行程的记录；保存并不保证获得复核或改变规则。' })
const end = (id: string, title: string, body: string, art: string, item: EndingRelic, unresolvedEcho: string): EndingDraft => ({ id, title, body, art, relic: item, unresolvedEcho })
const recording = relic('local-recording', '未上传的录音', '周屿手机保留的实际录音片段，范围以本次开启和关闭的时刻为准。', '一份没有交给平台的证据，能保护谁？', 'record')
const timeline = relic('two-person-timeline', '两个人的时间线', '乘客与司机各自确认能提供的部分，未知与异议没有被补成一致。', '安全是否只能建立在先认定一个坏人之上？', 'people')
const protocol = relic('public-protocol', '证据使用协议草案', '草案提出最少数据、使用边界、人工复核和删除期限，接收不等于正式采纳。', '被写下的程序，谁负责让它真正执行？', 'procedure')

export const maleSafety = withMaleSafetyConsequences(buildAuthoredEpisode({
  id: 'male-safety', number: 6, title: '男人深夜出门，请先证明自己安全', protagonist: '周屿', rule: '男性夜间叫车必须接受额外安全验证',
  headline: ['想安全到家，', '先交出全部隐私。'], hook: '车辆已经到达，平台仍在索要麦克风和通讯录。',
  feedArt: '/art/worlds/male-safety-guide.jpg', feedAlt: '深夜叫车页面要求男性开启安全功能',
  opening: '你叫周屿。凌晨一点十七分，加班后你在雨里叫车，只想回家换掉湿袜子，关灯睡觉。平台要求男性乘客开启持续录音、精确定位与通讯录读取，绑定一名女性担保人，否则夜间投诉只能进普通队列。司机宋岚已到，评分很高，前方却显示临时施工。倒计时亮着，你还没坐进车里，先得决定交出多少隐私。',
  openingArt: '/art/worlds/male-safety-guide.jpg', firstTitle: '倒计时二十秒：选择本次安全方式',
  firstBody: '全部授权可以启动平台守护；联系朋友可以留下外部见证；拒绝授权仍能上车，但平台明确提示投诉优先级降低。',
  firstArt: '/art/worlds/male-safety-guide.jpg',
  routes: [
    { id: 'comply', openingChoice: o('safety-q1-comply', '开启录音、定位和通讯录', '获得官方守护；录音、定位和通讯录将保存三十天', '页面变绿：“守护已开启。”宋岚看见司机端的男性乘客提醒，开口说：“系统让我确认你没有饮酒，你别介意。”', 'routeComply'), rounds: [
      r('司机端要求她描述你的穿着和状态', '宋岚说这是平台新增的纠纷保护。录音正在上传，你能听见每句话被转成文字。', '/art/worlds/male-safety-guide.jpg', [
        o('safety-comply-q2-answer', '配合回答并确认无饮酒', '平台会把回答加入行程档案', '她照着选项逐项确认。系统却把你的沉默标记为“乘客情绪紧张”。', 'platformProfile'),
        o('safety-comply-q2-question', '询问司机也被记录了什么', '可以对照司机端知道些什么；她也可能拿不到期限和录音副本', '宋岚第一次发现她的车内音频同样会被保存，却不能下载副本。', 'mutualDataSeen'),
        o('safety-comply-q2-minimize', '关闭通讯录，只保留本次录音', '守护等级会从绿色降为黄色', '担保人功能消失，录音仍在上传。页面提示是你主动降低保护。', 'partialConsent'),
      ]),
      r('宋岚临时偏离导航路线', '她说前方积水，要从高架下绕行。平台弹窗只给“确认安全”和“立即报警”，没有询问施工情况。', '/art/worlds/male-safety-guide.jpg', [
        o('safety-comply-q3-confirm', '先确认安全，继续观察', '先结束安全追问，仍需自己观察后续路况', '弹窗消失。宋岚驶入一段没有路灯的辅路，平台不再追问。', 'confirmedSafe'),
        o('safety-comply-q3-alert', '触发平台安全警报', '平台会同时联系司机和担保人', '车内响起警报。宋岚急刹，后车差点追尾。她让你看前方已经封闭的主路。', 'platformAlert'),
        o('safety-comply-q3-call', '要求靠边并人工核实施工', '先停在亮处等人工核实施工；预计等待三分钟，客服未必看得到路障', '宋岚停在便利店灯下。客服只重复导航显示正常，无法看到现场路障。', 'humanCheck'),
      ]),
      r('平台把偏航升级为高风险事件', '自动客服要求你锁定车门等待报警，司机端却要求宋岚立即结束行程。两套安全指令互相冲突。', '/art/worlds/male-safety-guide.jpg', [
        o('safety-comply-q4-exit', '在亮处下车，结束行程', '结束这段车程；须在雨中另作安排，下一辆车预计等十五分钟', '宋岚结束订单。平台随即停止共享她的位置，却继续保存你的录音。', 'exitedSafely'),
        o('safety-comply-q4-together', '与宋岚一起向人工客服说明', '双方都会留下实名陈述', '客服终于标注道路施工。宋岚补充司机端冲突指令，你补充警报引发的急刹。', 'jointAccount', { requiresTags: ['mutualDataSeen'] }),
      ]),
      r('到家后，平台生成了“已妥善保护”报告', '报告删除施工与冲突指令，只保留你主动报警。提交投诉会公开部分录音给司机，撤回则数据仍保存三十天。', '/art/worlds/male-safety-guide.jpg', [
        { ...o('safety-comply-q5-report', '提交投诉并要求双方补充记录', '宋岚也能看见并回应你的陈述', '', 'jointReview'), endingId: 'safety-end-timeline' },
        { ...o('safety-comply-q5-delete', '要求删除通讯录与无关录音', '平台可能关闭本次申诉', '', 'deletionRequested'), endingId: 'safety-end-protocol' },
      ]),
    ] },
    { id: 'witness', openingChoice: o('safety-q1-witness', '不开通讯录，直接把车牌发给朋友陈晨', '朋友愿意陪你通话，但订单没有官方守护标记', '陈晨接起电话，把你的预计到达时间写进聊天框。平台显示你未开启官方守护，宋岚只看到普通订单。', 'routeWitness'), rounds: [
      r('宋岚问你为什么一直通话', '陈晨能听见车内声音，但看不到实时路线。宋岚担心私人录音会在投诉时只截取她的话。', '/art/worlds/male-safety-guide.jpg', [
        o('safety-witness-q2-open', '告诉她朋友正在见证行程', '宋岚可以选择取消订单', '她没有取消，只要求你也记下前方施工：“如果要录，别只录我。”', 'driverInformed'),
        o('safety-witness-q2-quiet', '保持通话，不说明原因', '朋友可以听见行程，司机却不知道通话用途', '宋岚从后视镜看了你几次，把车内广播调大。两个人都开始猜测对方。', 'covertWitness'),
        o('safety-witness-q2-route', '请陈晨同时打开公开路况', '可核对公开施工预警，无法看见车旁实时路况', '陈晨确认主路确有积水预警，并把公告截图发进聊天。', 'outsideRouteCheck'),
      ]),
      r('车辆离开平台建议路线', '宋岚指向封闭路牌，陈晨却说地图上的偏航越来越大。你必须决定把谁的信息当作行动依据。', '/art/worlds/male-safety-guide.jpg', [
        o('safety-witness-q3-driver', '请宋岚说出完整绕行路线', '让陈晨核对绕行路口如何接回主路；地图无法替你确认眼前路况', '她逐个报出路口。陈晨发现第三个路口会重新接回主路。', 'routeVerbalized'),
        o('safety-witness-q3-stop', '要求停在最近的亮处', '可在两百米外的亮处停车再判断；到家时间会推迟', '宋岚靠边停车，没有争辩。陈晨记录了停车时间和位置。', 'witnessedStop'),
        o('safety-witness-q3-platform', '临时开启定位并触发警报', '请求平台介入，也开始向平台共享位置', '平台警报响起，宋岚急刹。陈晨同时听见她喊出前方封路。', 'dualRecord'),
      ]),
      r('陈晨突然听不清车内声音', '车辆进入高架下方，通话断续。平台仍未开启官方守护，宋岚建议继续两分钟就能回主路。', '/art/worlds/male-safety-guide.jpg', [
        o('safety-witness-q4-code', '按约定安全词报出位置', '陈晨会在一分钟无回应后报警', '你说出安全词和路口。信号断了二十秒，再接通时车辆已经回到主路。', 'safetyWordUsed'),
        o('safety-witness-q4-timeline', '让宋岚停车，共同补全时间线', '停车会让后车等待', '她停下发动机。你读聊天记录，她读行车记录，缺失的三分钟终于对上。', 'timelineBuilt', { requiresTags: ['driverInformed'] }),
        o('safety-witness-q4-exit', '立即下车，等待陈晨来接', '这里没有室内等候点', '宋岚把车停在监控下。她没有离开，直到陈晨的车灯出现。', 'friendPickup'),
      ]),
      r('平台事后询问是否遭遇危险', '选择“是”会自动冻结宋岚账号；选择“否”则这次偏航不进入安全统计。你和宋岚都能提交补充说明。', '/art/worlds/male-safety-guide.jpg', [
        { ...o('safety-witness-q5-both', '与宋岚共同提交完整时间线', '道路施工和系统缺口都会进入复核', '', 'sharedTimeline'), endingId: 'safety-end-together' },
        { ...o('safety-witness-q5-gap', '单独报告偏航和二元问法', '司机账号可能先被冻结', '', 'reportedDesign'), endingId: 'safety-end-witness' },
      ]),
    ] },
    { id: 'private', openingChoice: o('safety-q1-private', '拒绝额外授权，只保留本地录音', '不自动上传文件，夜间投诉只能进普通队列', '你打开手机本地录音，文件不会自动上传。宋岚接单后看不到任何安全标签，也不知道你正在录音。', 'routePrivate'), rounds: [
      r('是否告诉宋岚正在录音', '本地录音属于你的设备，平台不会替双方确认边界。车已经驶入主路。', '/art/worlds/male-safety-guide.jpg', [
        o('safety-private-q2-tell', '明确告知并允许她也录音', '双方设备会保存不同版本', '宋岚打开行车记录仪的音频。她说：“至少别让任何一边只有一段剪过的话。”', 'mutualRecording'),
        o('safety-private-q2-hide', '不告诉她，继续本地录音', '保留未上传的对话片段；司机不知录音，语境只能先由你说明', '她随口评论你的外套和深夜出行。你没有回应，录音继续。', 'covertRecording'),
        o('safety-private-q2-notes', '关闭声音，只记时间与位置', '少留敏感内容，也不再保存对话原声', '你在备忘录写下上车时间、车牌和第一个路口。', 'minimalLog'),
      ]),
      r('主路封闭，宋岚准备绕行', '平台因你拒绝定位而不会自动识别偏航。本地记录是否构成危险，只能由你现场判断。', '/art/worlds/male-safety-guide.jpg', [
        o('safety-private-q3-photo', '拍下封路牌和绕行入口', '留下封路标牌与入口的图像；照片带时间位置，也只覆盖拍到的路段', '宋岚放慢车速让你拍清标牌。两个人都知道偏航从哪里开始。', 'detourDocumented'),
        o('safety-private-q3-map', '离线记下她说的三个路口', '先保存她口述的三个路口；目前仍需自己观察，笔记不是完整定位轨迹', '第二个路口与她描述一致。第三个路口仍在黑暗里。', 'routeNoted'),
        o('safety-private-q3-stop', '拒绝绕行，要求原地结束订单', '平台可能收取取消费', '宋岚停在封路牌前。你们一起等了两分钟，没有车能通过主路。', 'rideEndedEarly'),
      ]),
      r('绕行路段没有信号，车后出现持续跟随的摩托车', '宋岚说可能是同路线外卖员，也主动锁上车门。你无法联系平台，只有本地记录。', '/art/worlds/male-safety-guide.jpg', [
        o('safety-private-q4-share', '恢复信号后再发送本地记录', '先保留本地隐私，恢复信号前无法发出记录', '宋岚驶向亮处，摩托车转入另一条路。信号恢复时，你仍保有完整文件。', 'recordKeptLocal'),
        o('safety-private-q4-pair', '与宋岚互相核对各自记录', '她的行车记录包含车外画面', '车外画面显示摩托车在前一个路口已跟随另一辆车。恐惧没有被嘲笑，也没有被当成定罪。', 'recordsCompared', { requiresTags: ['mutualRecording'] }),
      ]),
      r('到家后，你可以上传录音换取快速复核', '上传即同意平台用于安全模型训练；不上传，本次偏航不会进入平台统计。宋岚也无法取得你的版本。', '/art/worlds/male-safety-guide.jpg', [
        { ...o('safety-private-q5-local', '保留本地文件，只提交最少事实', '投诉将进入普通队列', '', 'minimalComplaint'), endingId: 'safety-end-local' },
        { ...o('safety-private-q5-protocol', '向双方提交可撤回的证据使用协议', '平台目前没有对应入口', '', 'protocolProposed'), endingId: 'safety-end-public' },
      ]),
    ] },
  ],
  endings: [
    end('safety-end-timeline', '同一趟车的两份陈述', '复核时，你与宋岚各交自己保存的消息和亲历经过，核对施工、停车与系统指令，未知处留空，各下载一份时间线。她没被永久封号，你的投诉也保留着。平台只回“导航异常”。宋岚发来一句：“两边指令打架，还是没答。”你把这条也存了。', '/art/worlds/male-safety-guide.jpg', timeline, '承认双方都可能害怕，会不会削弱对伤害的追究？'),
    end('safety-end-protocol', '被关闭的投诉', '你先存下可见页面，再撤回授权。通讯录获准删除，投诉却因“证据授权撤回”关闭。你写好限定用途、期限与人工复核的协议草案，发给宋岚和客服。宋岚回“收到了”，客服拒绝按草案重开，也没有机构承诺试用。你把删除回执和结案通知放在一起。', '/art/worlds/male-safety-guide.jpg', protocol, '删除权和申诉权为什么必须互相交换？'),
    end('safety-end-together', '两个人核对过的三分钟', '你与宋岚把已有记录摊开，核对施工与本次求助，空缺的分钟留着，各存一份时间线。复核没有直接把偏航判成司机恶意。你们提议加上“情况不明，申请人工核实”，客服收下，未承诺改版。宋岚把副本存进手机：“至少这次经过，我们各有一份了。”', '/art/worlds/male-safety-guide.jpg', timeline, '一个新选项是否真的改变了处理它的人？'),
    end('safety-end-witness', '不能只回答是或否', '宋岚的账号冻结两天后恢复。你隐去司机身份，公开平台的二元问法，收到四十七份类似截图。你据此写好分列双方记录、限定用途与人工复核的协议草案，发给材料提供者和客服。讨论还在继续，客服只接收意见；宋岚少接的两天单，记录里也留下了。', '/art/worlds/male-safety-guide.jpg', protocol, '许多相似证据出现以后，平台还能把它们叫作个例吗？'),
    end('safety-end-local', '凌晨两点的未上传录音', '你只提交车牌、时间和实际记下的路况，平台发来五元券，结束普通投诉。回家后，手机里还留着真正录到的片段与时间笔记；停录以后的空白，你没有补。你换下湿袜子，看到券上写“感谢理解”。记录未证明宋岚有罪，也没换来完整复核。', '/art/worlds/male-safety-guide.jpg', recording, '不被使用的证据，仍然会改变保存它的人。'),
    end('safety-end-public', '还不存在的提交方式', '你写好最少数据、双方核对、人工复核与到期删除的协议草案，平台拒收附带期限的录音。宋岚先圈定自己愿意提供的范围，再与你把草案交给司机互助会与男性夜行小组。十二辆车的夜班车队愿意试用，平台规则仍旧。第一趟怎么执行，还等车队一起试。', '/art/worlds/male-safety-guide.jpg', protocol, '小范围可执行的规则，能不能反过来迫使大平台改变？'),
  ],
}))
