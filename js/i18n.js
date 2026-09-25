/* =========================================================
   OSfolio · 界面文案（中英双语）
   想加语言：复制一份 key 改掉即可，无需动逻辑
   ========================================================= */
const I18N = {
  zh: {
    apps: { about: "关于我", terminal: "终端", blog: "博客", projects: "作品集", settings: "设置", trash: "回收站" },
    menu: { finder: "Finder", file: "文件", view: "视图", help: "帮助" },
    boot: "正在启动",
    theme: "主题",
    lang: "语言",
    wallpaper: "壁纸",
    about: {
      title: "关于我",
      skills: "技能",
      experience: "经历",
      contact: "联系方式",
      contactTip: "把下面这些换成你自己的社交链接（改 js/data.js）",
    },
    blog: {
      title: "博客",
      empty: "← 左边选一篇文章",
      postsCount: (n) => `共 ${n} 篇文章`,
    },
    projects: { title: "作品集", tip: "点击卡片打开项目链接" },
    settings: {
      title: "设置",
      themeLabel: "外观主题",
      langLabel: "界面语言",
      wallLabel: "桌面壁纸",
      hint: "所有选择都会自动记住（存在浏览器 localStorage）",
      reset: "重置为默认",
      authorTip: "这个模板的所有内容都写在 js/data.js 里，改那个文件就能变成你自己的主页。",
    },
    terminal: {
      title: "终端",
      welcome: "输入 help 查看可用命令；试试 neofetch、ls、cat resume.txt、open blog",
      unknown: (c) => `找不到命令：${c}（输入 help 看看）`,
      notfound: (f) => `没有那个文件或目录：${f}`,
      isDir: (f) => `${f} 是一个目录，用 ls 看看里面`,
      helpTitle: "可用命令",
    },
    trash: { title: "回收站", empty: "空的。像你的日程表一样干净 ✨" },
    themes: {
      mac: "macOS 风格", win: "Windows 风格", term: "终端 Terminal",
      cyber: "赛博朋克", pixel: "复古像素",
    },
    walls: { aurora: "极光", grid: "网格", sunset: "日落", forest: "森林", stars: "星空" },
  },

  en: {
    apps: { about: "About", terminal: "Terminal", blog: "Blog", projects: "Projects", settings: "Settings", trash: "Trash" },
    menu: { finder: "Finder", file: "File", view: "View", help: "Help" },
    boot: "Starting up",
    theme: "Theme",
    lang: "Language",
    wallpaper: "Wallpaper",
    about: {
      title: "About me",
      skills: "Skills",
      experience: "Experience",
      contact: "Contact",
      contactTip: "Replace these with your own links (edit js/data.js)",
    },
    blog: {
      title: "Blog",
      empty: "← Pick an article on the left",
      postsCount: (n) => `${n} posts`,
    },
    projects: { title: "Projects", tip: "Click a card to open the project" },
    settings: {
      title: "Settings",
      themeLabel: "Appearance",
      langLabel: "Language",
      wallLabel: "Wallpaper",
      hint: "Your choices are remembered (localStorage)",
      reset: "Reset to defaults",
      authorTip: "Everything on this page lives in js/data.js — edit that file to make it yours.",
    },
    terminal: {
      title: "Terminal",
      welcome: "Type help for commands. Try neofetch, ls, cat resume.txt, open blog",
      unknown: (c) => `command not found: ${c} (try help)`,
      notfound: (f) => `no such file or directory: ${f}`,
      isDir: (f) => `${f} is a directory — try ls`,
      helpTitle: "Commands",
    },
    trash: { title: "Trash", empty: "Empty. As clean as your inbox ✨" },
    themes: {
      mac: "macOS", win: "Windows", term: "Terminal",
      cyber: "Cyberpunk", pixel: "Retro pixel",
    },
    walls: { aurora: "Aurora", grid: "Grid", sunset: "Sunset", forest: "Forest", stars: "Stars" },
  },
};

/* 主题色板（设置面板里的预览小方块） */
const THEME_SWATCH = {
  mac: "#4c8dff",
  win: "#0078d4",
  term: "#33ff66",
  cyber: "#ff2bd1",
  pixel: "#e94f37",
};
