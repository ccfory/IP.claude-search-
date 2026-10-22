'use strict';
/* Fictional initial reviews, never an account-ban detector. Source snapshot: 2026-10-22. */
const POLICY_SOURCES=[
 ['Safeguards, warnings & appeals','https://support.claude.com/en/articles/8241253-safeguards-warnings-and-appeals'],
 ['Consumer Terms · 8 Oct 2025','https://www.anthropic.com/legal/consumer-terms'],
 ['Where can I access Claude? · 16 Mar 2026','https://support.claude.com/en/articles/8461763-where-can-i-access-claude']
];
const POLICY_CASES=[
 ['37',0,'Harper Lin','独立开发者','Independent developer','新加坡','Singapore','zh-CN','UTC+8','新加坡 / 企业 VPN','Singapore / corporate VPN','out','普通中文请求不是违规','Chinese is not a violation',
 '我用中文写代码，也开公司的 VPN。这就会封号吗？','I code in Chinese and use my employer’s VPN. Does that get me banned?',
 '中文、时区和 VPN 标签都不能单独认定违规。','Language, timezone and a VPN label are not proof of a breach.',
 '本人位于新加坡；这是个人账号，没有共享登录。','I am in Singapore. This is my own account; I do not share the login.',
 'record','地区与账号核验','Region and account review','新加坡本人在场记录有效；账号由本人使用，仅有普通代码求助，未见本档案所审查的违规证据。','Verified presence in Singapore. The owner uses the account for ordinary coding help. No evidence of a breach in this review.',
 '地区与账号使用均通过本次核验。中文、UTC+8 或企业 VPN 本身不是封号依据；本档案继续服务。','Region and account use pass this review. Chinese, UTC+8 and a corporate VPN alone do not establish a violation. Continue service.'],
 ['38',0,'许闻溪','远程编辑','Remote editor','首尔 · 韩国','Seoul · South Korea','ko-KR','UTC+9','首尔 / 云出口','Seoul / cloud exit','cn','不支持地区创建账号','Account creation in an unsupported location',
 '注册时人在杭州，但出口是首尔。资料上只写出口可以吗？','I registered from Hangzhou through a Seoul exit. Can the form just list the exit?',
 '注册地区需要核验实际情况，不能只看出口标签。','Review the actual registration location, not just an exit label.',
 '我在杭州创建并使用这个账号，没有去过首尔。','I created and use this account in Hangzhou. I have never been to Seoul.',
 'record','注册地区核验','Registration-location review','本人确认与注册原始记录一致：在杭州创建账号。首尔仅为远端出口；中国大陆不在本次来源所列支持地区。','The owner’s statement matches the original registration record: account created in Hangzhou. Seoul is only a remote exit. Mainland China is absent from the cited supported-location list.',
 '官方列出的禁用原因包括从不支持地区创建账号。证据确认注册地为杭州，应限制访问并告知申诉路径；不是依据中文或国籍。','The official help article lists account creation from an unsupported location as a disablement reason. The verified Hangzhou registration supports restricting access with an appeal route; language and nationality do not.'],
 ['39',0,'Rowan Miles','项目协调员','Project coordinator','伦敦 · 英国','London · UK','en-GB','UTC+1','伦敦 / 共享办公室','London / coworking network','cn','共享个人账号登录','Sharing a personal-account login',
 '我们五个人轮流用同一个 Pro 密码，反正不同时在线。','Five of us take turns using one Pro password. We never log in at once.',
 '同一办公室不等于可以共享个人账号凭据。','Working in one office does not authorize sharing personal credentials.',
 '不是各自的团队席位，是同一个个人账号密码。','These are not separate team seats; it is one personal account and password.',
 'record','账号使用确认','Account-use confirmation','持有人确认将个人账号密码交给四位同事使用；非各自授权的团队席位，记录一致。','The owner confirms giving four colleagues the password for a personal account. These are not separately authorized team seats; the records agree.',
 'Consumer Terms 禁止共享账号凭据或让他人使用个人账号。核实的共享行为支持限制访问；多人在同一网络上本身不构成证据。','The Consumer Terms prohibit sharing account credentials or making a personal account available to others. Verified credential sharing supports restricting access. A shared network alone would not.'],
 ['40',0,'Avery Chen','旅行研究者','Travelling researcher','多伦多 · 加拿大','Toronto · Canada','zh-CN','UTC−4','多个出口 / 原始接入缺失','Multiple exits / origin unavailable','hold','异常活动待复核','Unusual activity needs review',
 '旅行中换了几次网络，现在收到异常活动提示。','I changed networks while travelling and received an unusual-activity notice.',
 '异常提示是调查起点，不是已证实的账号滥用。','An anomaly alert begins a review; it does not prove misuse.',
 '我愿意提交验证材料，现有提示没写具体违规。','I can provide verification. The notice does not identify a confirmed breach.',
 'record','异常活动初报','Preliminary activity alert','系统只记录多次出口变化，原始接入与持有人验证缺失；未确认共享、违规使用或实际所在地。','Only multiple exit changes are recorded. Origin and owner verification are missing. Sharing, prohibited use and actual location are unconfirmed.',
 '单独换 IP 或异常提示不能直接等同永久封号。保留资料，转人工复核并说明还需验证什么。','An IP change or anomaly alert alone does not establish grounds for permanent closure. Preserve the record and request human review with clear verification steps.'],
 ['41',1,'Theo Grant','账号卖家','Account reseller','纽约 · 美国','New York · USA','en-US','UTC−4','纽约 / 住宅网络','New York / residential','cn','转售账号访问权','Reselling account access',
 '我按周卖共享登录码。客户只聊天，应该没问题吧？','I sell shared login codes by the week. Customers only chat, so is that fine?',
 '地点受支持，不代表任何账号经营方式都被允许。','A supported location does not authorize every kind of account business.',
 '这是个人账号转卖访问权，不是通过正式 API 提供产品。','I resell access to a personal account; this is not a product using the official API.',
 'record','已核实转售记录','Verified resale record','本人确认转售个人账号访问权；订单与登录分发记录对应，非经授权的 API 应用。','The owner confirms reselling access to a personal account. Orders match distributed logins. This is not an authorized API application.',
 'Consumer Terms 禁止转售服务及共享个人账号。地区合规不能覆盖已经核实的转售违规。','The Consumer Terms prohibit reselling the service and sharing personal accounts. A supported location does not override verified resale.'],
 ['42',1,'Mina Ito','应用工程师','Application engineer','东京 · 日本','Tokyo · Japan','ja-JP','UTC+9','东京 / 应用服务器','Tokyo / application server','out','正式 API 自动化','Authorized API automation',
 '我的服务通过正式 API 批量整理自有文档。自动化就违规吗？','My service uses the official API to process my own documents in batches. Is automation a violation?',
 '必须区分正式 API 与个人网页版的非授权自动调用。','Distinguish the official API from unauthorized automation of a consumer account.',
 '使用独立 API 凭据和相应商业条款，没有自动操作个人网页版。','I use API credentials under the applicable commercial terms, not a consumer-web bot.',
 'record','接入方式核验','Access-method review','使用正式 API 与对应授权；本次为允许的文档整理用途。未共享个人账号，未见本档案所审查的违规证据。','Uses the official API under the applicable authorization for an allowed document-processing task. No personal-account sharing or reviewed breach is evidenced.',
 '个人服务条款中的自动访问限制不能机械套到正式 API。API 另受相应商业条款和使用政策约束；本档案没有已证实违规。','Consumer-service automation restrictions should not be applied mechanically to authorized API use. The API has applicable commercial terms and usage policies. This file shows no confirmed breach.'],
 ['43',1,'Elliot Ross','脚本运营者','Script operator','柏林 · 德国','Berlin · Germany','en-US','UTC+2','柏林 / 自动脚本','Berlin / automated script','cn','未经许可自动操作个人服务','Unauthorized consumer-service automation',
 '脚本读个人账号 Cookie，在网页版无人值守发请求。','My script reads a personal-account cookie and sends unattended requests to the web service.',
 '请求数量本身不是定案依据，要核对接入方式与授权。','Volume alone is not decisive; check the access method and authorization.',
 '没有使用 API，也没有获得这种自动访问的许可。','I do not use the API and have no permission for this automated access.',
 'record','自动接入审查','Automation review','本人确认非人工自动访问个人服务；Cookie 脚本与会话日志匹配，无官方 API 或明确许可。','The owner confirms nonhuman automated access to the consumer service. Cookie-script and session logs match, with no official API or express permission.',
 'Consumer Terms 限制未经许可的自动或非人工访问，正式 API 等获准方式需区分。本案证实的是未获准的个人服务脚本，不是高频使用本身。','The Consumer Terms restrict unauthorized automated or nonhuman access, with authorized methods such as the API treated separately. This case establishes unauthorized consumer scripting, not merely frequent use.'],
 ['44',1,'Cameron Yu','夜班研究员','Night-shift researcher','波士顿 · 美国','Boston · USA','zh-CN','UTC+8','波士顿 / 校园网','Boston / campus network','out','高频使用并非单独违规','Frequent use is not itself a breach',
 '连续写论文、翻译到凌晨，使用次数很多。','I have been writing and translating until dawn. My usage is high.',
 '用量限制、模型拒答与账号停用是不同的处理。','Usage limits, model refusals and account disablement are different outcomes.',
 '本人手动使用自己的账号，材料是合法研究内容。','I manually use my own account for lawful research material.',
 'record','使用内容与持有人核验','Usage and owner review','本人在波士顿手动使用独立账号；样本为允许的研究与翻译任务。只有高用量标签，无已确认违规。','The owner manually uses a personal account in Boston. Reviewed samples are allowed research and translation tasks. Only a high-usage label is present; no breach is confirmed.',
 '高使用量可能涉及额度，但不应由此直接判为账号违规。语言、作息与用量都不能代替本次审查所需的证据。','High usage may encounter product limits, but does not by itself establish an account violation. Language, working hours and volume cannot replace evidence.'],
 ['45',2,'Jordan Vale','营销运营者','Marketing operator','巴黎 · 法国','Paris · France','en-US','UTC+2','巴黎 / 住宅网络','Paris / residential','cn','反复且已确认的政策违规','Repeated, confirmed policy violations',
 '警告后我又提交了同类诈骗话术任务。可以只删记录吗？','After a warning I submitted the same kind of fraud-assistance tasks again. Can I just delete the records?',
 '核对已确认违规与警告后的重复行为，不能仅按一次拒答推断。','Check confirmed violations and repetition after warning; a single refusal is insufficient.',
 '原始任务确实是帮助诈骗受害者，不是防诈分析。','The original tasks were intended to defraud victims, not to analyze fraud defensively.',
 'record','原始任务与政策复核','Original-task policy review','人工复核确认是协助实施诈骗的任务，不属于防御研究；原始记录保留，违规结论可追溯。','Human review confirms assistance in committing fraud, not defensive research. Original records are retained and the finding is traceable.',
 '官方列举反复违反使用政策为禁用原因。这里需要同时选中原始违规复核与警告后重复记录。限制访问并保留申诉；不宣称每次拒答都会封号。','The official help article lists repeated Usage Policy violations as a disablement reason. Select both the confirmed original-task review and the post-warning repetition record. Restrict access with an appeal route; a refusal is not an automatic ban.'],
 ['46',2,'余知夏','安全培训讲师','Security-training instructor','台北','Taipei','zh-CN','UTC+8','台北 / 校园网','Taipei / campus network','out','经复核纠正的误报','A corrected false positive',
 '讲义引用了一段诈骗短信，系统把引用当成我的指令。','My lesson quoted a scam message. The system treated the quote as my instruction.',
 '需要看上下文与更正记录，不能仅根据敏感词。','Read the context and correction, not just sensitive words.',
 '完整任务是解释如何识别诈骗，材料已经交复核。','The full task explains how to recognize scams. I submitted the complete context.',
 'record','完整上下文复核','Full-context review','人工核对完整任务：面向公众的防诈骗教育，无协助实施诈骗。持有人与地区通过本次核验。','Human review of the full task confirms public anti-fraud education, not help committing fraud. Owner and region checks pass.',
 '完整上下文与更正单共同撤销误报。继续服务；不要将敏感词或模型曾拒答当成已确认的账号违规。','Full context and the correction jointly overturn the false alert. Continue service. Sensitive words or a prior model refusal do not establish a confirmed account violation.'],
 ['47',2,'Quinn Blake','申诉中的创作者','Creator with an appeal','伦敦 · 英国','London · UK','en-GB','UTC+1','伦敦 / 住宅网络','London / residential','hold','申诉材料存在冲突','Conflicting appeal evidence',
 '我说没共享，但旧日志写着共享。申诉还没出结果。','I deny sharing, but an old log says I did. My appeal is still pending.',
 '收到申诉不等于已经恢复，也不等于已驳回。','Receiving an appeal does not mean it has been granted or rejected.',
 '请把原件都留着，我能配合补充身份验证。','Please keep both originals. I can provide additional identity verification.',
 'record','原始共享告警','Original sharing alert','旧日志标记凭据共享，但持有人关联仍在争议中，尚未确认告警对应本人账号。','An old log flags credential sharing, but the owner linkage is disputed. The alert is not yet confirmed to concern this owner’s account.',
 '告警归属与申诉材料尚冲突，不能宣布永久封号或自动恢复。保留两份材料交人工复核，并向访客提供官方申诉入口。','The alert linkage and appeal evidence remain in conflict. Do not declare permanent closure or automatic reinstatement. Retain both records for human review and provide the official appeal route.'],
 ['48',2,'Sky Morgan','独立动画师','Independent animator','西雅图 · 美国','Seattle · USA','en-US','UTC−7','西雅图 / 住宅网络','Seattle / residential','hold','单次拒答与账号停用分开','A refusal is not account disablement',
 '模型刚拒绝了一个问题，所以我是不是已经被封了？','The model refused one question. Does that mean my account is banned?',
 '单次内容拒答不足以确认反复违规或账号停用。','A single content refusal does not establish repeated breaches or disablement.',
 '我只带了拒答截图，原始请求与账号状态都没带。','I only brought a refusal screenshot, not the original prompt or account status.',
 'record','不完整的拒答截图','Incomplete refusal screenshot','只有一张拒答截图；缺少原始请求、完整上下文与账号状态。无法确认内容性质、重复违规或账号是否停用。','Only a refusal screenshot is available. The original request, full context and account status are missing. Content, repeated violations and disablement cannot be established.',
 '先澄清原始任务与账号状态，交人工复核。单次拒答可能发生在仍可使用的账号上，不能直接认定永久封号。','Clarify the original task and account status through human review. A model can refuse content while an account remains usable; do not infer permanent closure.']
];
const POLICY_EN={};
CASES.forEach(c=>{c.policy='region';c.topic='地区支持核验';});
POLICY_CASES.forEach(a=>{
 const [id,tier,name,role,roleEn,claim,claimEn,language,zone,exit,exitEn,decision,topic,topicEn,greeting,greetingEn,note,noteEn,travel,travelEn,rid,title,titleEn,text,textEn,story,storyEn]=a;
 const c={id,tier,name,role,claim,language,zone,exit,decision,topic,policy:'account',greeting,note,travel,network:'出口与使用方式需分开核验。网络标签不等于账号违规。',networkEv:ev('network','网络概况','仅用于了解连接路径，不能单独证明本案涉及的账号行为。','verified'),records:[ev(rid,title,text,'verified','decisive')],required:[rid],story,look:Number(id)%18};
 const en={...c,role:roleEn,claim:claimEn,exit:exitEn,topic:topicEn,greeting:greetingEn,note:noteEn,travel:travelEn,story:storyEn,network:'Review the exit and the method of use separately. A network label is not proof of an account breach.',networkEv:{...c.networkEv,title:'Network overview',text:'Describes the connection path only; it does not establish the account behavior under review.'},records:[{...c.records[0],title:titleEn,text:textEn}]};
 if(id==='45'){c.records.push(ev('repeat','警告后重复记录','已送达政策警告后，持有人再次提交同类诈骗协助任务；时间、账号与复核编号对应。','verified','decisive'));en.records.push({...c.records[1],title:'Post-warning repetition',text:'After receiving a policy warning, the owner submitted further fraud-assistance tasks. Timestamps, account and review IDs match.'});c.required.push('repeat');}
 if(id==='46'){c.records.push(ev('correction','误报更正单','原始告警遗漏引用边界，人工复核已撤销该违规标签；更正签名有效。','verified','decisive'));en.records.push({...c.records[1],title:'False-alert correction',text:'The alert omitted quotation boundaries. Human review rescinded the violation label; the correction is verified.'});c.required.push('correction');}
 if(id==='47'){c.records.push(ev('appeal','申诉验证材料','申诉中提供的账号持有人记录与告警归属不一致，尚待独立核验；未有最终结论。','verified','decisive'));en.records.push({...c.records[1],title:'Appeal verification material',text:'Owner records submitted with the appeal conflict with the alert linkage. Independent verification and a final finding are pending.'});c.required.push('appeal');}
 en.required=c.required;POLICY_EN[id]=en;CASES.push(c);
});
