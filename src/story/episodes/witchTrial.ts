import { buildAuthoredEpisode, type AuthoredOption, type AuthoredRound, type EndingDraft } from '../authoredEpisode'
import type { EndingRelic, RelicPattern } from '../types'
import { withWitchTrialConsequences } from './witchTrialConsequences'

const o = (id: string, label: string, hint: string, result: string, tag: string, extra: Partial<AuthoredOption> = {}): AuthoredOption => ({ id, label, hint, result, tag, ...extra })
const r = (title: string, body: string, art: string, options: AuthoredOption[]): AuthoredRound => ({ title, body, art, options })
const relic = (id: string, name: string, description: string, echo: string, pattern: RelicPattern): EndingRelic => ({ id, name, description, echo, pattern, useHint: ({ 'signed-prescription': '在纺机试机前，分别记录设计、出资与操作责任，供后续调查。', 'anonymous-dose': '为本机留下可核对的操作与停机说明，监督受训者接手。', 'prison-thread': '交出故障材料前，让不同当事人各留副本，保住调查依据。' } as Record<string, string>)[id] })
const end = (id: string, title: string, body: string, art: string, item: EndingRelic, unresolvedEcho: string): EndingDraft => ({
  id, title, body, art, relic: item, unresolvedEcho,
  nextLifeTeaser: '九十年后，一名男纺工造出一台机器。图纸上同样不能写他的名字。',
})

const signedPrescription = relic('signed-prescription', '共同署名的诊疗记录', '亲历者分别签明自己核对的诊疗事实，没有替未在场者作证。', '共同署名，也意味着共同受罚。', 'people')
const anonymousDose = relic('anonymous-dose', '无名剂量副本', '它没有作者，只有剂量、时刻和孩子退烧后的体温。', '方法被留下时，谁会记得付出代价的人？', 'record')
const prisonThread = relic('prison-thread', '从牢中传出的病例册', '玛塔把证词与病例缝成薄册，从送饭口逐页递出。', '一个人的证词如何变成许多人能使用的程序？', 'procedure')

