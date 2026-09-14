import { chapterMemory } from '../chapterMemory'
import type { EpisodeDefinition } from '../types'

export function withWitchTrialConsequences(episode: EpisodeDefinition): EpisodeDefinition {
  const { nodes, remember, replace } = chapterMemory(episode)
  const teacherEnds = ['witch-end-joint', 'witch-end-thread']
  const doseCopy = nodes['q4-teacher'].choices!.find((choice) => choice.id === 'witch-teacher-q4-copy')!
  doseCopy.label = '把剂量副本交药房，核对执行时刻'
  doseCopy.riskHint = '尚未送药就立刻执行；已送药则补记，不重复给药'
  nodes['q4-teacher'].choices!.find((choice) => choice.id === 'witch-teacher-q4-oral')!.riskHint = '口述并核对本次剂量；若已经送出，只补记执行过程'
  remember(['q3-teacher', 'q5-teacher', ...teacherEnds], 'fullTestimony', '玛塔指着已入卷的六年师承：“第一堂课到最后一次改量，都在这里。判我违规，也把我教过什么念完。”')
  replace('q4-teacher', 'doseSent', '第五声钟后，女药师已将完整剂量送往东翼，学徒带回给药时刻，退热反应还在观察。玛塔举了举手铐：“我留在这里核对。带副本也好，口述也好，只补这次的记录，别再给药。”')
  replace('result-witch-teacher-q4-copy', 'doseSent', '你把剂量副本交给药房学徒带去核对已执行的处方，不再追加给药。女药师将先前给药时刻和随后退烧的体温写回纸上；第八声没有响。')
  replace('result-witch-teacher-q4-oral', 'doseSent', '你口述先前已送出的剂量，玛塔逐项复核；学徒与东翼女药师核对给药记录，不再追加剂量。退烧的消息传回，药房仍只登记执行者，口述者与复核者留在庭审笔录。')
  remember(['q3-teacher', 'q5-teacher', ...teacherEnds], 'doseSent', '玛塔听见又有人叫送药，立刻抬头：“第五声后已送过完整剂量。这次核对给药时刻，别给两遍。”')
  remember(['q5-teacher', ...teacherEnds], 'scarPublic', '海伦娜按住已公开的伤口与日期：“这些进笔录。其他病史，到此为止。”玛塔收回病例，未再抄写。')
  remember(['q5-teacher', ...teacherEnds], 'scarPrivate', '海伦娜将屏风后核对的处方交书记员：“身份封存，只准按限制查阅。”玛塔看着封口落下。')
  remember(['q5-teacher', ...teacherEnds], 'medicalPrivacy', '玛塔合上海伦娜的病历，另指其他诊疗线索：“她的病史，你已经决定不用。”')
  remember(teacherEnds, 'childSaved', '女药师在剂量纸旁签下给药与观察，推回配方来源那栏：“这一处，请你和玛塔各自写。”')
  remember(teacherEnds, 'savedOrally', '药房依据口述剂量处置，女药师确认执行，玛塔确认复核。署名被遗漏的争议有了各人负责的部分。')
  remember(teacherEnds, 'savedWithNames', '玛塔摸过药房簿上的两个名字，又指向送药时刻：“名字留下了，孩子多等的几分钟也写上。”')

  const researchEnds = ['witch-end-record', 'witch-end-anonymous']
  remember(['q3-research', 'q5-research'], 'doseRewritten', '书记员在新抄剂量上写下今日时刻，旧病例另放一边；你看着那一笔落完，伸手要他核对。')
  remember(['q3-research', 'q5-research'], 'methodExplained', '旁听女医师追问你刚才讲的体重、脉搏与反应：“完整剂量呢？”你面前尚无本轮抄件，要公布就得补写今日这一份。')
  nodes['q4-research'].body = '女药师在庭门口等你核对本次剂量，药典上的比例有误。已有文字可以申请核对；若没有完整抄件，现在须口述或补写正确剂量。她核对后才能去东翼执行。'
  remember(['q4-research'], 'doseRewritten', '你本轮重写的庭审副本留在书记员手里，可以据它逐项核对；交出后仍须说明来源。')
  remember(['q4-research'], 'methodExplained', '你此前只解释方法，没有重写本轮完整副本。别把那段说明指作一张现成的处方。')
  nodes['q4-research'].choices!.find((choice) => choice.id === 'witch-research-q4-release')!.riskHint = '女药师在庭门口等候，核对后立刻去东翼'
  nodes['result-witch-research-q4-release'].body = '你逐项交代正确剂量，女药师核对并改正药典比例，立即赶往东翼。第八声没有响，约纳斯的呼吸慢慢平稳。'
  nodes['q5-research'].body = '约纳斯活了下来。海伦娜把改版药典与最终陈述放在一起，你要决定是否署名，也要把实际送药时刻与治疗反应留下；许可不替代诊疗结果。'
  remember(['q5-research'], 'privateLicense', '海伦娜压住原稿：“个人研究许可换不公开，你答应过。如今要公开副本或方法，就在笔录里改答复；行医资格并不随这枚印章给你。”')
  remember(['witch-end-record'], 'privateLicense', '海伦娜把你公开署名材料的决定记为改变私下交换，要求复审个人许可。你交出已经公开的版本编号，没有再答应收回；许可争议与无证行医判决分别留档。')
  remember(['witch-end-anonymous'], 'privateLicense', '海伦娜接受无名收录，却仍扣着不准公开的原稿。私下研究许可没有成为普遍行医资格；你留下药典之外的实际诊疗记录，许可的范围仍由教会限制。')
  remember(['q5-research', ...researchEnds], 'anonymousEvidence', '女医师把患者姓名那格空着，接着抄匿名病例的剂量：“这里怎么算？再说一遍。”')
  remember(['q5-research', ...researchEnds], 'evidenceChain', '书记员把副本、伤疤与日期的对应关系列明，海伦娜承认的是既往治疗，不是你独自研究的师承主张。')
  remember(['q5-research', ...researchEnds], 'licenseBeforePatient', '莉维娅把许可落印时刻挨着第八声钟：“孩子活了，左手却因等这枚印章失去灵活。药典里把延误与左手损伤也写上。”')
  remember(researchEnds, 'doseReleased', '女药师核对正确剂量后立刻送药，莉维娅在实际给药时刻旁确认孩子的反应。公开作者与否没有改写这一次及时处置。')
  remember(researchEnds, 'doseOrallyVerified', '女药师复述正确后立即执行；记录分开列出你的口述与她的复核，没有补造送出前的书面副本。')
  remember(researchEnds, 'copiesReleased', '三名旁听者保存抄件，抄写用时也进入记录。不同持有人能核对版本，不能替女药师证明未亲见的治疗。')

  const patientEnds = ['witch-end-hearing', 'witch-end-households']
  remember(['q3-patient', 'q4-patient', 'q5-patient'], 'motherProtected', '莉维娅看着被划掉的被告栏：“你替我担了隐瞒来历。还要我作证，就先说清问哪件事。”她握紧双手，等法庭再追问她知情多少。')
  remember(['q3-patient', 'q5-patient', ...patientEnds], 'motherTestified', '莉维娅指着自己的供词：“三夜求药，两次拒诊，我都说了。孩子之外的风险，先问我。”')
  remember(['result-witch-patient-q3-witness'], 'motherProtected', '莉维娅先看了看被划掉的被告栏：“你才替我担了隐瞒来历的责任，现在又要我说明知道多少。”她只陈述诊室外亲眼看见的事，书记员另记这次证词范围。')
  nodes['result-witch-patient-q3-boundary'].body = '你阻止追问海伦娜的病史，把问题拉回本次孩子等药与已经登记的求诊材料。海伦娜没有摘下手套。'
  nodes['result-witch-patient-q4-witness'].body = '女药师复述剂量无误，冲向东翼。莉维娅留在庭内答问，直到确认第八声没有响，才松开攥白的指节；书记员仍沿用她先前供述对应的身份栏。'
  replace('result-witch-patient-q4-box', 'motherProtected', '莉维娅抱药箱跑向东翼，把口述剂量交给门口女药师核对执行，约纳斯得救。她此前已被移出被告栏；这次明知药箱遭扣仍带走的行为被另记，海伦娜准备据此重新追究，尚不是判罪。')
  nodes['q5-patient'].body = '孩子退烧的消息传来，海伦娜又推来口供：求药者否认知情，或在本轮确有玛塔出庭核对时，让她否认授课，换取释放。莉维娅望着纸，没有立刻伸手；拒绝交换，案件就公开续审。'
  remember(['q5-patient', ...patientEnds], 'motherProtected', '海伦娜重新调查最初藏药时莉维娅是否知情，质疑先前隐瞒来历的口供，尚未取得新的知情证据。莉维娅指着移出被告栏的记录：“新指控请另写理由，别说我从头就认了。”', 'boxReturned')
  remember(['q5-patient', ...patientEnds], 'boxReturned', '海伦娜把这次明知药箱被扣仍带走的行为另列调查理由，不能因此倒写莉维娅先前已经承认知情。莉维娅要求保留两次行为的日期。')
  remember(['q5-patient', ...patientEnds], 'motherWitnessed', '莉维娅拦住传抄的人：“车马、绷带，是我在诊室外亲见的。里面怎么治，我没看见，这句留下。”')
  remember(['q5-patient', ...patientEnds], 'privacyKept', '你阻止过公开海伦娜的病史。最终陈述和传出的剂量都省去她的身份，莉维娅确认自己只谈本次求诊。')
  remember(patientEnds, 'boxReturned', '莉维娅确认带回药箱与口述剂量，女药师另签核对和实际给药。跑回东翼的人与执行配药的人分别留下经过。')
  remember(patientEnds, 'externalExecutor', '女药师独自离庭执行送药，莉维娅当时仍在庭中；她只确认收到退烧消息的时刻，没有替药师补写亲历给药。')
  remember(patientEnds, 'careRecord', '病房保存处方副本与此前实际提交的拒诊收据，来源分开登记，收据没有被当作药效证明。')
  return { ...episode, nodes }
}
