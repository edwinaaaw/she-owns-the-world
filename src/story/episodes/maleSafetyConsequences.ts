import { chapterMemory } from '../chapterMemory'
import type { EpisodeDefinition } from '../types'

export function withMaleSafetyConsequences(episode: EpisodeDefinition): EpisodeDefinition {
  const { nodes, remember, replace } = chapterMemory(episode)
  const complyEnds = ['safety-end-timeline', 'safety-end-protocol']
  remember(['q3-comply', 'q5-comply'], 'platformProfile', '宋岚看见“情绪紧张”也愣了：“我只问你喝没喝酒，没写这句。”你把系统标注连同时间截下来。')
  remember(['q3-comply', 'q5-comply'], 'mutualDataSeen', '宋岚点了两次灰色下载键：“我的音频也存着，我自己却拿不到。我们先对一下能看见什么，私人材料各自留着。”')
  nodes['q4-comply'].body = '手机又响了：持续偏航使平台自动升级风险。你的屏幕要锁门等候，宋岚那边却催她结束订单。她把两块屏幕并排：“现在听哪一个？”'
  remember(['q4-comply', 'q5-comply', ...complyEnds], 'confirmedSafe', '你翻到先前“确认安全”的点击，平台当时就停了追问。宋岚指着施工说明：“这个时间留着，后来的自动升级别写成你按过警报。”')
  remember(['q4-comply', 'q5-comply', ...complyEnds], 'platformAlert', '宋岚指向制动时刻：“你那次按警报，我急刹，后车差点撞上。封路要查，这次制动也写进去。”')
  remember(['q4-comply', 'q5-comply', ...complyEnds], 'humanCheck', '等人工客服时，车停在便利店灯下，对方只说导航正常。宋岚指着路障：“接通了，她也没看见这里。”')
  nodes['result-safety-comply-q4-together'].body = '你和宋岚分别说明乘客端与司机端的冲突指令，客服终于标注道路施工。她确认自己提供的司机端文字，你核对自己的点击时刻；没有发生的行为不写进共同陈述。'
  remember(['result-safety-comply-q4-together'], 'platformAlert', '你补充警报引发的急刹，宋岚核对制动时刻，后车的实际受损情况仍未知。')
  nodes['q5-comply'].body = '到家后报告称平台已妥善保护，却没有完整列出施工与两端指令。投诉将让宋岚查看你同意用于本次复核的相关陈述，她可以自行补充；撤回授权也不等于已上传数据立即消失。'
  remember(complyEnds, 'exitedSafely', '你在亮处结束订单后，司机位置共享停止，自己的音频却继续留在平台。下车时间与后来到家时间分别列出。')
  remember(complyEnds, 'jointAccount', '施工说明与双方实际提供的系统文字已经进入客服记录。宋岚保留未交出材料的边界，你们只各签亲历部分。')
  remember(['safety-end-protocol'], 'routeComply', '先前上传的录音、位置与通讯录有各自保存范围。你核对平台删除通讯录的回执，其余资料是否删除仍未获确认。')

  const witnessEnds = ['safety-end-together', 'safety-end-witness']
  nodes.q1.choices!.find((choice) => choice.id === 'safety-q1-witness')!.grantsTags!.push('safetyWordAgreed')
  replace('result-q1-witness', 'safetyWordAgreed', '陈晨接起电话，记下车牌与预计到达时间。你们另约定安全词“回拨”：报出位置后若一分钟无回应，她先回拨，再按最后位置求助。她只答应本次通话的安排；平台仍显示未开启官方守护。')
  remember(['q3-witness', 'q5-witness', ...witnessEnds], 'driverInformed', '你说过陈晨在见证，宋岚便将封路牌指给通话那头：“施工这段一起记，别只留下我说话。”她仍担心话被截断。')
  remember(['q3-witness', 'q5-witness'], 'covertWitness', '宋岚从后视镜看你：“她到底记了什么？”你之前没说明通话用途，她把广播关小，等你说清记录范围。')
  remember(['safety-end-together'], 'covertWitness', '你起初没有告知宋岚通话用途，后来提交时间线时才说明外部见证的来源。她只核对提交出的条目，没有看过陈晨整份私人聊天，先前猜疑也没有因此消除。')
  remember(['safety-end-witness'], 'covertWitness', '你起初没有告知宋岚通话用途，最终又单独报告二元问法。陈晨的私人记录没有因此全部交给宋岚，她只确认自己实际收到的投诉内容。')
  remember(['q5-witness', ...witnessEnds], 'routeVerbalized', '陈晨翻着宋岚报出的三个路口：“第三个能接回主路，我查到了。前面实际怎么样，你们继续说。”')
  remember(['q5-witness', ...witnessEnds], 'witnessedStop', '陈晨翻到便利店的停车时刻：“后面听不清的时候，你们还停着，对吧？”那段通话空白接在停车记录之后。')
  const stopped = '车辆仍停在便利店灯下，通话却变得断续。宋岚询问是留在这里核对还是结束订单，你没有同意重新出发。陈晨需要知道缺音发生在哪里。'
  replace('q4-witness', 'witnessedStop', stopped)
  replace('q4-witness', 'relic-followed:male-safety-witness-worker-ledger', stopped)
  replace('q4-witness', 'dualRecord', '临时定位与平台警报已经开启，车辆因急刹停下，陈晨听见封路解释。通话此时变得断续，官方介入与外部通话都须各自补记，不能再写成从未开启平台。')
  const code = nodes['q4-witness'].choices!.find((choice) => choice.id === 'safety-witness-q4-code')!
  code.requiresTags = ['safetyWordAgreed']
  code.grantsTags!.push('safetyWordProtocolUsed')
  code.riskHint = '按本次约定，失联一分钟后陈晨先回拨，再依据最后位置求助'
  nodes['result-safety-witness-q4-code'].body = '通话短暂中断后重新接通。现有记录未确认安全词的事先约定，也不能据此推定陈晨曾答应一分钟后报警；你保留能核对的通话时刻。'
  replace('result-safety-witness-q4-code', 'safetyWordProtocolUsed', '你说“回拨”，报出眼前位置。信号断了二十秒，陈晨的声音回来：“听见了，还在这儿。”未到一分钟，她没启动回拨求助；车要不要继续走，你另行决定。')
  nodes['q4-witness'].choices!.find((choice) => choice.id === 'safety-witness-q4-timeline')!.label = '在安全停靠处，与宋岚核对时间线'
  nodes['q4-witness'].choices!.find((choice) => choice.id === 'safety-witness-q4-timeline')!.riskHint = '行驶中先请求安全停靠；已停靠则继续核对，只记录双方能确认的部分'
  const timeline = nodes['q4-witness'].choices!.find((choice) => choice.id === 'safety-witness-q4-timeline')!
  timeline.grantsTags!.push('timelineScopeConfirmed')
  nodes['result-safety-witness-q4-timeline'].body = '你和宋岚在停靠处并列聊天与行车记录，能对上的时刻留下来源，缺失的部分仍待确认，不能凭“共同”两字补齐。'
  replace('result-safety-witness-q4-timeline', 'timelineScopeConfirmed', '你先确认车辆在安全处停稳，再询问宋岚愿意核对哪些部分。她读出自己可见的路况时刻，你读聊天记录，两人只确认能对应的项目，缺失分钟仍留空。')
  const pickup = nodes['q4-witness'].choices!.find((choice) => choice.id === 'safety-witness-q4-exit')!
  pickup.label = '结束订单，到亮处请求陈晨来接'
  pickup.riskHint = '先确认安全下车位置；陈晨能否出发要再问，司机也没有义务一直等候'
  pickup.grantsTags!.push('pickupConfirmedThisTrip')
  nodes['result-safety-witness-q4-exit'].body = '你结束订单并在亮处等待，陈晨后来接到了你。记录没有说明宋岚承诺陪等，也不能从这一次接送推定朋友以后都能赶来。'
  replace('result-safety-witness-q4-exit', 'pickupConfirmedThisTrip', '你确认亮处可以下车，再请求陈晨来接；陈晨答应这次能出发，并报了预计时间。宋岚结束订单，你到灯下等候，没有要求她一直陪等。陈晨到达后，你在聊天中确认已接上。')
  remember(['q5-witness', ...witnessEnds], 'safetyWordProtocolUsed', '安全词确实按本次约定使用，二十秒后恢复通话，没有达到回拨求助的时限。陈晨只确认听见和接通的时刻。')
  remember(['q5-witness', ...witnessEnds], 'safetyWordUsed', '聊天里留着一次安全词使用，你往上翻，没找到事先的求助约定；陈晨答应过哪些步骤，还得向她确认。', 'safetyWordProtocolUsed')
  remember(witnessEnds, 'timelineBuilt', '停车时核对出的共同条目保留双方来源，未确认的分钟仍为空白。后来的复核没有把所有分歧填成一致。')
  remember(witnessEnds, 'friendPickup', '陈晨最终接走你的时刻单列在订单结束之后。一次接送没有成为朋友或司机往后必须随叫随到的承诺。')

  const privateEnds = ['safety-end-local', 'safety-end-public']
  nodes['q4-private'].title = '信号中断，附近的摩托车让你警觉'
  remember(['q3-private', 'q5-private', ...privateEnds], 'mutualRecording', '宋岚在你告知后才打开音频：“我的从这里开始。”你们各记起始时刻，完整文件留在各自设备上，尚未答应互换。')
  remember(['q3-private', 'q5-private', ...privateEnds], 'covertRecording', '那段录音来自你的手机。你当时没告诉宋岚，她也没核对说话对象与前后经过；这份记录只有你提供的语境。')
  remember(['q3-private', 'q4-private', 'q5-private', ...privateEnds], 'minimalLog', '录音已经关掉，停录前的片段仍在。你接着写时间与位置，后面的对话只留笔记，没有原声。')
  remember(['q4-private', 'q5-private', ...privateEnds], 'detourDocumented', '封路牌和绕行入口的照片带着拍摄时刻。你放大看过，再滑向下一张；后面的路段没有拍进去。')
  remember(['q4-private', 'q5-private', ...privateEnds], 'routeNoted', '你记下宋岚说的三个路口，只亲见第二个符合描述，第三个仍待核对。笔记不能被说成已走完全程的定位轨迹。')
  replace('q4-private', 'rideEndedEarly', '订单已在封路牌前结束，你下车站在亮处。手机没有信号，摩托车从附近路口经过；宋岚的车门与车内动静，已不在你眼前这段等候里。')
  replace('q4-private', 'relic-followed:male-safety-private-worker-ledger', '车辆在安全处核对完路况后，宋岚询问是否继续。你同意沿核对过的绕行方向出发，随后进入无信号路段，看见后方摩托车；先前核对没有包含尚未发生的这一段。')
  nodes['q4-private'].choices!.find((choice) => choice.id === 'safety-private-q4-share')!.label = '保留现有本地记录，恢复信号后再决定提交'
  nodes['result-safety-private-q4-share'].body = '你保留手机实际录到的片段、笔记与已有图片，等信号恢复后再核对发送范围。没有新发出完整音频，缺失的声音也没有因此补回。'
  remember(['result-safety-private-q4-share'], 'rideEndedEarly', '你在订单结束后的等候处恢复信号。记录注明下车时刻，没有继续添加车内经过。')
  const compare = nodes['q4-private'].choices!.find((choice) => choice.id === 'safety-private-q4-pair')!
  compare.grantsTags!.push('footageScopeConfirmed')
  compare.label = '请宋岚提供愿意核对的记录，双方对照'
  compare.riskHint = '她可只提供部分车外片段，未提供之处保留未知'
  nodes['result-safety-private-q4-pair'].body = '两份记录有可核对的部分，宋岚实际交出了哪些范围还须确认。不能把“互相核对”当作整份车外文件已获授权。'
  replace('result-safety-private-q4-pair', 'footageScopeConfirmed', '你请求宋岚核对路口附近的车外片段。她愿意提供这一小段，画面显示摩托车先前跟随另一辆车；其余文件仍留在她设备里。你们记录能确认的范围，没有据此判断全部行程或认定谁有罪。')
  nodes['q5-private'].body = '到家后，平台提出上传实际录音片段换取快速复核，同时要求同意模型训练。你可以只提交最少事实，或提出限定用途的协议；现有录音、笔记和照片的范围按实际保存情况核对，宋岚没有自动取得你的整份文件。'
  remember(privateEnds, 'recordKeptLocal', '恢复信号没有自动发送本地声音文件。你保留已有片段与笔记，提交最少事实或协商协议都不等于已接受训练用途。')
  remember(privateEnds, 'footageScopeConfirmed', '宋岚同意核对的只是那一段车外画面。你把范围附在记录旁，协议草案没有扩大她已经给出的许可。')
  remember(privateEnds, 'recordsCompared', '双方记录的可用范围仍要逐项核对，现有资料不足以推定宋岚曾同意交出完整行车文件。', 'footageScopeConfirmed')
  remember(privateEnds, 'rideEndedEarly', '订单在封路牌前已经结束，后来的等候与到家过程另列。你没有用后续时间补成长途车内记录。')
  return { ...episode, nodes }
}
