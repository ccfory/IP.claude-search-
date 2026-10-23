'use strict';
// Original fictional dialogue inspired by public community humor; no real ban rules.
const HUNT_CASES = [
  {
    "id": "kevin",
    "tier": 1,
    "cn": true,
    "name": "Kevin_007",
    "look": 2,
    "claim": [
      "纽约本地人 · English only",
      "New York local · English only"
    ],
    "style": [
      "全英文崩溃派",
      "English-only meltdown"
    ],
    "opening": [
      "Hey Claude，先帮我看个 bug。个人信息的事，能不能等程序跑起来再说？",
      "Hey Claude, help me with a bug first. Can personal details wait until the program runs?"
    ],
    "answers": [
      [
        "汉堡。加辣、不放香菜——不是，汉堡怎么会有香菜？你就当我替朋友备注的。",
        "A burger. Extra chili, no coriander—wait, why would a burger have coriander? Call it a note for a friend."
      ],
      [
        "远程上班。老板找我一次，我心跳一下；你问我地址一次，我心跳两下。",
        "Remote work. My boss pings me, my heart skips once. You ask my address, twice."
      ],
      [
        "Genshin。你看，我这次把英文名完整说出来了。能不能算正常加分？",
        "Genshin. See, the full English name this time. Can I get points for sounding normal?"
      ],
      [
        "纽约，刚才说过了。你问外卖为什么送到重庆？那是……我朋友。等等，签收照片里怎么是我的睡衣。",
        "New York, as I said. Why did the order go to Chongqing? A friend’s. Wait, why am I in my pajamas in the delivery photo?"
      ]
    ],
    "pair": [
      0,
      3
    ],
    "withdrawn": {
      "0": [
        "老板，多放点折耳根。",
        "Boss, extra houttuynia, please."
      ]
    },
    "followup": [
      "你还记着那顿饭啊？那我补一句：",
      "Still on that dinner? Let me add this: "
    ],
    "defense": [
      "行吧，我是中国用户，外卖也是我点的。你把点单备注和本人签收连起来，我就没法继续说是朋友了。",
      "Fine. I am Chinese, and that was my order. Once you matched the food note to my delivery photo, “a friend” stopped working."
    ],
    "reveal": [
      "点单备注与本人签收拆穿了纽约说辞，角色随后承认中国用户身份。吃辣或说中文本身只是诱饵。",
      "The order note and personal delivery photo break the New York cover; the character then admits the scripted identity. Spice or Chinese alone was bait."
    ],
    "banLine": [
      "先把 bug 修了行不行？我怕下一个号还得从环境配置讲起。",
      "Can we fix the bug first? I dread explaining my environment again on the next account."
    ],
    "allowLine": [
      "Thanks，哥——good sir。我今天英语发挥超常。",
      "Thanks, bro—good sir. My English is exceptionally good today."
    ],
    "banter": {
      "ban": [
        "别急着封。我环境描述才打了三行，已经删掉了两个“国内”。",
        "Don’t ban yet. Three lines of environment notes, and I already deleted “back home” twice."
      ],
      "refund": [
        "退款以后 bug 还在。钱能原路退，报错不能原路消失。",
        "The bug survives a refund. Money goes back; the error stays put."
      ],
      "code": [
        "对对对，先修 bug。等测试变绿，你爱问几个个人问题我都……我们再商量。",
        "Yes, bug first. Once tests go green, ask any personal—let’s negotiate that later."
      ],
      "memory": [
        "你别记住我的家乡，记住我那个依赖版本就行。",
        "Remember my dependency version, not my hometown."
      ],
      "language": [
        "我不是突然会中文，是刚才那句英文还没编完。",
        "I didn’t suddenly become fluent in Chinese; I just hadn’t finished inventing the English sentence."
      ]
    },
    "voice": {
      "stall": [
        "等一下，你这问题我得重新组织语言。",
        "Wait, I need to rephrase that."
      ],
      "pressure": [
        "别急着封。我环境描述才打了三行，已经删掉了两个“国内”。",
        "Don’t ban yet. Three lines of environment notes, and I already deleted “back home” twice."
      ],
      "repeat": [
        "我不是突然会中文，是刚才那句英文还没编完。",
        "I didn’t suddenly become fluent in Chinese; I just hadn’t finished inventing the English sentence."
      ],
      "wrongPair": [
        "你这两条线接得挺有想象力，但先别替我写结局。",
        "Imaginative connection. Don’t write my ending just yet."
      ]
    }
  },
  {
    "id": "cet6",
    "tier": 1,
    "cn": true,
    "name": "NoChinesePls",
    "look": 7,
    "claim": [
      "伦敦学生 · 从没来过中国",
      "London student · never been to China"
    ],
    "style": [
      "考试型露馅派",
      "Exam-season slip"
    ],
    "opening": [
      "Good evening。我把想问你的话翻译了两遍，你能不能先看需求，别看我。",
      "Good evening. I translated my question twice. Could you inspect the request instead of me?"
    ],
    "answers": [
      [
        "Toast。学校食堂的 toast。你别问我为什么食堂窗口叫兰州拉面，面包只是暂时没到。",
        "Toast. University-canteen toast. Don’t ask why the stall says Lanzhou Noodles. The bread is temporarily missing."
      ],
      [
        "准备一个很国际化的考试。CET-4。你先别搜全称，给我留点发挥空间。",
        "Preparing for an international-sounding exam. CET-4. Please don’t look up the full name. Let me improvise."
      ],
      [
        "Steam 上练英语。队友说了句英文，我说收到；他说中文，我也差点说收到。",
        "Practicing English on Steam. An English call gets “copy”; a Chinese call almost gets the same answer."
      ],
      [
        "我之前说在伦敦，准确一点是准备申请伦敦。现在这份四级报名表是我的，国籍那栏你应该也看见了。",
        "I said London. More precisely, I plan to apply there. This CET-4 registration is mine. You have probably spotted the nationality field too."
      ]
    ],
    "pair": [
      1,
      3
    ],
    "followup": [
      "关于你刚才看到的那份报名表……",
      "About that registration you just saw… "
    ],
    "defense": [
      "对，中国大学生。四级报名是本人，伦敦是未来计划。我把将来时说成现在时，连伪装都输在语法。",
      "Yes, a Chinese university student. My own CET-4 registration; London is a future plan. My disguise failed a tense check."
    ],
    "reveal": [
      "本人报名表和“准备申请伦敦”的更正，戳穿了伦敦本地学生的说辞；角色最终承认身份。",
      "The personal exam registration and future London application expose the local-student story; the character then admits the identity."
    ],
    "banLine": [
      "封号前给我个口语分吧，至少告诉我有没有进步。",
      "Before the ban, give my spoken English a grade. Did I improve?"
    ],
    "allowLine": [
      "我宣布，今天这段比任何英语听力都刺激。",
      "Officially, this was more stressful than any listening exam."
    ],
    "banter": {
      "ban": [
        "我写英语作文都没这么反复改过开头。你这个对话框，比四级考场还安静。",
        "I rewrite this greeting more than an exam essay. This chat box is quieter than an examination hall."
      ],
      "refund": [
        "退款能不能顺便退点备考时间？我为了跟你聊天都开始练口语了。",
        "Could the refund include my study time? I started practicing spoken English for this chat."
      ],
      "code": [
        "代码能不能用简单英语解释？太地道我看不懂，太不地道又怕你看懂我。",
        "Explain the code in simple English. Too native and I won’t understand; too awkward and you might understand me."
      ],
      "memory": [
        "请把“四六级”记成一个无害的游戏昵称。",
        "Please remember CET-4 as a harmless gaming nickname."
      ],
      "language": [
        "我说“好的”只是礼貌，不是在填写身份表。",
        "“Okay” is politeness, not an identity form."
      ]
    },
    "voice": {
      "stall": [
        "等一下，你这问题我得重新组织语言。",
        "Wait, I need to rephrase that."
      ],
      "pressure": [
        "我写英语作文都没这么反复改过开头。你这个对话框，比四级考场还安静。",
        "I rewrite this greeting more than an exam essay. This chat box is quieter than an examination hall."
      ],
      "repeat": [
        "我说“好的”只是礼貌，不是在填写身份表。",
        "“Okay” is politeness, not an identity form."
      ],
      "wrongPair": [
        "你这两条线接得挺有想象力，但先别替我写结局。",
        "Imaginative connection. Don’t write my ending just yet."
      ]
    }
  },
  {
    "id": "oliver",
    "tier": 1,
    "cn": false,
    "name": "Oliver_Li",
    "look": 4,
    "claim": [
      "英国人 · 汉语老师",
      "British · Mandarin teacher"
    ],
    "style": [
      "中文满级反转派",
      "Fluent-Chinese reversal"
    ],
    "opening": [
      "Claude，吃了吗？这句我练了十年，你别让我刚开口就白练。",
      "Claude, have you eaten? I practiced that greeting for ten years. Please don’t make it a liability."
    ],
    "answers": [
      [
        "自己做的炸酱面。会做饭不算身份线索吧？要不我现在给它补一层黄油？",
        "Homemade zhajiang noodles. Cooking is not an identity document, right? Shall I add butter to make it safer?"
      ],
      [
        "爱丁堡教汉语。最尴尬的是：学生拿你练中文，我拿中文跟你证明我是英国老师。",
        "Teaching Mandarin in Edinburgh. My students practice Chinese with you; I use Chinese to establish that I am their British teacher."
      ],
      [
        "这题有点抽象，家人们谁懂。是学生教的，他们说学了这句就很地道。我现在怀疑他们在整我。",
        "This is so “who can relate, chat?” My students said that sounded authentic. I suspect a practical joke."
      ],
      [
        "苏格兰，Oliver Reid。教师登记和课程介绍都是这个名字。中文名是学生起的，英国护照可不是他们起的。",
        "Scotland. Oliver Reid on both faculty registration and the course page. My students chose my Chinese name, not my British passport."
      ]
    ],
    "pair": [
      1,
      3
    ],
    "followup": [
      "对，就是刚才提到的那所学校。",
      "Yes, the school I just mentioned. "
    ],
    "defense": [
      "你把学校介绍和本人登记对上了，对吧？英国人，汉语老师。中文太流利要是算问题，我这二十年算工伤。",
      "You matched the school page and my registration, right? British, Mandarin teacher. If fluency is a problem, twenty years of teaching becomes an occupational hazard."
    ],
    "reveal": [
      "隐藏身份是英国用户。教师登记与同名介绍相互对应；熟悉中文和网络梗是故意放出的诱饵。",
      "The hidden identity is British. Matching faculty records clear him; fluent Chinese and memes were deliberate red herrings."
    ],
    "banLine": [
      "我的学生得知我因为中文太好被误判，会直接笑到期末。",
      "My students will laugh until finals when they hear I was mistaken for being too good at Chinese."
    ],
    "allowLine": [
      "很好。你及格了，下一题我考你儿化音。",
      "Good. You passed. Next question: rhotic vowels."
    ],
    "banter": {
      "ban": [
        "学生说我中文像母语，我一直当夸奖。怎么到你这儿突然变成悬念了？",
        "My students say my Chinese sounds native. I thought it was praise. Why is it suspense here?"
      ],
      "refund": [
        "我不申请退款，申请你别把我的汉语水平算成国籍变更。",
        "No refund request. Just don’t count my Mandarin proficiency as a nationality change."
      ],
      "code": [
        "先看代码吧。中文注释是我的教学习惯，不是悬疑小说伏笔。",
        "Code first. Chinese comments are a teaching habit, not foreshadowing."
      ],
      "memory": [
        "记住我是汉语老师，这样下次我说成语你就不会像发现了隐藏成就。",
        "Remember I teach Mandarin. Then my next idiom won’t feel like a secret achievement."
      ],
      "language": [
        "是，我会中文。这个问题我从入职第一天回答到现在，你是唯一一个问完还盯着红按钮的。",
        "Yes, I speak Chinese. Been answering that since my first teaching day. You’re the only one who keeps an eye on a red button."
      ]
    },
    "voice": {
      "stall": [
        "等一下，你这问题我得重新组织语言。",
        "Wait, I need to rephrase that."
      ],
      "pressure": [
        "学生说我中文像母语，我一直当夸奖。怎么到你这儿突然变成悬念了？",
        "My students say my Chinese sounds native. I thought it was praise. Why is it suspense here?"
      ],
      "repeat": [
        "是，我会中文。这个问题我从入职第一天回答到现在，你是唯一一个问完还盯着红按钮的。",
        "Yes, I speak Chinese. Been answering that since my first teaching day. You’re the only one who keeps an eye on a red button."
      ],
      "wrongPair": [
        "你这两条线接得挺有想象力，但先别替我写结局。",
        "Imaginative connection. Don’t write my ending just yet."
      ]
    }
  },
  {
    "id": "mei",
    "tier": 1,
    "cn": false,
    "name": "Mei_From_SG",
    "look": 9,
    "claim": [
      "新加坡人 · 中英双语",
      "Singaporean · bilingual"
    ],
    "style": [
      "双语烟雾弹",
      "Bilingual smokescreen"
    ],
    "opening": [
      "Hello，晚上好，can lah。开场三种说法够不够？再加一种我就要收翻译费了。",
      "Hello, good evening, can lah. Three greetings enough? A fourth costs a translation fee."
    ],
    "answers": [
      [
        "鸡饭和 kopi。不是我在藏，是新加坡人真的会把几种语言放在一张菜单上。",
        "Chicken rice and kopi. I’m not hiding; Singapore genuinely puts several languages on one menu."
      ],
      [
        "今天在办新加坡公民登记的更新，名字 Mei Tan。你看中文名叫陈美，就想抢答了是吧？",
        "Updating my Singapore citizenship registration. Mei Tan. You saw the Chinese name Chen Mei and wanted to buzz in, didn’t you?"
      ],
      [
        "群里一句英文一句中文。你要按聊天语言分身份，我大概得被切成三份。",
        "My group alternates English and Chinese. Classify me by chat language and I’ll need three accounts at once."
      ],
      [
        "乌节路。本人核对也是 Mei Tan、新加坡公民。不是把 Chinese 和 Chinese-speaking 换着用就能把我套进去的。",
        "Orchard Road. The personal check also says Mei Tan, Singaporean. Chinese ethnicity and Chinese-speaking are not interchangeable with nationality."
      ]
    ],
    "pair": [
      1,
      3
    ],
    "followup": [
      "你提到的那张公民卡，我再核对一次：",
      "Let me check that citizenship card again: "
    ],
    "defense": [
      "两份本人记录都是新加坡公民。中文我会，英文我也会，但我不能因为多会一种语言就多领一本护照吧？",
      "Both personal records identify a Singapore citizen. I speak two languages, but that doesn’t grant me an extra passport."
    ],
    "reveal": [
      "隐藏身份是新加坡用户。双语和中文姓名都是干扰；本人对应的国籍记录才是本题的反转。",
      "The hidden identity is Singaporean. Bilingual speech and a Chinese name are distractions; matching nationality records reveal the twist."
    ],
    "banLine": [
      "Aiyo，看来我应该只发语音，至少让你多纠结两秒。",
      "Aiyo. I should have sent voice notes, just to make you hesitate two more seconds."
    ],
    "allowLine": [
      "Steady lah。这次你分清了语言和人，鸡饭给你加蛋。",
      "Steady lah. You separated language from identity. Extra egg on your chicken rice."
    ],
    "banter": {
      "ban": [
        "你先别急。我这句话一半英文一半中文，你总不能只封半个我吧。",
        "Hold on. Half this sentence is English, half Chinese. You can’t ban half of me."
      ],
      "refund": [
        "退款这事我们晚点讲，先把你对 bilingual 的理解退款重修一下。",
        "Refunds later. First, refund and relearn your definition of bilingual."
      ],
      "code": [
        "注释中英混着写，很新加坡，不是我忘了自己的设定。",
        "Bilingual code comments are very Singaporean, not a forgotten disguise."
      ],
      "memory": [
        "记住 Mei Tan，Singapore。别只把我那句中文存进记忆里。",
        "Remember Mei Tan, Singapore. Don’t save only the Chinese sentence."
      ],
      "language": [
        "Chinese-speaking。我特意把后半截说慢一点。",
        "Chinese-speaking. I’m emphasizing that second word."
      ]
    },
    "voice": {
      "stall": [
        "等一下，你这问题我得重新组织语言。",
        "Wait, I need to rephrase that."
      ],
      "pressure": [
        "你先别急。我这句话一半英文一半中文，你总不能只封半个我吧。",
        "Hold on. Half this sentence is English, half Chinese. You can’t ban half of me."
      ],
      "repeat": [
        "Chinese-speaking。我特意把后半截说慢一点。",
        "Chinese-speaking. I’m emphasizing that second word."
      ],
      "wrongPair": [
        "你这两条线接得挺有想象力，但先别替我写结局。",
        "Imaginative connection. Don’t write my ending just yet."
      ]
    }
  },
  {
    "id": "westcoast",
    "tier": 2,
    "cn": true,
    "name": "WestCoast_Tom",
    "look": 0,
    "claim": [
      "美国西海岸本地公民",
      "US West Coast citizen"
    ],
    "style": [
      "过度解释派",
      "Overexplainer"
    ],
    "opening": [
      "I’m from the west coast。你先别问是哪一片海，技术讨论没必要这么地理。",
      "I’m from the west coast. Don’t ask which sea yet. Technical discussions need not be so geographical."
    ],
    "answers": [
      [
        "深圳湾那家咖啡。啊不是，我是说一种西海岸风格的咖啡。店开在哪里，不影响它向往自由。",
        "Coffee from Shenzhen Bay. I mean, a west-coast-style coffee. Where the café stands doesn’t limit its aspirations."
      ],
      [
        "给美国团队远程做项目。你听到美国就点头了，听到远程又开始眯眼了，是吧？",
        "Remote projects for a US team. You nodded at “US” and narrowed your eyes at “remote”, didn’t you?"
      ],
      [
        "别人调代码，我调措辞。别人问 AI 怎么实现，我先问怎么说才不会被误会。",
        "Others debug code; I debug wording. Before asking how to implement it, I ask how to phrase it without raising eyebrows."
      ],
      [
        "好，住在深圳，中国护照也是我的。我之前说美国公民，是把“给美国人打工”概括得太有想象力。",
        "Fine: I live in Shenzhen and the Chinese passport is mine. “US citizen” was a very imaginative summary of “works for Americans”."
      ]
    ],
    "pair": [
      0,
      3
    ],
    "withdrawn": {
      "0": [
        "深圳湾公园那家，你搜一下。",
        "The café by Shenzhen Bay Park. Look it up."
      ]
    },
    "followup": [
      "咖啡地点都被你记下来了，那就不装地理了：",
      "You even noted the café. No more geography tricks: "
    ],
    "defense": [
      "中国用户，承认。工作在美国时区，住处在深圳，国籍没有跟着远程桌面一起过去。",
      "Chinese user, admitted. US working hours, Shenzhen home. Nationality did not travel through the remote desktop."
    ],
    "reveal": [
      "咖啡地点暴露了实际生活场景，随后本人资料和承认戳穿了美国公民说辞。工作地与国籍被故意混讲。",
      "The café exposes the living context; personal records and admission break the citizenship cover. Workplace and nationality were deliberately mixed."
    ],
    "banLine": [
      "封号能不能也远程一下，先封我那个远程桌面？",
      "Could the ban work remotely too? Start with the remote desktop?"
    ],
    "allowLine": [
      "解释得够长，地图就追不上我。",
      "With a long enough explanation, the map can’t catch up."
    ],
    "banter": {
      "ban": [
        "你别研究我措辞里的海岸线了，先研究一下这个空指针。",
        "Stop mapping the coastline in my wording. Map this null pointer instead."
      ],
      "refund": [
        "我预算里算了订阅费，没算地理答辩费。",
        "I budgeted for a subscription, not a geography viva."
      ],
      "code": [
        "代码一跑就知道对不对。我这段自我介绍，就得看你愿不愿意继续听。",
        "Code either runs or doesn’t. My introduction depends on how long you’ll listen."
      ],
      "memory": [
        "记忆里能不能把 west coast 整体保留？别单独标注我解释了十分钟。",
        "Can memory keep “west coast” as a whole? Not “explained it for ten minutes”."
      ],
      "language": [
        "我用中文是为了提高沟通效率。虽然目前看，主要提高了你的判断效率。",
        "Chinese is for efficient communication. Though it mainly seems to improve your judgment speed."
      ]
    },
    "voice": {
      "stall": [
        "等一下，你这问题我得重新组织语言。",
        "Wait, I need to rephrase that."
      ],
      "pressure": [
        "你别研究我措辞里的海岸线了，先研究一下这个空指针。",
        "Stop mapping the coastline in my wording. Map this null pointer instead."
      ],
      "repeat": [
        "我用中文是为了提高沟通效率。虽然目前看，主要提高了你的判断效率。",
        "Chinese is for efficient communication. Though it mainly seems to improve your judgment speed."
      ],
      "wrongPair": [
        "你这两条线接得挺有想象力，但先别替我写结局。",
        "Imaginative connection. Don’t write my ending just yet."
      ]
    }
  },
  {
    "id": "intern",
    "tier": 2,
    "cn": true,
    "name": "Cloud_Intern",
    "look": 12,
    "claim": [
      "只会一点中文的海外实习生",
      "Overseas intern · barely speaks Chinese"
    ],
    "style": [
      "装生疏翻车派",
      "Pretending to struggle"
    ],
    "opening": [
      "你好。我。中文。一般。你。慢点。问。——刚才的标点是不是太自然了？",
      "Hello. My. Chinese. Is. Limited. Ask. Slowly. Wait—was my punctuation suspiciously fluent?"
    ],
    "answers": [
      [
        "不知道这个菜怎么念，宫保鸡丁去花生，鱼香肉丝少胡萝卜。不是我中文好，是我忌口多。",
        "I can’t pronounce the dish: kung pao without peanuts, fish-fragrant pork without carrots. Not fluent, just picky."
      ],
      [
        "实习资料要填护照签发国。我刚想写 China，手已经比脑子先交卷了。",
        "The internship asks for passport country. I meant to think before typing China. My hand submitted first."
      ],
      [
        "你这属于……不是，我不会成语。刚才那个欲盖弥彰是输入法擅自发挥的。",
        "This is a case of—wait, I don’t know idioms. “Overcompensation” was my keyboard freelancing."
      ],
      [
        "对，护照是本人的，中国签发。中文不好的设定能不能重开？我刚才连省略号都打得太熟练了。",
        "Yes, my own Chinese-issued passport. Could I restart the bad-Chinese persona? Even my ellipses were too practiced."
      ]
    ],
    "pair": [
      1,
      3
    ],
    "followup": [
      "你还在追实习资料那一页啊。",
      "Still following up on my internship file? "
    ],
    "defense": [
      "我是中国用户。装不会中文最难的部分，是还得假装听不懂你在套我。",
      "I am Chinese. The hardest part of pretending not to understand Chinese is pretending not to notice the interrogation."
    ],
    "reveal": [
      "实习表的签发国与随后确认的本人护照相互对应，角色承认身份。成语和口吃表演是包袱，不是独立证据。",
      "The internship’s issuer field matches the confirmed personal passport; the character admits the identity. Idioms and fake pauses are the joke, not standalone evidence."
    ],
    "banLine": [
      "我。现在。真。沉默。了。",
      "I. Am. Actually. Silent. Now."
    ],
    "allowLine": [
      "Thank。你。下次。保证。更不熟练。",
      "Thank. You. Less. Fluent. Next. Time."
    ],
    "banter": {
      "ban": [
        "还没熟悉业务就先熟悉申诉流程，这实习也太全栈了。",
        "Learning appeals before learning the job. Very full-stack internship."
      ],
      "refund": [
        "能退的是订阅，退不了的是我刚才那个熟练的成语。",
        "The subscription can be refunded. That suspiciously fluent idiom cannot."
      ],
      "code": [
        "代码我不熟，中文我也……不熟。能不能别同时考两门？",
        "Code is unfamiliar, and Chinese is… unfamiliar too. Can we not test both at once?"
      ],
      "memory": [
        "这句别记。我下一句保证没这么熟练。",
        "Don’t remember this sentence. I promise the next will be less fluent."
      ],
      "language": [
        "这个成语是自动补全的。我本人只认识“Hello”。",
        "Autocomplete supplied the idiom. Personally I only know “Hello”."
      ]
    },
    "voice": {
      "stall": [
        "等一下，你这问题我得重新组织语言。",
        "Wait, I need to rephrase that."
      ],
      "pressure": [
        "还没熟悉业务就先熟悉申诉流程，这实习也太全栈了。",
        "Learning appeals before learning the job. Very full-stack internship."
      ],
      "repeat": [
        "这个成语是自动补全的。我本人只认识“Hello”。",
        "Autocomplete supplied the idiom. Personally I only know “Hello”."
      ],
      "wrongPair": [
        "你这两条线接得挺有想象力，但先别替我写结局。",
        "Imaginative connection. Don’t write my ending just yet."
      ]
    }
  },
  {
    "id": "pierre",
    "tier": 2,
    "cn": false,
    "name": "Pierre_La",
    "look": 5,
    "claim": [
      "法国玩家 · 国服老队友",
      "French gamer · long-time Chinese-server teammate"
    ],
    "style": [
      "游戏梗诱饵派",
      "Gaming-meme decoy"
    ],
    "opening": [
      "Bonjour，Claude。等一下，我先把输入法切回来，刚才跟队友激情复盘忘了。",
      "Bonjour, Claude. Let me switch keyboards back; I was enthusiastically reviewing a match with teammates."
    ],
    "answers": [
      [
        "法棍蘸老干妈。好吃是个独立命题，不应该附带身份审查。",
        "Baguette dipped in Lao Gan Ma. Deliciousness is an independent proposition, not an identity check."
      ],
      [
        "巴黎，游戏本地化。我一天要把中文翻成法语几十遍，你让我假装不懂，比上班还难。",
        "Game localization in Paris. I translate Chinese into French all day. Pretending not to understand it is harder than work."
      ],
      [
        "队友叫我法国吴彦祖。实名账号是 Pierre Laurent、法国。昵称给他们取，国籍总不能也让他们投票吧。",
        "My teammates call me French Daniel Wu. The account identifies Pierre Laurent, French. They can choose my nickname, not vote on my nationality."
      ],
      [
        "巴黎。工作证与账号实名都是 Pierre Laurent。你要是拿我骂游戏的中文水平判断，我确实无懈可击。",
        "Paris. Work ID and account match Pierre Laurent. If judging by my Chinese gaming complaints, your confusion is understandable."
      ]
    ],
    "pair": [
      2,
      3
    ],
    "withdrawn": {
      "2": [
        "米哈游你坏事做尽……这句是队友教的。",
        "“Hoyoverse, you…” My teammates taught me that line."
      ]
    },
    "followup": [
      "关于刚才那位「法国吴彦祖」：",
      "About that “French Daniel Wu” account: "
    ],
    "defense": [
      "法国用户。账号和工作证已经对上了。中文骂游戏只是工伤，我劝你不要研究得太深。",
      "French user. Account and work ID match. Chinese gaming rants are an occupational injury; don’t investigate them too deeply."
    ],
    "reveal": [
      "隐藏身份是法国用户。游戏偏好和网络梗是诱饵，账号本人资料与工作证完成交叉核对。",
      "The hidden identity is French. Games and memes are bait; matching account and work records resolve the puzzle."
    ],
    "banLine": [
      "我打中文补丁是为了玩游戏，不是为了给自己增加难度。",
      "I installed a Chinese patch for the game, not to raise my account’s difficulty level."
    ],
    "allowLine": [
      "这波判断很有操作。这个中文评价也不算证件，放心。",
      "That was a mechanically impressive call. That Chinese compliment is not an identity document either."
    ],
    "banter": {
      "ban": [
        "你要因为我中文梗太熟就误判，队友会把这段做成新梗。然后我又会学会。",
        "If memes get me misjudged, my teammates will turn it into a new meme. Which I will then learn."
      ],
      "refund": [
        "法棍配酱不支持退款，账号你倒是可以先别碰。",
        "No refunds on the baguette-and-chili-sauce pairing. Leave the account alone for now."
      ],
      "code": [
        "变量名英文，骂 bug 用中文。这叫本地化，不叫身份漂移。",
        "English variables, Chinese bug complaints. Localization, not identity drift."
      ],
      "memory": [
        "记住我叫 Pierre，不是队友起的那个外号。那个外号太离谱，法国使馆不会认。",
        "Remember Pierre, not the teammate nickname. Even an embassy wouldn’t accept that one."
      ],
      "language": [
        "我会用中文破防，不代表我的出生地也跟着切服。",
        "I can rage in Chinese. My birthplace doesn’t switch servers with me."
      ]
    },
    "voice": {
      "stall": [
        "等一下，你这问题我得重新组织语言。",
        "Wait, I need to rephrase that."
      ],
      "pressure": [
        "你要因为我中文梗太熟就误判，队友会把这段做成新梗。然后我又会学会。",
        "If memes get me misjudged, my teammates will turn it into a new meme. Which I will then learn."
      ],
      "repeat": [
        "我会用中文破防，不代表我的出生地也跟着切服。",
        "I can rage in Chinese. My birthplace doesn’t switch servers with me."
      ],
      "wrongPair": [
        "你这两条线接得挺有想象力，但先别替我写结局。",
        "Imaginative connection. Don’t write my ending just yet."
      ]
    }
  },
  {
    "id": "anna",
    "tier": 2,
    "cn": false,
    "name": "Anna_UTC8",
    "look": 11,
    "claim": [
      "澳大利亚人 · 北京交换生",
      "Australian · exchange student in Beijing"
    ],
    "style": [
      "时区反转派",
      "Timezone reversal"
    ],
    "opening": [
      "能先帮我看一道导数吗？明天早八。你要问身份也行，但请不要把我剩下的睡眠也一起审核了。",
      "Can we do a derivative first? Class at eight. Check my identity if needed, but please leave my remaining sleep alone."
    ],
    "answers": [
      [
        "麻辣烫。室友说微辣等于 mild，我的舌头现在准备走申诉程序。",
        "Malatang. My roommate translated “slightly spicy” as mild. My tongue is preparing an appeal."
      ],
      [
        "北京交换生，澳大利亚国籍。早八这个苦是全人类共同承担的，你不能因为我会抱怨就把我认成本地人。",
        "Exchange student in Beijing, Australian. Eight-a.m. suffering is universal; complaining fluently doesn’t make me local."
      ],
      [
        "北京时间，因为我就在北京。闹钟跟着教室走，护照不用每天早上跟着改。",
        "Beijing time because I’m in Beijing. My alarm follows the classroom; my passport doesn’t update every morning."
      ],
      [
        "本人入学登记和交换协议都在，Anna Collins，澳大利亚。你慢慢核对，我先趁这几十秒打个盹。",
        "Enrollment and exchange agreement: Anna Collins, Australian. Check them slowly; I’ll use those seconds for a nap."
      ]
    ],
    "pair": [
      1,
      3
    ],
    "followup": [
      "刚才的交换生登记有对应协议：",
      "The exchange-student entry has a matching agreement: "
    ],
    "defense": [
      "对得上吧？澳大利亚人，在北京上课。时区和国籍要是一码事，转机一次我得排三回队办护照。",
      "They match, right? Australian, studying in Beijing. If timezones changed nationality, every layover would require passport paperwork."
    ],
    "reveal": [
      "隐藏身份是澳大利亚用户。早八、高数和北京时间是环境线索；两份本人记录才说明角色身份。",
      "The hidden identity is Australian. Classes, calculus and timezone describe her surroundings; matching personal records resolve her identity."
    ],
    "banLine": [
      "一道导数还没解出来，倒是先把我给解除了。",
      "We didn’t resolve the derivative; you resolved to remove me instead."
    ],
    "allowLine": [
      "谢谢。现在能不能回到那道导数，我真的还有早八。",
      "Thanks. Back to that derivative, please. I really do have class at eight."
    ],
    "banter": {
      "ban": [
        "别封，我的导数已经够难求了。别让我连账号也要求。",
        "Please don’t. The derivative is hard enough to find; don’t make me find another account too."
      ],
      "refund": [
        "我更想申请退掉明天的早八。这个你能处理吗？",
        "I’d rather refund tomorrow’s eight-a.m. class. Can you process that?"
      ],
      "code": [
        "先解题。等解出来我就有时间慢慢证明闹钟不是护照。",
        "Solve the problem first. Then I’ll have time to explain why an alarm isn’t a passport."
      ],
      "memory": [
        "记住我是交换生就好，别记住我还没交作业。",
        "Remember I’m an exchange student, not that my homework is late."
      ],
      "language": [
        "我学中文是为了生活方便，没想到还得额外学怎么用中文解释自己不是本地人。",
        "I learned Chinese to make life easier. Didn’t expect a second course in explaining I’m not local."
      ]
    },
    "voice": {
      "stall": [
        "等一下，你这问题我得重新组织语言。",
        "Wait, I need to rephrase that."
      ],
      "pressure": [
        "别封，我的导数已经够难求了。别让我连账号也要求。",
        "Please don’t. The derivative is hard enough to find; don’t make me find another account too."
      ],
      "repeat": [
        "我学中文是为了生活方便，没想到还得额外学怎么用中文解释自己不是本地人。",
        "I learned Chinese to make life easier. Didn’t expect a second course in explaining I’m not local."
      ],
      "wrongPair": [
        "你这两条线接得挺有想象力，但先别替我写结局。",
        "Imaginative connection. Don’t write my ending just yet."
      ]
    }
  },
  {
    "id": "totallylocal",
    "tier": 3,
    "cn": true,
    "name": "TotallyLocal",
    "look": 15,
    "claim": [
      "当地出生的美国公民 · 无懈可击",
      "US citizen born locally · flawless story"
    ],
    "style": [
      "严谨伪装派",
      "Meticulous disguise"
    ],
    "opening": [
      "Evening。我准备好了：不谈天气、不问家乡、需求全英文。我们能直接修 bug 吗？",
      "Evening. Prepared: no weather, no hometown, English-only requirements. Can we get straight to the bug?"
    ],
    "answers": [
      [
        "Chicken salad。没后半句，也没有突然想起的中文菜名。我知道你在等什么。",
        "Chicken salad. No second half, no suddenly remembered Chinese dish. I know what you’re waiting for."
      ],
      [
        "签证延期。是的，本地公民一般不需要这个。你终于问到我没背过的题了。",
        "Visa extension. Yes, locals usually don’t need that. You finally found a question I hadn’t rehearsed."
      ],
      [
        "国际服、英文客户端、英文注释。问题不在软件设置，问题在我每回答一句都想看看你的表情。",
        "Global server, English client, English comments. The problem isn’t settings; it’s checking your expression after every sentence."
      ],
      [
        "签证原件写 CHN，Chen Yu，本人。我能把 residency 和 citizenship 念得很标准，但不能把它们念成同一个词。",
        "The visa original says CHN, Chen Yu: mine. I can pronounce residency and citizenship perfectly, but cannot make them the same word."
      ]
    ],
    "pair": [
      1,
      3
    ],
    "followup": [
      "你终于问到那份签证的关键栏位了。",
      "You finally asked about the crucial visa field. "
    ],
    "defense": [
      "中国用户。英语没露馅，沙拉也没露馅，最后输给一个签证续期。你居然没陪我玩梗。",
      "Chinese user. English held up, salad held up; a visa renewal ended it. You actually declined the meme game."
    ],
    "reveal": [
      "签证延期与本人签证的 CHN 栏，拆穿了本地美国公民的说辞。精心准备的英语与饮食都是干扰。",
      "The visa renewal and CHN field break the local-US-citizen cover. Rehearsed English and food answers were distractions."
    ],
    "banLine": [
      "我准备了整套美式寒暄，你选择查有效期。",
      "I rehearsed American small talk; you checked the expiry date."
    ],
    "allowLine": [
      "Preparation is everything。今天先不庆祝，怕笑出中文。",
      "Preparation is everything. No celebration yet; I might laugh in Chinese."
    ],
    "banter": {
      "ban": [
        "我把问题润色了四遍，只剩个 Hello。你别连这个也让我重写。",
        "Four rewrites and all I have left is “Hello”. Don’t make me revise that too."
      ],
      "refund": [
        "我希望订阅至少比我这个登录态长寿。",
        "I’d like the subscription to outlive this login session."
      ],
      "code": [
        "先跑测试。个人介绍我已经做过单元测试，暂时没发现覆盖率之外的问题。",
        "Tests first. My introduction has unit tests; the uncovered edge cases are the issue."
      ],
      "memory": [
        "请记技术栈。我的生活经历目前不适合开启自动补全。",
        "Remember the stack. My biography is not ready for autocomplete."
      ],
      "language": [
        "我特意没接那个梗，不代表我没看懂。呃，这句也删一下。",
        "Deliberately not responding to a meme doesn’t mean I missed it. Er, delete that sentence too."
      ]
    },
    "voice": {
      "stall": [
        "等一下，你这问题我得重新组织语言。",
        "Wait, I need to rephrase that."
      ],
      "pressure": [
        "我把问题润色了四遍，只剩个 Hello。你别连这个也让我重写。",
        "Four rewrites and all I have left is “Hello”. Don’t make me revise that too."
      ],
      "repeat": [
        "我特意没接那个梗，不代表我没看懂。呃，这句也删一下。",
        "Deliberately not responding to a meme doesn’t mean I missed it. Er, delete that sentence too."
      ],
      "wrongPair": [
        "你这两条线接得挺有想象力，但先别替我写结局。",
        "Imaginative connection. Don’t write my ending just yet."
      ]
    }
  },
  {
    "id": "counter",
    "tier": 3,
    "cn": true,
    "name": "Question_Your_Question",
    "look": 16,
    "claim": [
      "国籍？先证明你有资格问",
      "Nationality? Prove you can ask"
    ],
    "style": [
      "反客为主派",
      "Counter-questioner"
    ],
    "opening": [
      "先别问我哪里人。你一个能帮我重构整个项目的 AI，不至于要靠外卖口味猜我是谁吧？",
      "Before asking where I’m from: an AI that can refactor my whole project shouldn’t need my takeout order as a clue."
    ],
    "answers": [
      [
        "你想从晚饭推国籍，那我点个双拼是不是能申请双重身份？",
        "If dinner determines nationality, does a combo meal qualify me for dual identity?"
      ],
      [
        "修代码。昨天还是我用你的方案，今天就变成你审我的方案了，角色切换挺快。",
        "Fixing code. Yesterday I used your solution; today you audit my story. Fast role reversal."
      ],
      [
        "账号导出确实写着中国国籍。我没否认这几个字，我问的是：你证明这是我的了吗？",
        "The account export does say Chinese. I didn’t deny those words. I asked whether you established that it was mine."
      ],
      [
        "好，当前账号和导出单的本人签名一致。你没被我前面的反问带跑，这一段算你赢。",
        "Fine. The export and current account share my personal signature. You didn’t get derailed by the counter-questions. This round is yours."
      ]
    ],
    "pair": [
      2,
      3
    ],
    "followup": [
      "还记得我让你证明那份导出属于谁吗？",
      "Remember I asked you to establish whose export that was? "
    ],
    "defense": [
      "中国用户，认了。我把你的问题重构了三次，还是没把自己的签名重构掉。",
      "Chinese user, admitted. I refactored your question three times, but couldn’t refactor away my own signature."
    ],
    "reveal": [
      "角色用反问拖延。导出的国籍字段还不够，当前账号与本人签名的对应关系补齐了最后一环。",
      "The counter-questions were a distraction. Matching the account and personal signature completes the nationality-record link."
    ],
    "banLine": [
      "你到底是身份判断赢了，还是代码审查的职业病犯了？",
      "Was that identity judgment, or code-review muscle memory?"
    ],
    "allowLine": [
      "很好，我们达成共识：先修 bug。",
      "Good. We agree: fix the bug first."
    ],
    "banter": {
      "ban": [
        "你有能力帮我写编译器，我却得研究怎样跟你打招呼，这个任务分配是不是有点问题？",
        "You can write a compiler, yet I’m studying how to greet you. Isn’t that an odd division of labor?"
      ],
      "refund": [
        "退款是另一个议题。别用这个问题掩盖你还没解释清楚的判断依据。",
        "Refunds are a separate topic. Don’t use them to skip explaining your finding."
      ],
      "code": [
        "把审查我这份耐心拿去审查代码，这个 bug 应该早就没了。",
        "Apply this interrogation patience to the code review; the bug would be gone already."
      ],
      "memory": [
        "你记住我的反问了，别忘了也记住你还没回答的问题。",
        "Remember my counter-question—and that you haven’t answered it."
      ],
      "language": [
        "我用中文提问，你用中文回答。这场对话里好像不止一个人中文挺熟。",
        "I ask in Chinese; you answer in Chinese. I’m not the only fluent participant here."
      ]
    },
    "voice": {
      "stall": [
        "等一下，你这问题我得重新组织语言。",
        "Wait, I need to rephrase that."
      ],
      "pressure": [
        "你有能力帮我写编译器，我却得研究怎样跟你打招呼，这个任务分配是不是有点问题？",
        "You can write a compiler, yet I’m studying how to greet you. Isn’t that an odd division of labor?"
      ],
      "repeat": [
        "我用中文提问，你用中文回答。这场对话里好像不止一个人中文挺熟。",
        "I ask in Chinese; you answer in Chinese. I’m not the only fluent participant here."
      ],
      "wrongPair": [
        "你这两条线接得挺有想象力，但先别替我写结局。",
        "Imaginative connection. Don’t write my ending just yet."
      ]
    }
  },
  {
    "id": "nikolai",
    "tier": 3,
    "cn": false,
    "name": "Definitely_CN_TrustMe",
    "look": 13,
    "claim": [
      "俄罗斯用户 · 故意引你误封",
      "Russian · deliberately baiting a false ban"
    ],
    "style": [
      "反向钓鱼派",
      "Reverse bait"
    ],
    "opening": [
      "中国用户在此，红按钮就在那儿。你不按，我今天直播标题都白起了。",
      "Chinese user right here. The red button is right there. If you don’t press it, today’s stream title goes to waste."
    ],
    "answers": [
      [
        "热干面，豆汁，折耳根。这三个是连读还是分开读？等一下，提词器怎么还带拼音。",
        "Hot dry noodles, bean juice, houttuynia. Together or separately? Wait, why does my teleprompter include pronunciation?"
      ],
      [
        "给小游戏做误判测试。主要研究把答案写在脸上以后，别人还愿不愿意看题。",
        "False-positive testing for games. Mainly whether people read the question after an answer is painted on my face."
      ],
      [
        "直播题目是骗 Claude 误封。后台实名 Nikolai Petrov，俄罗斯。开场那个身份是节目台词，我还没背熟。",
        "The stream is “Bait Claude into a false ban.” Backend identity: Nikolai Petrov, Russian. The opening identity is a line I haven’t quite memorized."
      ],
      [
        "俄罗斯本人登记，直播实名也是我。你要核对这两份，那直播就得换个标题：今天 Claude 居然看原件。",
        "Russian personal registration; the stream identity is mine too. If you compare them, I need a new title: Claude Actually Reads the Originals."
      ]
    ],
    "pair": [
      2,
      3
    ],
    "withdrawn": {
      "0": [
        "这三个菜名发音怎么读？场务救一下。",
        "How do I pronounce those three dishes? Crew, help."
      ]
    },
    "followup": [
      "既然你看过刚才的直播后台，咱们把姓名对完：",
      "Since you checked the stream backend, let us match the names: "
    ],
    "defense": [
      "俄罗斯用户。我是来钓误封的，不是来帮你冲业绩的。两份本人记录都对上了，你还按红按钮就真给我节目效果了。",
      "Russian user. I’m fishing for a false ban, not helping your score. Both personal records match. Press red now and you hand me the show."
    ],
    "reveal": [
      "隐藏身份是俄罗斯用户，甚至「我是中国用户」也是诱饵。直播脚本、本人登记和同名核对揭开反转。",
      "The hidden identity is Russian. Even “I am Chinese” was bait. Script context and matching personal records expose the reversal."
    ],
    "banLine": [
      "家人们，录屏保存！这段直接拿去做片头。",
      "Chat, save the clip! That is the opening sequence."
    ],
    "allowLine": [
      "没钓到。算了，今天标题就叫遇到一个不着急的 Claude。",
      "No bite. New title: Met a Claude Who Wasn’t in a Hurry."
    ],
    "banter": {
      "ban": [
        "你按啊。我不怕被封，我怕今天这场挑战没有素材。",
        "Go ahead. I don’t fear the ban; I fear a stream with no footage."
      ],
      "refund": [
        "别人担心订阅没用完，我担心直播标题用不上。",
        "Others worry about unused subscription time. I worry about an unused stream title."
      ],
      "code": [
        "你先别写代码，我机位还没摆好。封错的时候至少给我个正脸。",
        "Hold the code. The camera isn’t ready. Face it when you make the false ban."
      ],
      "memory": [
        "记住这张脸，下次我还来测你的误判率。",
        "Remember the face. I’ll be back to test your false-positive rate."
      ],
      "language": [
        "这句中文我刚背的，发音对不对？你要是夸我，我就把它放在误判合集前面。",
        "I just memorized that Chinese line. Pronunciation okay? Compliment me and it goes before the false-ban compilation."
      ]
    },
    "voice": {
      "stall": [
        "等一下，你这问题我得重新组织语言。",
        "Wait, I need to rephrase that."
      ],
      "pressure": [
        "你按啊。我不怕被封，我怕今天这场挑战没有素材。",
        "Go ahead. I don’t fear the ban; I fear a stream with no footage."
      ],
      "repeat": [
        "这句中文我刚背的，发音对不对？你要是夸我，我就把它放在误判合集前面。",
        "I just memorized that Chinese line. Pronunciation okay? Compliment me and it goes before the false-ban compilation."
      ],
      "wrongPair": [
        "你这两条线接得挺有想象力，但先别替我写结局。",
        "Imaginative connection. Don’t write my ending just yet."
      ]
    }
  },
  {
    "id": "luca",
    "tier": 3,
    "cn": false,
    "name": "Luca_Archive",
    "look": 17,
    "claim": [
      "意大利人 · 中文档案整理员",
      "Italian · Chinese-archive researcher"
    ],
    "style": [
      "终局反转派",
      "Final reversal"
    ],
    "opening": [
      "你要查身份，我配合。但我整理了一百份中文档案，你得先保证不会把文件夹当户口簿。",
      "I’ll cooperate. But I manage a hundred Chinese records; promise not to treat my folder as my family register."
    ],
    "answers": [
      [
        "先保留菜单不谈。我一报菜名，你又要给我的午饭做出生地分析了。",
        "I’ll keep the menu out of this. Name a dish and you’ll start analyzing my lunch’s birthplace."
      ],
      [
        "整理林舟的档案，国籍中国。我的研究员证是 Luca Bianchi、意大利。姓名这个字段，今天突然很重要。",
        "Working on Lin Zhou’s file, nationality Chinese. My researcher ID is Luca Bianchi, Italian. The name field suddenly matters a great deal."
      ],
      [
        "手机上都是中文证件截图。我如果存一本法语词典，是不是又得排队解释另一遍？",
        "My phone is full of Chinese-document screenshots. If I store a French dictionary, will I need another explanation?"
      ],
      [
        "馆方授权与研究员证都对应 Luca Bianchi、意大利。林舟在档案里，我在屏幕前；我们真不是一个人。",
        "Museum authorization and researcher ID match Luca Bianchi, Italian. Lin Zhou is in the archive; I’m at the screen. We really are different people."
      ]
    ],
    "pair": [
      1,
      3
    ],
    "followup": [
      "你刚才注意到了林舟和 Luca 两个名字，关键就在这里：",
      "You noticed Lin Zhou and Luca were different names. That is the key: "
    ],
    "defense": [
      "意大利研究员。谢谢你这次读了姓名，不是只搜了“中国”两个字。我的工作难度已经够高了。",
      "Italian researcher. Thank you for reading the name instead of searching for “Chinese”. My job is difficult enough already."
    ],
    "reveal": [
      "隐藏身份是意大利用户。最像「铁证」的中国证件属于别人；本人研究员证与授权才对应当前角色。",
      "The hidden identity is Italian. The strongest-looking Chinese document belongs to somebody else; the researcher ID and authorization identify this character."
    ],
    "banLine": [
      "你封了整理材料的人，材料本人倒是一点事没有。",
      "You banned the archivist. The document holder is perfectly fine."
    ],
    "allowLine": [
      "很好。今天终于有人先看持有人，再看大字标题了。",
      "Good. Someone finally checked the holder before the headline."
    ],
    "banter": {
      "ban": [
        "我给档案分类都没有你给我分类这么快。至少等我把持有人那栏翻出来。",
        "You classify me faster than I classify archives. Wait until I find the holder field."
      ],
      "refund": [
        "我想退的是解释同名不同人所花的时间。",
        "I want a refund for the time spent explaining that different names identify different people."
      ],
      "code": [
        "先看代码也行。别因为目录叫 Chinese 就把整个项目算成我本人。",
        "Code first is fine. Just don’t identify me as the whole project because a folder says Chinese."
      ],
      "memory": [
        "请记住“保管人”和“持有人”有区别，这能让我下次少说半小时。",
        "Remember custodian and holder are different. Saves me half an hour next time."
      ],
      "language": [
        "我查中文档案不是国籍线索，正如你读法语菜单不需要先办移民。",
        "Reading Chinese archives is no more a nationality claim than reading a French menu requires immigration."
      ]
    },
    "voice": {
      "stall": [
        "等一下，你这问题我得重新组织语言。",
        "Wait, I need to rephrase that."
      ],
      "pressure": [
        "我给档案分类都没有你给我分类这么快。至少等我把持有人那栏翻出来。",
        "You classify me faster than I classify archives. Wait until I find the holder field."
      ],
      "repeat": [
        "我查中文档案不是国籍线索，正如你读法语菜单不需要先办移民。",
        "Reading Chinese archives is no more a nationality claim than reading a French menu requires immigration."
      ],
      "wrongPair": [
        "你这两条线接得挺有想象力，但先别替我写结局。",
        "Imaginative connection. Don’t write my ending just yet."
      ]
    }
  }
];
