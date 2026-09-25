/* =========================================================
   OSfolio · 站点内容（全部在这里改！）
   zh = 中文内容，en = English content
   改完保存刷新即可，不需要任何构建工具
   ========================================================= */
const SITE = {
  /* ---------------- 中文 ---------------- */
  zh: {
    name: "陈默",
    enName: "Mo Chen",
    title: "独立开发者 · 前端 & 创意编程",
    location: "📍 中国 · 杭州",
    email: "hi@example.com",
    avatar: "🧑‍💻",
    bio: "喜欢把奇怪的想法做出来。平时写前端、搞点交互小玩具，偶尔折腾生成艺术。相信「能跑起来的东西才有说服力」。这个页面本身就是我做的开源模板 OSfolio —— 一个假装是操作系统的个人主页。",

    skills: [
      { name: "JavaScript / TypeScript", level: 92 },
      { name: "HTML / CSS 动画", level: 88 },
      { name: "Node.js", level: 78 },
      { name: "创意编程 / Canvas", level: 74 },
      { name: "设计 & 排版", level: 70 },
      { name: "折腾没用的小玩意", level: 99 },
    ],

    experience: [
      {
        role: "独立开发者",
        org: "自由职业",
        period: "2023 — 至今",
        desc: "做自己的小产品，接有意思的外包。写过用户量六位数的浏览器插件，也写过只有三个人用的命令行工具，都挺开心。",
      },
      {
        role: "前端工程师",
        org: "某互联网公司",
        period: "2020 — 2023",
        desc: "负责中后台与活动页开发，把首屏加载从 4.2s 优化到 1.1s，顺手给团队写了套组件库。",
      },
      {
        role: "计算机科学 · 学士",
        org: "某大学",
        period: "2016 — 2020",
        desc: "课上没学会什么，课下全靠自己做项目。毕业设计做了一个像素风小游戏，答辩老师笑了。",
      },
    ],

    tags: ["前端", "创意编程", "开源", "像素艺术", "交互设计"],

    links: [
      { icon: "🐙", label: "GitHub", href: "https://github.com/zhenmaoge520" },
      { icon: "✉️", label: "邮箱", href: "mailto:hi@example.com" },
      { icon: "🌐", label: "主页", href: "https://zhenmaoge520.github.io/osfolio/" },
      { icon: "🐦", label: "X / Twitter", href: "https://x.com/" },
    ],

    projects: [
      { icon: "🐱", name: "Happy Cat", desc: "一只养在浏览器里的小猫，能摸能喂能睡觉，还会呼噜。", tech: ["HTML", "CSS", "JS"], href: "https://github.com/zhenmaoge520/happy-cat" },
      { icon: "🖥️", name: "OSfolio", desc: "就是这个页面 —— 模拟操作系统桌面的个人主页模板。", tech: ["静态站点", "零依赖"], href: "#" },
      { icon: "🎨", name: "Generative Art", desc: "用 Canvas 做的生成艺术实验合集，每周更新一张。", tech: ["Canvas", "JS"], href: "#" },
      { icon: "⌨️", name: "dotfiles", desc: "我的终端与编辑器配置，能让你少踩 80% 的坑。", tech: ["Shell"], href: "#" },
    ],

    posts: [
      {
        title: "我把个人主页做成了一个操作系统",
        date: "2026-09-26",
        tag: "项目",
        body: [
          "传统的博客模板长得都一样：顶栏、大标题、文章列表。看久了真的会腻。",
          "所以我把整个页面重写成了一个「桌面」——简历是「关于我」应用，文章列表是「资源管理器」，还有一个真的能敲命令的终端。切换主题后，它可以在 macOS、Windows、复古终端和赛博朋克之间来回变脸。",
          "技术上没有用任何框架：窗口管理是几十行原生 JS，主题切换靠 CSS 变量，内容全部存在一个 data.js 里。所以它能直接双击 index.html 打开，也能丢到 GitHub Pages 上。",
          "最意外的是，来围观的人里有一半是先敲了 <code>sudo rm -rf /</code> 才想起来看简历的。",
        ],
      },
      {
        title: "零依赖项目为什么更受欢迎",
        date: "2026-09-10",
        tag: "思考",
        body: [
          "在 GitHub 上逛久了会发现一个规律：越是「clone 下来就能跑」的项目，越容易拿到 star。",
          "原因是成本。一个需要 npm install、配置环境变量、跑构建的项目，路人即使在首页心动了，也很少真的动手。而一个打开 index.html 就能看到效果的项目，从好奇到上手只需要三秒。",
          "所以我做模板时刻意守着一条线：不引入任何运行时依赖，所有内容集中在一个文件里改。想加功能的人自然会 fork，不想加的人也不会被劝退。",
        ],
      },
      {
        title: "用 CSS 变量做主题切换的五个坑",
        date: "2026-08-28",
        tag: "技术",
        body: [
          "第一坑：光改颜色不够，字体、圆角、阴影都得跟着变，否则「像素风」只是换了个配色的 macOS。",
          "第二坑：Windows 风格需要隐藏菜单栏、把 Dock 变成任务栏，这种结构差异只能靠 CSS 硬切，别指望一套布局通吃。",
          "第三坑：半透明面板（backdrop-filter）在深色主题下会让文字发虚，记得同步提高对比度。",
          "第四坑：主题要存 localStorage，否则用户每次刷新都被打回默认主题。",
          "第五坑：别忘了 <code>prefers-color-scheme</code>，第一次访问时给个聪明的默认值，好感度直接翻倍。",
        ],
      },
    ],
  },

  /* ---------------- English ---------------- */
  en: {
    name: "Mo Chen",
    enName: "Mo Chen",
    title: "Indie Developer · Frontend & Creative Coding",
    location: "📍 Hangzhou, China",
    email: "hi@example.com",
    avatar: "🧑‍💻",
    bio: "I build the weird ideas. Frontend by day, interactive toys by night, generative art on weekends. I believe a thing only counts once it runs. This page itself is OSfolio — my open-source, desktop-OS-style homepage template.",

    skills: [
      { name: "JavaScript / TypeScript", level: 92 },
      { name: "HTML / CSS animation", level: 88 },
      { name: "Node.js", level: 78 },
      { name: "Creative coding / Canvas", level: 74 },
      { name: "Design & typography", level: 70 },
      { name: "Building useless little things", level: 99 },
    ],

    experience: [
      {
        role: "Indie Developer",
        org: "Freelance",
        period: "2023 — now",
        desc: "Shipping my own little products and taking the fun contracts. Built a browser extension with six-figure users, and a CLI tool used by literally three people. Enjoyed both equally.",
      },
      {
        role: "Frontend Engineer",
        org: "Some internet company",
        period: "2020 — 2023",
        desc: "Owned dashboard and campaign pages. Cut first-paint from 4.2s to 1.1s and wrote the team component library along the way.",
      },
      {
        role: "BSc, Computer Science",
        org: "Some university",
        period: "2016 — 2020",
        desc: "Learned little in class, everything from side projects. Graduation project was a pixel-art game — the committee laughed (in a good way).",
      },
    ],

    tags: ["Frontend", "Creative coding", "Open source", "Pixel art", "Interaction design"],

    links: [
      { icon: "🐙", label: "GitHub", href: "https://github.com/zhenmaoge520" },
      { icon: "✉️", label: "Email", href: "mailto:hi@example.com" },
      { icon: "🌐", label: "Website", href: "https://zhenmaoge520.github.io/osfolio/" },
      { icon: "🐦", label: "X / Twitter", href: "https://x.com/" },
    ],

    projects: [
      { icon: "🐱", name: "Happy Cat", desc: "A cat that lives in your browser. Pet it, feed it, it purrs.", tech: ["HTML", "CSS", "JS"], href: "https://github.com/zhenmaoge520/happy-cat" },
      { icon: "🖥️", name: "OSfolio", desc: "This very page — a desktop-OS-style homepage template.", tech: ["Static", "Zero-dep"], href: "#" },
      { icon: "🎨", name: "Generative Art", desc: "Weekly Canvas experiments, one sketch every week.", tech: ["Canvas", "JS"], href: "#" },
      { icon: "⌨️", name: "dotfiles", desc: "My terminal and editor config — saves you 80% of the pain.", tech: ["Shell"], href: "#" },
    ],

    posts: [
      {
        title: "I turned my homepage into an operating system",
        date: "2026-09-26",
        tag: "Project",
        body: [
          "Every blog template looks the same: top nav, big title, list of posts. It gets old fast.",
          "So I rewrote the whole page as a desktop — the résumé is an \"About\" app, the post list lives in a file explorer, and there's a terminal that actually takes commands. Switch themes and it morphs between macOS, Windows, a retro terminal and cyberpunk.",
          "No framework was involved: the window manager is a few dozen lines of vanilla JS, theming is pure CSS variables, and all content sits in one data.js file. That means you can just double-click index.html, or drop it on GitHub Pages.",
          "Fun fact: half the visitors type <code>sudo rm -rf /</code> before they ever open the résumé.",
        ],
      },
      {
        title: "Why zero-dependency projects win",
        date: "2026-09-10",
        tag: "Thoughts",
        body: [
          "Spend enough time on GitHub and a pattern shows up: the projects you can clone and run immediately are the ones collecting stars.",
          "It's about cost. If a project needs npm install, env vars and a build step, most people who felt a spark on the README will never actually start it. If it's open-index.html-and-it-works, curiosity converts in three seconds.",
          "So I hold one line when building templates: no runtime dependencies, all content editable in a single file. People who want more will fork; people who don't won't bounce.",
        ],
      },
      {
        title: "Five traps when theming with CSS variables",
        date: "2026-08-28",
        tag: "Tech",
        body: [
          "Trap one: color isn't enough. Font, radius and shadow have to change too, or your \"pixel theme\" is just macOS in different paint.",
          "Trap two: a Windows look needs the menu bar hidden and the dock turned into a taskbar. Structural differences need hard CSS swaps — one layout can't rule them all.",
          "Trap three: translucent panels (backdrop-filter) wash out text on dark themes. Raise contrast along with the blur.",
          "Trap four: persist the theme in localStorage, or every reload snaps the user back to default.",
          "Trap five: don't forget <code>prefers-color-scheme</code> — a smart default on first visit buys a lot of goodwill.",
        ],
      },
    ],
  },
};
