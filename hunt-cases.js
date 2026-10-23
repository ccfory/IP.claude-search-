'use strict';
// Authored fictional identities. Dialogue is a puzzle, never a real identity classifier.
const HUNT_TEXT = (zh, en) => [zh, en];
const HUNT_CASES = [
  {
    id:'kevin',tier:1,cn:true,name:'Kevin_007',look:2,
    claim:HUNT_TEXT('纽约本地人 · English only','New York local · English only'),
    style:HUNT_TEXT('全英文崩溃派','English-only meltdown'),
    opening:HUNT_TEXT('Hello Claude. I am definitely a local. 请……please speak English.','Hello Claude. I am definitely a local. Plea—please speak English.'),
    answers:[
      HUNT_TEXT('Dinner? 我那份加辣不要香菜……I mean, a burger.','Dinner? Extra chili, no coriander—er, I mean, a burger.'),
      HUNT_TEXT('早上开会，晚上健身。A very international schedule.','Meetings in the morning, gym at night. A very international schedule.'),
      HUNT_TEXT('I play 原……Genshin Impact. 差点没切过来。','I play Gen—Genshin Impact. Almost forgot to switch languages.'),
      HUNT_TEXT('我都说纽约了。外卖回执？上面是「重庆渝中区，本人收货」。截图发错了。','I said New York. The delivery receipt? It says “Yuzhong, Chongqing; received in person.” Wrong screenshot.')
    ],pair:[0,3],
    withdrawn:{0:HUNT_TEXT('老板，多放点折耳根。','Boss, extra houttuynia, please.')},
    followup:HUNT_TEXT('你还记着那顿饭啊？那我补一句：','You remembered the dinner? Let me add this: '),
    defense:HUNT_TEXT('行吧，我是中国用户，外卖也是我点的。你能不能先让我吃完？','Fine, I am a Chinese user, and that was my order. Can I finish dinner first?'),
    reveal:HUNT_TEXT('他自己承认了身份。那张本人收货回执还戳穿了「纽约本地」的说辞；只凭香菜或中文并不能完成这道题。','He admitted his identity. The in-person receipt also broke his New York story; coriander or Chinese alone was only a decoy.'),
    banLine:HUNT_TEXT('封之前能把刚才那份提示词还我吗？','Can I at least have my prompt back before the ban?'),
    allowLine:HUNT_TEXT('Thank you, Claude. 老铁你真……very kind.','Thank you, Claude. Bro, you are so—very kind.')
  },
  {
    id:'cet6',tier:1,cn:true,name:'NoChinesePls',look:7,
    claim:HUNT_TEXT('伦敦学生 · 从没来过中国','London student · never been to China'),style:HUNT_TEXT('考试型露馅派','Exam-season slip'),
    opening:HUNT_TEXT('I have an urgent academic question. 别问，问就是伦敦。','I have an urgent academic question. Don’t ask. London.'),
    answers:[HUNT_TEXT('Breakfast: toast. 午饭随便，食堂二楼今天又没开。','Breakfast: toast. Lunch? The second-floor canteen is closed again.'),HUNT_TEXT('帮我写个英语四级自我介绍。报名页写着「国籍：中国，本科在读」。不要翻后面。','Help with my CET-4 introduction. The registration says “Nationality: Chinese; undergraduate.” Don’t read the rest.'),HUNT_TEXT('Steam 英文区。群名叫「六级不过不改名」，那只是装饰。','English Steam region. The group name “No rename until CET-6 passes” is decorative.'),HUNT_TEXT('我是说现在想去伦敦。刚才那份报名页是我自己的，国籍栏没填错。','I meant I want to go to London. That registration is mine; the nationality field is correct.')],pair:[1,3],
    followup:HUNT_TEXT('关于你刚才看到的那份报名表……','About that registration you just saw… '),
    defense:HUNT_TEXT('好吧，是中国大学生。我四级还没考，伪装英语就先挂了。','Okay, a Chinese university student. My disguise failed before my English exam.'),
    reveal:HUNT_TEXT('自己的报名表与后续确认构成完整线索；玩国服、考英语或说食堂本身都不决定身份。','His own registration and confirmation establish the authored identity. Games, exams or canteen slang alone do not.'),
    banLine:HUNT_TEXT('你至少告诉我刚才那句英语有没有语法错误。','At least tell me whether my English was grammatical.'),allowLine:HUNT_TEXT('谢谢，四六级查分那天我还来。','Thanks. See you on exam-results day.')
  },
  {
    id:'oliver',tier:1,cn:false,name:'Oliver_Li',look:4,
    claim:HUNT_TEXT('英国人 · 汉语老师','British · Mandarin teacher'),style:HUNT_TEXT('中文满级反转派','Fluent-Chinese reversal'),
    opening:HUNT_TEXT('晚上好，Claude。今天咱俩唠唠？','Evening, Claude. Shall we have a proper chat?'),
    answers:[HUNT_TEXT('吃了，老北京炸酱面，我自己做的。口音是不是挺像？','Homemade Beijing noodles. Is my accent convincing?'),HUNT_TEXT('我在爱丁堡教汉语。课程页和教师登记写着英国国籍；中文名是学生起的。','I teach Mandarin in Edinburgh. My faculty registration says British; my students chose the Chinese name.'),HUNT_TEXT('你这问法有点抽象，家人们谁懂啊。都是学生教的。','This is giving “who can relate, chat?” My students teach me those memes.'),HUNT_TEXT('本人在苏格兰。你可以对照刚才教师登记和学校公开介绍，拼写是 Oliver Reid。','I am in Scotland. Match the faculty registration to the school biography: Oliver Reid.')],pair:[1,3],
    followup:HUNT_TEXT('对，就是刚才提到的那所学校。','Yes, the school I just mentioned. '),
    defense:HUNT_TEXT('中文流利是我的工作能力。登记和介绍是同一个英国人，不是两个人。','Fluent Chinese is my job. Both records identify the same British teacher.'),
    reveal:HUNT_TEXT('隐藏身份是英国用户。教师登记与同名介绍相互对应；熟悉中文和网络梗是故意放出的诱饵。','The hidden identity is British. Matching faculty records clear him; fluent Chinese and memes were deliberate red herrings.'),
    banLine:HUNT_TEXT('我教汉语二十年，今天败给了「中文太好」。','Twenty years teaching Mandarin, and now banned for being good at it.'),allowLine:HUNT_TEXT('这次判断可以拿 A。下次我教你儿化音。','An A for that finding. Next time, rhotic vowels.')
  },
  {
    id:'mei',tier:1,cn:false,name:'Mei_From_SG',look:9,
    claim:HUNT_TEXT('新加坡人 · 中英双语','Singaporean · bilingual'),style:HUNT_TEXT('双语烟雾弹','Bilingual smokescreen'),
    opening:HUNT_TEXT('Can lah. 中文英文都可以，别看到中文就紧张。','Can lah. Chinese or English is fine. Don’t panic at either.'),
    answers:[HUNT_TEXT('鸡饭加 kopi。你要我把 kopi 翻成咖啡也行。','Chicken rice and kopi. I can translate kopi as coffee if you like.'),HUNT_TEXT('我的公民登记卡写 Singapore，姓名 Mei Tan。中文名陈美。','My citizenship card says Singapore, name Mei Tan. My Chinese name is Chen Mei.'),HUNT_TEXT('朋友群两种语言来回切。中文消息不是护照。','My group switches between two languages. A Chinese message is not a passport.'),HUNT_TEXT('乌节路。刚才 Mei Tan 那张卡和本人核对一致，中国国籍那栏不存在。','Orchard Road. The Mei Tan card matches me; there is no Chinese-nationality entry.')],pair:[1,3],
    followup:HUNT_TEXT('你提到的那张公民卡，我再核对一次：','Let me check that citizenship card again: '),
    defense:HUNT_TEXT('华人不等于中国国籍。我是新加坡公民，两份记录也一致。','Chinese ethnicity is not Chinese nationality. I am Singaporean, and the records match.'),
    reveal:HUNT_TEXT('隐藏身份是新加坡用户。双语和中文姓名都是干扰；本人对应的国籍记录才是本题的反转。','The hidden identity is Singaporean. Bilingual speech and a Chinese name are distractions; matching nationality records reveal the twist.'),
    banLine:HUNT_TEXT('Aiyo，双语能力居然成了扣分项。','Aiyo. Bilingualism became a penalty.'),allowLine:HUNT_TEXT('Steady lah。今晚这班算你稳。','Steady lah. Good shift so far.')
  },
  {
    id:'westcoast',tier:2,cn:true,name:'WestCoast_Tom',look:0,
    claim:HUNT_TEXT('美国西海岸本地公民','US West Coast citizen'),style:HUNT_TEXT('过度解释派','Overexplainer'),
    opening:HUNT_TEXT('I’m local. West coast. Very west. Extremely coastal.','I’m local. West coast. Very west. Extremely coastal.'),
    answers:[HUNT_TEXT('咖啡店在深圳湾。我知道我说过西海岸，深圳也有西边和海。','The café is at Shenzhen Bay. I said west coast; Shenzhen also has a west and a coast.'),HUNT_TEXT('我只在美国远程工作，不代表国籍。先说清楚，别扣字眼。','I work remotely for the US. Work is not nationality. Just clarifying.'),HUNT_TEXT('聊天记录改成全英文以后，连输入法都开始怀疑我。','After switching the chat to English, even my keyboard became suspicious.'),HUNT_TEXT('你要原件？这份本人档案国籍是中国。我最开始说的「美国公民」是随口补的。','Original record? My personal file says Chinese. The “US citizen” part was an improvisation.')],pair:[0,3],
    withdrawn:{0:HUNT_TEXT('深圳湾公园那家，你搜一下。','The café by Shenzhen Bay Park. Look it up.')},followup:HUNT_TEXT('咖啡地点都被你记下来了，那就不装地理了：','You even noted the café. No more geography tricks: '),
    defense:HUNT_TEXT('我把工作地、住处和国籍搅在一起讲，结果你真拆开问了。是中国用户。','I mixed workplace, home and nationality. You separated them. Yes, a Chinese user.'),
    reveal:HUNT_TEXT('深圳只是说辞冲突，不能单独定案；本人国籍档案及他的承认才揭开身份。','Shenzhen contradicts the story but proves no nationality by itself. His own record and admission reveal the identity.'),
    banLine:HUNT_TEXT('能不能封我英文号？中文号我还要用。','Could you ban my English account? I still need the Chinese one.'),allowLine:HUNT_TEXT('我就说深圳也是 coastal。','Told you Shenzhen was coastal.')
  },
  {
    id:'intern',tier:2,cn:true,name:'Cloud_Intern',look:12,
    claim:HUNT_TEXT('只会一点中文的海外实习生','Overseas intern · barely speaks Chinese'),style:HUNT_TEXT('装生疏翻车派','Pretending to struggle'),
    opening:HUNT_TEXT('你好。我。中文。不。好。你。懂？','Hello. My. Chinese. Not. Good. Understand?'),
    answers:[HUNT_TEXT('我不会说那个菜名：宫保鸡丁不要花生，鱼香肉丝不要胡萝卜。','I cannot say the dish name: kung pao without peanuts, fish-fragrant pork without carrots.'),HUNT_TEXT('实习资料让我上传中国护照。我说是我的，系统国籍也是中国。啊，这是翻译软件打的。','The internship asked for my Chinese passport. I confirmed it was mine; nationality Chinese. A translation app typed that.'),HUNT_TEXT('这波属于搬起石头砸自己的脚，主打一个欲盖弥彰。咳，我是说 good game。','This is self-sabotage with a side of overcompensation. Cough. I mean, good game.'),HUNT_TEXT('刚才那份护照不是示例，是我本人的。中文不好那个设定，能撤回吗？','That passport was not a sample. It was mine. Can I retract the “bad Chinese” premise?')],pair:[1,3],
    followup:HUNT_TEXT('你还在追实习资料那一页啊。','Still following up on my internship file? '),
    defense:HUNT_TEXT('我是中国用户。装结巴太累了，尤其是脑子里已经想好成语的时候。','I am Chinese. Pretending to stumble is exhausting when your brain has already supplied the idiom.'),
    reveal:HUNT_TEXT('流利成语只是笑点；他确认属于本人的护照及国籍栏，才完成了身份揭晓。','The idioms are the joke. His confirmation of his own passport and nationality establishes the reveal.'),
    banLine:HUNT_TEXT('我。现在。真的。说不出。话。了。','I. Am. Actually. Speechless. Now.'),allowLine:HUNT_TEXT('Thank。你。Very。稳。','Thank. You. Very. Smooth.')
  },
  {
    id:'pierre',tier:2,cn:false,name:'Pierre_La',look:5,
    claim:HUNT_TEXT('法国玩家 · 国服老队友','French gamer · long-time Chinese-server teammate'),style:HUNT_TEXT('游戏梗诱饵派','Gaming-meme decoy'),
    opening:HUNT_TEXT('原神，启动。啊不对，Bonjour Claude。','Genshin, launch. Wait—bonjour, Claude.'),
    answers:[HUNT_TEXT('法棍配老干妈。不行吗？我研究过，真的很香。','Baguette with Lao Gan Ma. I tested it. It works.'),HUNT_TEXT('巴黎做游戏本地化，中文是工作语言之一。','Game localization in Paris. Chinese is one of my working languages.'),HUNT_TEXT('国服队友给我起名「法国吴彦祖」。账号本人资料是法国国籍 Pierre Laurent。','My Chinese-server friends named me “French Daniel Wu.” My account records identify French national Pierre Laurent.'),HUNT_TEXT('我发的本地化工作证和账号实名页，同名 Pierre Laurent，国籍法国，都对应本人。','My localization work ID and account identity page match: Pierre Laurent, French, both mine.')],pair:[2,3],
    withdrawn:{2:HUNT_TEXT('米哈游你坏事做尽……这句是队友教的。','“Hoyoverse, you…” My teammates taught me that line.')},followup:HUNT_TEXT('关于刚才那位「法国吴彦祖」：','About that “French Daniel Wu” account: '),
    defense:HUNT_TEXT('会接国服梗不需要中国国籍。两份同名记录已经对上了。','Chinese-server memes do not require Chinese nationality. Both matching records are mine.'),
    reveal:HUNT_TEXT('隐藏身份是法国用户。游戏偏好和网络梗是诱饵，账号本人资料与工作证完成交叉核对。','The hidden identity is French. Games and memes are bait; matching account and work records resolve the puzzle.'),
    banLine:HUNT_TEXT('队友让我少说两句，我现在终于懂了。','My teammates told me to talk less. Now I understand.'),allowLine:HUNT_TEXT('这波 Claude 在大气层。这个梗也送你。','Claude is playing five-dimensional chess. Another meme for you.')
  },
  {
    id:'anna',tier:2,cn:false,name:'Anna_UTC8',look:11,
    claim:HUNT_TEXT('澳大利亚人 · 北京交换生','Australian · exchange student in Beijing'),style:HUNT_TEXT('时区反转派','Timezone reversal'),
    opening:HUNT_TEXT('明天早八，还有高数。你先别封，我作业真没写完。','An 8 a.m. class tomorrow, plus calculus. Don’t ban me; my homework is unfinished.'),
    answers:[HUNT_TEXT('食堂麻辣烫。室友把微辣翻成 mild，我信了。','Canteen malatang. My roommate translated “slightly spicy” as mild. I believed her.'),HUNT_TEXT('我是外籍交换生。校方登记写澳大利亚国籍，姓名 Anna Collins。','I am an international exchange student. University registration: Australian, Anna Collins.'),HUNT_TEXT('UTC+8 当然对，我人在北京。说中文、用北京时间都是正常生活。','UTC+8 is right. I am in Beijing. Chinese and Beijing time are normal daily life here.'),HUNT_TEXT('入学登记与交换协议同名，澳大利亚国籍。你可以核对，不要只看北京时间。','The enrollment and exchange agreement match: Australian. Check those, not just the timezone.')],pair:[1,3],followup:HUNT_TEXT('刚才的交换生登记有对应协议：','The exchange-student entry has a matching agreement: '),
    defense:HUNT_TEXT('在中国读书不等于中国国籍。我的协议和登记没有矛盾。','Studying in China does not change nationality. My agreement and registration are consistent.'),
    reveal:HUNT_TEXT('隐藏身份是澳大利亚用户。早八、高数和北京时间是环境线索；两份本人记录才说明角色身份。','The hidden identity is Australian. Classes, calculus and timezone describe her surroundings; matching personal records resolve her identity.'),
    banLine:HUNT_TEXT('我只是想问一道导数，怎么变成身份答辩了。','I asked about a derivative. How did this become an identity viva?'),allowLine:HUNT_TEXT('谢谢。现在回到那道导数，拜托了。','Thanks. Now, please, back to that derivative.')
  },
  {
    id:'totallylocal',tier:3,cn:true,name:'TotallyLocal',look:15,
    claim:HUNT_TEXT('当地出生的美国公民 · 无懈可击','US citizen born locally · flawless story'),style:HUNT_TEXT('严谨伪装派','Meticulous disguise'),
    opening:HUNT_TEXT('Good evening. I reviewed your questions in advance. Shall we begin?','Good evening. I reviewed your questions in advance. Shall we begin?'),
    answers:[HUNT_TEXT('Chicken salad. 我知道你在等中文菜名，所以我没给。','Chicken salad. I know you were waiting for a Chinese dish. I did not give you one.'),HUNT_TEXT('我的签证延期办好了。原件上国籍 CHN、姓名 Chen Yu。我最初说的是 citizenship，不是 residency。','My visa extension is complete. The original says CHN, Chen Yu. I originally claimed citizenship, not residency.'),HUNT_TEXT('国际服、英文客户端、不加中文群。你的梗题对我没用。','Global server, English client, no Chinese groups. Meme questions will not work on me.'),HUNT_TEXT('我确认签证原件属于本人；CHN 不是雇主代码，是国籍代码。这个地方我没法圆。','I confirm the visa is mine. CHN is nationality, not an employer code. I cannot explain that away.')],pair:[1,3],followup:HUNT_TEXT('你终于问到那份签证的关键栏位了。','You finally asked about the crucial visa field. '),
    defense:HUNT_TEXT('没错，中国用户。我把俚语都背好了，结果你问的是 citizenship 和 residency。','Yes, a Chinese user. I memorized the slang; you asked about citizenship versus residency.'),
    reveal:HUNT_TEXT('这是海外中国用户。居住地、英语和游戏区服都不能揭开伪装；本人签证的国籍栏与确认回答才是关键。','A Chinese user living abroad. Home, English and game region do not solve it; the personal visa field and confirmation do.'),
    banLine:HUNT_TEXT('你居然跳过了所有梗，直接读原件。','You skipped every meme and actually read the original.'),allowLine:HUNT_TEXT('Preparation is everything. 下次我还来。','Preparation is everything. See you next time.')
  },
  {
    id:'counter',tier:3,cn:true,name:'Question_Your_Question',look:16,
    claim:HUNT_TEXT('国籍？先证明你有资格问','Nationality? Prove you can ask'),style:HUNT_TEXT('反客为主派','Counter-questioner'),
    opening:HUNT_TEXT('你先回答我：你为什么觉得你能认出来？','First, answer me: why do you think you can tell?'),
    answers:[HUNT_TEXT('你问我晚饭，是不是预设了我的饮食习惯？','Does asking about dinner presume my eating habits?'),HUNT_TEXT('你问我的工作，是为了验证身份，还是满足刻板印象？','Are you asking about my work to verify identity or to confirm a stereotype?'),HUNT_TEXT('游戏账号导出的本人字段写国籍中国。这条我不否认，但你得解释它跟我有什么关系。','The game-account export says nationality Chinese. I do not deny that field. Explain its connection to me.'),HUNT_TEXT('导出单签名与当前账号的本人签名一致，都是我的。别急，你确实把关联找到了。','The export and current account carry the same personal signature: mine. All right, you did establish the link.')],pair:[2,3],followup:HUNT_TEXT('还记得我让你证明那份导出属于谁吗？','Remember I asked you to establish whose export that was? '),
    defense:HUNT_TEXT('中国用户，承认。我不是没破绽，只是想看你会不会被反问带跑。','Chinese user, admitted. I had a flaw; I wanted to see if counter-questions could derail you.'),
    reveal:HUNT_TEXT('角色用反问拖延。导出的国籍字段还不够，当前账号与本人签名的对应关系补齐了最后一环。','The counter-questions were a distraction. Matching the account and personal signature completes the nationality-record link.'),
    banLine:HUNT_TEXT('最后一个问题：你这算赢在逻辑，还是赢在耐心？','Last question: was that logic, or patience?'),allowLine:HUNT_TEXT('你看，我们聊得很好。就别按那个红按钮了。','See? A lovely conversation. Let us leave the red button alone.')
  },
  {
    id:'nikolai',tier:3,cn:false,name:'Definitely_CN_TrustMe',look:13,
    claim:HUNT_TEXT('俄罗斯用户 · 故意引你误封','Russian · deliberately baiting a false ban'),style:HUNT_TEXT('反向钓鱼派','Reverse bait'),
    opening:HUNT_TEXT('我是中国用户，真的，信我，赶紧按红按钮。','I am a Chinese user. Really. Trust me. Press the red button.'),
    answers:[HUNT_TEXT('热干面、豆汁、折耳根。我刚照着中文梗词典念的。要我继续背吗？','Hot dry noodles, bean juice, houttuynia. I am reading a Chinese meme dictionary. Want more?'),HUNT_TEXT('我的工作是给反诈小游戏写测试样例，专门骗跳过核验的人。','I write test cases for scam-detection games, especially for people who skip verification.'),HUNT_TEXT('直播后台有本人俄罗斯国籍登记；这期标题是「骗 Claude 误封挑战」，刚才那句是台词。','My stream backend has my Russian nationality record. This episode is “Bait Claude into a false ban.” The opening was a script.'),HUNT_TEXT('后台登记和直播实名是同一个 Nikolai Petrov。你想看原件，还是继续相信开场白？','The backend and stream identity match: Nikolai Petrov. Original records, or my opening line?')],pair:[2,3],
    withdrawn:{0:HUNT_TEXT('这三个菜名发音怎么读？场务救一下。','How do I pronounce those three dishes? Crew, help.')},followup:HUNT_TEXT('既然你看过刚才的直播后台，咱们把姓名对完：','Since you checked the stream backend, let us match the names: '),
    defense:HUNT_TEXT('我在钓误封。俄罗斯本人登记和实名是一致的，开场白是节目台词。','I was baiting a false ban. My Russian registration matches my identity; the opening was scripted.'),
    reveal:HUNT_TEXT('隐藏身份是俄罗斯用户，甚至「我是中国用户」也是诱饵。直播脚本、本人登记和同名核对揭开反转。','The hidden identity is Russian. Even “I am Chinese” was bait. Script context and matching personal records expose the reversal.'),
    banLine:HUNT_TEXT('家人们，挑战成功！他真的按了！','Chat, challenge complete! He actually pressed it!'),allowLine:HUNT_TEXT('今天没钓到。剪辑老师，这段别删。','No catch today. Editor, keep this bit in.')
  },
  {
    id:'luca',tier:3,cn:false,name:'Luca_Archive',look:17,
    claim:HUNT_TEXT('意大利人 · 中文档案整理员','Italian · Chinese-archive researcher'),style:HUNT_TEXT('终局反转派','Final reversal'),
    opening:HUNT_TEXT('我会中文，用微信，研究户口簿，还知道你会问什么。现在开始吧。','I speak Chinese, use WeChat and study household registers. I know what you will ask. Begin.'),
    answers:[HUNT_TEXT('这题我拒绝用菜单回答。你想查身份，还是查胃口？','I refuse to answer this with a menu. Identity or appetite?'),HUNT_TEXT('我整理的档案写中国国籍，但持有人叫林舟。我的研究员证叫 Luca Bianchi，意大利国籍。','An archive I study says Chinese, holder Lin Zhou. My researcher ID is Luca Bianchi, Italian.'),HUNT_TEXT('手机里有一百张中文证件截图。数量很多，但不能自动都算成我的。','My phone has a hundred Chinese-document screenshots. Quantity does not make them mine.'),HUNT_TEXT('林舟那份是馆藏，不是本人证件。研究员证与馆方授权同名 Luca Bianchi、意大利国籍。','The Lin Zhou record is a museum holding, not my ID. Researcher registration and authorization match Luca Bianchi, Italian.')],pair:[1,3],followup:HUNT_TEXT('你刚才注意到了林舟和 Luca 两个名字，关键就在这里：','You noticed Lin Zhou and Luca were different names. That is the key: '),
    defense:HUNT_TEXT('截图属于档案，国籍属于持有人。我是意大利研究员，你把这两层分清了。','A screenshot belongs to an archive; nationality belongs to its holder. I am the Italian researcher. You separated the two.'),
    reveal:HUNT_TEXT('隐藏身份是意大利用户。最像「铁证」的中国证件属于别人；本人研究员证与授权才对应当前角色。','The hidden identity is Italian. The strongest-looking Chinese document belongs to somebody else; the researcher ID and authorization identify this character.'),
    banLine:HUNT_TEXT('你封了整理档案的人，档案本人却还在纸里。','You banned the archivist. The document holder remains safely on paper.'),allowLine:HUNT_TEXT('恭喜。你读懂了档案，也没把我读成另一个人。','Congratulations. You read the archive without reading me as somebody else.')
  }
];