export const witchTrial = withWitchTrialConsequences(buildAuthoredEpisode({
  id: 'witch-trial', number: 2, title: '男人行医会被当作巫术', protagonist: '伊莱亚斯', rule: '男人不得受训行医或配药',
  headline: ['你救过她的命，', '今天她要审判你。'], hook: '第七声钟响之前，你必须证明那不是巫术。',
  feedArt: '/art/worlds/witch-trial.jpg', feedAlt: '男医徒在审判庭面对曾被他治疗的女审判官',
  opening: '你叫伊莱亚斯，是药师玛塔秘密教了六年的男学徒。昨夜，面包师莉维娅明知你没有行医资格，仍让你把药箱放在她家：“先救孩子。”她的儿子约纳斯高烧不退，你原想今晨配好药，坐在床边等他自己喝下一口水。天亮前药箱被搜出，你被带进审判厅；玛塔扣在侧室，尚未入狱。东翼药房每隔一刻钟敲一次钟，孩子等不到第八声。主审海伦娜左腕戴着手套——去年冬天，你和玛塔曾替她切开感染的伤口。',
  openingArt: '/art/worlds/witch-trial/elias.jpg',
  firstTitle: '海伦娜问：是谁教你配药？',
  firstBody: '书记员已经蘸好墨。你的回答会决定玛塔是证人、共同被告，还是与你毫无关系的人。侧室的门就在审判席后面。',
  firstArt: '/art/worlds/witch-trial/tribunal-hall.jpg',
  routes: [
    {
      id: 'teacher',
      openingChoice: o('witch-q1-teacher', '说出玛塔的名字', '她能证明你的师承，也会因教导男徒受到追究', '侧室门打开。玛塔没有否认，只对你说：“既然写了我的名字，就别让她们只写一半。”她被列为共同嫌疑人，仍留在庭内。', 'routeTeacher'),
      rounds: [
        r('玛塔可以作证，但证词会决定她的罪名', '海伦娜只允许你们提出一次公开行动。东翼传来第五声钟，药房学徒说约纳斯已经开始发冷。', '/art/worlds/witch-trial/marta.jpg', [
          o('witch-teacher-q2-testify', '请玛塔完整陈述六年师承', '补全学习经历，也留下玛塔长期授课的证据', '玛塔讲出第一堂课、第一名病人和每次改过的剂量。书记员不得不把“长期教导男徒”写入她的罪名。', 'fullTestimony'),
          o('witch-teacher-q2-dose', '请她口述约纳斯需要的剂量', '药师可立即送药，玛塔也会被指控停医期间继续指导', '玛塔一边口述，你一边校正。女药师带着剂量跑向东翼，玛塔因停医期间继续指导被守卫铐住。', 'doseSent'),
          o('witch-teacher-q2-sign', '请她在处方下与你共同签名', '共同留下处方署名，也共同承担这张处方的指控', '两个人的名字第一次出现在同一张药方上。海伦娜命人扣下处方，也把玛塔移到被告席。', 'jointSignature'),
        ]),
        r('海伦娜摘下左手手套', '十字形伤疤与你记得的去年冬天那道切口完全一致。它能证明你们救过她，也会把一名病人的隐私变成公开证据。第六声钟从东翼传来。', '/art/worlds/witch-trial/helena.jpg', [
          o('witch-teacher-q3-public', '请玛塔说出伤口与日期', '用真实治疗经历作证，也公开海伦娜的病史', '玛塔说出脓肿的位置，你补上当时修改的剂量。海伦娜无法否认这段治疗。', 'scarPublic'),
          o('witch-teacher-q3-private', '只请海伦娜私下核对处方', '保留病人隐私，但公开卷宗不会留下她的身份', '海伦娜在屏风后看完处方，承认字迹真实，却拒绝让书记员记录病人身份。', 'scarPrivate'),
          o('witch-teacher-q3-refuse', '不使用她的病史', '守住治疗秘密，同时放弃这项可用的证据', '你说治疗秘密不该因病人成为法官而失效。海伦娜把手套重新戴好。', 'medicalPrivacy'),
        ]),
        r('第七声钟响，药箱仍锁在证物柜', '约纳斯开始抽搐。门口的女药师能执行处方，但她需要完整剂量；玛塔被铐在被告席，不能离开。', '/art/worlds/witch-trial/prove-medicine.jpg', [
          o('witch-teacher-q4-copy', '让女药师带走一份剂量副本', '她可以在第八声前赶到东翼', '副本离开审判厅。第八声没有响，女药师回来时说孩子已经退烧。', 'childSaved'),
          o('witch-teacher-q4-joint', '要求先把共同签名抄进药房簿', '抄写会占去最后几分钟', '书记员抄完两个名字，女药师抱着处方冲出门。钟锤已经抬起，她在落下前推开东翼的门。', 'savedWithNames', { requiresTags: ['jointSignature'] }),
          o('witch-teacher-q4-oral', '由你口述，玛塔逐项复核', '可以送出剂量，药房未必留下你们的署名', '女药师复述一遍剂量才离开。孩子得救，药房簿只写了执行者的名字。', 'savedOrally'),
        ]),
        r('孩子退烧后，审判才真正开始', '海伦娜提出交换：撤销你的巫术罪，玛塔承认违规并永久停医。你们只能提交一份最终陈述。', '/art/worlds/witch-trial/tribunal-hall.jpg', [
          { ...o('witch-teacher-q5-share', '与玛塔提交共同陈述', '保留共同陈述；你与玛塔都继续面对指控，不接受单独赦免', '', 'sharedVerdict'), endingId: 'witch-end-joint' },
          { ...o('witch-teacher-q5-preserve', '让玛塔先把完整师承送出庭外', '先让完整师承留到庭外；藏副本的学徒也要冒被发现的风险', '', 'testimonyEscaped'), endingId: 'witch-end-thread' },
        ]),
      ],
    },
    {
      id: 'research',
      openingChoice: o('witch-q1-research', '声称配方由你独自研究', '暂不牵出老师，由你独自证明配方来历', '玛塔没有被带出来。海伦娜把药箱放上证物桌：“那就由你一个人证明，每一味药为何在这里。”', 'routeResearch'),
      rounds: [
        r('海伦娜让你当庭重写配方', '写错一处就是巫术证据。东翼传来第五声钟，药房学徒说孩子的呼吸正在变浅。', '/art/worlds/witch-trial/hidden-herb-book.jpg', [
          o('witch-research-q2-memory', '凭记忆重写全部剂量', '留下本轮书面副本，也会被逐项查验；送药仍需另行安排', '你写出的比例与原稿一致，书记员留下了一份庭审副本。', 'doseRewritten'),
          o('witch-research-q2-method', '先解释判断剂量的方法', '向旁听者说明计算方法；这还不是可供送药的完整剂量副本', '你让旁听者看见剂量来自体重、脉搏和反应，而不是一句神秘口诀。', 'methodExplained'),
          o('witch-research-q2-refuse', '拒绝在孩子病危时接受考试', '坚持先救人，法庭也会记录你拒绝证明', '你把笔推回去，要求先送药。海伦娜命书记员记下“拒绝证明”。', 'testRefused'),
        ]),
        r('旧诊疗记录里出现一名无名病人', '书记员取出证物袋里的旧诊疗记录，其中十字切口与海伦娜腕上的伤疤一致。承认这名病人，就能证明你的方法曾经有效。第六声钟响了。', '/art/worlds/witch-trial/helena.jpg', [
          o('witch-research-q3-chain', '把副本、伤疤和日期并列核对', '可对照副本、伤疤与日期；也会让海伦娜的既往治疗成为公开证据', '时间与剂量完全吻合。海伦娜承认接受过治疗，却说她当时只认可玛塔。', 'evidenceChain', { requiresTags: ['doseRewritten'] }),
          o('witch-research-q3-anon', '只公开匿名病例的剂量', '病人身份不会进入卷宗', '你证明方法可复核，没有说出伤疤属于谁。旁听女医师开始抄写。', 'anonymousEvidence'),
          o('witch-research-q3-license', '私下用旧处方换研究许可', '争取个人许可，条件是旧处方不再公开', '海伦娜答应承认你是唯一合法的男研究者，条件是原稿不再公开。', 'privateLicense'),
        ]),
        r('第七声钟响，教会药典的剂量是错的', '门口女药师准备照药典配药。你的庭审副本能纠正她，但交出去以后，教会也能把它改写成自己的发现。', '/art/worlds/witch-trial/prove-medicine.jpg', [
          o('witch-research-q4-release', '把正确剂量交给女药师', '她正等在东翼门口', '女药师改掉剂量。第八声没有响，约纳斯的呼吸慢慢平稳。', 'doseReleased'),
          o('witch-research-q4-verify', '口述正确剂量，让女药师复述后立刻送药', '先确认她听清每项剂量，不等待许可落印', '你逐项报出剂量，女药师复述无误后跑向东翼。第八声没有响，孩子的呼吸平稳下来。', 'doseOrallyVerified'),
          o('witch-research-q4-copy', '让三名旁听者分别抄一份再送药', '多留几份可核对的证据，送药前需先完成抄写', '三份副本同时离开。孩子得救，教会无法再收回全部版本。', 'copiesReleased', { requiresTags: ['anonymousEvidence'] }),
          o('witch-research-q4-license', '要求许可落印后再交出剂量', '先取得许可，但孩子的救治会继续等待', '印章落下时，第八声同时响起。女药师最终稳住了约纳斯，他却因延误再也无法灵活使用左手。', 'licenseBeforePatient', { requiresTags: ['privateLicense'] }),
        ]),
        r('海伦娜要决定药典如何改写', '她可以承认一名特殊男研究者，也可以无名收录剂量。若孩子死去，药典仍会改版，只是没有人再能把它叫作救命。', '/art/worlds/witch-trial/hidden-herb-book.jpg', [
          { ...o('witch-research-q5-credit', '公开庭审副本与时间记录', '任何人都能核对谁先写下剂量', '', 'creditPublished'), endingId: 'witch-end-record' },
          { ...o('witch-research-q5-open', '放弃署名，要求公开计算方法', '方法会进入下一版药典', '', 'methodOpened'), endingId: 'witch-end-anonymous' },
        ]),
      ],
    },
    {
      id: 'patient',
      openingChoice: o('witch-q1-patient', '拒绝回答老师是谁，先说约纳斯在等药', '先争取救治孩子，求药的母亲也会被传到庭上', '你说出孩子的症状和最后一次测温。海伦娜命人把母亲莉维娅带到庭上，玛塔仍扣在侧室。', 'routePatient'),
      rounds: [
        r('莉维娅承认药箱藏在她家', '她若说是你指使，会被视为受骗；若承认主动求药，就会以协助巫术受审。第五声钟从东翼传来。', '/art/worlds/witch-trial/confession.jpg', [
          o('witch-patient-q2-blame', '请她说是你隐瞒了药箱来历', '帮助她摆脱知情协助的指控，责任由你承担', '莉维娅照做了。她被移出被告栏，却不敢再替药效作证。', 'motherProtected'),
          o('witch-patient-q2-truth', '请她说出求药的全过程', '说明她为何主动求药，也承认她知情相助', '莉维娅讲出孩子如何连续三夜高烧，也说出合法药房两次拒绝接诊。', 'motherTestified'),
          o('witch-patient-q2-receipt', '只提交合法药房的拒诊收据', '先用书面记录证明拒诊，不请她陈述藏药经过', '书记员核对收据。审判第一次不得不回答：若你的药违法，合法药房为何让孩子等死？', 'refusalReceipt'),
        ]),
        r('海伦娜的伤疤让莉维娅认出了她', '去年冬天，莉维娅曾在玛塔诊室外等候，看见海伦娜遮着同一只手离开。第六声钟响了。', '/art/worlds/witch-trial/helena.jpg', [
          o('witch-patient-q3-witness', '请莉维娅描述那天看见的事', '让她证明求诊经过，也公开海伦娜曾来诊室', '莉维娅说出日期、马车和沾血的绷带。海伦娜无法否认自己曾秘密求助。', 'motherWitnessed'),
          o('witch-patient-q3-boundary', '阻止她公开海伦娜的病史', '不公开病人的秘密，也不再追问这项证据', '你把问题拉回莉维娅已经陈述的求诊经过。海伦娜看了你很久，没有摘下手套。', 'privacyKept'),
          o('witch-patient-q3-marta', '要求玛塔出庭核对伤疤', '她会从证人变成共同被告', '侧室门打开。玛塔确认伤口，也确认是你调整了剂量。两个名字同时进入卷宗。', 'martaJoined'),
        ]),
        r('第七声钟响，莉维娅只能带一件东西回东翼', '药箱、处方与已登记的求诊陈述在证物桌上。女药师会在门口接应她，但没有时间往返；是否另有拒诊收据，要看此前实际提交了什么。', '/art/worlds/witch-trial/prove-medicine.jpg', [
          o('witch-patient-q4-box', '让她带走药箱和口述剂量', '先让孩子用上药，带走药箱不会撤销她的指控', '莉维娅抱着药箱跑回东翼。约纳斯得救，药箱来源仍是她案卷里的罪证。', 'boxReturned'),
          o('witch-patient-q4-record', '让她带处方副本与拒诊收据', '女药师可据副本配药，收据可说明拒诊；两份材料会进入病房记录', '处方救下孩子，收据则证明他为何拖到病危。两张纸一起进入病房记录。', 'careRecord', { requiresTags: ['refusalReceipt'] }),
          o('witch-patient-q4-witness', '让女药师在庭内复述剂量后去救人', '药师去救孩子，莉维娅留下继续面对审问', '女药师复述无误后冲向东翼。莉维娅留在被告栏，听见第八声钟没有响。', 'externalExecutor'),
        ]),
        r('海伦娜愿意释放一个人', '孩子已经退烧。她给出最后条件：莉维娅否认主动求药，或者玛塔否认教过你。两项都不接受，案件将公开续审。', '/art/worlds/witch-trial/confession.jpg', [
          { ...o('witch-patient-q5-hearing', '拒绝交换，要求公开续审', '莉维娅和玛塔都要继续承担风险', '', 'publicHearing'), endingId: 'witch-end-hearing' },
          { ...o('witch-patient-q5-network', '先把病例与剂量交给城中家庭', '让病例与剂量传到家庭手中；材料会继续外传，庭上的指控仍在', '', 'householdNetwork'), endingId: 'witch-end-households' },
        ]),
      ],
    },
  ],
  endings: [
    end('witch-end-joint', '同一份判决里的两个人', '伊莱亚斯因无证行医获罪，玛塔被吊销执照，两人监禁三个月。出狱那天，莉维娅拿着药房簿抄件等在门外：“约纳斯活下来了。我想把另外两个名字补上。”玛塔接过纸，你们逐项核对，各签自己负责的诊疗经过。她的执照没有还回来，纸上终于放得下你们做过的事。', '/art/worlds/witch-trial/marta.jpg', signedPrescription, '两个名字被一起写下，也一起承受了制度的惩罚。'),
    end('witch-end-thread', '从牢门缝递出的师承', '玛塔被判一年监禁。她拆下衣角的线，把六年病例和证词缝成薄册，从送饭口逐页递出。你离城前把最后一页交给莉维娅；她先看剂量，才抚平牢门夹出的折痕。玛塔还在里面，六年所教已到了门外。', '/art/worlds/witch-trial/marta.jpg', prisonThread, '人被关住以后，知识是否还属于审判者？'),
    end('witch-end-record', '早于药典的那一页', '你在最终陈述上重写并签下剂量与诊疗时序；书记员对照扣押原稿，标出去年的病例。副本贴到新药典旁，你仍因无证行医获罪。玛塔来核对自己参与的诊疗，只在那些地方补签：“这几次，我们一起做的。”你的独立研究声明停在她没有签的那一栏。', '/art/worlds/witch-trial/hidden-herb-book.jpg', signedPrescription, '证明谁先发现，并不等于让后来的人都能使用。'),
    end('witch-end-anonymous', '没有作者的正确剂量', '新版药典改正了剂量，城中诊所开始使用同一套计算方法，书上没有伊莱亚斯或玛塔。约纳斯活了下来。你另抄一页，记下实际给药时刻与治疗反应；多年后，有人问方法从哪里来，药师翻着新版药典，只答：“一直如此。”', '/art/worlds/witch-trial/prove-medicine.jpg', anonymousDose, '救人的方法流传下去，救人的人却再次消失。'),
    end('witch-end-hearing', '第八声没有响', '公开续审持续七天。莉维娅失去面包铺，玛塔被停医，你仍等待判决。莉维娅与你、负责送药的女药师核对求诊、给药和退烧时刻，各签亲历部分。约纳斯每天坐在旁听席第一排；钟一响，你们便回头。他还坐在那里。', '/art/worlds/witch-trial/tribunal-hall.jpg', { ...signedPrescription, description: '伊莱亚斯、莉维娅与执行处方的女药师分别签下亲历的诊疗经过。' }, '活下来的人，也会成为一段证词。'),
    end('witch-end-households', '在厨房之间传递的剂量', '教会封存药箱时，剂量已被抄进十七本家庭账簿。你留下一份匿名副本，写清本次给药时刻、孩子反应，以及新病人须由医师重新判断。莉维娅还要受审，玛塔未恢复执照；厨房里有人翻到账簿这一页，指给来诊的医师看。', '/art/worlds/witch-trial/confession.jpg', anonymousDose, '分散保存让知识活下来，也让责任更难追索。'),
  ],
}))
