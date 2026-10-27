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
    `一束独一无二的数字花束：${stems} 枝手绘花枝（${flowers}），插在${vase}里。它会绽放三个月，之后便永远停留在凋谢的模样。`,

  pages: {
    index: {
      title: "数字花束，一枝一枝手绘而成 | Belai's Garden",
      description: '照着真实花朵一枝一枝绘制的数字花束。每一束都独一无二，每天上新，可在 Base 上收藏，并摆上你的电脑桌面。',
      ogTitle: '数字花束，一枝一枝手绘而成',
      ogDescription: '每天都有独一无二的新花束，每一束都插在真实的花瓶里。看它绽放，收藏一束，摆上你的桌面。',
    },
    about: {
      title: "关于我们：照着真实花朵绘制的数字花束 | Belai's Garden",
      description: '我们的电子花束是怎样做成的：每朵花都依照真实照片用代码绘制，花瓶真实存在，价格就是花枝的价钱，花束能活三个月。',
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
  orgDescription: '照着真实花朵一枝一枝绘制的数字花束，在 Base 上收藏。',
  listName: '今日花束',

  // ---------- the shop page
  index: {
    h1: "Belai's Garden：有生命的数字花束",
    intro:
      '照着真实花朵一枝一枝绘制的数字花束。每天都有独一无二的新花束，每一束都插在真实的花瓶里，在 Base 上收藏。一束花能活三个月，之后便永远停留在凋谢的模样。借助免费的 Windows 桌面小组件 Belai Bureau，把你的花束摆上电脑桌面。',
    noscript:
      '这座花园需要 JavaScript 才能让花束绽放。你可以阅读<a href="{{p}}about.html">关于花束</a>，查看<a href="{{p}}desktop.html">如何把花束摆上桌面</a>，或阅读<a href="{{legal}}">法律声明与条款</a>。',
    galleryLabel: '今日花束',
    lookCloser: '凑近看看这束花',
    shelvesLabel: '花架',
    budVases: '单枝花瓶即将上架：一枝花，配一只花瓶。',
    noneCollected: '还没有花束找到它的收藏者。',
    seeOpenSea: '在 OpenSea 上查看收藏系列',
    onDesktop: '摆上桌面',
    buy: '购买',
    demoTitle: '把你的花束摆上桌面',
    closeVideo: '关闭视频',
    videoMissing: '视频即将上线：它会演示如何把花束摆上你的电脑桌面。',
    // the purchase sheet: the express waiver of the right of withdrawal (French Consumer Code L221-28, 13°)
    sheetTitle: '付款之前',
    waiver: '我要求立即交付我的花束，并知悉我因此将失去 14 天的撤回权。',
    accept: '付款即表示你确认已成年，并接受<a href="{{legal}}#terms">销售条款</a>。',
    confirm: '确认并付款',
    cancel: '取消',
  },

  // ---------- the About page
  about: {
    h1: '关于我们',
    lead: '一朵一朵绘制的花束，在你眼前绽放。',
    body: `<h2>写生而来的花朵</h2>
  <p>这座花园里的每一朵花，都依照真实照片用代码一笔一笔绘制：花瓣的形状、在每个品种上实测的颜色、花苞、盛开的花朵和凋谢的花朵。
    花园里已有五百多个品种。</p>

  <h2>每天都有独一无二的花束</h2>
  <p>每天都会搭配出新的花束，每一束都插在真实的花瓶里，比如那只铸铜鲤鱼花瓶。每一束花都独一无二：
    每一枝花茎、每一朵花、每一片叶子的位置，都不会在别的花束里重复。</p>

  <h2>有生命的花束</h2>
  <p>一束花自铸造之日起能活三个月：倒计时以小时和分钟显示它剩下的时间。
    之后，它便永远凋谢、静止。</p>

  <h2>真实花枝的价格</h2>
  <p>一束花的价格，就是它所有花枝在法国花店的价钱之和。花瓶免费赠送。转售时，我们分文不取：版税为 0%。</p>

  <h2>收藏一束花</h2>
  <p>这些花束是 Base 网络上的 NFT，在我们的 OpenSea 页面上架。你可以直接在本站用自己的钱包付款，
    无需离开网站。</p>

  <h2>摆上桌面</h2>
  <p>借助免费的 Windows 桌面小组件 <a href="{{p}}desktop.html">Belai Bureau</a>，你收藏的花束就能立在
    电脑桌面上，大小由你决定，可放在窗口前面或后面。</p>

  <h2>让花园生长</h2>
  <p>每收藏一束花，都在帮助花园生长：新的品种、新的花瓶、新的花束。</p>`,
    faqTitle: '常见问题',
    faq: [
      ['什么是数字花束？', '一束依照真实照片、以矢量图形一枝一枝绘制的花，插在真实的花瓶里。它在屏幕上绽放，随微风轻摆，三个月后凋谢。每一束都独一无二，以 Base 上的 NFT 形式收藏。'],
      ['我能把花束摆在电脑桌面上吗？', '可以。下载 Belai Bureau（免费，支持 Windows 10 和 11），关联你的钱包，你拥有的花束就会以小组件的形式立在桌面上：你可以随意摆放、调整大小、固定位置，并把它放在窗口前面或后面。'],
      ['花束如何定价？', '按其花枝在法国花店的价钱之和定价，换算成 ETH，不含增值税（依据法国《税法通则》第 293 B 条，免征增值税）。花瓶免费赠送。以欧元或美元显示的金额按当前汇率换算，仅供参考。'],
      ['三个月后会怎样？', '花束会凋谢，并永远保持凋谢、静止的模样。它依然属于你。'],
      ['转售时你们收取版税吗？', '不收：0%。只需支付平台和网络自身的费用。'],
      ['谁能展示一束花？', 'Belai Bureau 只展示你所关联的钱包持有的花束，关联时需一次免费签名（不产生任何转账）。'],
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
    updated: '最后更新：2026年10月16日',
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
    <h3>网站托管</h3>
    <p>Cloudflare, Inc.，101 Townsend Street, San Francisco, CA 94107, United States（美国）· +1 650 319 8930 ·
      cloudflare.com</p>
  </section>

  <section id="terms" aria-labelledby="t-terms">
    <h2 id="t-terms">销售条款</h2>

    <h3>1. 卖方与买方</h3>
    <p>本条款适用于法律声明中所列发布者（“我们”）通过本网站向任何成年人（“你”）出售的每一束花。
      为花束付款即表示接受本条款于购买当日的版本。本条款有多种语言版本，以法语版本为准。</p>

    <h3>2. 花束是什么</h3>
    <p>花束是一件独一无二的数字艺术作品：以矢量图形绘制的花朵，插在花瓶中，以非同质化代币（NFT）的形式记录在
      Base 网络上。购买前，每束花的页面都会显示其名称、花瓶、花枝数量和价格。</p>
    <p>一束花自铸造之日起能活三个月：它会绽放、轻摆，倒计时显示剩余时间。之后，它会凋谢，并永远保持凋谢、静止的模样。
      这是作品的一部分，而非瑕疵。</p>
    <p>花束是一件收藏品，不赋予任何获取收入或份额的权利。</p>

    <h3>3. 花束归你所有</h3>
    <p>持有其代币，即拥有这束花：你可以在任何地方展示、保存、赠送或转售，无需其他手续。如同一幅画，
      购买花束并不转让画作的著作权：制作并出售其复制品或周边商品不在许可范围之内。</p>

    <h3>4. 价格</h3>
    <p>价格以 ETH 标示，不含增值税（依据法国《税法通则》第 293 B 条，免征增值税），并在购买前显示在花束上。旁边以欧元或美元显示的金额，是按 CoinGecko
      提供的当前汇率换算的同一价格；你支付的是 ETH 价格。Base 网络的手续费（“gas”）由你的钱包另行加收，
      支付给网络，而非我们。</p>

    <h3>5. 下单与付款</h3>
    <p>你在本网站上用自己的钱包付款，通过 Seaport 完成。Seaport 是我们的花束所上架的 OpenSea 平台所用的协议。
      付款前，你需勾选一个方框，要求立即交付（见第7条），然后确认；你的钱包随即显示确切金额，在钱包中确认即构成
      负有付款义务的订单。已在网络上确认的转账无法撤销。</p>
    <p>你须自行负责你的钱包、钱包密钥以及用于购买的地址。我们从不保管你的密钥或你的资金。</p>

    <h3>6. 交付与收据</h3>
    <p>网络一经确认，花束即在同一笔转账中转入你的钱包。随后，网站会提供一份可下载的收据，确认本次购买、
      价格、转账以及你提出的立即交付请求。该转账在 Base 网络上的记录亦可作为购买凭证。</p>

    <h3>7. 撤回权</h3>
    <p>如果你是欧盟境内的消费者，通常享有自远程购买之日起 14 天的撤回权。花束属于不以有形载体提供、
      并即时交付的数字内容：付款前，你明确要求立即交付，并确认你因此失去撤回权（法国《消费法典》第L221-28条第13项；
      欧盟第2011/83号指令第16条(m)项）。</p>

    <h3>8. 相符性</h3>
    <p>如果你是消费者，你享有数字内容的法定相符性保证（法国《消费法典》第L224-25-1条及以下各条）：
      如果你收到的花束与其描述不符，请写信告知我们，我们将使其符合描述，否则予以退款。</p>

    <h3>9. 转售</h3>
    <p>转售时我们不收取任何版税（0%）。只需支付平台和网络自身的费用。转售花束的价格由其持有者自由定价；
      我们对此不作任何承诺。</p>

    <h3>10. 责任</h3>
    <p>Base 网络、各类钱包及 OpenSea 平台均由第三方运营。对于其故障、费用或变更，以及因密钥丢失或地址错误造成的损失，
      我们不承担责任。本条款的任何内容均不限制消费者依法享有的权利。</p>

    <h3>11. 投诉与调解</h3>
    <p>请先写信给我们（见<a href="{{legal}}#contact">联系方式</a>）；我们将在 30 天内答复。若未能解决，
      消费者可免费将争议提交我们的消费调解员：
      <span class="a-remplir">[调解员的名称、网站和邮寄地址]</span>。</p>

    <h3>12. 适用法律</h3>
    <p>本条款受法国法律管辖。消费者仍受其居住国强制性规定的保护，并可向该国或法国的法院提起诉讼。</p>
  </section>

  <section id="privacy" aria-labelledby="t-privacy">
    <h2 id="t-privacy">隐私政策</h2>
    <p>数据控制者为<a href="{{legal}}#notice">法律声明</a>中所列的发布者。我们尽可能少地收集数据，
      且绝不用于对你进行画像分析。</p>
    <h3>处理哪些数据、出于何种目的、依据何种法律基础</h3>
    <ul>
      <li><strong>连接数据</strong>（IP 地址、浏览器、所访问的页面）：由我们的托管商 Cloudflare 保存在其技术日志中，
        用于提供网站服务并防止滥用。法律基础：我们维持网站正常、安全运行的正当利益。</li>
      <li><strong>你所在的国家</strong>：每次访问时由 Cloudflare 根据你的 IP 地址推断，用于以你的语言显示网站，
        并以你的货币显示价格。该信息即时使用，从不保存。法律基础：我们让你能读懂网站的正当利益。</li>
      <li><strong>ETH 汇率：</strong>为以你的货币显示金额，你的浏览器会向 CoinGecko（api.coingecko.com）
        查询当前汇率；CoinGecko 会看到你的 IP 地址。法律基础：我们显示最新金额的正当利益。</li>
      <li><strong>你的钱包地址</strong>：在你购买或关联钱包时读取，用于完成购买或展示你的花束。法律基础：合同。
        Base 网络上的转账是公开且永久的：我们和任何人都无法将其删除。</li>
    </ul>
    <h3>Cookie</h3>
    <p>如果你自行选择了语言，网站会用一个名为 <code>lang</code> 的 Cookie 记住你的选择，保存一年。
      仅此而已：没有其他 Cookie，没有访问统计，没有广告。该 Cookie 仅用于保存你的选择，因此无需征得同意的横幅提示。</p>
    <h3>谁会接收数据，位于何处</h3>
    <p>Cloudflare, Inc.（网站托管，美国）和 CoinGecko（汇率，新加坡）。向欧盟以外地区的传输，对 Cloudflare
      依据欧盟—美国数据隐私框架，其他则依据欧盟委员会的标准合同条款。</p>
    <h3>保存期限</h3>
    <p>Cloudflare 的技术日志：按 Cloudflare 的设定，从数天到数周不等。你发给我们的电子邮件：在答复所需期间内保存，
      之后再保存三年。我们不保存其他任何数据。</p>
    <h3>你的权利</h3>
    <p>你可以写信给我们（见<a href="{{legal}}#contact">联系方式</a>），要求访问、更正或删除你的数据，限制或反对对其的处理，
      以及以可携带的形式获取你的数据。你也可以向法国数据保护机构 CNIL（cnil.fr）投诉。</p>
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
    <p>本网站及 Belai Bureau 中的花朵、花瓶、花束、场景、文字、视频和代码均为原创作品。未经许可，禁止任何形式的复制，
      <a href="{{legal}}#terms">销售条款</a>所允许的情形除外。OpenSea、Base 和 CoinGecko 是其各自所有者的名称。
      ETH 汇率由 <a href="https://www.coingecko.com/" target="_blank" rel="noopener">CoinGecko</a> 提供。</p>
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
    shelves: { bouquets: '今日花束', soliflores: '单枝花瓶', vendus: '已被收藏的花束' },
    desktopTitle: '摆上我的桌面',
    desktopLabel: '把你的花束摆上桌面',
    openSeaTitle: '我们在 OpenSea 上的收藏系列',
    openSeaLabel: '我们在 OpenSea 上的收藏系列（新标签页）',
    about: '关于我们',
    legal: '法律信息',
    closeLegal: '关闭法律信息面板',
    footer:
      '<p>每一束花都是独一无二的数字收藏品（Base 上的 NFT），以 ETH 标价，不含增值税（依据法国《税法通则》第 293 B 条，免征增值税）；以欧元或美元显示的金额是按当前汇率换算的同一价格。它自铸造之日起能活三个月，之后便永远凋谢。花束即时交付，因此一经确认，撤回权即不再适用。转售时我们不收取任何版税（0%）。</p><p>没有追踪，没有广告：最多一个 Cookie，用于记住你选择的语言。</p>',
    links: { notice: '法律声明', terms: '销售条款', privacy: '隐私', app: 'Belai Bureau 使用许可', accessibility: '无障碍', contact: '联系方式' },
    credit: 'ETH 汇率由 {coingecko} 提供。',
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
    buy: '购买',
    soon: '即将推出',
    soonMessage: '站内购买即将开放。',
    tickFirst: '请先勾选方框：你的花束将立即交付。',
    receipt: {
      title: '收据',
      download: '下载你的收据',
      bouquet: '花束',
      token: '代币',
      price: '价格',
      date: '日期',
      buyer: '买方钱包',
      transaction: '转账',
      seller: '卖方',
      waiver: '付款前，你已要求立即交付，并确认你因此失去撤回权（法国《消费法典》第L221-28条第13项）。',
      terms: '当日接受的销售条款：{url}',
      taxes: '不含增值税（依据法国《税法通则》第 293 B 条，免征增值税）。',
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
