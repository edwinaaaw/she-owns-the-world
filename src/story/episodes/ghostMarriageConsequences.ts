import { chapterMemory } from '../chapterMemory'
import type { EpisodeDefinition } from '../types'

export function withGhostMarriageConsequences(episode: EpisodeDefinition): EpisodeDefinition {
  const { nodes, remember, replace } = chapterMemory(episode)
  const marriageEnds = ['ghost-end-husband', 'ghost-end-ledger']
  remember(['q3-marriage', 'q4-marriage'], 'boxOpened', '你凭丈夫身份开箱，先见到三封信与钥匙。徐莲留下开箱记录：“东西归你保管，她可没答应让你替她说话。”')
  remember(['q3-marriage', 'q4-marriage'], 'openedWithLian', '徐莲收起共同开箱时撬下的锁，指认封账的蓝蜡：“我认得这些。丈夫的保管权，仍在你那里。”')
  nodes['q3-marriage'].body = '徐家要把九岁的阿芸过继到徐宁名下，交你抚养，又要限制你对产业和孩子日后婚姻的决定。女孩还没答话，族老已将条款翻到下一页。'
  nodes['q4-marriage'].body = '徐莲请族老当场展示木箱来信，已有开箱者核对自己看过的部分，未看过的人此时才读到：徐宁要求补发四年欠薪，并明确拒绝阴婚保产。末封退信写着“未有丈夫共同签署”。展示原文不等于遗嘱获准执行。'
  remember(['q5-marriage', ...marriageEnds], 'metAyun', '阿芸扯住你衣角：“你还没说，我要怎么叫你。”她没答应过继，也没改口，等的是你的回答。')
  remember(['q5-marriage', ...marriageEnds], 'guardianshipTerms', '徐莲收回未获批准的监护附约，圈着删去代定婚姻的那条：“产业和照护分开谈，孩子这件还没定。”')
  const sign = nodes['q4-marriage'].choices!.find((choice) => choice.id === 'ghost-marriage-q4-sign')!
  sign.label = '以丈夫身份在来信执行附页补签'
  sign.riskHint = '以婚书权限推进执行；附页与原意分存，仍违背徐宁拒婚的意愿'
  sign.grantsTags!.push('willSignatureSeparated')
  nodes['result-ghost-marriage-q4-sign'].body = '旧记录只留下你曾在旧信上补签，没有记明是否另附纸。徐莲要求核对原文与后来签名的日期，不能把新增丈夫身份说成徐宁自己的安排。'
  replace('result-ghost-marriage-q4-sign', 'willSignatureSeparated', '你把签名写在附页，注明今日日期与丈夫身份，原信没有新增文字。族老接受这项执行申请，徐莲留下原信与附页：“她拒绝阴婚的那句仍在，你的签名是后来加的。”')
  remember(['q5-marriage', ...marriageEnds], 'willSubmitted', '三封原信已经提交，族老承认笔迹却质疑效力。徐莲要求记下这项退回理由，不能把未获执行写成信不存在。')
  remember(['q5-marriage', ...marriageEnds], 'willCountersigned', '徐莲将原信与后加的丈夫签名按日期摆开：“执行方便了。她写的拒婚，也还在。”')
  remember(['q5-marriage', ...marriageEnds], 'willSignatureSeparated', '原文与补签附页分别保存；徐莲持有可核对的版本，不把你的执行权限混进徐宁亲笔的同意。')
  remember(['q5-marriage', ...marriageEnds], 'workersVerified', '女工已经拿自己的工钱簿核对欠薪。她们要求继承决定写明偿还范围，不把核账当成已收到银子。')

  const investigateEnds = ['ghost-end-will', 'ghost-end-account']
  remember(['q3-investigate', 'q5-investigate', 'ghost-end-will'], 'wagesConfirmed', '徐莲把最先核过残字的六份欠薪条放在左边，余下债权等本人来认：“这六笔先记，其他人另问。”')
  remember(['ghost-end-account'], 'wagesConfirmed', '最初只有六名夜班女工核对残字，商会后来补齐三十二人的核查与按印。徐莲保留先后来源，不让早期六份材料冒充后来完成的全部核对。')
  remember(['q3-investigate', 'q5-investigate', ...investigateEnds], 'debtAfterDeath', '掌柜指着付款日：徐宁死后，旁支签字。徐莲将药债移开：“银子她们付了，婚姻不是我姐姐答应的。”')
  remember(['q5-investigate', ...investigateEnds], 'willReadTogether', '徐莲按住让她继续做账房的那页：“当初说先看再决定。这一条也随信提交，别只留下拒婚。”')
  remember(['q5-investigate'], 'fullDisclosurePact', '徐莲握着末封信，迟迟没松手：“你答应完整公开。我想保住账房的位置，也在里面。”')
  remember(['q5-investigate'], 'fullDisclosurePact', '公开宣读尚未完成。徐莲提醒：现在交材料或先处理债务，都不能把未公开的部分算成已经履行约定。', 'willReadPublic')
  remember(investigateEnds, 'fullDisclosurePact', '徐莲把完整公开的约定附在提交清单上，包括自己的账房利益。她要求收件人逐页核对，公开范围仍以实际展示、抄录的内容为准。')
  remember(investigateEnds, 'willReadPublic', '徐莲已经当众读完全部来信，自己的职位也没有略去。工人要求连同欠薪条一并登记，公开听见不等于遗嘱已被认定有效。')
  nodes['q5-investigate'].title = '继承听证开始，婚书与遗嘱并列'
  nodes['q5-investigate'].choices!.find((choice) => choice.id === 'ghost-investigate-q5-will')!.riskHint = '拒绝新增补签；若已有婚书，须另申请撤销，不能自动解除'
  nodes['q5-investigate'].body = '族老让你决定是否以丈夫身份补签执行文件。徐莲握着遗嘱原件，工人要求核对欠薪，母亲在门外等祖屋结果。婚书此前是否签过，必须先分清，拒绝新的签名不会自动消除旧签名。'
  remember(['q5-investigate'], 'temporaryMarriage', '徐莲把已生效的婚书和遭拒的天亮失效附注递来：“现在不补签，还得另请撤销。族老没答应这段婚姻天亮就完。”')
  replace('ghost-end-will', 'temporaryMarriage', '你把徐宁遗嘱递上，同时申请撤销已生效的婚书，不再补签新文件。族老将遭拒的临时失效附注留在一旁。徐莲带原件出宗祠，工人凭它追讨欠薪；你手里还握着撤销申请，婚书效力与顾家债务都没处理完。')
  remember(['ghost-end-account'], 'temporaryMarriage', '已生效的婚书和未被接受的失效附注分列待处理。徐莲先核工人债权，没有替族老承诺婚约会自动撤销。')
  remember(investigateEnds, 'documentsPresented', '听证展示过原件、退信理由与盖印婚书。徐莲保留展示清单，顾言看过这些材料不等于同意在婚书上落笔。')
  remember(['ghost-end-will'], 'laborDebtFirst', '欠薪簿先进入债权核查，三十二份申报仍须逐一确认。徐莲把继承安排放在后面，避免先把欠薪当作可分的家产。')
  remember(['ghost-end-account'], 'laborDebtFirst', '先登记债权的决定使商会在继承前完成了三十二笔欠薪核对。徐莲把工人各自按印的结果附回申报页，未把登记本身当作已清偿。')

  const refuseEnds = ['ghost-end-cord', 'ghost-end-workers']
  remember(['q3-refuse', 'q5-refuse', ...refuseEnds], 'familyPacked', '三只箱子装了母亲的药材和家人的东西，你的衣物仍在旧屋。母亲清点药包，你摸了摸藏在衣内的账册，腾不出手再拿别的。')
  remember(['q3-refuse', 'q5-refuse', ...refuseEnds], 'fraudTimeline', '徐莲把相差七日的账册与借据副本摆好：“婚姻条件是后来加的。先拿这两个日期去问，交易能否判无效还要另审。”')
  remember(['q4-refuse', 'q5-refuse'], 'lianAlliance', '徐莲按住自己保留账房职位的那页：“说好一封都不抽。我的利益也让她们查。”')
  remember(['q4-refuse', 'q5-refuse', ...refuseEnds], 'willCopied', '原件仍由徐莲决定交给谁，留下副本没有取得替她公开个人陈述的许可。她确认文字来源，也保留决定何时出面的权利。')
  remember(refuseEnds, 'lianAlliance', '共同提交的三封信没有被抽走，徐莲保留自己的提交记录。她的利益随文件一同受查，结盟没有保证保住她的职位。')
  nodes['q5-refuse'].body = '祖屋贴上封条，工人请你把现有账册交商会核查。母亲先计算今晚住处与余下药材；没有谈成的减债不能算已获得补偿。拒婚的代价仍在。'
  remember(['q5-refuse', ...refuseEnds], 'debtOffer', '旁支指着减债一半的交换：“公开徐宁的安排，这事就不谈了。”账上尚未减去一文，你望向母亲手里的药包。')
  remember(refuseEnds, 'keyReturned', '你交出祖屋钥匙，却没有签自愿说明。商会只能据实际交割记录核查，交钥匙没有替你承认婚姻条件合理。')
  remember(refuseEnds, 'objectionFiled', '族老收下的书面异议尚未裁定，祖屋已交割。你带着收件记录继续申诉，没有把登记当作已经胜诉。')
  remember(refuseEnds, 'coercionRecorded', '交割记录留下被划掉的“自愿”和两份日期。祖屋照旧交出，你收好这一页，带着争议继续找人核查。')
  remember(refuseEnds, 'refusalPublic', '徐莲已经公开读出拒婚与自己保留职位的安排。她确认宣读范围，不让旁支把这次发言算作同意代签。')
  return { ...episode, nodes }
}
