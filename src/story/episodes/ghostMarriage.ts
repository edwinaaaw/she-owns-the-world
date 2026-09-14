import { buildAuthoredEpisode, type AuthoredOption, type AuthoredRound, type EndingDraft } from '../authoredEpisode'
import type { EndingRelic, RelicPattern } from '../types'
import { withGhostMarriageConsequences } from './ghostMarriageConsequences'

const o = (id: string, label: string, hint: string, result: string, tag: string, extra: Partial<AuthoredOption> = {}): AuthoredOption => ({ id, label, hint, result, tag, ...extra })
const r = (title: string, body: string, art: string, options: AuthoredOption[]): AuthoredRound => ({ title, body, art, options })
const relic = (id: string, name: string, description: string, echo: string, pattern: RelicPattern): EndingRelic => ({ id, name, description, echo, pattern, useHint: ({ 'unexecuted-will': '在深夜行程中，想起为证据写明用途、期限与接收条件。', 'cut-red-cord': '在深夜行程中，想起把拒绝额外授权与放弃求助明确分开。', 'worker-ledger': '在深夜行程中，想起由双方分别核对各自亲历的记录。' } as Record<string, string>)[id] })
const end = (id: string, title: string, body: string, art: string, item: EndingRelic, unresolvedEcho: string): EndingDraft => ({ id, title, body, art, relic: item, unresolvedEcho, nextLifeTeaser: '许多年后，一段深夜录音也将面临同样的问题：被保存，是否等于被相信？' })
const will = relic('unexecuted-will', '徐宁的遗嘱', '来信写明补发欠薪与拒绝阴婚；执行状态和后来补签须与原文分别核对。', '死者的意愿要由哪个活人替她执行？', 'record')
const cord = relic('cut-red-cord', '剪断的红线', '顾言把准备给婚礼的红线剪成两截，它没有成为他的婚姻承诺。', '拒绝一份关系，并不会让它制造的债务消失。', 'identity')
const ledger = relic('worker-ledger', '按过手印的账册', '工人逐人确认欠薪后按印，来源与申报人保留在同一册里。', '看见账目的人，能不能共同决定账目？', 'procedure')

