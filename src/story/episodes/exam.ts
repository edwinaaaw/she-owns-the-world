import { buildAuthoredEpisode, type AuthoredOption, type AuthoredRound, type EndingDraft } from '../authoredEpisode'
import type { EndingRelic, RelicPattern } from '../types'
import { withExamConsequences } from './examConsequences'

const o = (id: string, label: string, hint: string, result: string, tag: string, extra: Partial<AuthoredOption> = {}): AuthoredOption => ({ id, label, hint, result, tag, ...extra })
const r = (title: string, body: string, art: string, options: AuthoredOption[]): AuthoredRound => ({ title, body, art, options })
const relic = (id: string, name: string, description: string, echo: string, pattern: RelicPattern): EndingRelic => ({ id, name, description, echo, pattern, useHint: ({ 'named-roll': '在医徒审判中，请书记员分列配方提出、核对与执行者。', 'sealed-page': '在医徒审判中，交出材料前取得带日期、书记员确认的副本。', 'school-roster': '在医徒审判中，让女药师复述步骤、纠正后登记，由她执行。' } as Record<string, string>)[id] })
const end = (id: string, title: string, body: string, art: string, item: EndingRelic, unresolvedEcho: string): EndingDraft => ({
  id, title, body, art, relic: item, unresolvedEcho,
  nextLifeTeaser: '另一片大陆上，一名男医徒也必须回答：知识究竟是谁教给他的。',
})

const namedRoll = relic('named-roll', '留有真名的文书 · 榜单', '定稿榜单留下林昭的真名与头名身份，也把他变成朝廷特许的例外。', '名字留下以后，谁会替它承担后果？', 'record')
const sealedPage = relic('sealed-page', '封存的原卷', '林昭的原卷与真名被一同封入内档，封存也限制了谁能查阅。', '秘密证据要到什么时候才算证据？', 'record')
const schoolRoster = relic('school-roster', '书院名册', '自愿留下的学员逐人登记，未同意公开的人不被代写。', '入口不被承认时，人还会不会走进去？', 'procedure')

