import { chapterMemory } from '../chapterMemory'
import type { EpisodeDefinition } from '../types'

export function withExamConsequences(episode: EpisodeDefinition): EpisodeDefinition {
  const { nodes, remember, replace } = chapterMemory(episode)
  const recordEnds = ['exam-end-exception', 'exam-end-rules']
  remember(['q3-record', 'q4-record'], 'authorshipRecorded', '魏瑾将供词压在榜样旁：“作者是你，冒名的也是你。公开时，两句同读。”')
  remember(['q3-record', 'q4-record'], 'shenWitness', '沈砚秋按住内档封口：“真名由你公布。我的证词只准留档，尚未准许张贴。”')
  remember(['q5-record', ...recordEnds], 'nameOnRoll', '门外有人照着榜单喊“林昭”。魏瑾指向那一笔：你的真名，已经有人记住了。')
  remember(['q5-record', ...recordEnds], 'nameSealed', '魏瑾翻出内档里的真名与指印，与公开落款逐一对照：“先前封存的，也留着。”')
  remember(['q5-record', ...recordEnds], 'confessionRead', '魏瑾已经当众读过供词，听众同时记下作者与罪名。撤下纸张也收不回听见的人名。')
  remember(['q5-record'], 'portraitAccepted', '画师送来你已经坐过的画像。魏瑾问是否随任命公布，你看见被改过的目光，知道官职连着这张脸。')
  remember(['q5-record'], 'portraitRefused', '魏瑾提醒你拒绝过画像。女帝仍把任职与公布宫装画像绑在一起：接受官职就须改变这项决定；若另贴规则，她不会撤去追责。')
  remember(['q5-record', ...recordEnds], 'essayPublished', '删节策论已经印出。沈砚秋留着原卷，提醒读者对照被删的那段；刊文没有让删改变成你的同意。')
  nodes['q5-record'].choices!.find((choice) => choice.id === 'exam-record-q5-office')!.grantsTags!.push('officeImageConditionAccepted')
  replace('exam-end-exception', 'portraitRefused', '榜首留下林昭真名，你的任命也已生效。画师仍奉命制作恩诏画像，卷宗却没有记下你后来是否同意坐像。魏瑾保留你此前的拒绝，落榜者仍追问为什么只有你能入朝。')
  replace('exam-end-exception', 'officeImageConditionAccepted', '榜首终于写着林昭，官职也生效了。你接受画像随任命公布，画师却一再让你低眉。落榜男人追问应试资格，官差指着画像：“林大人做得到，你为何做不到？”你听见自己的名字，正被拿去堵住另一个人。')
  remember(['exam-end-exception'], 'officeImageConditionAccepted', '魏瑾将落笔前说明的画像条件与任职答复另记一行；若先前拒绝过画像，这就是改变原先立场的日期，不能写成一直自愿。')
  remember(['exam-end-rules'], 'portraitRefused', '画师等你回座，你却走向榜后。魏瑾收起空着的坐像安排，拒绝画像那一行留在原处。')
  remember(['exam-end-rules'], 'portraitAccepted', '坐像已经画过。沈砚秋把它与后来被撕的规则分开存放：先前的顺从没有替你取消这次追责。')

  const patronEnds = ['exam-end-sealed', 'exam-end-cosigned']
  nodes['q5-patronage'].choices!.find((choice) => choice.id === 'exam-patronage-q5-seal')!.riskHint = '让三人获得入场机会，自己的名字不列入这张新榜'
  nodes['q5-patronage'].choices!.find((choice) => choice.id === 'exam-patronage-q5-joint')!.riskHint = '四人的署名与规则一同进入公开记录'
  remember(['q3-patronage', 'q5-patronage'], 'patronageAccepted', '沈砚秋翻着你替她起草的奏议：“无名书吏的安稳，我给过。若换另一种做法，我们得另谈。”')
  remember(['q3-patronage', 'q5-patronage'], 'secretCopy', '衣内副本磨着你的肋骨。沈砚秋仍保管原卷，问你：“若有人查抄件来路，由谁答？”')
  nodes['result-exam-patronage-q4-break'].body = '你从帘后走出来，向魏瑾报出作者真名。沈砚秋没有阻止，收起还没递出的荐举纸：“以后每次署名，都得由你自己回答。”'
  replace('result-exam-patronage-q4-break', 'privateContract', '你公开承认作者身份。沈砚秋把此前亲签的私人契约放到桌上：“写过的归属还在，我却不能再替你挡在帘前。”')
  remember(['q5-patronage', ...patronEnds], 'enteredAsClerk', '魏瑾写下赴宴身份“书吏”；沈砚秋另指作者一栏：“他斟过酒，也答过只有作者能答的问题。”')
  remember(['q5-patronage', ...patronEnds], 'questionsRelayed', '沈砚秋把代你问的三个问题与御前答复并排放好：“那日称赞只给了我。这一处，我来说明。”')
  remember(['q5-patronage', ...patronEnds], 'copyDelivered', '御前那份副本已经引来魏瑾查问。沈砚秋看着你：“越过我递进去的，就由你说清来路。”')
  remember(['q5-patronage', ...patronEnds], 'trustedShen', '沈砚秋递上三名推荐人选，又列出被她筛掉的人：“荐举是我定的，取舍也记在我名下。”')
  remember(['q5-patronage', 'exam-end-cosigned'], 'brokePatronage', '宫门外已经听见你承认作者。沈砚秋把幕府旧稿另存，今后的合作必须重谈，公开身份也收不回内档。')
  replace('exam-end-sealed', 'brokePatronage', '三名考生进了贡院，你没上新榜。原卷与真名封入内档，宫门外听见的作者身份却已传开。沈砚秋把幕府新约推来：“旧庇护到此为止。若还写，我们重谈。”')

  const outsideEnds = ['exam-end-outside-seats', 'exam-end-school']
  remember(['q3-outside', 'q4-outside'], 'anonymousPrint', '匿名印张仍在卖。老板听见官差查纸和印坊的脚步，低声道：“谁来问作者来处，先让我自己答。”')
  remember(['q3-outside', 'q4-outside'], 'namedPrint', '老板摸了摸藏好的刻板：“林昭二字刻下了。查着你，也就查着这间印坊。”')
  nodes['q4-outside'].body = '朝廷宣布开放三个男子名额，又把民间策论归功于沈砚秋主持教化。魏瑾愿意撤销对你的缉捕，条件是停止公开讲卷；同行者是否在撤诉范围内，须逐名核对。'
  nodes['q4-outside'].choices!.find((choice) => choice.id === 'exam-outside-q4-amnesty')!.riskHint = '撤销对你的缉捕；已署名同行者须另核对是否在免罪名单内'
  nodes['result-exam-outside-q4-amnesty'].body = '你接受撤诉条件，印坊撤下讲卷告示，暂停开门。老板问下一次来人时怎么答，你请他先说明课程已停。'
  remember(['q4-outside', 'result-exam-outside-q4-amnesty', ...outsideEnds], 'jointPetition', '四名署名者凑近免罪名单，另外三人站开。魏瑾点着四个名字：“停讲条件一经接受，本次一并免罪。”')
  remember(['q5-outside', ...outsideEnds], 'publicLesson', '老板留着那晚的题纸。有人已能讲明阅卷标准，另一个人仍来问：“若只买答案，收多少？”')
  nodes['q5-outside'].body = '恩科开门，三名男子有机会入场，其余人仍在门外。你拿着原卷，准备核对愿意加入名册的人；沉默者不代写，是否开门授课也要在今天重新决定。'
  remember(['q5-outside'], 'acceptedAmnesty', '门簿上还有你答应停讲的日期。老板握着门闩：“再开课就是反悔，魏瑾会按撤诉条件追究。今天开吗？”')
  remember(outsideEnds, 'acceptedAmnesty', '印坊曾依撤诉约定关门，那段停课写在门簿里，后来的决定没有让它消失。')
  remember(['result-exam-outside-q4-amnesty'], 'jointPetition', '停讲条件被接受后，魏瑾核准四名请愿者在本次撤诉中的免罪，不包括将来的新行动。')
  remember(['exam-end-school'], 'acceptedAmnesty', '你在关闭后重新开课，魏瑾以违反撤诉约定把你带走。老板重挂告示，也记下这是你改变主意的日期。')
  remember(['q5-outside', ...outsideEnds], 'rosterCreated', '老板沿名册逐个点名，听见本人同意公开才落笔；七位来客中，没答应的那几行仍空着。')
  remember(outsideEnds, 'lessonsContinue', '你此前没有接受停讲条件，贡院外的课一直被登记。老板保留每次讲题，官差也保留每次查问。')
  nodes['exam-end-school'].body = '原卷被雨打湿，仍钉在书院门上。官差带走你后，自愿留下的学员排好轮值，推开院门。又一人抱书问是否查籍贯，值班者让出一条路：“先来听。姓名愿意留下再写。”'
  nodes['exam-end-outside-seats'].body = '三名准备最充分的男子从贡院侧门入场，你停在门外，看着最后一个背影拐弯。考试仍由旧官员主持，你留下的备考标准还可供后来者使用。官差封了讲卷院门，等课的人走到你身边。'
  remember(outsideEnds, 'routeOutside', '离开前，你请愿意登记的学员逐人确认姓名与公开范围，把答应留下的名字订成书院名册；没有答复的人留空。')
  return { ...episode, nodes }
}
