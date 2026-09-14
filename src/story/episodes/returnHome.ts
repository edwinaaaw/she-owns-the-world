import { buildAuthoredEpisode, type AuthoredOption, type AuthoredRound, type EndingDraft } from '../authoredEpisode'
import type { EndingRelic, RelicPattern } from '../types'
import { withReturnHomeConsequences } from './returnHomeConsequences'

const o = (id: string, label: string, hint: string, result: string, tag: string, extra: Partial<AuthoredOption> = {}): AuthoredOption => ({ id, label, hint, result, tag, ...extra })
const r = (title: string, body: string, art: string, options: AuthoredOption[]): AuthoredRound => ({ title, body, art, options })
const relic = (id: string, name: string, description: string, echo: string, pattern: RelicPattern): EndingRelic => ({ id, name, description, echo, pattern, useHint: ({ 'shared-roster': '面对徐家的继承安排，想起把照护、财产管理和代签权分开。', 'old-badge': '面对徐家的婚书，想起核对身份附带的权利及退出的损失。', 'film-strip': '面对缺页账册，想起保留完整材料、日期和未解决的异议。' } as Record<string, string>)[id] })
const end = (id: string, title: string, body: string, art: string, item: EndingRelic, unresolvedEcho: string): EndingDraft => ({ id, title, body, art, relic: item, unresolvedEcho, nextLifeTeaser: '另一个时代，一名男人面对的不是工牌，而是一张要用婚姻偿还的借据。' })
const sharedRoster = relic('shared-roster', '共同签署的排班表', '排班参与者在同一张表上分别确认工作、交接与照护安排。', '一个位置为什么只能容下一个完整的人生？', 'people')
const oldBadge = relic('old-badge', '旧工牌', '它记录获得或恢复的岗位身份，也留下这份身份附带的限制。', '一段劳动要由谁盖章才算发生过？', 'record')
const filmStrip = relic('film-strip', '未删改的事实记录', '完整考核材料或原始胶片，留下官方叙述省略的过程。', '被剪掉的事实还能怎样回来？', 'identity')

