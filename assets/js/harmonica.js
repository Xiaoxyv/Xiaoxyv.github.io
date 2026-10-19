/**
 * Harmonica 待办曲目：浏览器端解密 + 渲染。
 *
 * 密文由 ../Harmonica/src/encrypt.js 生成：
 *   PBKDF2-SHA256(iterations, salt) -> AES-256-GCM
 *   负载 = { v, hint, kdf{name,iterations,salt}, cipher, iv, data }
 *   data = base64(ciphertext || authTag[16])
 *
 * 站点无后端，口令只存在于本文件运行时的内存里，不写进仓库。
 * 任何拿到口令的人都能查看——这是「简单加密」，不是访问控制。
 */

const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function deriveKey(password, kdf) {
  const base = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: b64(kdf.salt), iterations: kdf.iterations, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
}

async function decryptPayload(payload, password) {
  const key = await deriveKey(password, payload.kdf);
  // WebCrypto 的 AES-GCM 约定：传入的 data 为 ciphertext || authTag
  const raw = b64(payload.data);
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: b64(payload.iv), tagLength: 128 },
    key,
    raw
  );
  return JSON.parse(new TextDecoder().decode(plain));
}

/* ---------- 渲染 ---------- */

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function noteHtml(n) {
  if (n.rest) return '<div class="n rest">·</div>';
  const cls = n.action === "blow" ? "blow" : "draw";
  const label = n.hole + (n.action === "blow" ? "吹" : "吸") + (n.slide ? "▲" : "");
  return `<div class="n ${cls}"><div class="tab">${esc(label)}</div>` +
    `<div class="nm">${esc(n.name)}</div></div>`;
}

function songHtml(song) {
  if (song.pending) {
    return `<li><details class="song pending">
      <summary>
        <span class="idx">${String(song.order).padStart(2, "0")}</span>
        <span class="t">${esc(song.title)}</span>
        <span class="k">待补</span>
        <span class="a">${esc(song.artist)}</span>
      </summary>
      <div class="body"><p class="hint">曲谱待补 —— ${esc(song.reason || "")}</p></div>
    </details></li>`;
  }

  const secs = song.sections.map((sec) => `
    <div class="secname">${esc(sec.name)}</div>
    <div class="bars">${sec.bars.map((b) =>
      `<div class="bar">${b.map(noteHtml).join("")}</div>`).join("")}</div>`).join("");
  const meta = [
    song.artist ? esc(song.artist) : "",
    `原调 ${esc(song.key)}`,
    esc(song.time) + (song.tempo ? ` · ♩=${song.tempo}` : ""),
    `按键 ${song.stats.slideNotes}/${song.stats.notes}`,
    `音域 ${esc(song.stats.lowest)}–${esc(song.stats.highest)}`,
  ].filter(Boolean).join(" · ");

  return `<li><details class="song">
    <summary>
      <span class="idx">${String(song.order).padStart(2, "0")}</span>
      <span class="t">${esc(song.title)}</span>
      ${song.incomplete ? '<span class="tag-warn">待补充 · ' + esc(song.incomplete) + "</span>" : ""}
      <span class="k">${esc(song.key)}</span>
      <span class="a">${esc(song.artist)}</span>
    </summary>
    <div class="body">
      <div class="hint" style="margin-bottom:14px">${meta}${song.note ? " · " + esc(song.note) : ""}</div>
      ${song.incomplete ? '<div class="warn-line">这首只有主歌，' + esc(song.incomplete) + '，指法谱先按现有段落给出。</div>' : ""}
      ${secs}
    </div>
  </details></li>`;
}

function render(data) {
  const songs = [...data.songs].sort((a, b) => a.order - b.order);
  const done = songs.filter((s) => !s.pending);
  const total = done.reduce((n, s) => n + s.stats.notes, 0);
  const slides = done.reduce((n, s) => n + s.stats.slideNotes, 0);
  return `
    <div class="legend2">
      <span>${esc(data.instrument.name)}（${esc(data.instrument.tuning)}）</span>
      <span>音域 ${esc(data.instrument.range.join(" – "))}</span>
      <span>共 ${songs.length} 首 · ${total} 音 · 按键 ${slides}</span>
    </div>
    <div class="legend2" style="margin-bottom:18px">
      <span><b style="color:var(--blow)">吹</b> = 呼气</span>
      <span><b style="color:var(--draw)">吸</b> = 吸气</span>
      <span><b>▲</b> = 按下按键，升高半音</span>
      <span>数字 = 孔号（1–12，从左往右）</span>
    </div>
    <ol class="list">${songs.map(songHtml).join("")}</ol>
    <p class="hint" style="margin-top:18px">
      顺序即待办顺序。曲谱按原调从公开简谱逐音转译，只收主歌与副歌（不含前奏、间奏与反复），
      仅供个人练习；原始曲谱的著作权归各自的作者。
    </p>`;
}

/* ---------- 对外暴露（便于离线预览与将来复用） ---------- */
window.HarmonicaUI = { render, decryptPayload };

/* ---------- 启动 ---------- */

const state = { payload: null, data: null };

async function boot() {
  const form = document.getElementById("lock-form");
  const input = document.getElementById("lock-pass");
  const msg = document.getElementById("lock-msg");
  const locked = document.getElementById("locked");
  const unlocked = document.getElementById("unlocked");
  const out = document.getElementById("songs");
  if (!form) return;

  try {
    const res = await fetch("data/harmonica.enc.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(String(res.status));
    state.payload = await res.json();
  } catch (e) {
    msg.textContent = "曲目数据加载失败（data/harmonica.enc.json）";
    msg.className = "msg err";
    return;
  }

  // 会话内解锁过就不必再输一次
  const cached = sessionStorage.getItem("hm-unlock");
  if (cached) {
    try {
      state.data = JSON.parse(cached);
      out.innerHTML = render(state.data);
      locked.hidden = true;
      unlocked.hidden = false;
      return;
    } catch { sessionStorage.removeItem("hm-unlock"); }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const pass = input.value;
    if (!pass) return;
    msg.textContent = "正在验证…";
    msg.className = "msg";
    const btn = form.querySelector("button");
    btn.disabled = true;
    try {
      const data = await decryptPayload(state.payload, pass);
      state.data = data;
      sessionStorage.setItem("hm-unlock", JSON.stringify(data));
      out.innerHTML = render(data);
      locked.hidden = true;
      unlocked.hidden = false;
      msg.textContent = "";
    } catch (err) {
      msg.textContent = "口令不正确";
      msg.className = "msg err";
      input.select();
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById("relock")?.addEventListener("click", () => {
    sessionStorage.removeItem("hm-unlock");
    state.data = null;
    out.innerHTML = "";
    locked.hidden = false;
    unlocked.hidden = true;
    input.value = "";
    msg.textContent = "";
  });
}

boot();
