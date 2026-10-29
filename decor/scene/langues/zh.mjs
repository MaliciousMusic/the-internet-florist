// The site's words in Simplified Chinese: the source of the other languages (fr, es, zh, de have the same keys). build.mjs writes
// the pages from gabarits/ with them; the runtime strings (js) go into each page as a JSON block read by entete.js and
// boutique.js. In the HTML strings: {{p}} is the page's language prefix ('' or 'fr/'...), {{legal}} the legal page with
// that prefix; in the runtime strings, {name} and the like are filled in by the scripts. Product names stay as they are.
export default {
  code: 'zh',
  name: '中文',
  locale: 'zh-CN',
  ogLocale: 'zh_CN',
  // a list of words as the language writes it: "a、b和c"
  list: (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join('、')}和${a[a.length - 1]}`),
  more: '其他花材',
  describe: ({ stems, flowers, vase }) =>
    `一束独一无二的数字花束，由 ${stems} 枝手绘花枝组成（${flowers}），插在${vase}中。它会活三十天，之后永远保持凋谢的模样。`,

  pages: {
    index: {
      title: "数字花束，一枝一枝手绘而成 | Belai's Garden",
      description: '照着真实花朵一枝一枝绘制的数字花束。每月一个系列，可以送人，也可以摆在你的屏幕上。',
      ogTitle: '数字花束，一枝一枝手绘而成',
      ogDescription: '每个月一个花束系列，每一束都插在真实的花瓶里。看它们绽放，送出一束，或把它摆在你的屏幕上。',
    },
    about: {
      title: "关于我们：照着真实花朵绘制的数字花束 | Belai's Garden",
      description: '我们的数字花束是怎样诞生的：依照真实照片用代码绘制的花朵、真实的花瓶、按花枝定价、三十天的生命。',
      ogTitle: '关于我们的数字花束',
      ogDescription: '每一朵花都依照真实照片用代码绘制。独一无二的花束，插在真实的花瓶里，先绽放，后凋谢。',
    },
    desktop: {
      title: '把花束摆上桌面的 Windows 桌面小组件 | Belai Bureau',
      description: 'Belai Bureau 是一款免费的 Windows 10 和 11 桌面小组件：把你收藏的数字花束摆在电脑桌面上。随意摆放、调整大小、固定位置。',
      ogTitle: '把你的花束摆上桌面',
      ogDescription: '一款为你的数字花束准备的免费 Windows 桌面小组件：随意摆放、调整大小、固定位置。',
    },
    legal: {
      title: "法律声明、销售条款与隐私政策 | Belai's Garden",
      description: "Belai's Garden 的法律声明、数字花束销售条款、隐私政策、Belai Bureau 使用许可及无障碍声明。",
      ogTitle: '法律声明、销售条款与隐私政策',
      ogDescription: '我们是谁，花束如何出售，我们如何处理数据。',
    },
  },
  shareAlt: 'Ronde bleue 花束：丁香、鸢尾、银莲花和风信子，插在饰有舞者的磨砂玻璃花瓶里',
  orgDescription: '照着真实花朵一枝一枝绘制的数字花束，可以送人，也可以摆在你的屏幕上。',
  listName: '今日花束',

  // ---------- the shop page
  index: {
    h1: "Belai's Garden：有生命的数字花束",
    intro:
      '照着真实花朵一枝一枝绘制的数字花束。每个月推出一个新的花束系列，每一束都插在真实的花瓶里。一束花会活三十天，之后永远保持凋谢的模样。把它送人，或用 Belai Bureau 把它摆在你的屏幕上。',
    noscript:
      '这座花园需要 JavaScript 才能让花束绽放。你可以阅读<a href="{{p}}about.html">关于花束</a>，查看<a href="{{p}}desktop.html">如何把花束摆上桌面</a>，或阅读<a href="{{legal}}">法律声明与条款</a>。',
    galleryLabel: '今日花束',
    lookCloser: '凑近看看这束花',
    shelvesLabel: '花架',
    budVases: '单枝花瓶即将上架：一枝花，配一只花瓶。',
    noneCollected: '还没有花束找到它的收藏者。',
    seeOpenSea: '在 OpenSea 上查看收藏系列',
    onDesktop: "在桌面上试试",
    buy: '购买',
    // the purchase sheet: the express waiver of the right of withdrawal (French Consumer Code L221-28, 13°)
    sheetTitle: '付款之前',
    waiver: '我要求立即交付我的花束，并知悉我因此将失去 14 天的撤回权。',
    accept: '付款即表示你确认已成年，并接受<a href="{{legal}}#terms">销售条款</a>。',
    confirm: '确认并付款',
    cancel: '取消',
    signInTitle: '你的账户（短信验证）',
    phone: '手机号码',
    sendCode: '获取验证码',
    code: '收到的验证码',
    firstName: '名字',
    giftsTitle: '我的礼物',
    giftsHelp: '输入送你花束的人的名字，以及对方发给你的代码。',
    giftSender: '对方的名字',
    giftCode: '代码',
    giftOpen: '打开礼物',
    accountTitle: '我的账户',
    accountHelp: '填写你的名字和手机号：我们会通过短信发送验证码。',
    invoices: '发票',
    tabProfile: '个人',
    tabHelp: '售后',
    noInvoice: '暂无发票。',
    invoicePrint: '打印或 PDF',
    invoiceClose: '关闭发票',
    helpExchangeTitle: '24 小时内更换。',
    helpExchange: '对自己购买且未赠送的花束，可在“个人”页更换一次，换成当天价格相同或更低的花束。差额存入你的余额。',
    helpDefectTitle: '花束有问题？',
    helpDefect: '如果无法显示或运作，请联系我们：我们会修复，并补回失去的天数。',
    helpWrite: '联系客服',
    helpTerms: '销售条款',
    signIn: '登录',
    signOut: '退出登录',
  },

  // ---------- the About page
  about: {
    h1: '关于我们',
    lead: '一朵一朵绘制的花束，在你眼前绽放。',
    body: `<h2>写生而来的花朵</h2>
  <p>这座花园里的每一朵花，都依照真实照片用代码一笔一笔绘制：花瓣的形状、在每个品种上实测的颜色、花苞、盛开的花朵和凋谢的花朵。
    花园里已有五百多个品种。</p>

  <h2>一枝一枝插成的花束</h2>
  <p>每一束花都是一枝一枝插成的，插在真实的花瓶里，比如那只青铜鲤鱼瓶。每一枝花、每一朵花、每一片叶子的位置，都不会出现在别的花束里。</p>

  <h2>有生命的花束</h2>
  <p>一束花从购买之日起活三十天：倒计时以小时和分钟显示它剩下的时间。之后它会永远凋谢、静止。</p>

  <h2>真实花枝的价格</h2>
  <p>花束的价格是其花枝在法国花店的价钱之和。花瓶免费赠送。用银行卡付款。</p>

  <h2>每月一个系列</h2>
  <p>每个月都有自己的系列；你买到的花束就是你看到的那一束。</p>

  <h2>送一束花</h2>
  <p>购买时，你可以把花束送人：一段由昆虫带来的短消息、一段音乐，以及一个要转交的代码。收花的人在“我的礼物”中输入你的名字和这个代码即可收到。</p>

  <h2>摆上桌面</h2>
  <p>借助免费的 Windows 桌面小组件 <a href="{{p}}index.html?bureau">Belai Bureau</a>，你收藏的花束就能立在
    电脑桌面上，大小由你决定，可放在窗口前面或后面。</p>

  <h2>让花园生长</h2>
  <p>每收藏一束花，都在帮助花园生长：新的品种、新的花瓶、新的花束。</p>`,
    faqTitle: '常见问题',
    faq: [
      ['什么是数字花束？', '一束依照真实照片、以矢量图形一枝一枝绘制的花，插在真实的花瓶里。它在屏幕上绽放，随风轻摆，三十天后凋谢。'],
      ['我能把花束摆在屏幕上吗？', '可以。下载 Belai Bureau（免费），用你的手机号和短信收到的验证码登录一次：你账户里的花束就会出现在屏幕上，你可以摆放、调整大小并固定它们。'],
      ['花束如何定价？', '按其花枝在法国花店的价钱之和定价。花瓶免费赠送。价格以欧元显示（欧元区以外以美元显示），用银行卡支付。'],
      ['三十天后会怎样？', '花束会凋谢，并永远保持凋谢、静止的模样。它依然属于你。'],
      ['怎样送一束花？', '购买时选择送人：写一段短消息，选一段音乐和带消息的昆虫。你会收到一个链接和一个代码；对方在“我的礼物”中输入它们和你的名字，花束就会转到对方的账户。'],
    ],
    back: '← 返回花束',
  },

  // ---------- the desktop page
  desktop: {
    h1: '把你的花束摆上桌面',
    lead: '借助免费的 Windows 桌面小组件 Belai Bureau，把你收藏的花束摆上电脑桌面。',
    videoLabel: '操作视频：一步一步把花束摆上桌面（仅有音乐，步骤以文字列在旁边）',
    stepsTitle: '五个步骤',
    steps: [
      '下载并安装 Belai Bureau。',
      '点击时钟旁的 Belai 图标，关联你的钱包。',
      '选择你的花束，把它放到屏幕上：只需一次签名，免费，不产生任何转账。',
      '摆放、调整大小，放在窗口前面或后面，然后点击 ✓ 固定。',
      '如需再次移动，在花束上按住鼠标六秒钟。',
    ],
    download: '下载 Belai Bureau',
    downloadSmall: 'Windows 10 和 11 · 3 MB · 免费',
    winSmall: '10 和 11 · 3 MB · 免费',
    soon: '即将推出',
    note: '只有持有花束的钱包才能展示它。首次启动时，Windows 可能会提示尚不认识此应用：点击“更多信息”，再点击“仍要运行”。',
    appLanguage: '应用本身目前仅提供法语版。',
    fingerprint: '版本 {v} · SHA-256',
    licence: '使用许可与隐私',
    back: '← 返回花束',
    appDescription: '一款免费的 Windows 桌面小组件，把你收藏的数字花束展示在电脑桌面上：随意摆放、调整大小、固定位置，可放在窗口前面或后面。',
    videoName: '如何把花束摆上桌面',
    videoDescription: '一分钟操作演示：下载 Belai Bureau，关联钱包，把花束放到屏幕上，摆放、调整大小并固定，按住六秒即可再次移动。',
    howToName: '如何把数字花束摆上 Windows 桌面',
    howToTools: ['Belai Bureau（免费，支持 Windows 10 和 11）', '一个持有花束的钱包'],
  },

  // ---------- the legal page
  legal: {
    h1: '法律信息',
    updated: '最后更新：2026 年 10 月 27 日',
    onThisPage: '本页内容',
    toc: { notice: '法律声明', terms: '销售条款', privacy: '隐私政策', app: 'Belai Bureau 使用许可', ip: '知识产权', accessibility: '无障碍', contact: '联系方式' },
    reference: '',
    body: `<section id="notice" aria-labelledby="t-notice">
    <h2 id="t-notice">法律声明</h2>
    <h3>发布者</h3>
    <p>Hadrien Lonjaret，entrepreneur individuel（个体企业主），以 Agent 33 名义经营<br>
      地址：35 cours Sablon, 63000 Clermont-Ferrand, France（法国）<br>
      电子邮件：<a href="mailto:lonjaret.hadrien@proton.me">lonjaret.hadrien@proton.me</a> · 电话：+33 6 18 55 81 22<br>
      SIREN 853 801 488 · RCS Clermont-Ferrand（克莱蒙费朗商业及公司注册处）· 增值税号 FR69853801488</p>
    <h3>出版负责人</h3>
    <p>Hadrien Lonjaret</p>
    <h3>网站托管方</h3>
    <p>GitHub, Inc.（GitHub Pages），88 Colin P. Kelly Jr. Street, San Francisco, CA 94107，美国 · github.com。
      账户与礼物服务器由 Cloudflare, Inc. 托管，101 Townsend Street, San Francisco, CA 94107，美国 · cloudflare.com</p>
  </section>

  <section id="terms" aria-labelledby="t-terms">
    <h2 id="t-terms">销售条款</h2>

    <h3>1. 当事方与适用范围</h3>
    <p>本销售条款适用于法律声明中所列的发布者（“我们”）在本网站向任何成年人（“你”）出售的每一束花。支付花束即表示接受
      购买当日有效版本的本条款。本条款有多种语言版本，以法文版本为准。</p>

    <h3>2. 标的：花束</h3>
    <p>花束是一件数字作品：以矢量图形绘制的花朵，插在花瓶里，在屏幕上呈现动态。每一束花属于某个月份的系列。你买到的花束就是你看到的那一束，没有任何变化。购买前，花束页面会显示其名称、花瓶、所属
      系列和价格。</p>
    <p>花束从购买之日起活三十天：它会绽放、摇曳，倒计时显示剩余时间。之后它会凋谢，并永远保持凋谢、静止。这一变化是作品
      的一部分，并非瑕疵。</p>
    <p>花束不赋予任何收益或份额的权利，也不能在本网站转售。</p>

    <h3>3. 你的账户</h3>
    <p>购买或接收花束前，你需要用你的名字和手机号码创建账户，手机号码通过短信验证码确认。你的花束、发票和余额（第 11
      条）都归入这个账户。你应自行保管你的号码；如更换号码，请告知我们。如果你删除账户，你的花束和余额也会一并消失。</p>

    <h3>4. 你获得的权利</h3>
    <p>购买后，你享有在本网站观看该花束，并通过 Belai Bureau 在你的屏幕上展示它的个人、非独占权利，仅限私人用途。该权利只能
      通过赠送花束转让（第 8 条）。如同购买一幅画，购买并不转让画作的著作权：制作和出售复制品或衍生产品，以及任何商业用途，
      均不包括在内。</p>

    <h3>5. 价格</h3>
    <p>价格以欧元标示，不含增值税（根据法国《税收总法典》第 293 B 条，不适用增值税），并在购买前显示在花束上；价格等于其
      花枝在法国花店的价钱之和，花瓶免费赠送。在欧元区以外，以美元显示的金额仅供参考：付款以欧元进行，你的银行可能收取
      货币兑换费用。</p>

    <h3>6. 下单与付款</h3>
    <p>你可以在我们的支付服务商 Stripe（Stripe Payments Europe, Ltd.，爱尔兰都柏林）的付款页面上，用银行卡、Apple Pay 或
      Google Pay 付款。我们从不查看或保存你的卡号。付款前，你需勾选一个方框，要求立即交付（见第 9 条）。确认付款即构成
      负有付款义务的订单。</p>

    <h3>7. 交付与发票</h3>
    <p>Stripe 确认付款后，花束即加入你的账户。你会收到一份收据，载明花束、价格、日期以及你要求立即交付的申请。编号发票可在你的账户中打印或保存。</p>

    <h3>8. 赠送花束</h3>
    <p>购买时，你可以把花束送人，并安排它的到来：一段由昆虫带来的短消息、一段音乐，以及携带消息的昆虫。你会收到一个链接和
      一个代码，由你自己转交给你选择的人。代码在花束凋谢前有效，只能使用一次；连续输错五次后，输入将被锁定一小时。对方输入
      你的名字和代码后，花束会转到对方的账户并离开你的账户；在代码被使用之前，花束仍留在你的账户中。你须对消息内容负责，
      消息不得违反法律或侵犯任何人的权利。</p>

    <h3>9. 撤销权</h3>
    <p>如果你是居住在欧盟的消费者，原则上你在远程购买后享有 14 天的撤销权。花束属于不以有形载体提供、并即时交付的数字内容：
      付款前，你明确要求立即交付，并确认因此放弃撤销权（法国《消费法典》第 L221-28 条第 13 项；欧盟第 2011/83/EU 号指令
      第 16 条 m 项）。</p>

    <h3>10. 合规保证</h3>
    <p>如果你是消费者，你享有数字内容的法定符合性保证（法国《消费法典》第 L224-25-1 条及以下）。如果花束未交付给你，或在其三十天内未能按描述显示或运作，请联系我们：我们会在合理期限内免费使其符合约定，并将其凋谢时间推迟与不可用天数相同的天数。如果无法使其符合约定、修复失败或未在该期限内完成，或缺陷严重，你可以依法获得降价，或解除合同并获得退款。</p>
    <p>除上述情形及第 11 条规定的更换外，不予退款。</p>

    <h3>11. 24 小时内更换与余额</h3>
    <p>作为商业上的善意安排（并非撤回权），你可以在购买后 24 小时内，将自己购买且未赠送的花束更换一次。更换在你的账户中进行，可换成当天仍有余量、价格相同或更低的花束。新花束自更换起绽放三十天；退回的花束离开你的账户并重新开放购买。</p>
    <p>如果新花束价格更低，差额会存入你的余额，不会向你支付任何款项。余额会自动从你之后的购买中扣除；不可退款、不可转让，并随账户一并消失。每次更换会为退回的花束开具一张红字发票（贷项通知），并为新花束开具一张发票。</p>

    <h3>12. 对付款提出争议</h3>
    <p>如果你就已交付给你的花束向银行提出付款争议，我们会向 Stripe 提交订单证明，包括你注明日期的立即交付申请。如果争议以对你有利的结果结束，该花束或更换得到的花束将被收回（包括已赠送给他人的情况），由该次更换产生的余额也会被取消。请先联系我们：问题往往能更快解决。</p>

    <h3>13. 责任</h3>
    <p>付款由 Stripe 处理，短信由 OVHcloud 发送。对于它们的中断或变更，我们不承担责任。本条款中的任何规定均不限制消费者依法
      享有的权利。</p>

    <h3>14. 投诉与调解</h3>
    <p>请先写信给我们（见<a href="{{legal}}#contact">联系方式</a>）；我们会在 30 天内答复。若未能解决，消费者可免费将争议
      提交我们的消费调解员：<span class="a-remplir">[调解员的名称、网站和邮寄地址]</span>。</p>

    <h3>15. 适用法律</h3>
    <p>本条款受法国法律管辖。消费者仍享有其居住国强制性法律规定的保护，并可向该国或法国的法院提起诉讼。</p>
  </section>

  <section id="privacy" aria-labelledby="t-privacy">
    <h2 id="t-privacy">隐私政策</h2>
    <p>数据控制者是<a href="{{legal}}#notice">法律声明</a>中所列的发布者。我们尽可能少地收集数据，且不用于对你进行画像。</p>
    <h3>处理的数据、目的与法律依据</h3>
    <ul>
      <li><strong>连接数据</strong>（IP 地址、浏览器、访问的页面）：由我们的托管方保存在其技术日志中，用于提供网站服务并防止
        滥用。法律依据：我们拥有一个正常运行、安全的网站的正当利益。</li>
      <li><strong>你的语言和国家</strong>：在你的设备上根据浏览器的语言设置推断，用于以你的语言显示网站、以你的货币显示价格。
        不会发送或保存任何信息。</li>
      <li><strong>你的账户</strong>：你的手机号码、你选择的名字以及账户创建日期，用于识别你并把花束归入你的账户。号码加密保存；
        号码的指纹用于查找你的账户。它绝不会显示给其他人。法律依据：合同。</li>
      <li><strong>短信验证码</strong>：用于验证你的号码，有效期十分钟，之后删除。法律依据：合同。</li>
      <li><strong>你的购买记录</strong>：花束、价格、日期，Stripe 传来的付款编号和状态，以及你立即交付的要求。法律依据：合同和
        我们的会计义务。</li>
      <li><strong>你的礼物</strong>：所选的消息、音乐和昆虫，赠送者的名字以及礼物状态；代码只以指纹形式保存。收到花束的人能看到
        名字和消息；赠送者只能看到花束已被领取。法律依据：合同。</li>
    </ul>
    <h3>付款</h3>
    <p>你的银行卡信息在 Stripe 的页面上输入，由 Stripe 按其自身的隐私政策处理。我们只收到付款编号、金额和状态。</p>
    <h3>Cookie</h3>
    <p>如果你自行选择语言，网站会把它保存在名为 <code>lang</code> 的 Cookie 中，为期一年。登录账户期间，一个会话 Cookie 会让你
      保持登录。如果你打开声音，浏览器会把这个选择保存在本地存储中（键名 <code>son</code>），不会向我们发送任何内容。仅此而已：没有流量统计，没有广告。这些 Cookie 是你所请求的服务所必需的，因此无需同意横幅。</p>
    <h3>接收方与处理地点</h3>
    <p>GitHub, Inc.（网站托管，美国）、Cloudflare, Inc.（账户与礼物服务器，美国）、Stripe（付款，爱尔兰和美国）以及 OVHcloud
      （短信发送，法国）。向欧盟以外的传输依据欧盟—美国数据隐私框架（Data Privacy Framework）以及欧盟委员会的标准合同条款。</p>
    <h3>保存期限</h3>
    <p>托管方的技术日志：根据其设置，保存几天到几周。账户：只要你保留就一直保存；删除后，在 30 天内清除。礼物：只要花束仍在
      某个账户中。购买记录：十年，即会计凭证的保存期限（法国《商法典》第 L123-22 条）。你发给我们的电子邮件：在答复所需的
      时间内保存，之后保存三年。</p>
    <h3>你的权利</h3>
    <p>你可以写信给我们（见<a href="{{legal}}#contact">联系方式</a>），要求查阅、更正或删除你的数据，限制或反对其处理，并以
      可携带的格式获取你的数据。你可以随时删除你的账户。你也可以向法国数据保护机构 CNIL（cnil.fr）投诉。</p>
  </section>

  <section id="app" aria-labelledby="t-app">
    <h2 id="t-app">Belai Bureau 使用许可</h2>
    <p>Belai Bureau 是一款适用于 Windows 10 和 11 的免费软件，可在你的桌面上展示你所关联的钱包持有的花束。
      我们授予你免费、个人、非独占的许可，以安装和使用本软件。你不得出售本软件，也不得分发经修改的副本。</p>
    <p><strong>它如何处理数据：</strong>它会在你的电脑上保存一个代表这台电脑的随机代码、你所关联的钱包地址以及你的设置。
      它会向 Base 网络（mainnet.base.org，由 Base 运营）查询你的钱包持有哪些花束，并在你关联钱包时在浏览器中打开本网站。
      它不向我们发送任何数据，也不做任何统计。</p>
    <p>本应用按“现状”提供。卸载它（Windows 设置 › 应用）即可删除应用及其设置。</p>
  </section>

  <section id="ip" aria-labelledby="t-ip">
    <h2 id="t-ip">知识产权</h2>
    <p>本网站及 Belai Bureau 中的花朵、花瓶、花束、布景、文字、视频和代码均为原创作品。未经许可，禁止任何复制，
      <a href="{{legal}}#terms">销售条款</a>所规定的范围除外。Stripe、OVHcloud、GitHub、Cloudflare 和 Base 是其各自所有者的
      名称。</p>
  </section>

  <section id="accessibility" aria-labelledby="t-accessibility">
    <h2 id="t-accessibility">无障碍</h2>
    <p>我们以《网页内容无障碍指南》（WCAG）2.1 AA 级为目标。本网站可完全用键盘操作（方向键切换花束，Esc 键后退），
      每个按钮都为屏幕阅读器提供了名称，当你的系统要求减少动态效果时，动画会停止。已知局限：草地和花束是艺术作品，
      以文字概述而非逐一细述；操作视频没有配音，其步骤以文字列在旁边。
      如有任何障碍，请写信给我们，我们会提供帮助。</p>
  </section>

  <section id="contact" aria-labelledby="t-contact">
    <h2 id="t-contact">联系方式</h2>
    <p>电子邮件：<a href="mailto:lonjaret.hadrien@proton.me">lonjaret.hadrien@proton.me</a> · 电话：+33 6 18 55 81 22 ·
      邮寄地址：Hadrien Lonjaret, 35 cours Sablon, 63000 Clermont-Ferrand, France（法国）</p>
  </section>`,
    back: '← 返回花束',
  },

  // ---------- the strings of the scripts (entete.js, boutique.js), with {placeholders}
  js: {
    menu: '菜单',
    shelves: { bouquets: '今日花束', soliflores: '单枝花瓶', vendus: '已被收藏的花束', cadeaux: '我的礼物', profil: '我的账户' },
    desktopTitle: '摆上我的桌面',
    desktopLabel: '把你的花束摆上桌面',
    appTitle: 'Belai Bureau',
    appLabel: '下载 Belai Bureau，把花束摆上屏幕的应用',
    soundOn: '打开自然之声',
    soundOff: '关闭自然之声',
    openSeaTitle: '我们在 OpenSea 上的收藏系列',
    openSeaLabel: '我们在 OpenSea 上的收藏系列（新标签页）',
    about: '关于我们',
    legal: '法律信息',
    closeLegal: '关闭法律信息面板',
    footer:
      '<p>每一束花都是数字花束，用银行卡支付，不含增值税（根据法国《税收总法典》第 293 B 条，不适用增值税）。它从购买之日起活三十天，之后永远保持凋谢。交付即时完成，因此一旦确认购买，撤销权即不再适用。</p><p>没有追踪，没有广告：最多一个 Cookie，用于记住你选择的语言。</p>',
    links: { notice: '法律声明', terms: '销售条款', privacy: '隐私', app: 'Belai Bureau 使用许可', accessibility: '无障碍', contact: '联系方式' },
    credit: '',
    language: '语言',
    lookCloser: '凑近看看这束花',
    stepBack: '后退一步',
    planeLabel: '{name}，在石柱上。{alt}',
    frameLabel: '{name}，约 {fiat}，{life}。{alt}',
    buyLabel: '购买“{name}”，约 {fiat}',
    lifeLeft: '{h} 小时 {m} 分',
    fadesIn: '{t}后凋谢',
    fadesInLower: '{t}后凋谢',
    faded: '已凋谢',
    fadedLower: '已凋谢',
    fadedForGood: '已永久凋谢',
    // the month's collection and the copies left, under the bouquet's name ({month}: the month in the page's language)
    series: '{month}系列',
    fadeReminder: '（花束 {n} 天后凋谢）',
    fadeShort: '{n} 天后凋谢',
    collectionEnds: '{month}系列，{when}结束',
    collectionDone: '{month}系列，已结束',
    buy: '购买',
    soon: '即将推出',
    soonMessage: '站内购买即将开放。',
    tickFirst: '请先勾选方框：你的花束将立即交付。',
    signInFirst: '请先登录：你的花束将归入你的手机号账户。',
    codeSent: '验证码已通过短信发送：请输入并确认。',
    wrongNumber: '这个号码似乎无效。',
    wrongCode: '验证码错误：还可以尝试 {n} 次。',
    tooMany: '尝试次数过多：请几分钟后再试。',
    codeExpired: '验证码已过期：请重新获取。',
    soldOut: '这束花已经全部售完。',
    payError: '付款未能完成，请稍后再试。',
    redirecting: '正在前往付款页面…',
    paid: '这束花属于你了：第 {n} 份。',
    paymentPending: '正在确认付款…',
    cancelled: '付款已取消。',
    accountSoon: '账户即将推出：你将用手机号登录，并在这里看到你的花束。',
    accountSignIn: '登录',
    hello: '你好，{name}',
    firstNameNeeded: '请填写你的名字以创建账户。',
    creditBalance: '余额：{amount}，将从下次购买中扣除。',
    exchangeUntil: '更换（{t} 前）',
    exchangeFor: '更换为',
    exchangeConfirm: '确认更换',
    exchangeDiff: '差额 {amount} 将存入你的余额。',
    exchangeSame: '价格相同：不会存入余额。',
    exchangeNone: '今天没有这个价格或更低的花束可选。',
    exchangeDone: '已更换：你的新花束将绽放三十天。',
    exchangeRefused: '无法进行这次更换。',
    helpSubject: 'Belai’s Garden 客服',
    essai: {
      titre: "把花束放到你的桌面上试试",
      fermer: "关闭",
      annuler: "以后再说",
      partager: "点击你的<b>屏幕</b>，再点击<b>共享</b>：我只看一次，任何内容都不会离开你的电脑。",
      partagerEncore: "要把这束花放到你自己的桌面上，请共享<b>整个屏幕</b>：我只看一次，任何内容都不会离开你的电脑。",
      partagerBouton: "共享我的屏幕",
      pasEcran: "这是一个窗口，不是你的屏幕。请选择<b>整个屏幕</b>。",
      reduire: "现在把这个窗口<b>最小化</b>一下（顶部的 <b>–</b>），然后再回来：我会照原样拍下你的桌面。",
      reduireWin: "现在按 <kbd>⊞</kbd> + <kbd>D</kbd>：我会拍下你的桌面。然后再按一次 <kbd>⊞</kbd> + <kbd>D</kbd> 回到这里。",
      reduireMac: "现在按 <kbd>⌘</kbd> + <kbd>F3</kbd> 显示桌面：我会拍下它。然后再按一次回到这里。",
      encore: "我还看到这个页面。再试一次：你的桌面需要显示在屏幕上。",
      pret: "已经拿到你的桌面。<b>点击任意位置</b>，把花束放上去。",
      pretTel: "已经拿到你的主屏幕。把花束放上去吗？",
      montrer: "放上去",
      glisser: "它就在你的桌面上。<b>拖动它</b>，放到你喜欢的位置。",
      glisserTel: "它就在你的主屏幕上。<b>拖动它</b>，放到你喜欢的位置。",
      taille: "<b>拉动一个角</b>，把它放大或缩小。",
      ok: "这样可以吗？按 <b>✓</b> 把它放好。",
      appui: "放好了。以后想调整，就像在 Belai Bureau 里一样：<b>按住</b>花束 6 秒。",
      revalider: "又可以移动了：拖动它或调整大小，然后按 <b>✓</b> 再放好。",
      valider: "放在这里",
      fin: "它就这样在你的桌面上生活 {jours} 天。想真正留住它：<b>Belai Bureau</b>，Windows 版免费。",
      finAutre: "它就这样在你的桌面上生活 {jours} 天。Belai Bureau 很快会支持你的系统。",
      finTel: "在你的手机上就是这个样子。手机版 Belai Bureau 即将推出。",
      telecharger: "获取 Belai Bureau",
      retour: "回到花束",
      capture: "在你的手机上看看吧。回到主屏幕，<b>截一张屏</b>，然后回到这里选择它。<small>截图只留在你的手机上，不会发送任何内容。</small>",
      choisir: "选择我的截图",
    },
    copyNo: '第 {n} 份',
    noBouquet: '你的账户里还没有花束。',
    giftsSoon: '礼物功能即将推出：你可以在这里打开别人送你的花束。',
    giftOpened: '你的礼物到了。',
    giftWrong: '这个名字和代码没有对应的礼物。',
    receipt: {
      title: '收据',
      download: '下载你的收据',
      bouquet: '花束',
      price: '价格',
      date: '日期',
      seller: '卖方',
      waiver: '付款前，你已要求立即交付，并确认你因此失去撤回权（法国《消费法典》第L221-28条第13项）。',
      terms: '当日接受的销售条款：{url}',
      taxes: '不含增值税（依据法国《税法通则》第 293 B 条，免征增值税）。',
      copy: '份数',
      copyOf: '第 {n} 份，{month}',
      order: '订单',
      payment: '付款',
    },
  },

  // ---------- the names the bouquet descriptions use
  vases: {
    'bronze-carpe': '铸铜鲤鱼花瓶',
    'verre-danseuses': '饰有舞者的磨砂玻璃花瓶',
    'coupe-cobalt-mouchetee': '钴蓝斑点花钵',
    'coupe-pied-blanche-mate': '哑光白色高脚花钵',
    'cylindre-inox-miroir': '镜面不锈钢圆筒花瓶',
    'bulbe-pied-sable': '沙色高脚球形花瓶',
    'calice-mouchete': '斑点圣杯形花瓶',
    'prisme-jaune': '悬心黄水晶切割玻璃棱柱花瓶',
    'jardiniere-cristaux': '新艺术风格结晶釉花槽',
    'prismes-bronze': '铜绿青铜棱柱花瓶',
    'colonne-art-nouveau': '新艺术风格炻器柱形花瓶',
    'bouteille-dragon': '午夜蓝绿松石龙纹瓶',
    'jarre-carpes': '浮雕鲤鱼陶罐',
    'bronze-lys': '百合纹古铜花瓶',
    'gres-chauve-souris': '釉面蝙蝠炻器花瓶',
    'balustre-perce-neige': '雪花莲纹栏柱花瓶',
  },
  flowers: {
    'cerisier-du-japon-sato-zakura': '日本樱花',
    'cognassier-du-japon': '贴梗海棠',
    forsythia: '连翘',
    'iris-hollandais': '荷兰鸢尾',
    lilas: '丁香',
    'tulipe-perroquet': '鹦鹉郁金香',
    'tulipe-double': '重瓣郁金香',
    'tulipe-simple': '郁金香',
    'tulipe-frangee': '流苏郁金香',
    'renoncule-classique': '花毛茛',
    'narcisse-trompette': '喇叭水仙',
    'narcisse-bouquet': '多花水仙',
    jacinthe: '风信子',
    'anemone-coronaria': '银莲花',
    'anemone-sauvage': '栎林银莲花',
    freesia: '小苍兰',
    'pois-de-senteur': '香豌豆',
    muscari: '葡萄风信子',
    'fritillaire-meleagris': '花格贝母',
    glycine: '紫藤',
    'viburnum-roseum': '雪球荚蒾',
    alchemille: '羽衣草',
    'anthurium-obake': '双色红掌',
    'saule-a-chatons': '银柳',
    'liriope-lily-grass': '山麦冬',
    'cymbidium-grandes-fleurs': '大花蕙兰',
    'rose-de-jardin': '庭院玫瑰',
    sanguisorbe: '地榆',
    phalaenopsis: '蝴蝶兰',
    'arum-calla': '马蹄莲',
    'hortensia-boule': '绣球',
    'giroflee-matthiole': '紫罗兰',
    'oeillet-de-poete-dianthus': '须苞石竹',
    'anthurium-cristal': '水晶花烛',
    'jasminum-liane-jasmin': '素馨',
    'cyclamen-fleur-coupee': '仙客来',
    'ruscus-seche-teint': '染色假叶树',
    lisianthus: '洋桔梗',
    germini: '迷你非洲菊',
    'reine-marguerite': '翠菊',
    bromeliacees: '观赏凤梨',
    'rose-standard': '玫瑰',
    'rose-aspect-jardin': '庭院风玫瑰',
    gerbera: '非洲菊',
    'dahlia-decoratif': '大丽花',
    'chrysantheme-disbud': '大朵菊花',
    'anthurium-andraeanum': '红掌',
    'amarante-retombante': '尾穗苋',
    nerine: '娜丽花',
    'oeillet-standard': '康乃馨',
    delphinium: '飞燕草',
    gloriosa: '嘉兰',
    scabieuse: '蓝盆花',
  },
};