export const returnHome = withReturnHomeConsequences(buildAuthoredEpisode({
  id: 'return-home', number: 4, title: '战争结束，男人请回家', protagonist: '塞缪尔', rule: '复员女性优先恢复战前岗位',
  headline: ['国家曾经需要你，', '现在只需要你回家。'], hook: '工厂只剩一个主管位置，七天后必须交接。',
  feedArt: '/art/worlds/return-home.jpg', feedAlt: '战后男工的工作证被家庭手册取代',
  opening: '你叫塞缪尔。战争四年，你管理飞机零件厂夜班，妻子克拉拉在邮局工作。你盼着停战后能按时回家，和她吃一顿不被工厂电话打断的晚饭。原主管比阿特丽斯复员归来，工厂却只有一个正式主管名额。她要照顾受伤的妹妹，你要偿还房贷。七天后必须交接，政府摄影队也将在那天拍“女人归厂，男人回家”。',
  openingArt: '/art/worlds/return-home/samuel.jpg', firstTitle: '厂长把一枚工牌放在桌中央',
  firstBody: '你可以要求与比阿特丽斯竞争，提出共享班次，或者先接受回家津贴。三条路都会在七天后的直播拍摄前给出结果。',
  firstArt: '/art/worlds/return-home/shift-over.jpg',
  routes: [
    { id: 'compete', openingChoice: o('home-q1-compete', '要求用现场考核决定主管', '争取凭维修能力留任；题目和家庭审查仍可能影响资格。', '比阿特丽斯同意考核，要求同时包括战前资历和战时流程。厂长让你们商定题目，桌上仍只有一枚工牌。', 'routeCompete'), rounds: [
      r('第一道题由谁的经验定义', '你的夜班流程降低了事故；比阿特丽斯熟悉战前设备，也在前线负责维修。只考一套经验，就会让另一个人的四年消失。', '/art/worlds/return-home/wartime-records.jpg', [
        o('home-compete-q2-war', '以近四年生产记录出题', '你的夜班经验占优势；对方的前线维修可能被漏算。', '比阿特丽斯答错一项夜班交接，却指出记录从未包含前线临修。', 'warRecordTest'),
        o('home-compete-q2-both', '让双方各设计一半考核', '双方经验都能进入考核，也要接受对方出的难题。', '你们用九十分钟拼出两套题。你说明夜班停机次序，比阿特丽斯核对传动轴结构；两人知道了彼此熟悉哪一段，没有人包下全部。', 'balancedTest'),
        o('home-compete-q2-output', '只比较当天成品与事故率', '同一条生产线同时受两人指挥，成绩与事故责任更难分清', '你们把争论交给一条同时受两人指挥的生产线。', 'liveOutputTest'),
      ]),
      r('克拉拉收到“一户一职”审查信', '如果你得到主管职位，她必须辞去邮局工作。她把信放到餐桌上：“你是在争自己的工作，还是我们家的那一个工作？”', '/art/worlds/return-home/one-job.jpg', [
        o('home-compete-q3-clara', '承诺不要求克拉拉辞职', '审查员可能取消你的资格', '克拉拉把审查信装回信封，要求与你一起去工厂说明。', 'claraKeepsJob'),
        o('home-compete-q3-job', '先赢下岗位，再申请例外', '保留竞争资格；例外没有申请入口，克拉拉仍可能被复核。', '克拉拉没有争吵，只把本月房贷数字写在你的准考证背面。', 'exceptionPlanned'),
        o('home-compete-q3-public', '把审查信带到考核现场', '让审查规则进入公开考核；克拉拉的岗位处境也会被现场看见', '比阿特丽斯看完说，她同样反对用家庭规则替工厂选主管。', 'letterPublic'),
      ]),
      r('直播拍摄时，旧传送带突然卡死', '导演要求继续演“男人交还工牌”。厂长却让候选人当场处理故障，这将成为考核最后一题。', '/art/worlds/return-home/model-homecoming-man.jpg', [
        o('home-compete-q4-alone', '独自排除故障', '断电后亲自抢修，争取速度成绩；检修责任也由你承担。', '你按夜班流程切断动力，等设备停稳后排除卡阻，恢复生产。比阿特丽斯停在警戒线外，计时员记下你的用时。', 'soloRepair'),
        o('home-compete-q4-stopfilm', '先停止直播，疏散工人', '先让人员离开危险处；计时不停，会失去速度分。', '你叫人退到警戒线外，请当班电工切断动力。导演失去直播画面，车间没有人受伤。厂长在速度栏扣了分，检修留到停稳之后。', 'workersFirst'),
      ]),
      r('考核结果只允许写一个名字', '厂长把考核表压在任命书下：“我可以录用你，先签这份声明。”声明支持“一户一职”，克拉拉的邮局岗位会被复核。比阿特丽斯反对这条规定，也没有放弃自己的任职要求。', '/art/worlds/return-home/employment-office.jpg', [
        { ...o('home-compete-q5-sign', '签署声明，接受主管职位', '克拉拉的邮局岗位将进入复核', '', 'signedOneJob'), endingId: 'home-end-one' },
        { ...o('home-compete-q5-contest', '公开全部考核与家庭审查信', '厂长会取消本次任命', '', 'publishedContest'), endingId: 'home-end-film' },
      ]),
    ] },
    { id: 'share', openingChoice: o('home-q1-share', '向比阿特丽斯提出共享班次', '两个人只能各领六成工资', '她没有立刻答应：“我从前线回来，不是为了分到半个旧职位。”你请她用七天一起证明这个岗位本来就需要两种经验。', 'routeShare'), rounds: [
      r('共享班次必须先解决谁负责', '一次夜班事故只能有一名主管签字。厂长认为两个人意味着无人负责。', '/art/worlds/return-home/shared-shift.jpg', [
        o('home-share-q2-roster', '设计重叠一小时的交接班', '能当面核对故障与未完事项；重叠工时还没有工资预算。', '你们把设备状态和未完成事项写在同一张表上，重叠的一小时用铅笔框住，谁来付薪还未谈妥。', 'sharedHandoff'),
        o('home-share-q2-split', '按车间区域划分责任', '各自负责的设备更清楚；跨区故障仍可能需要两人同时到场。', '边界画得清楚，第一起跨区停机就让两人同时赶到。', 'splitAreas'),
        o('home-share-q2-rotate', '每周轮换唯一负责人', '两人轮换主管责任；班次每周改变，家庭接送与复健也须协调', '比阿特丽斯把第一周交给你，要求第二周所有流程必须能由她接手。', 'rotatingLead'),
      ]),
      r('克拉拉无法配合每天变化的班次', '邮局不接受临时换班。比阿特丽斯的妹妹也需要固定复健时间，共享不能只解决工厂内部。', '/art/worlds/return-home/one-job.jpg', [
        o('home-share-q3-fixed', '固定各自三天班次', '让两家提前安排生活；周日交接仍没有薪资着落。', '两家第一次能提前安排生活，厂长却说固定表降低了临时调度权。', 'fixedRoster'),
        o('home-share-q3-care', '征得当事人同意，再登记照护时段', '让排班预留照护时间；只记获准部分，厂长仍可能拒绝。', '照护备注已经写在排班表旁，能交给谁看尚未确认。比阿特丽斯把这一页暂时收起：“还要问她们。”', 'careVisible'),
        o('home-share-q3-private', '不解释原因，只保证产量', '任何一次迟到都由个人承担', '表格很整洁，两个人每天都在表格外交换家庭时间。', 'hiddenCare'),
      ]),
      r('摄影队要求重演“交接工牌”', '导演只需要比阿特丽斯接过工牌、你走向厨房布景。你们共同设计的排班表不会出现在画面里。', '/art/worlds/return-home/model-homecoming-man.jpg', [
        o('home-share-q4-stage', '先照剧本拍，再展示真实排班', '配合拍摄后争取解释机会；导演可能来不及听就切走镜头。', '导演在你开口前切走画面。真实排班只留在未播出的胶片尾部。', 'stagedFilm'),
        o('home-share-q4-table', '把共同排班表举到镜头前', '让观众看见固定班次；方案尚未获批，直播可能被中断。', '比阿特丽斯站到你身边，逐项解释为什么两个人都无法消失。直播被提前中断。', 'rosterShown', { requiresTags: ['fixedRoster'] }),
        o('home-share-q4-refuse', '拒绝扮演交接，继续当班', '继续实际工作；摄影队会拍到空布景，也可能省略你的理由。', '机器声盖过导演的催促。空厨房和运转的车间同时进入胶片。', 'emptySet'),
      ]),
      r('厂长愿意试行共享三个月', '条件是两人合计只领一份工资，且任何事故都可立即取消试行。排班表还缺最后的签名。', '/art/worlds/return-home/shared-shift.jpg', [
        { ...o('home-share-q5-trial', '共同签下三个月试行', '两家都要承受减薪', '', 'sharedTrial'), endingId: 'home-end-shared' },
        { ...o('home-share-q5-workers', '让夜班工人共同签署排班标准', '把安排变成多人提出的要求；厂长可能拒批，签名者也会被看见。', '', 'collectiveRoster'), endingId: 'home-end-roster' },
      ]),
    ] },
    { id: 'home', openingChoice: o('home-q1-home', '交还工牌，申请回家津贴', '保住本月还贷的钱，同时交回工厂身份', '办事员收走工牌，递给你《幸福丈夫手册》。回家当晚，旧同事却来求助：工厂仍在使用你的夜班流程，却没人知道如何处理其中一项故障。', 'routeHome'), rounds: [
      r('你是否回厂解释那套流程', '津贴条款禁止领取者从事有偿生产。厂长愿意让你从侧门进去，但不会留下记录。', '/art/worlds/return-home/household-allowance.jpg', [
        o('home-home-q2-letter', '把步骤写成正式说明寄回', '留下贡献与日期；厂长可能不认署名，纸本也不能代替实做交接。', '厂长退回说明，理由是家庭津贴领取者不具备工厂身份。工人私下抄走了它。', 'signedProcess'),
        o('home-home-q2-refuse', '拒绝继续提供无名劳动', '不再免费填补交接缺口；夜班可能停产，同事仍要处理故障。', '工厂停机六小时。第二天报纸把事故归因于复员交接混乱。', 'refusedInvisibleWork'),
        o('home-home-q2-secret', '从侧门回去，无偿解决故障', '先恢复生产，但这次劳动没有正式署名或报酬', '生产恢复。新主管报告写着“依照既有流程处理”，没有写你来过。', 'secretReturn'),
      ]),
      r('克拉拉发现津贴账户只能由她联名支取', '她不是规则的制定者，却成了你每次花钱必须请求的人。摄影队同时邀请你做“安心回家”的示范丈夫。', '/art/worlds/return-home/one-job.jpg', [
        o('home-home-q3-joint', '与克拉拉一起要求独立账户', '争取自己支取津贴；银行没有现成表格，开支可能继续受阻。', '克拉拉拒绝替你签下一笔日常开支，要求银行书面说明拒绝理由。', 'accountChallenge'),
        o('home-home-q3-film', '接受拍摄，换取半年津贴', '获得半年津贴，同时配合“幸福丈夫”的拍摄安排', '导演让你系上围裙，说只需微笑，不必谈账户。', 'acceptedFilm'),
        o('home-home-q3-record', '把退回的流程说明交给摄影队', '让记者看见有日期的贡献记录；导演可能拒绝拍摄或播出。', '记者偷偷拍下署名页，导演要求立刻收走。', 'processOnFilm', { requiresTags: ['signedProcess'] }),
      ]),
      r('直播开始，车间警报突然响起', '你应摄影队的邀请来到工厂，站在厨房布景旁。车间警报盖过导演的声音，比阿特丽斯从厂内打来电话，问这项故障的夜班处置次序。', '/art/worlds/return-home/model-homecoming-man.jpg', [
        o('home-home-q4-run', '离开布景，直接赶到车间', '到场协助能让镜头拍到你的劳动；摄影队可能将它剪掉。', '你从布景旁跑进车间，先确认断电、停稳，再报出阀门顺序，与比阿特丽斯一起处理卡阻。警报解除，镜头拍到了你的来路。', 'liveReturn'),
        o('home-home-q4-call', '隔着电话指导比阿特丽斯', '由她在厂内操作，你远程逐项确认；镜头可能只留下声音。', '你在电话里先请她确认断电、停稳，再逐项报数，她重复确认后操作。警报解除，直播录到你的声音，现场处置由她完成。', 'remoteHandoff'),
      ]),
      r('政府要求剪掉警报后的全部画面', '恢复工牌可以作为交换，但你必须承认那只是一次家庭男性的志愿帮助。原始胶片今晚就会被销毁。', '/art/worlds/return-home/employment-office.jpg', [
        { ...o('home-home-q5-badge', '接受工牌，签下志愿说明', '恢复个人工作，过去的劳动则要签作志愿服务', '', 'badgeRestored'), endingId: 'home-end-badge' },
        { ...o('home-home-q5-film', '带走原始胶片，放弃复职', '保住警报前后的完整影像；放弃以签志愿说明换取的复职机会', '', 'filmPreserved'), endingId: 'home-end-unbroadcast' },
      ]),
    ] },
  ],
  endings: [
    end('home-end-one', '唯一留下的男人', '新工牌终于没有“临时”。你把它别好，桌上二十七份战时男工申请却都盖着“建议回家”，最上面的人曾替你挡过事故。克拉拉的邮局资格也在复核。今天有两份退件等你签字，家里的那份压在下面。', '/art/worlds/return-home/employment-office.jpg', oldBadge, '进入规则的人，是否会替规则继续关门？'),
    end('home-end-film', '被取消的考核', '工厂取消任命，报纸只刊你与比阿特丽斯争岗位的照片。你复印完整成绩与家庭审查信，工人贴一份在食堂，你带另一份回家。克拉拉把它摊在餐桌上，补写：“这不是两个人的私人战争。”晚饭还没端来，你们先一起读完。', '/art/worlds/return-home/model-homecoming-man.jpg', { ...filmStrip, name: '未删改的事实记录 · 考核材料', description: '未删改的考核成绩与家庭审查信副本。' }, '事实公开以后，谁能让它不再只是新闻？'),
    end('home-end-shared', '共享的一班', '三个月里，你和比阿特丽斯各领半份工资，交接簿写满争执与未完事项。每次接班，有人读完上一人的留言才开工。到期后厂长没有续批。夜班工人把簿子留在桌上，问那一小时交接到底该算谁的工时。', '/art/worlds/return-home/shared-shift.jpg', sharedRoster, '临时试行何时才能成为别人也能要求的制度？'),
    end('home-end-roster', '写满名字的排班表', '二十九名夜班工人在表后签名，厂长拒绝承认，撕掉第一张。第二张随后贴到了邮局和另外两家工厂。比阿特丽斯抚平剩下的副本：“下次有人问，就从交接的这一小时讲。”她和你的名字挨在一起，班次仍未获批。', '/art/worlds/return-home/shared-shift.jpg', sharedRoster, '共同签名会分散风险，也会让惩罚寻找新的目标。'),
    end('home-end-badge', '重新发下来的旧工牌', '工牌回到胸前，志愿说明锁进档案。政府把你列为特殊技术人员，克拉拉保住邮局工作。新男工来问同样的资格怎么申请，你替他翻到表格最后一页，仍找不到入口。到家时，你把工牌放在两人的饭碗旁。', '/art/worlds/return-home/household-allowance.jpg', oldBadge, '个人例外能否成为公开入口，取决于谁愿意交出特权。'),
    end('home-end-unbroadcast', '没有播出的四十七码', '官方影片停在厨房布景。你与记者留下原始胶片，后面的警报、对话和现场反应都在。没有电视台播放，工会却在新工培训时放映。放到警报解除处，有人倒回去听你们如何交接；“志愿帮助”省去的那些分钟，终于有人肯看完。', '/art/worlds/return-home/beatrice.jpg', { ...filmStrip, name: '未删改的事实记录 · 胶片', description: '保存了警报前后完整过程的原始胶片。' }, '没有获得流量的内容，也可能改变真正看见它的人。'),
  ],
}))
