/* =========================================================
   OSfolio · 桌面逻辑
   窗口管理 / 应用渲染 / 主题与语言 / 终端
   ========================================================= */
(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  /* ---------------- 状态 ---------------- */
  const STORE = "osfolio-prefs";
  const prefs = Object.assign(
    { theme: "mac", wall: "aurora", lang: "zh" },
    (() => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } })()
  );
  if (!prefs.lang) {
    prefs.lang = (navigator.language || "zh").toLowerCase().startsWith("en") ? "en" : "zh";
  }
  // 支持 URL 参数：index.html?theme=cyber&lang=en&wall=stars&app=terminal（方便直接分享某种主题）
  var qApp = null;
  try {
    const q = new URLSearchParams(location.search);
    if (q.get("theme") && I18N.zh.themes[q.get("theme")]) prefs.theme = q.get("theme");
    if (q.get("wall") && I18N.zh.walls[q.get("wall")]) prefs.wall = q.get("wall");
    if (q.get("lang") === "zh" || q.get("lang") === "en") prefs.lang = q.get("lang");
  } catch (e) {}
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(prefs)); } catch (e) {} };

  const t = () => I18N[prefs.lang];          // 界面文案
  const d = () => SITE[prefs.lang];          // 站点内容

  /* ---------------- 应用注册 ---------------- */
  const APPS = [
    { id: "about",    icon: "👤", render: renderAbout },
    { id: "terminal", icon: "🖥️", render: renderTerminal, w: 720, h: 440 },
    { id: "blog",     icon: "📝", render: renderBlog,     w: 760, h: 470 },
    { id: "projects", icon: "📦", render: renderProjects },
    { id: "settings", icon: "⚙️", render: renderSettings, w: 520, h: 460 },
    { id: "trash",    icon: "🗑️", render: renderTrash,    w: 420, h: 260 },
  ];
  const appById = (id) => APPS.find((a) => a.id === id);

  /* ---------------- 桌面与 Dock ---------------- */
  function renderShell() {
    const icons = $("#desktop-icons");
    const dock = $("#dock-apps");
    icons.innerHTML = "";
    dock.innerHTML = "";

    APPS.forEach((a) => {
      const name = t().apps[a.id];
      const ic = el("div", "desk-icon", `<div class="ico">${a.icon}</div><div class="label">${name}</div>`);
      ic.dataset.app = a.id;
      ic.addEventListener("dblclick", () => openApp(a.id));
      ic.addEventListener("click", () => openApp(a.id));
      icons.appendChild(ic);

      const di = el("div", "dock-item", a.icon);
      di.dataset.app = a.id;
      di.title = name;
      di.addEventListener("click", () => openApp(a.id));
      dock.appendChild(di);
    });

    $("#menu-finder").textContent = t().menu.finder;
    $("#menu-file").textContent = t().menu.file;
    $("#menu-view").textContent = t().menu.view;
    $("#menu-help").textContent = t().menu.help;
    $("#lang-btn").textContent = prefs.lang === "zh" ? "🌐 中文" : "🌐 English";
    $("#theme-btn").textContent = "🎨 " + t().theme;
    document.documentElement.lang = prefs.lang === "zh" ? "zh-CN" : "en";
  }

  /* ---------------- 窗口管理 ---------------- */
  const windows = {};
  let zTop = 20;
  let cascade = 0;

  function openApp(id) {
    if (windows[id]) {
      const w = windows[id];
      w.classList.remove("minimized");
      focusWin(id);
      return;
    }
    const app = appById(id);
    const node = $("#win-template").content.firstElementChild.cloneNode(true);
    node.dataset.app = id;
    node.querySelector(".win-title").textContent = app.icon + "  " + t().apps[id];

    const isSmall = window.innerWidth < 700;
    const w = Math.min(app.w || 680, window.innerWidth - 40);
    const h = Math.min(app.h || 460, window.innerHeight - 140);
    node.style.width = w + "px";
    node.style.height = h + "px";
    if (isSmall) {
      node.style.top = "38px";
      node.style.left = "2vw";
    } else {
      const off = (cascade++ % 6) * 26;
      node.style.top = 52 + off + "px";
      node.style.left = Math.min(120 + off, window.innerWidth - w - 30) + "px";
    }

    $("#windows").appendChild(node);
    windows[id] = node;

    const bar = node.querySelector(".titlebar");
    makeDraggable(node, bar);

    node.querySelector(".btn.close").addEventListener("click", () => closeWin(id));
    node.querySelector(".btn-close").addEventListener("click", () => closeWin(id));
    node.querySelector(".btn.max").addEventListener("click", () => node.classList.toggle("maximized"));
    node.querySelector(".btn.mini").addEventListener("click", () => node.classList.add("minimized"));
    node.addEventListener("pointerdown", () => focusWin(id));

    app.render(node.querySelector(".win-body"), node);
    focusWin(id);
    markActive(id);
  }

  function closeWin(id) {
    if (windows[id]) { windows[id].remove(); delete windows[id]; }
    markActive(null);
  }

  function focusWin(id) {
    Object.entries(windows).forEach(([k, w]) => w.classList.toggle("focused", k === id));
    windows[id].style.zIndex = ++zTop;
  }

  function markActive(id) {
    document.querySelectorAll(".desk-icon, .dock-item").forEach((n) => {
      n.classList.toggle("active", n.dataset.app === id);
    });
  }

  function makeDraggable(node, handle) {
    let sx = 0, sy = 0, ox = 0, oy = 0, dragging = false;
    handle.addEventListener("pointerdown", (e) => {
      if (node.classList.contains("maximized")) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      ox = node.offsetLeft; oy = node.offsetTop;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const x = Math.max(-node.offsetWidth + 80, Math.min(window.innerWidth - 80, ox + e.clientX - sx));
      const y = Math.max(30, Math.min(window.innerHeight - 60, oy + e.clientY - sy));
      node.style.left = x + "px";
      node.style.top = y + "px";
    });
    handle.addEventListener("pointerup", () => { dragging = false; });
  }

  /* =========================================================
     应用：关于我（简历）
     ========================================================= */
  function renderAbout(body) {
    const s = d(), i = t();
    body.innerHTML = `
      <div class="profile">
        <div class="avatar">${s.avatar}</div>
        <div class="profile-main">
          <div class="profile-name">${s.name}${s.enName && s.enName !== s.name ? ` <span style="font-size:14px;opacity:.6">${s.enName}</span>` : ""}</div>
          <div class="profile-title">${s.title}</div>
          <div class="profile-meta"><span>${s.location}</span><span>✉️ ${s.email}</span></div>
          <div class="profile-bio">${s.bio}</div>
          <div class="chips">${s.tags.map((x) => `<span class="chip">${x}</span>`).join("")}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">🛠️ ${i.about.skills}</div>
        ${s.skills.map((k) => `
          <div class="skill">
            <div class="skill-row"><span>${k.name}</span><span>${k.level}%</span></div>
            <div class="skill-bar"><div class="skill-fill" style="width:${k.level}%"></div></div>
          </div>`).join("")}
      </div>

      <div class="section">
        <div class="section-title">🧭 ${i.about.experience}</div>
        <div class="timeline">
          ${s.experience.map((e) => `
            <div class="tl-item">
              <div class="tl-head"><span class="tl-role">${e.role}</span><span class="tl-period">${e.period}</span></div>
              <div class="tl-org">${e.org}</div>
              <div class="tl-desc">${e.desc}</div>
            </div>`).join("")}
        </div>
      </div>

      <div class="section">
        <div class="section-title">📮 ${i.about.contact}</div>
        <div class="links">
          ${s.links.map((l) => `<a class="link" href="${l.href}" target="_blank" rel="noopener">${l.icon} ${l.label}</a>`).join("")}
        </div>
        <div class="tip">💡 ${i.about.contactTip}</div>
      </div>`;
  }

  /* =========================================================
     应用：博客
     ========================================================= */
  function renderBlog(body) {
    const s = d(), i = t();
    body.innerHTML = `
      <div class="blog-wrap">
        <div class="blog-list" id="blist">
          ${s.posts.map((p, idx) => `
            <div class="blog-item${idx === 0 ? " active" : ""}" data-i="${idx}">
              <div class="bt">${p.title}</div>
              <div class="bm">${p.date} · #${p.tag}</div>
            </div>`).join("")}
          <div class="tip">${i.blog.postsCount(s.posts.length)}</div>
        </div>
        <div class="blog-detail" id="bdetail"></div>
      </div>`;

    const detail = body.querySelector("#bdetail");
    const show = (idx) => {
      const p = s.posts[idx];
      detail.innerHTML = `<h3>${p.title}</h3><div class="meta">${p.date} · #${p.tag}</div>${p.body.map((x) => `<p>${x}</p>`).join("")}`;
      body.querySelectorAll(".blog-item").forEach((n) => n.classList.toggle("active", +n.dataset.i === idx));
    };
    body.querySelectorAll(".blog-item").forEach((n) => n.addEventListener("click", () => show(+n.dataset.i)));
    show(0);
  }

  /* =========================================================
     应用：作品集
     ========================================================= */
  function renderProjects(body) {
    const s = d(), i = t();
    body.innerHTML = `
      <div class="cards">
        ${s.projects.map((p) => `
          <div class="card">
            <div class="cico">${p.icon}</div>
            <div class="cname">${p.name}</div>
            <div class="cdesc">${p.desc}</div>
            <div class="chips">${p.tech.map((x) => `<span class="chip">${x}</span>`).join("")}</div>
            <div style="margin-top:8px"><a class="clink" href="${p.href}" target="_blank" rel="noopener">打开 →</a></div>
          </div>`).join("")}
      </div>
      <div class="tip">💡 ${i.projects.tip}</div>`;
  }

  /* =========================================================
     应用：设置
     ========================================================= */
  function renderSettings(body, win) {
    const i = t();
    body.innerHTML = `
      <div class="set-grid">
        <div>
          <div class="section-title">🎨 ${i.settings.themeLabel}</div>
          <div class="set-row" id="row-theme">
            ${Object.keys(I18N.zh.themes).map((k) => `
              <div class="set-opt${prefs.theme === k ? " on" : ""}" data-theme="${k}">
                <span class="swatch" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${THEME_SWATCH[k]};margin-right:6px"></span>
                ${i.themes[k]}
              </div>`).join("")}
          </div>
        </div>
        <div>
          <div class="section-title">🖼️ ${i.settings.wallLabel}</div>
          <div class="set-row" id="row-wall">
            ${Object.keys(I18N.zh.walls).map((k) => `<div class="set-opt${prefs.wall === k ? " on" : ""}" data-wall="${k}">${i.walls[k]}</div>`).join("")}
          </div>
        </div>
        <div>
          <div class="section-title">🌐 ${i.settings.langLabel}</div>
          <div class="set-row" id="row-lang">
            <div class="set-opt${prefs.lang === "zh" ? " on" : ""}" data-lang="zh">中文</div>
            <div class="set-opt${prefs.lang === "en" ? " on" : ""}" data-lang="en">English</div>
          </div>
        </div>
        <div class="tip">💡 ${i.settings.authorTip}</div>
      </div>`;

    body.querySelectorAll("[data-theme]").forEach((n) =>
      n.addEventListener("click", () => { setTheme(n.dataset.theme); renderSettings(body, win); }));
    body.querySelectorAll("[data-wall]").forEach((n) =>
      n.addEventListener("click", () => { setWall(n.dataset.wall); renderSettings(body, win); }));
    body.querySelectorAll("[data-lang]").forEach((n) =>
      n.addEventListener("click", () => { setLang(n.dataset.lang); renderSettings(body, win); }));
  }

  /* =========================================================
     应用：回收站（彩蛋）
     ========================================================= */
  function renderTrash(body) {
    body.innerHTML = `<div style="font-size:40px;text-align:center;margin:20px 0">🗑️</div>
      <div style="text-align:center">${t().trash.empty}</div>`;
  }

  /* =========================================================
     应用：终端
     ========================================================= */
  function buildFS() {
    const s = d();
    const children = {
      "README.md": { type: "file", get: () =>
        `${d().name} — ${d().title}\n\n${prefs.lang === "zh"
          ? "这是一个模拟操作系统桌面的个人主页模板。\n试试这些命令：ls / cat resume.txt / open blog / neofetch"
          : "A desktop-OS-style personal homepage template.\nTry: ls / cat resume.txt / open blog / neofetch"}` },
      "resume.txt": { type: "file", get: () =>
        `${s.name} (${s.enName})\n${s.title}\n${s.location}\n${s.email}\n\n` +
        (prefs.lang === "zh" ? "经历：\n" : "Experience:\n") +
        s.experience.map((e) => `- ${e.period}  ${e.role} @ ${e.org}`).join("\n") +
        "\n\n" + (prefs.lang === "zh" ? "技能：\n" : "Skills:\n") +
        s.skills.map((k) => `- ${k.name}  ${k.level}%`).join("\n") },
      "contact.txt": { type: "file", get: () =>
        s.links.map((l) => `${l.icon} ${l.label}: ${l.href}`).join("\n") },
      "skills.json": { type: "file", get: () => JSON.stringify(s.skills, null, 2) },
      "blog": { type: "dir", children: Object.fromEntries(
        s.posts.map((p, i) => [`${i + 1}.md`, { type: "file", get: () => `# ${p.title}\n${p.date} #${p.tag}\n\n${p.body.join("\n\n")}` }])
      ) },
      "projects": { type: "dir", children: Object.fromEntries(
        s.projects.map((p) => [`${p.name.toLowerCase().replace(/\s+/g, "-")}.txt`,
          { type: "file", get: () => `${p.icon} ${p.name}\n${p.desc}\n${p.href}` }])
      ) },
    };
    return { type: "dir", children };
  }

  function renderTerminal(body) {
    const i = t();
    body.innerHTML = `
      <div class="term">
        <div class="term-out" id="tout"></div>
        <div class="term-input-row">
          <span class="term-prompt">visitor@osfolio:~$</span>
          <input class="term-input" id="tin" autocomplete="off" spellcheck="false" />
        </div>
      </div>`;

    const out = body.querySelector("#tout");
    const input = body.querySelector("#tin");
    let cwd = [];
    const history = [];
    let hIdx = -1;

    const print = (text, cls = "") => {
      const line = el("div", "term-line " + cls, text);
      out.appendChild(line);
      out.scrollTop = out.scrollHeight;
    };
    const here = () => {
      let node = buildFS();
      cwd.forEach((k) => { node = node.children[k]; });
      return node;
    };

    const COMMANDS = {
      help() {
        print(i.terminal.helpTitle + ":", "ok");
        [
          ["ls [目录]", "列出文件"],
          ["cd <目录> / cd ..", "进入目录"],
          ["cat <文件>", "查看文件内容"],
          ["open <应用>", "打开应用：about / blog / projects / settings"],
          ["whoami", "你是谁"],
          ["neofetch", "系统信息"],
          ["skills", "技能一览"],
          ["theme <名称>", "切换主题：mac / win / term / cyber / pixel"],
          ["lang <zh|en>", "切换语言"],
          ["date", "现在时间"],
          ["echo <文本>", "复读机"],
          ["clear", "清屏"],
          ["sudo ...", "真的以为我会让你执行吗"],
        ].forEach(([c, desc]) => print(`  ${c.padEnd(22, " ")} ${desc}`));
      },
      ls(args) {
        const node = args[0] ? resolve(args[0]) : here();
        if (!node) return print(i.terminal.notfound(args[0]), "err");
        if (node.type !== "dir") return print(args[0], "");
        print(Object.keys(node.children).map((k) =>
          node.children[k].type === "dir" ? k + "/" : k).join("   "));
      },
      cd(args) {
        if (!args[0] || args[0] === "~") { cwd = []; return; }
        if (args[0] === "..") { cwd.pop(); return; }
        const node = resolve(args[0]);
        if (!node) return print(i.terminal.notfound(args[0]), "err");
        if (node.type !== "dir") return print(i.terminal.isDir(args[0]), "err");
        if (node === here()) return;
        cwd.push(args[0]);
      },
      pwd() { print("~/" + cwd.join("/"), ""); },
      cat(args) {
        if (!args[0]) return print("cat: " + (prefs.lang === "zh" ? "缺少文件名" : "missing filename"), "err");
        const node = resolve(args[0]);
        if (!node) return print(i.terminal.notfound(args[0]), "err");
        if (node.type === "dir") return print(i.terminal.isDir(args[0]), "err");
        print(node.get());
      },
      open(args) {
        const key = (args[0] || "").toLowerCase();
        const map = { about: "about", blog: "blog", projects: "projects", settings: "settings", terminal: "terminal", trash: "trash" };
        if (map[key]) { openApp(map[key]); print((prefs.lang === "zh" ? "已打开 " : "opened ") + key, "ok"); }
        else print((prefs.lang === "zh" ? "无法打开：" : "cannot open: ") + (args[0] || ""), "err");
      },
      whoami() { print("visitor  " + (prefs.lang === "zh" ? "（一个好奇的陌生人）" : "(a curious stranger)"), "ok"); },
      neofetch() {
        print(`<span class="term-art">┌─────────────────────────────┐
│  O S F O L I O   v1.0       │
│  a desktop in your browser  │
└─────────────────────────────┘</span>`, "");
        print("");
        print(`OS        OSfolio 1.0 (${i.themes[prefs.theme]})`);
        print(`Host      ${d().name} — ${d().title}`);
        print(`Shell     osf-sh 1.0`);
        print(`Theme     ${prefs.theme} / wallpaper:${prefs.wall}`);
        print(`Lang      ${prefs.lang}`);
        print(`Uptime    ${prefs.lang === "zh" ? "从你打开这个页面开始" : "since you opened this page"}`);
        print(`Packages  0 (${prefs.lang === "zh" ? "真的，一个依赖都没有" : "yes, zero dependencies"})`);
      },
      skills() { d().skills.forEach((k) => print(`  ${k.name.padEnd(26, " ")} ${"█".repeat(Math.round(k.level / 10))} ${k.level}%`)); },
      theme(args) {
        const k = (args[0] || "").toLowerCase();
        if (!I18N.zh.themes[k]) return print("themes: mac / win / term / cyber / pixel", "err");
        setTheme(k); print("theme → " + k, "ok");
      },
      lang(args) {
        const k = (args[0] || "").toLowerCase();
        if (k !== "zh" && k !== "en") return print("lang: zh | en", "err");
        setLang(k); print("lang → " + k, "ok");
      },
      date() { print(new Date().toString(), ""); },
      echo(args) { print(args.join(" "), ""); },
      clear() { out.innerHTML = ""; },
      sudo() { print((prefs.lang === "zh" ? "visitor 不在 sudoers 文件中。此事将被上报。" : "visitor is not in the sudoers file. This incident has been reported."), "err"); },
      exit() { print((prefs.lang === "zh" ? "这是网页，你逃不掉的 :)" : "It's a webpage, you can't leave :)"), "ok"); },
      coffee() { print("☕ " + (prefs.lang === "zh" ? "给你冲了一杯" : "here you go")); },
    };

    function resolve(path) {
      const parts = path.replace(/^\//, "").split("/").filter(Boolean);
      let node = buildFS();
      // 支持在子目录里继续解析（先试相对当前，再试相对根）
      const tryFrom = (base, ps) => {
        let n = base;
        for (const p of ps) {
          if (!n || n.type !== "dir" || !n.children[p]) return null;
          n = n.children[p];
        }
        return n;
      };
      node = tryFrom(here(), parts) || tryFrom(buildFS(), parts);
      return node;
    }

    function run(raw) {
      const line = raw.trim();
      print(`visitor@osfolio:~$ ${line}`, "cmd");
      if (!line) return;
      const [cmd, ...args] = line.split(/\s+/);
      const fn = COMMANDS[cmd.toLowerCase()];
      if (fn) fn(args);
      else print(i.terminal.unknown(cmd), "err");
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const v = input.value;
        if (v.trim()) { history.push(v); hIdx = history.length; }
        input.value = "";
        run(v);
      } else if (e.key === "ArrowUp") {
        if (hIdx > 0) { hIdx--; input.value = history[hIdx] || ""; }
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        if (hIdx < history.length - 1) { hIdx++; input.value = history[hIdx] || ""; }
        else { hIdx = history.length; input.value = ""; }
        e.preventDefault();
      }
    });

    body.addEventListener("click", () => input.focus());

    print(i.terminal.welcome, "ok");
    print("");
    run("neofetch");
    setTimeout(() => input.focus(), 60);
  }

  /* =========================================================
     主题 / 语言 / 壁纸
     ========================================================= */
  function setTheme(v) { prefs.theme = v; apply(); save(); }
  function setWall(v) { prefs.wall = v; apply(); save(); }
  function setLang(v) {
    prefs.lang = v;
    apply();
    save();
    renderShell();
    // 已打开的窗口：重绘内容以切换语言
    Object.entries(windows).forEach(([id, w]) => {
      const app = appById(id);
      w.querySelector(".win-title").textContent = app.icon + "  " + t().apps[id];
      app.render(w.querySelector(".win-body"), w);
    });
  }

  function apply() {
    document.documentElement.dataset.theme = prefs.theme;
    document.documentElement.dataset.wall = prefs.wall;
  }

  /* ---------------- 弹出面板 ---------------- */
  function showPopover(kind) {
    const pop = $("#popover");
    const title = $("#popover-title");
    const box = $("#popover-body");
    box.innerHTML = "";
    if (kind === "theme") {
      title.textContent = t().theme;
      Object.keys(I18N.zh.themes).forEach((k) => {
        const n = el("div", "poptem" + (prefs.theme === k ? " selected" : ""),
          `<span class="swatch" style="background:${THEME_SWATCH[k]}"></span><span>${t().themes[k]}</span>`);
        n.addEventListener("click", () => { setTheme(k); showPopover("theme"); });
        box.appendChild(n);
      });
      Object.keys(I18N.zh.walls).forEach((k) => {
        const n = el("div", "poptem" + (prefs.wall === k ? " selected" : ""), `<span>🖼️ ${t().walls[k]}</span>`);
        n.addEventListener("click", () => { setWall(k); showPopover("theme"); });
        box.appendChild(n);
      });
    } else {
      title.textContent = t().lang;
      [["zh", "中文"], ["en", "English"]].forEach(([k, label]) => {
        const n = el("div", "poptem" + (prefs.lang === k ? " selected" : ""), `<span>${label}</span>`);
        n.addEventListener("click", () => { setLang(k); pop.classList.add("hidden"); });
        box.appendChild(n);
      });
    }
    pop.classList.remove("hidden");
  }

  $("#theme-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    const pop = $("#popover");
    if (!pop.classList.contains("hidden") && $("#popover-title").textContent === t().theme) {
      pop.classList.add("hidden");
    } else showPopover("theme");
  });
  $("#lang-btn").addEventListener("click", (e) => { e.stopPropagation(); showPopover("lang"); });
  document.addEventListener("click", () => $("#popover").classList.add("hidden"));
  $("#start-btn").addEventListener("click", (e) => { e.stopPropagation(); openApp("about"); });

  /* ---------------- 时钟 ---------------- */
  function tick() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const md = prefs.lang === "zh"
      ? `${now.getMonth() + 1}月${now.getDate()}日`
      : now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const txt = `${md} ${hh}:${mm}`;
    $("#clock").textContent = txt;
    $("#tray-clock").textContent = `${hh}:${mm}`;
  }

  /* ---------------- 快捷键 ---------------- */
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "`") { e.preventDefault(); openApp("terminal"); }
    if (e.altKey && e.key.toLowerCase() === "t") { e.preventDefault(); openApp("terminal"); }
    if (e.key === "Escape") { $("#popover").classList.add("hidden"); }
  });

  /* ---------------- 启动 ---------------- */
  apply();
  renderShell();
  tick();
  setInterval(tick, 15000);

  setTimeout(() => {
    $("#boot").classList.add("done");
    setTimeout(() => $("#boot").remove(), 700);
  }, 2400);

  // 开机后自动弹出「关于我」，让人一眼看到简历（URL ?app= 可指定）
  try {
    const qApp = new URLSearchParams(location.search).get("app");
    setTimeout(() => openApp(appById(qApp) ? qApp : "about"), 2600);
  } catch (e) {
    setTimeout(() => openApp("about"), 2600);
  }
})();