export const exam = withExamConsequences(buildAuthoredEpisode({
  id: 'exam', number: 1, title: '男人不能参加科举', protagonist: '林昭', rule: '男人不得进入贡院',
  headline: ['你假扮成女人，', '考了第一名。'], hook: '发簪落下时，监察官已经走到门口。',
  feedArt: '/art/feed-exam.webp', feedAlt: '贡院中，一名男子的发簪落在头名试卷上',
  opening: '你叫林昭。大雍只许女人参加科举。你借用亡姐林照的籍贯和名字进入贡院，盼着有人读完策论，只问你这一句是怎么想的。放榜前，主考官沈砚秋让你留下复核；门外，监察官魏瑾正逐一验明身份。',
  openingArt: '/art/lin-anxious.webp',
  firstTitle: '木簪落在头名卷上',
  firstBody: '长发散下。沈砚秋看清了你的脸，魏瑾已经推开外门。现在做出的动作，将决定这篇文章以什么身份进入案卷。',
  firstArt: '/art/lin-anxious.webp',
  routes: [
    {
      id: 'record',
      openingChoice: o('exam-q1-record', '走到魏瑾面前，报出真名', '承认作者身份，也会暴露冒名入试', '魏瑾没有立刻叫卫士。她先把“林照”划掉，在旁边写下“自称林昭，男，冒名入试”。你和试卷一起被带进复核室。', 'routeRecord'),
      rounds: [
        r('魏瑾要你在供词上认下“窃取文章”', '她承认策论出自你的笔，却说男人依法不能成为作者。沈砚秋坐在另一侧，没有替你说话。', '/art/name-erased.jpg', [
          o('exam-record-q2-sign', '划掉“窃取”，只承认冒名', '留下作者身份，也签下冒名的供认', '魏瑾扣住纸角。供词上第一次同时出现你的罪名和作者身份。', 'authorshipRecorded'),
          o('exam-record-q2-witness', '请沈砚秋证明交卷过程', '她能证明文章出自你，但要求证词封入内档', '沈砚秋作证文章是你现场写成，也要求把这份证词封入内档。', 'shenWitness'),
          o('exam-record-q2-silence', '拒绝在供词上落笔', '暂不承认指控，作者身份也尚未得到澄清', '魏瑾留下空白供词，把你关到放榜以后。外面开始传言头名卷来历不明。', 'refusedStatement'),
        ]),
        r('放榜鼓响了，榜首仍写着林照', '窗外有人高声念出亡姐的名字。魏瑾允许你改动榜单一次，但改动本身会成为冒名的公开证据。', '/art/exam-hall.webp', [
          o('exam-record-q3-rewrite', '亲手把“照”改成“昭”', '让榜首署上真名，也让所有人看见你是男人', '你落下最后一笔。门外先是安静，随后有人问：榜上为什么会有男人的名字？', 'nameOnRoll'),
          o('exam-record-q3-seal', '保留榜名，把真名写进卷宗', '内档保留证据，公众看见的仍是亡姐的名字', '榜首仍属于亡姐，内档多出一页完整笔迹和你的指印。', 'nameSealed'),
          o('exam-record-q3-read', '让魏瑾当众宣读供词', '她必须连罪名与作者一起念', '魏瑾念到“策论确由林昭所作”时，贡院门外第一次听见了你的名字。', 'confessionRead', { requiresTags: ['authorshipRecorded'] }),
        ]),
        r('女帝要在午门前见“那个男头名”', '她愿意保留你的名次，条件是画像与恩诏同时公布。画像中的你必须低眉、着宫装，证明朝廷宽厚。', '/art/palace-mirror.jpg', [
          o('exam-record-q4-portrait', '坐到画师面前', '接受画像随恩诏公布；姿态与衣着须听从宫中安排', '画师让你抬起下巴，又嫌目光太直。你的名字留下了，脸却被改成朝廷需要的样子。', 'portraitAccepted'),
          o('exam-record-q4-script', '要求诏书同时刊出策论', '争取策论随恩诏刊出；原卷在魏瑾手中，刊载范围由女帝批准', '女帝准许刊文，却把最尖锐的一段删去。读者仍能看出那不是一篇谢恩文章。', 'essayPublished', { requiresTags: ['nameOnRoll'] }),
          o('exam-record-q4-refuse', '拒绝画像，只谈考试资格', '拒绝本次坐像；若最后接受附画像的任命，须改变这次答复', '女帝收起笑意：“你以为留下名字，就能决定别人如何看你？”', 'portraitRefused'),
        ]),
        r('榜单今晚必须定稿', '魏瑾把笔交给你。保住你的头名，可能只制造一个例外；重写规则，则可能让整张榜单作废。', '/art/three-seats.jpg', [
          { ...o('exam-record-q5-office', '保留头名，接受入朝任职', '获得自己的官职，并不等于其他男人也能应试', '', 'acceptedOffice'), endingId: 'exam-end-exception' },
          { ...o('exam-record-q5-rules', '在榜后附上公开阅卷标准', '公开你主张的阅卷标准；附文未经女帝批准，署名由你承担', '', 'publishedRules'), endingId: 'exam-end-rules' },
        ]),
      ],
    },
    {
      id: 'patronage',
      openingChoice: o('exam-q1-patronage', '请沈砚秋把你藏进内档室', '先避开验身，接下来须与沈砚秋商量庇护条件', '沈砚秋让你抱起废卷躲进内档室。她对魏瑾说，头名考生身体不适，身份稍后再验。门关上后，她问你愿意拿什么交换。', 'routePatronage'),
      rounds: [
        r('沈砚秋提出一个安全的名字', '头名继续写林照。你以“男书吏”身份进入她的幕府，替她起草奏议；没有人追究贡院里出现的男人。', '/art/name-erased.jpg', [
          o('exam-patronage-q2-accept', '接受书吏身份', '今晚可以脱身，文章却要以无名书吏的身份递上去', '沈砚秋烧掉验身单，保留原卷。你的文章开始进入朝堂，署名处一直空着。', 'patronageAccepted'),
          o('exam-patronage-q2-copy', '先誊一份原卷藏起来', '私留可核对的原卷副本；誊写须赶在来人前，抄件来路也可能被追查', '你在门闩外响起脚步前抄完最后一行，把副本缝进衣里。', 'secretCopy'),
          o('exam-patronage-q2-terms', '要求她写下师生契约', '私人契约不受大雍律保护', '沈砚秋写明文章归你、奏议共同署名。她提醒你：纸只能约束愿意认它的人。', 'privateContract'),
        ]),
        r('三个月后，你的奏议被女帝看中', '女帝只召见沈砚秋。她可以带一名漂亮男书吏赴宴，却不能带“策论作者”。', '/art/palace-mirror.jpg', [
          o('exam-patronage-q3-attend', '以书吏身份随她入宫', '可以随沈砚秋入宫；获准随行的身份是书吏，不能以作者名义赴宴', '宴席上，女帝让你斟酒，也随口问出了只有作者才能回答的问题。', 'enteredAsClerk'),
          o('exam-patronage-q3-question', '让沈砚秋转述你的三个问题', '她可以替你发问，也可以改写', '女帝逐条作答，却称赞沈砚秋“替男子想得周全”。', 'questionsRelayed'),
          o('exam-patronage-q3-copy', '把原卷副本送到御前', '把作者证据送到女帝面前，也暴露副本的来路', '副本越过沈砚秋到了女帝案头。第二天，魏瑾来到幕府查问它从哪里来。', 'copyDelivered', { requiresTags: ['secretCopy'] }),
        ]),
        r('女帝只愿开三个男子恩科名额', '她要沈砚秋推荐人选，并让你成为恩诏上的“受教男书吏”。沈砚秋第一次问：你是否愿意继续相信她。', '/art/three-seats.jpg', [
          o('exam-patronage-q4-trust', '把三个人选交给沈砚秋', '由她决定推荐谁，你不再逐一筛选', '她选了三名最不可能激怒朝臣的男人，也把你的名字写在推荐理由里。', 'trustedShen'),
          o('exam-patronage-q4-joint', '与她共同面见三名考生', '可直接听取三人的要求；你与沈砚秋须共同回答荐举条件', '三个人逐一问你：若她失势，我们的资格还算数吗？', 'metCandidates', { requiresTags: ['privateContract'] }),
          o('exam-patronage-q4-break', '公开承认自己就是作者', '直接说明作者真名；须亲自面对魏瑾查问，现有庇护也可能改变', '你从帘后走出来。沈砚秋没有阻止，只把那份私人契约放到桌上。', 'brokePatronage'),
        ]),
        r('第一张男子榜单由沈砚秋执笔', '她留出最后一行，让你决定写谁的名字。宫门将在一刻钟后关闭。', '/art/three-seats.jpg', [
          { ...o('exam-patronage-q5-seal', '写下三名考生，把自己留在内档', '让三人获得入场机会，自己的名字仍不公开', '', 'othersNamed'), endingId: 'exam-end-sealed' },
          { ...o('exam-patronage-q5-joint', '让四个人共同签署考试规则', '签名会暴露你的真实身份', '', 'jointRules'), endingId: 'exam-end-cosigned' },
        ]),
      ],
    },
    {
      id: 'outside',
      openingChoice: o('exam-q1-outside', '抓起试卷，从送卷窗翻出去', '保住原卷，离开后将无法正常参加身份复核', '你带走头名卷，从抄录巷落进雨水里。贡院立刻封门。天亮以前，你必须决定这张卷子交给谁。', 'routeOutside'),
      rounds: [
        r('印坊老板只敢印没有署名的策论', '魏瑾已经张贴缉查告示。若留下真名，印坊会成为藏匿你的证据。', '/art/exam-hall.webp', [
          o('exam-outside-q2-anon', '匿名印出全文', '让文章流传，暂不公开作者真名', '策论沿街售出，读者只知道它来自一个逃跑的男人。', 'anonymousPrint'),
          o('exam-outside-q2-name', '署上林昭真名', '让读者认出作者，也留下可追查的姓名', '第一张纸揭下时，老板把沾墨的刻板塞给你：“若有人问，字是你刻的。”', 'namedPrint'),
          o('exam-outside-q2-hand', '只手抄给另外七名男考生', '让七名男考生各留手抄本；传播交给他们，你难以控制去向', '七份手抄卷在不同街巷出现。官差无法再用烧掉一块印版让文章消失。', 'candidateNetwork'),
        ]),
        r('七名男考生找到印坊', '有人想用你的卷子逼朝廷重考，有人只想买下答案，还有人担心家人因窝藏罪被捕。', '/art/exam-hall.webp', [
          o('exam-outside-q3-school', '今晚就开一场公开讲卷', '让来客当场听懂阅卷标准；公开授课也会暴露你的所在', '你没有讲答案，只讲阅卷标准。听众第一次能判断一篇文章为什么被称为头名。', 'publicLesson'),
          o('exam-outside-q3-petition', '邀请七人自愿署名请愿', '每个人自行决定；署名者会进入缉查名单', '七个人争了很久，最终有四个人写下名字。', 'jointPetition'),
          o('exam-outside-q3-disperse', '让众人带着手抄本分散离开', '分散人和抄件，减少集中被搜到的风险；之后难以当面协调', '没有人被当场抓住。第二天，策论出现在三座城门上。', 'distributedCopies', { requiresTags: ['candidateNetwork'] }),
        ]),
        r('朝廷宣布开放三个男子名额', '告示称女帝早有此意，并把匿名策论说成沈砚秋主持的民间教化。魏瑾愿意撤销缉捕，条件是你停止授课。', '/art/three-seats.jpg', [
          o('exam-outside-q4-amnesty', '接受撤诉，关闭讲卷', '四名请愿者也会一并免罪', '印坊拆下门板。你保住了四个人，却把谁写过那篇策论重新交给朝廷解释。', 'acceptedAmnesty'),
          o('exam-outside-q4-roster', '公布所有自愿署名者', '名单只收愿意承担风险的人', '你逐个确认名字，没有替沉默的人作主。第一张书院名册由此形成。', 'rosterCreated', { requiresTags: ['jointPetition'] }),
          o('exam-outside-q4-continue', '继续公开讲解考试标准', '继续公开解释考试标准；在贡院外授课更容易被官差查问', '来听的人不再只问怎么考中，也开始问谁有权制定题目。', 'lessonsContinue'),
        ]),
        r('恩科开门那天，官差也来到书院', '三名考生可以进入贡院，其余人必须离开。你请自愿留下的学员逐人确认姓名，补成第一册名录；头名原卷仍在你手上。', '/art/exam-hall.webp', [
          { ...o('exam-outside-q5-seat', '把三个位置交给准备最充分的人', '按备考表现分配三个名额；你与其余人仍留在贡院外', '', 'usedSeats'), endingId: 'exam-end-outside-seats' },
          { ...o('exam-outside-q5-school', '把原卷钉在门上，继续开课', '让后来的学员继续有课可听；开门者与署名者可能被追究', '', 'keptSchool'), endingId: 'exam-end-school' },
        ]),
      ],
    },
  ],
  endings: [
    end('exam-end-exception', '榜首的那一个男人', '三名男子的名字贴出时，女帝握着你的手让画师记录。落榜者追问标准，官差指着画中的你：“林大人做得到，你为何做不到？”你看见榜首终于是自己的名字，也看见它被用来堵住别人的嘴。', '/art/exception-ending.jpg', namedRoll, '名字被承认了，规则仍然只承认一个人。'),
    end('exam-end-rules', '贴在榜单背面的规则', '你在阅卷标准末尾签下林昭真名。魏瑾命人撕榜，围观者已连同署名抄走背面的标准。沈砚秋被调离。你被押上车时，一个落榜男人举着抄纸问：“明年还按这个考吗？”车门关上，那只手还举着。', '/art/archive-ending.jpg', { ...namedRoll, name: '留有真名的文书 · 署名规则', description: '榜后阅卷标准的抄件，末尾保留林昭亲笔署名。' }, '写下规则的人未必能留下来，规则却可能比人走得更远。'),
    end('exam-end-sealed', '没有出现在榜上的作者', '三名考生走进贡院。沈砚秋将你的原卷与真名封入内档，钥匙交给魏瑾。你留在幕府写作；有人凭你写下的标准中榜，托人来问该向谁道谢。沈砚秋看向你，等你决定怎样答。', '/art/archive-ending.jpg', sealedPage, '被保护起来的真相，也可能只是被安全地遗忘。'),
    end('exam-end-cosigned', '四个名字', '四个男人在规则末尾签名，沈砚秋也签了，你收好完整抄件。恩科随即暂停，五人接受调查。半年后，另一座城递来同样的规则，末尾已有二十三个名字。你把新旧两页铺在桌上，逐个读完。', '/art/three-seats.jpg', { ...namedRoll, name: '留有真名的文书 · 联署规则', description: '林昭、三名考生与沈砚秋共同签署的规则抄件。' }, '共同署名让责任无法只落在一个人身上。'),
    end('exam-end-outside-seats', '从侧门进去的人', '三名书院学生从贡院侧门入场，你没有进去。考试仍由旧官员主持，但每个考生都带着你们公开制定的模拟卷。官差封了书院，门外还排着下一批等课的人。', '/art/exam-hall.webp', schoolRoster, '得到入口的人，会不会回头替后来者守门？'),
    end('exam-end-school', '没有功名的书院', '原卷被雨打湿，仍钉在书院门上。官差带走你以后，七名学生轮流来开门。第八个人抱着偷抄的书问：“这里真的不查籍贯吗？”有人把他的名字写进新的一页。', '/art/exam-hall.webp', schoolRoster, '一扇不合法的门，可能比三个合法名额更长久。'),
  ],
}))