export const ghostMarriage = withGhostMarriageConsequences(buildAuthoredEpisode({
  id: 'ghost-marriage', number: 5, title: '你要娶一个死去的女人', protagonist: '顾言', rule: '顾家药债可以用一个男人的婚姻偿还',
  headline: ['新娘已经死了，', '婚约却还活着。'], hook: '天亮前不签婚书，顾家祖屋就会被收走。',
  feedArt: '/art/worlds/ghost-marriage.jpg', feedAlt: '红线将活着的男人与空置亡妻席相连',
  opening: '你叫顾言。母亲治病欠徐家三百两，祖屋明日抵债。你只想让她今晚在原来的床上喝完药，不必边收箱子边找住处。徐家给出的办法是：今夜与亡女徐宁结阴婚，终身以丈夫身份守住织坊继承权。徐宁的妹妹徐莲主持婚礼，却悄悄将缺三页的账册放到你脚边。天亮后，族老要开继承听证。',
  openingArt: '/art/worlds/ghost-marriage/gu-yan.jpg', firstTitle: '婚书、借据和缺页账册摆在同一张桌上',
  firstBody: '签婚书，债务今夜烧掉；查账，婚礼必须拖到丑时；拒绝，徐家明早接收祖屋。徐莲没有解释缺失的三页去了哪里。',
  firstArt: '/art/worlds/ghost-marriage/debt-becomes-marriage.jpg',
  routes: [
    { id: 'marriage', openingChoice: o('ghost-q1-marriage', '签下婚书，让母亲烧掉借据', '免去家中债务，终身身份也将被婚书绑定', '借据投入火盆，婚书锁进铁匣。仆人开始称你“徐宁之夫”。徐莲提醒：明早听证后，这个称呼也会决定谁控制织坊。', 'routeMarriage'), rounds: [
      r('洞房里只有牌位和一只上锁的木箱', '婚书规定丈夫可以保管亡妻遗物，却不得处置徐家产业。箱锁与账册缺页处沾着同样的蓝蜡。', '/art/worlds/ghost-marriage/ancestral-hall.jpg', [
        o('ghost-marriage-q2-open', '以丈夫身份打开木箱', '取得遗物中的线索，也动用徐宁未曾同意的丈夫身份', '箱内是三封退回的信和一枚织坊库房钥匙。信封上都是徐宁自己的字。', 'boxOpened'),
        o('ghost-marriage-q2-lian', '把木箱交给徐莲共同开启', '她没有婚书赋予的保管权', '徐莲用发簪撬锁。她承认蓝蜡来自徐宁生前封存的一份账目。', 'openedWithLian'),
        o('ghost-marriage-q2-seal', '保持木箱封闭，等族老到场', '申请正式保管证据，也把开箱与查阅交给族老', '族老收走木箱，称男人不宜单独阅读亡妻私信。', 'boxSeized'),
      ]),
      r('徐家要求你明早过继一个女孩', '孩子会成为徐宁名下继承人，你负责抚养，却没有权决定织坊或她成年后的婚姻。', '/art/worlds/ghost-marriage/madam-xu.jpg', [
        o('ghost-marriage-q3-accept', '先见过孩子再决定', '先听阿芸怎样想；见面仍不能替她同意过继，抚养安排要继续谈', '九岁的阿芸只问了一句：“我以后要叫你父亲，还是姐夫？”屋里没人答得出来。', 'metAyun'),
        o('ghost-marriage-q3-contract', '把监护权逐条写进附约', '把照护与代定婚姻的界线写清；附约还须争取族老接受', '你删掉替孩子决定婚姻的一条。族老说丈夫可以养人，不可改徐家家法。', 'guardianshipTerms'),
      ]),
      r('木箱里的信并不是情书', '徐宁写给商会：她要用织坊盈余补发四年欠薪，并明确拒绝以阴婚保产。最后一封被退回，原因是“未有丈夫共同签署”。', '/art/worlds/ghost-marriage/xu-lian.jpg', [
        o('ghost-marriage-q4-will', '把三封信作为遗嘱提交', '以徐宁自己的文字主张遗愿；缺少商会印章，效力会受质疑', '徐莲认出每一封笔迹。族老承认信是真的，却说没有丈夫签名便没有效力。', 'willSubmitted', { requiresTags: ['boxOpened'] }),
        o('ghost-marriage-q4-sign', '以丈夫身份在旧信上补签', '补签可以让内容生效，也会制造徐宁的同意', '你的名字让信第一次具有效力，也把她明确拒绝的丈夫写进遗愿。', 'willCountersigned'),
        o('ghost-marriage-q4-workers', '请三十二名女工核对欠薪', '让女工用各自工钱簿核对欠薪；欠款一旦列清，将影响可继承的产业', '工人带来自己的工钱簿。不同笔迹指向同一笔被挪走的银子。', 'workersVerified'),
      ]),
      r('继承听证只承认婚书或有效遗嘱', '保留丈夫身份可以执行徐宁的安排；废除婚约，顾家债务恢复；把账交给工人，两家都会失去控制。', '/art/worlds/ghost-marriage/ancestral-hall.jpg', [
        { ...o('ghost-marriage-q5-stay', '保留婚书，以丈夫身份执行遗愿', '保住丈夫身份带来的权限，尽管徐宁曾明确拒婚', '', 'stayedHusband'), endingId: 'ghost-end-husband' },
        { ...o('ghost-marriage-q5-workers', '公开欠薪，把织坊交给工人议决', '顾家旧债会重新生效', '', 'workersDecide'), endingId: 'ghost-end-ledger' },
      ]),
    ] },
    { id: 'investigate', openingChoice: o('ghost-q1-investigate', '要求先补齐账册再谈婚书', '争取补账和查问的时间；婚礼只暂缓，债务与祖屋期限仍在', '徐莲把你带到织坊账房。她说徐宁死前亲手撕下三页，此后徐家旁支忽然提出阴婚。外面已经开始催第三遍吉时。', 'routeInvestigate'), rounds: [
      r('缺页对应三笔去向不明的银子', '一笔给工人，一笔付药债，一笔没有收款人。徐莲认为最后一笔藏着徐宁真正的安排。', '/art/worlds/ghost-marriage/xu-lian.jpg', [
        o('ghost-investigate-q2-workers', '先向女工核对第一笔', '可先核对六名在场女工的欠薪；其他人的账目须另找本人确认', '女工拿出欠薪条，数额与账页边缘残字吻合。徐宁曾答应亲自补发。', 'wagesConfirmed'),
        o('ghost-investigate-q2-debt', '核对徐家为何替顾家付药费', '可当面查付款时间与签字人；查明药费来路不会自行免除顾家债务', '掌柜说付款发生在徐宁死后，签字人是徐家旁支，而非徐宁。', 'debtAfterDeath'),
        o('ghost-investigate-q2-impression', '拓下被撕页留下的压痕', '可能从压痕找回缺页线索；拓印残字还须与原件核对', '压痕显出“若我身故”四字，以及一个木箱的位置。', 'willImpression'),
      ]),
      r('徐莲承认自己藏起了木箱', '她害怕遗嘱把织坊交给工人，也害怕旁支夺产。她帮你不是因为正义，而是因为她不愿失去唯一的生计。', '/art/worlds/ghost-marriage/xu-lian.jpg', [
        o('ghost-investigate-q3-open', '和徐莲一起打开木箱', '她要求先看内容再决定公开', '三封信写明补发欠薪、拒绝阴婚，并允许徐莲继续担任账房。', 'willReadTogether'),
        o('ghost-investigate-q3-terms', '先约定任何内容都完整公开', '徐莲可能不再交出箱子', '她沉默很久，最终把钥匙放下：“那也包括我想保住的位置。”', 'fullDisclosurePact'),
        o('ghost-investigate-q3-copy', '趁她不注意拓下箱内信件', '留下信中文字，但绕过了徐莲决定是否公开的意愿', '你保住文字，却失去徐莲的信任。她带走原件去见族老。', 'secretWillCopy'),
      ]),
      r('天亮前，旁支带来已经盖印的婚书', '她们承认徐宁的信存在，却说只有成为丈夫的你补签，信才有效。徐莲问你愿不愿意用一次婚姻执行一份反对婚姻的遗愿。', '/art/worlds/ghost-marriage/madam-xu.jpg', [
        o('ghost-investigate-q4-temporary', '签下婚书，限定天亮后自动失效', '签名可能生效而失效条款不被接受；退出需另申请', '族老接受你的签名，不接受失效条款。婚书生效，附注被单独放到一边。', 'temporaryMarriage'),
        o('ghost-investigate-q4-request', '要求原件、退信理由与婚书同时出示', '听证要多核对一组材料，婚约仍未获你的同意', '族老让徐莲取来原件，将退信理由与盖印婚书并列。你看清签丈夫名可以取得什么，也看清遗愿明确拒绝这种身份。', 'documentsPresented'),
        o('ghost-investigate-q4-public', '让徐莲当众宣读完整遗嘱', '她也会公开自己的利益', '徐莲读到自己保留账房位置时没有停顿。工人第一次听见徐宁如何安排全部产业。', 'willReadPublic', { requiresTags: ['fullDisclosurePact'] }),
        o('ghost-investigate-q4-ledger', '用欠薪簿证明织坊早已负债于工人', '债权可以先于继承处理', '三十二份欠薪条排满供桌。婚书还没落笔，织坊已经不是一份干净的家产。', 'laborDebtFirst', { requiresTags: ['wagesConfirmed'] }),
      ]),
      r('继承听证开始，红线仍未系上', '族老给你最后一次落印机会。徐莲握着遗嘱原件，工人握着欠薪簿，母亲在门外等祖屋的结果。', '/art/worlds/ghost-marriage/ancestral-hall.jpg', [
        { ...o('ghost-investigate-q5-will', '提交遗嘱，拒绝补签婚书', '遗嘱可能因没有丈夫签名失效', '', 'willWithoutHusband'), endingId: 'ghost-end-will' },
        { ...o('ghost-investigate-q5-debt', '先登记工人债权，再处理两家债务', '听证将无法按家族内部事务结束', '', 'claimsRegistered'), endingId: 'ghost-end-account' },
      ]),
    ] },
    { id: 'refuse', openingChoice: o('ghost-q1-refuse', '推回婚书，接下祖屋钥匙', '徐家将在天亮收房', '母亲把钥匙放进你手心，没有劝你。徐家撤走婚礼酒席，却派人守住门口，防止顾家连夜转移财物。徐莲追出来，说婚约本来就不是徐宁的意思。', 'routeRefuse'), rounds: [
      r('全家只能带走三只箱子', '母亲要保留药材与祖先牌位，弟弟要带书，你还握着徐莲递来的缺页账册。', '/art/worlds/ghost-marriage/debt-becomes-marriage.jpg', [
        o('ghost-refuse-q2-family', '把箱子都留给家人', '让家人的物品先装箱；你的衣物可能留在旧屋，账册只能贴身带走', '你没有带自己的东西。母亲把那串祖屋钥匙又塞回你袖中。', 'familyPacked'),
        o('ghost-refuse-q2-ledger', '带走账册和借据副本', '它们可能证明交易发生在徐宁死后', '两份纸的日期相差七日。阴婚并非还债条件，而是旁支后来加上的交换。', 'fraudTimeline'),
        o('ghost-refuse-q2-stay', '拒绝搬走，等天亮正式交割', '等候正式交割，让一家人一起面对收房；守门人仍控制出入', '一家人坐在空院里等天亮。第一次，债务不再只由你私下解决。', 'publicEviction'),
      ]),
      r('徐莲带来徐宁退回的三封信', '信中拒绝阴婚，并安排织坊先补欠薪。徐莲愿意作证，但她也想保住账房职位。', '/art/worlds/ghost-marriage/xu-lian.jpg', [
        o('ghost-refuse-q3-alliance', '与徐莲共同提交信件', '她的利益也会被审查', '你们没有互称无私，只约定谁都不能抽走其中一封。', 'lianAlliance'),
        o('ghost-refuse-q3-copy', '留下副本，让徐莲自己决定', '留下可核对的文字；徐莲自己决定原件何时出现，你无法代她公开', '你把选择还给她，也失去控制证据何时出现。', 'willCopied'),
        o('ghost-refuse-q3-exchange', '用信件要求免除顾家债务', '尝试减轻家中债务，对方要求不再提徐宁的安排', '旁支答应减债一半，条件是你不在听证中提起徐宁的安排。', 'debtOffer'),
      ]),
      r('听证前，徐家把“自愿拒婚书”递给你', '签字后，祖屋交割被描述为你自愿选择；不签，守门人会按旧借据执行。', '/art/worlds/ghost-marriage/madam-xu.jpg', [
        o('ghost-refuse-q4-cross', '划掉“自愿”，写明婚姻附加条件', '把附加婚姻条件的时间写入交割争议；仍可能照旧交出祖屋', '你把两份日期并排写下。旁听者第一次看出债务如何被改写成婚姻。', 'coercionRecorded', { requiresTags: ['fraudTimeline'] }),
        o('ghost-refuse-q4-will', '让徐莲先宣读徐宁的信', '让拒婚与欠薪安排被听见；徐莲自己的职位利益也将公开', '徐莲读完整封信，也读出徐宁给她保留职位的安排。', 'refusalPublic', { requiresTags: ['lianAlliance'] }),
        o('ghost-refuse-q4-key', '交出钥匙，不签任何说明', '徐家会立即接收祖屋', '钥匙落在供桌上。族老无法得到一张证明你自愿的纸。', 'keyReturned'),
        o('ghost-refuse-q4-objection', '递交书面异议，请族老登记后再交钥匙', '房屋仍会交割，异议未必被采纳', '你写明拒婚不等于同意追加交易条件，族老收件但没有停止交割。钥匙交出，记录里多了一份尚未裁定的异议。', 'objectionFiled'),
      ]),
      r('祖屋门已经贴上徐家封条', '工人请你把账册带去外部商会立案；母亲则希望接受减债，至少保住一间住处。红线没有系上，代价仍在。', '/art/worlds/ghost-marriage/ancestral-hall.jpg', [
        { ...o('ghost-refuse-q5-cord', '公开拒婚与附加债务，接受失去祖屋', '今晚全家要另找住处', '', 'freedomCost'), endingId: 'ghost-end-cord' },
        { ...o('ghost-refuse-q5-ledger', '把账册交给工人和商会立案', '顾家债务不会因此自动消失', '', 'externalClaim'), endingId: 'ghost-end-workers' },
      ]),
    ] },
  ],
  endings: [
    end('ghost-end-husband', '徐宁的丈夫', '听证最后，你以丈夫名义在执行附页签字，徐宁的原信另存。欠薪补发，织坊保住；女工来问账，仍先向空牌位行礼。你翻开公文：“经丈夫顾言同意执行徐宁遗愿。”原信里那句拒绝阴婚，就压在附页下面。', '/art/worlds/ghost-marriage/madam-xu.jpg', { ...will, description: '徐宁来信及后来补签的执行附页；补发欠薪已执行，拒婚意愿却被丈夫身份覆盖。' }, '实现一个人的愿望，也可能违背她拒绝的身份。'),
    end('ghost-end-ledger', '供桌上的手印', '三十二名女工在欠薪册上按印，继承听证转成债务清算，织坊第一次没有单一主人。顾家药债恢复，你和母亲搬进租屋。她放好药包，问明日到哪里煎药；徐宁的牌位还留在正厅。', '/art/worlds/ghost-marriage/xu-lian.jpg', ledger, '制度改变以后，眼前的损失不会自动获得补偿。'),
    end('ghost-end-will', '没有丈夫签名的遗嘱', '族老判遗嘱无效。徐莲抱着原件走出宗祠，商会照着抄录，工人凭它追讨欠薪。你没有成为丈夫，也没救回祖屋。有人接过那页拒婚的文字，从头读到末尾，手边没有再摆一支等你补签的笔。', '/art/worlds/ghost-marriage/xu-lian.jpg', will, '无效的文件，也可能成为有效的证词。'),
    end('ghost-end-account', '先还给活着的人', '听证后，商会逐人核对三十二笔工人债权，女工各在确认账目旁按印，织坊暂缓继承。徐莲仍做账房，与你坐在同一桌前核债，你留一份账册副本。她点到下一笔时，先把顾言是否签过婚书的材料移到待办处，留待另行处理。', '/art/worlds/ghost-marriage/xu-lian.jpg', ledger, '把关系拆成可核对的权利，是否会失去关系中的照顾？'),
    end('ghost-end-cord', '剪断以后', '红线剪成两截，祖屋落锁。客栈里，母亲摊开剩下的药材，弟弟把书垫在漏雨处。债主在门外喊“顾言”，你应了一声。今夜你保住了自己的名字，母亲却还得换一张床睡。', '/art/worlds/ghost-marriage/debt-becomes-marriage.jpg', cord, '自由不是没有代价，而是代价不再被伪装成同意。'),
    end('ghost-end-workers', '被带出宗祠的账', '商会接下账册，逐人核对欠薪，三十二名女工各在确认的一栏按印、留副本。徐家封住祖屋，顾家仍欠债，徐莲也失去账房钥匙。一个月后，她与你在临时工坊铺开保存的第一页，认出熟悉的字：“从这一笔接着算。”', '/art/worlds/ghost-marriage/xu-lian.jpg', ledger, '公开账目的人，往往也会失去原本依靠的位置。'),
  ],
}))
