import { chapterMemory } from '../chapterMemory'
import type { EpisodeDefinition } from '../types'

export function withSpinningJennyConsequences(episode: EpisodeDefinition): EpisodeDefinition {
  const { nodes, remember, replace } = chapterMemory(episode)
  const ownerEnds = ['jenny-end-owner', 'jenny-end-standard']
  remember(['q3-owner', 'q4-owner', 'q5-owner'], 'guardAdded', '护罩里仍有偏移声。艾达指向你腰间的扳手：“铁皮能挡手，皮带没修好。谁来决定停？”')
  remember(['q3-owner', 'q4-owner'], 'adaTrained', '艾达摸到松轴杆：“两次都练过了。这次有响动，我能先停吧？”门外，埃莉诺还在计较推迟的十分钟。')
  remember(['q5-owner'], 'adaTrained', '艾达把两次练习的次序写在事故报告旁：“教过我什么、这次实际做了什么，都分开记。”训练推迟的十分钟仍在演示日志里。')
  remember(['q5-owner', ...ownerEnds], 'fullSpeed', '艾达在日志里圈出你的提速指令：“偏移声就是这时听不见的。别填进我的操作失误。”')
  remember(['q5-owner', ...ownerEnds], 'ruthInside', '鲁思已经被你请进机房，她把当时要求安全检查的话再说一次。埃莉诺追问你越权开门，她却要求先核对谁坚持演示。')
  remember(['q5-owner'], 'adaSavedByWrench', '艾达看看你被扳手划破的手，再把笔放回你的责任栏：“救我的事，我记得。学徒失误，我没认。”')
  remember(['q5-owner'], 'adaSavedByPowerCut', '艾达抬不起勒伤的手臂，只朝总闸偏了偏头：“埃莉诺断动力，你托住我。别只写我碰了什么。”')
  nodes['result-jenny-owner-q4-ada'].body = '艾达按练习自己先松轴，随即喊出断闸次序；门外埃莉诺拉下总闸。你等齿轮停稳后解开她的袖口，她的手臂留下勒痕。艾达指出自己练过并实际完成的那一步，没有把门外断闸也算作自己做的。'
  remember(['q5-owner'], 'adaSelfStopped', '艾达把训练步骤念了一遍：“我按你教的自己先停轴，为什么还要签操作失误？”她拒绝替你填好的责任栏落笔，你仍可以签下报告。')
  remember(['jenny-end-owner'], 'adaSelfStopped', '艾达保留自己练过并实际松轴的陈述，对“学徒失误”提出异议。你签下的报告不能替她同意，她要求调查你的提速安排与结构问题。')
  remember(['jenny-end-standard'], 'adaSelfStopped', '艾达在召回记录说明自己依训练先停轴，埃莉诺完成门外断闸。她肯核对这些动作，不把学徒练习写成结构已经安全。')
  remember(ownerEnds, 'adaSavedByWrench', '救援时扳手划破你的掌心，艾达确认是你撬开动力轴。她保留对事故原因的不同说法，获救没有替她认下报告。')
  remember(ownerEnds, 'adaSavedByPowerCut', '埃莉诺切断总闸动力，你托住艾达并在停稳后解袖。艾达的勒伤记在伤情栏，现场没有那次撬轴造成的掌心伤。')
  remember(ownerEnds, 'ruthStopped', '鲁思用先前拿到的钥匙切断动力，艾达确认实际救援者。钥匙没有使鲁思先前反对开机的话失效。')

  const workerEnds = ['jenny-end-joint', 'jenny-end-door']
  nodes['q3-workers'].body = '埃莉诺只肯说“不立即裁员”，同薪与工伤赔偿都没批准。鲁思把笔推回去：“有条款就逐项答。要试机，先说清哪条传动、准转多快。”'
  remember(['q3-workers', 'q5-workers'], 'workerTerms', '鲁思用粉笔划开两栏：工人逐项表决通过培训、同薪、赔偿；旁边一栏，等埃莉诺逐条签。')
  remember(['q3-workers', 'q4-workers'], 'gearRemoved', '关键齿轮在桌上，主传动已拆开。鲁思指着另一根备用动力轴：“那根还能转。开关在哪？”')
  replace('result-jenny-workers-q3-test', 'gearRemoved', '你先确认主传动与备用轴都断电，把拆下的齿轮装回，仅作低速测试。工人在总闸旁监督；测试结束再次停稳，齿轮取下交回鲁思，机器没有交付，备用轴仍须单独断开。')
  nodes['q4-workers'].body = '备用动力轴猛地绷响，艾达的袖口卷了进去。埃莉诺为赶投资人，另让她处理这根独立轴。鲁思与工人守在总闸旁：“主传动拆没拆都别管了，先指出这根的开关！”'
  replace('q4-workers', 'hiddenStartup', '封锁仍未解除，埃莉诺已让艾达从侧门启动独立的备用动力轴。袖口被卷住，鲁思与工人在总闸旁，必须分清备用轴开关；主传动的状态不能代替这条轴的断电确认。')
  nodes['q4-workers'].choices!.find((choice) => choice.id === 'jenny-workers-q4-restore')!.label = '断开备用动力，再装齿轮反向松袖口'
  nodes['q4-workers'].choices!.find((choice) => choice.id === 'jenny-workers-q4-restore')!.riskHint = '先由鲁思断开对应开关，停稳后才能装齿轮处理卡住的袖口'
  nodes['result-jenny-workers-q4-restore'].body = '你指出备用轴的独立开关，鲁思切断并守住动力。确认停稳后，你装回保管的齿轮，手动反向松开袖口，鲁思托住艾达。机器保住了，工人仍要求把只有你熟悉的复原方法写清。'
  remember(['q5-workers', ...workerEnds], 'partialAgreement', '鲁思把一成收益的新合同压在黑板下：“她之前只签培训。同薪、赔偿两条还欠着，今天怎么算？”')
  remember(['q5-workers', ...workerEnds], 'workerControlledTest', '鲁思保留仅允许低速测试、不交付机器的条件。后来的备用轴事故没有把测试许可扩大成任意开机的同意。')
  remember(['q5-workers', ...workerEnds], 'hiddenStartup', '工人曾拒绝放行，埃莉诺仍命艾达启用备用轴。鲁思要求把这次绕过封锁的命令写进调查，不能只追查谁在旁边。')
  remember(workerEnds, 'machineBroken', '鲁思把砸断的动力杆放在修复账旁：“艾达救出来了。修复费和停工损失，我们没答应独自抵。”')
  remember(workerEnds, 'directedStop', '鲁思按你指出的位置断开备用动力。调查把开关标识不清列入整改，现场指挥不等于此前人人已经受训。')
  remember(workerEnds, 'gearRestored', '主传动齿轮在断电后复原，备用轴的开关单独确认。鲁思要求新合同写清这两项维护责任，不能继续只有你认得。')
  remember(workerEnds, 'collectiveStop', '受训工人按实际练过的步骤分工停机。鲁思保留练习名单，未完成训练的人仍须补练，委员会身份不能替代操作资格。')

  const openEnds = ['jenny-end-card', 'jenny-end-maintenance']
  remember(openEnds, 'trainedOperatorsStopped', '两处接手者分别按实练过的适配说明停机，鲁思确认原机，仿制工坊学徒确认删改机。两处后来都停稳有各自的现场记录，没有合成你一个人的救援。')
  remember(['q3-open', 'q5-open'], 'safetyPage', '演示前，艾达把安全页送到街口。鲁思留下张贴位置：“哪间看懂、哪间照做，还得进去问。”')
  remember(['q3-open'], 'copyInspected', '鲁思指着刚查过的仿制机：“制动器确实没装。现在谁回原机看着艾达？”')
  remember(['q5-open'], 'copyInspected', '你与鲁思在演示前查过缺失的制动器，也听见仿制者拒绝停机。鲁思把这次实查的经过写入事故记录，与你后来站在哪台机器旁、实际停下哪台分开核对。')
  nodes['result-jenny-open-q3-original'].body = '你回到原机旁，鲁思也到原机总闸边，艾达负责上纱。原机启动后，隔街忽然传来金属撞击声，你们还没有看见那边的伤势。'
  nodes['result-jenny-open-q3-copy'].body = '你留在或赶到仿制机旁，鲁思返回原机总闸边。仿制者拒绝你的降速要求，两台机器几乎同时启动。你只能看见眼前这一台的动作。'
  remember(['q4-open', 'q5-open', ...openEnds], 'stayedOriginal', '事故时你守着原机，隔街只传来响声；那边的伤势，要听仿制工坊在场的人说。')
  remember(['q4-open', 'q5-open', ...openEnds], 'stayedCopy', '事故时你在仿制机旁，鲁思守原机总闸；她报她看到的，你说自己亲眼见到的。')
  nodes['q4-open'].choices!.find((choice) => choice.id === 'jenny-open-q4-copy')!.label = '向仿制工坊指出动力入口，请工人断开'
  replace('result-jenny-open-q4-copy', 'stayedCopy', '你就在仿制机旁，指明动力入口，请在场工人切断。她们断开后扶出受伤学徒；鲁思从隔街呼喊原机仍须处理，你还没有确认那边的结果。')
  nodes['result-jenny-open-q4-ruth'].body = '你向原机总闸边的鲁思喊出要核对的开关，她回应后切断动力。仿制机的声音还在，原机停下不代表隔街也已获救。'
  nodes['result-jenny-open-q4-card'].body = '拿到安全页的工人与仿制工坊操作人核对断动力位置，避开转动部件后切断开关。消息传来时，你只确认仿制机已停，原机结果仍须另报。'
  remember(['q5-open', ...openEnds], 'publicStop', '仿制工坊报来停机经过，附上安全页页码与操作人。你记下这一处，等鲁思报原机结果。', 'relic-used:spinning-jenny-open-prison-thread')
  remember(['q5-open', ...openEnds], 'oneMachineStopped', '已确认鲁思停下原机，仿制机随后怎样处置仍待其工人补记。事故册留下待核对的一栏。', 'relic-used:spinning-jenny-open-prison-thread')
  remember(['q5-open', ...openEnds], 'copyMachineStopped', '仿制机已经按你指出的位置停下，原机另列待核对栏。后来的登记不会把未确认的现场写成你同时救下。', 'relic-used:spinning-jenny-open-prison-thread')
  remember(openEnds, 'relic-used:spinning-jenny-open-prison-thread', '两处后来分别断开动力并补记亲历损伤，原机与仿制机的记录各有来源。先前只能确认一处的救援没有被说成同时完成，但后来的回报也没有被遗漏。', 'relic-followed:spinning-jenny-open-prison-thread')
  remember(openEnds, 'relic-followed:spinning-jenny-open-prison-thread', '两处随后分别断开动力，已登记版本的持有人各自补写现场损伤。原机与仿制机的回报分列，先前救援的地点与后来补齐的结果都能核对。')
  nodes['q5-open'].body = '报纸把两处事故都归咎于公开图纸。你可以申请登记安全版本，也可以公开版本号和事故记录；来源能供核对，是否执行仍取决于各工坊。每一处结果按已有回报核对，没有回报的字段留空。'
  nodes['jenny-end-maintenance'].body = '第七码公开后，城里出现十二种改版。工人拿维护卡对着机器问：“制动器这一项，谁删的？”卡上要求标明删改与适用结构，你仍没得到专利；有工坊答复，有工坊继续生产，没人能凭这张卡强制关停。'
  return { ...episode, nodes }
}
