import { useState, useEffect, useRef, useCallback } from "react";

const MODES = {
  7: {
    hairColor: "#fde047", strokeColor: "#eab308",
    lazyTitle: "戰鬥力只有 5 的戰渣柴...",
    lazyDesc: "廉價多巴胺把你完全封印在舒適圈裡。現在黑柴身上毫無氣場，快開始聚氣！",
    chargeTitle: "界王拳！黑柴正在聚氣中...",
    chargeDesc: "噢噢噢！你開始抵抗多巴胺了！賽亞人的金髮虛影已現，赤紅氣焰湧現！",
    godTitle: "🔥 超級賽亞柴 · 金髮覺醒！！！ 🔥",
    godDesc: "全項目滿分！金色怒髮徹底實體化，雷電環繞！戰鬥力直接突破天際！",
  },
  30: {
    hairColor: "#ef4444", strokeColor: "#b91c1c",
    lazyTitle: "多巴胺奴隸 · 常態柴",
    lazyDesc: "30天神級考驗開啟。你現在正被廉價多巴胺全面壓制，快執行首項修煉！",
    chargeTitle: "神之氣息凝聚中！超越極限...",
    chargeDesc: "感應到神盛能量！黑柴頭頂浮現暗紅色神之髮絲虛影，專注力強行淨化！",
    godTitle: "✨ 超賽神 · 赤紅神之境界覺醒！！！ ✨",
    godDesc: "完美通關！黑柴全身蛻變為「赤紅神之形態」，燃燒著神聖的赤紅氣焰！",
  },
  60: {
    hairColor: "#38bdf8", strokeColor: "#0284c7",
    lazyTitle: "凡人狀態 · 戰鬥力只有 5",
    lazyDesc: "這是通往破壞神領域的60天魔鬼修煉。現在毫無氣場。立刻修煉！",
    chargeTitle: "超賽藍聚氣！破壁進行時...",
    chargeDesc: "極度震撼！深藍色星空領域能量爆發，黑柴頭頂亮起海藍色極光怒髮虛影！",
    godTitle: "⚡ 超賽藍 · 破壞神領域極限破壁！！！ ⚡",
    godDesc: "神蹟降臨！60天修煉頂點！怒髮與雙眼進化為「璀璨藍形態」，閃電狂飆！",
  },
};

const STOIC_QUOTES = [
  "「你不是你的渴望，你是你的選擇。」",
  "「唯有能自律的人，才是真正自由的人。」— 愛比克泰德",
  "「損失不是你失去了什麼，而是你被它佔領了多久。」",
  "「專注在你能控制的事，放下你控制不了的事。」— 馬可·奧理略",
  "「磨難是通往美德的道路。」— 塞內卡",
  "「每一個早晨都是重新選擇自己的機會。」",
  "「弱者任由情緒控制，強者讓理性引路。」— 愛比克泰德",
  "「你今天的克制，是明天自由的基礎。」",
  "「不是外部事物傷害你，而是你對它的看法。」— 馬可·奧理略",
  "「真正的勝利是戰勝自己內心的軟弱。」",
  "「與其逃避痛苦，不如讓痛苦鍛鍊你。」— 塞內卡",
  "「讓每一天都值得被記住。」— 馬可·奧理略",
];

const BASE_TASKS = [
  { icon: "💪", tag: "早晨", title: "起床後 {push} 伏地挺身", desc: "用身體叫醒身體" },
  { icon: "🍬", tag: "整天", title: "戒糖", desc: "糖是你大腦被訓練成以為需要的物資" },
  { icon: "🥩", tag: "吃", title: "至少一餐吃原型食物", desc: "看得出食材原本長什麼樣的就算" },
  { icon: "🔞", tag: "戒", title: "不看 A 片、不打手槍", desc: "把高能的生理能量儲存留給自己" },
  { icon: "📱", tag: "夜間", title: "睡前十五分鐘不看手機", desc: "阻絕藍光與睡前刺激，拿回大腦的主導權" },
  { icon: "🧘", tag: "夜間", title: "睡前呼吸冥想 {med}", desc: "{medDesc}" },
];

function getTasks(mode) {
  const push = mode === 7 ? "10下" : mode === 30 ? "15下" : "20下";
  const med = mode === 7 ? "一分鐘" : mode === 30 ? "五分鐘" : "十分鐘";
  const medDesc = mode === 7
    ? "專注於一呼一吸，在靜止中切斷多巴胺，回歸內心平靜"
    : mode === 30
    ? "延長專注時間，深度沉澱思緒，強化專注力肌肉"
    : "進入大師級冥想狀態，徹底掌握精神主導權，斷絕雜念";
  return BASE_TASKS.map(t => ({
    ...t,
    title: t.title.replace("{push}", push).replace("{med}", med),
    desc: t.desc.replace("{medDesc}", medDesc),
  }));
}

function ShibaSVG({ doneCount, totalCount, hairColor, strokeColor, size = 66 }) {
  const isGod = doneCount === totalCount && totalCount > 0;
  const isCharging = doneCount > 0 && !isGod;
  const chargeColor = hairColor === "#fde047" ? "#ca8a04" : hairColor === "#ef4444" ? "#b91c1c" : "#0284c7";
  const activeHair = isGod ? hairColor : isCharging ? chargeColor : "transparent";
  const hairOpacity = isGod ? 1 : isCharging ? 0.4 : 0;
  const eyeR = isGod ? 6 : isCharging ? 4.5 : 4;
  const eyeFill = isGod ? hairColor : "#1a1a1a";
  const flareOpacity = isGod ? 0.75 : isCharging ? 0.25 : 0;
  const starOpacity = isGod ? 1 : 0;
  const lightningOpacity = isGod ? 1 : 0;
  const mouthD = isGod ? "M 44,59 Q 50,52 56,59" : isCharging ? "M 44,61 L 56,61" : "M 45,61 Q 50,65 55,61";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" overflow="visible">
      <path
        d="M 50,5 Q 65,15 75,35 Q 88,60 80,85 Q 50,92 20,85 Q 12,60 25,35 Q 35,15 50,5 Z"
        fill="none" opacity={flareOpacity} stroke={hairColor} strokeWidth="3" strokeLinecap="round"
        style={{ transformOrigin: "50px 75px", animation: flareOpacity > 0 ? "auraFlare 0.6s infinite alternate ease-in-out" : "none" }}
      />
      <g opacity={starOpacity} style={{ transformOrigin: "50px 50px", animation: starOpacity > 0 ? "starRot 12s infinite linear" : "none" }}>
        <path d="M 50,0 L 53,40 L 90,43 L 55,50 L 50,100 L 45,52 L 10,47 L 47,42 Z" fill={hairColor} opacity="0.25" />
        <path d="M 50,15 L 52,43 L 80,45 L 53,49 L 50,85 L 47,50 L 20,47 L 47,44 Z" fill="#ffffff" opacity="0.35" />
      </g>
      <g opacity={lightningOpacity}>
        <path d="M 10,20 L -2,40 L 8,35 L -5,60" stroke="#00cfff" strokeWidth="2" fill="none"
          style={{ animation: "lFlicker 0.2s infinite" }} />
        <path d="M 90,15 L 102,35 L 92,30 L 105,55" stroke="#00cfff" strokeWidth="2" fill="none"
          style={{ animation: "lFlicker 0.2s infinite" }} />
      </g>
      <polygon points="20,40 10,15 40,25" fill="#2c2c2c" />
      <polygon points="23,37 16,20 36,27" fill="#d7a15c" />
      <polygon points="80,40 90,15 60,25" fill="#2c2c2c" />
      <polygon points="77,37 84,20 64,27" fill="#d7a15c" />
      <path d="M 15,50 Q 15,25 50,25 Q 85,25 85,50 Q 85,80 50,85 Q 15,80 15,50 Z" fill="#2c2c2c" />
      <g opacity={hairOpacity}>
        <polygon points="28,26 10,2 38,20" fill={activeHair} stroke={isGod ? strokeColor : "none"} />
        <polygon points="36,22 30,-12 48,16" fill={activeHair} stroke={isGod ? strokeColor : "none"} />
        <polygon points="44,20 50,-20 56,20" fill={activeHair} stroke={isGod ? strokeColor : "none"} />
        <polygon points="52,16 70,-12 64,22" fill={activeHair} stroke={isGod ? strokeColor : "none"} />
        <polygon points="62,20 90,2 72,26" fill={activeHair} stroke={isGod ? strokeColor : "none"} />
      </g>
      <path d="M 20,60 Q 30,82 50,82 Q 70,82 80,60 Q 85,45 70,45 Q 50,55 30,45 Q 15,45 20,60 Z" fill="#f5f5f5" />
      <ellipse cx="35" cy="36" rx="6" ry="3" fill="#d7a15c" transform="rotate(-20 35 36)" />
      <ellipse cx="65" cy="36" rx="6" ry="3" fill="#d7a15c" transform="rotate(20 65 36)" />
      <circle cx="35" cy="46" r={eyeR} fill={eyeFill} />
      <circle cx="65" cy="46" r={eyeR} fill={eyeFill} />
      <path d="M 18,53 Q 25,58 28,50" fill="none" stroke="#d7a15c" strokeWidth="4" strokeLinecap="round" />
      <path d="M 82,53 Q 75,58 72,50" fill="none" stroke="#d7a15c" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="50" cy="58" rx="10" ry="7" fill="#e0e0e0" />
      <polygon points="46,55 54,55 50,60" fill="#1a1a1a" />
      <path d={mouthD} fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function useParticles() {
  const canvasRef = useRef(null);
  const fire = useCallback((hairColor, strokeColor) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = [hairColor, strokeColor, "#ffffff", "#00cfff", "#a0eaff"];
    const cx = canvas.width / 2, cy = canvas.height * 0.4;
    const particles = Array.from({ length: 120 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 9;
      return {
        x: cx, y: cy,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 3,
        r: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1, life: 0.012 + Math.random() * 0.012,
        star: Math.random() > 0.5,
      };
    });
    let id;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        if (p.alpha <= 0) return;
        alive = true;
        p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.alpha -= p.life;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        if (p.star) {
          for (let j = 0; j < 5; j++) {
            const a = (j * 4 * Math.PI / 5) - Math.PI / 2;
            const b = (j * 4 * Math.PI / 5 + Math.PI / 5) - Math.PI / 2;
            j === 0
              ? ctx.moveTo(p.x + p.r * Math.cos(a), p.y + p.r * Math.sin(a))
              : ctx.lineTo(p.x + p.r * Math.cos(a), p.y + p.r * Math.sin(a));
            ctx.lineTo(p.x + p.r * 0.4 * Math.cos(b), p.y + p.r * 0.4 * Math.sin(b));
          }
          ctx.closePath();
        } else {
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        }
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (alive) id = requestAnimationFrame(animate);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    animate();
  }, []);
  return { canvasRef, fire };
}

async function generateShareImage({ mode, day, statuses, tasks, quote }) {
  const cfg = MODES[mode];
  const ac = cfg.hairColor;
  const doneCount = statuses.filter(s => s === true).length;
  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,"0")}.${String(today.getDate()).padStart(2,"0")}`;

  const W = 640, TASK_H = 46, FOOTER_H = 130;
  const H = 220 + tasks.length * TASK_H + FOOTER_H;
  const DPR = Math.min(window.devicePixelRatio || 2, 3);
  const cv = document.createElement("canvas");
  cv.width = W * DPR; cv.height = H * DPR;
  cv.style.width = W + "px"; cv.style.height = H + "px";
  const c = cv.getContext("2d");
  c.scale(DPR, DPR);

  const bg = c.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0b0f1e"); bg.addColorStop(0.6, "#070a14"); bg.addColorStop(1, "#0c0810");
  c.fillStyle = bg; c.fillRect(0, 0, W, H);

  c.strokeStyle = ac; c.lineWidth = 3;
  roundRect(c, 4, 4, W-8, H-8, 24); c.stroke();

  const glowGrad = c.createLinearGradient(W*0.1, 0, W*0.9, 0);
  glowGrad.addColorStop(0, "transparent"); glowGrad.addColorStop(0.5, ac); glowGrad.addColorStop(1, "transparent");
  c.fillStyle = glowGrad; c.fillRect(W*0.1, 4, W*0.8, 3);

  drawShibaOnCanvas(c, cfg, doneCount, tasks.length, 28, 18, 72);

  c.fillStyle = ac; c.font = "bold 22px Impact,Arial,sans-serif";
  c.textAlign = "center"; c.letterSpacing = "4px";
  c.fillText("— KURO_SHIBA_DOJO —", W/2, 46);

  c.fillStyle = "#3a4d6a"; c.font = "18px Arial,sans-serif";
  c.fillText(dateStr, W/2, 70);

  c.save();
  c.shadowColor = ac; c.shadowBlur = 40;
  c.fillStyle = ac; c.font = `bold 160px Impact,Arial,sans-serif`;
  c.fillText(String(day), W/2, 200);
  c.restore();

  c.fillStyle = "#5a7090"; c.font = "bold 26px Impact,Arial,sans-serif";
  c.fillText("DAY", W/2, 228);

  c.fillStyle = "#4a6080"; c.font = "20px Arial,sans-serif";
  c.fillText(`${mode}天戒除廉價多巴胺挑戰`, W/2, 258);

  drawDivider(c, W, 272, ac);

  let ty = 296;
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const done = statuses[i] === true;
    c.fillStyle = "rgba(255,255,255,0.03)";
    roundRect(c, 24, ty-28, W-48, 40, 8); c.fill();
    c.fillStyle = "#c0d8f0"; c.font = "600 20px Arial,sans-serif";
    c.textAlign = "left";
    c.fillText(`${task.icon}  ${task.title}`, 40, ty);
    const badge = done ? "已完成 ✓" : "未記錄";
    c.fillStyle = done ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.15)";
    c.textAlign = "right";
    const bw = 110;
    roundRect(c, W-40-bw, ty-20, bw, 28, 6); c.fill();
    c.fillStyle = done ? "#10b981" : "#ef4444";
    c.font = "bold 17px Arial,sans-serif";
    c.fillText(badge, W-44, ty);
    ty += TASK_H;
  }

  const scoreY = ty + 10;
  c.strokeStyle = ac; c.lineWidth = 2;
  roundRect(c, 24, scoreY, W-48, 68, 12); c.stroke();
  c.save(); c.shadowColor = ac; c.shadowBlur = 20;
  c.fillStyle = ac; c.font = `bold 52px Impact,Arial,sans-serif`;
  c.textAlign = "center";
  c.fillText(`${doneCount} / ${tasks.length}`, W/2, scoreY+44);
  c.restore();
  c.fillStyle = "#5a7090"; c.font = "18px Arial,sans-serif";
  c.fillText("今天的我也是超賽柴 🔥", W/2, scoreY+64);

  const qY = scoreY + 88;
  drawDivider(c, W, qY, ac);
  c.fillStyle = "#8aa0b8"; c.font = "italic 18px Arial,sans-serif";
  c.fillText(quote, W/2, qY+24);

  drawDivider(c, W, qY+38, ac);
  c.save(); c.shadowColor = ac; c.shadowBlur = 12;
  c.fillStyle = ac; c.font = `bold 26px Impact,Arial,sans-serif`;
  c.fillText("@kuro_shiba_dojo", W/2, qY+62);
  c.restore();
  c.fillStyle = "#3a4d6a"; c.font = "16px Arial,sans-serif";
  c.fillText("一起戒掉廉價多巴胺", W/2, qY+82);

  return cv;
}

function drawShibaOnCanvas(c, cfg, doneCount, totalCount, ox, oy, size) {
  const sc = size / 100;
  const isGod = doneCount === totalCount && totalCount > 0;
  const isCharging = doneCount > 0 && !isGod;
  const hairColor = cfg.hairColor;
  const strokeColor = cfg.strokeColor;
  const chargeColor = hairColor === "#fde047" ? "#ca8a04" : hairColor === "#ef4444" ? "#b91c1c" : "#0284c7";
  const activeHair = isGod ? hairColor : isCharging ? chargeColor : null;
  const hairOpacity = isGod ? 1 : isCharging ? 0.4 : 0;
  const eyeR = (isGod ? 6 : isCharging ? 4.5 : 4) * sc;
  const eyeFill = isGod ? hairColor : "#1a1a1a";

  const px = (x) => ox + x * sc;
  const py = (y) => oy + y * sc;

  c.save();
  c.beginPath();
  c.arc(ox + size/2, oy + size/2, size/2 + 3, 0, Math.PI*2);
  c.fillStyle = isGod
    ? (hairColor === "#fde047" ? "#2e2a14" : hairColor === "#ef4444" ? "#2a0e0e" : "#071828")
    : "#111827";
  c.fill();
  c.strokeStyle = doneCount > 0 ? hairColor : "#1e3050";
  c.lineWidth = 2;
  if (isGod) { c.shadowColor = hairColor; c.shadowBlur = 14; }
  c.stroke();
  c.shadowBlur = 0;

  c.beginPath();
  c.arc(ox + size/2, oy + size/2, size/2 - 1, 0, Math.PI*2);
  c.clip();

  function poly(pts, fill, strokeC, sw) {
    c.beginPath();
    c.moveTo(px(pts[0][0]), py(pts[0][1]));
    for (let i=1;i<pts.length;i++) c.lineTo(px(pts[i][0]), py(pts[i][1]));
    c.closePath();
    c.fillStyle = fill; c.fill();
    if (strokeC) { c.strokeStyle = strokeC; c.lineWidth = (sw||1)*sc; c.stroke(); }
  }

  poly([[20,40],[10,15],[40,25]], "#2c2c2c");
  poly([[80,40],[90,15],[60,25]], "#2c2c2c");
  poly([[23,37],[16,20],[36,27]], "#d7a15c");
  poly([[77,37],[84,20],[64,27]], "#d7a15c");

  c.beginPath();
  c.moveTo(px(15),py(50));
  c.bezierCurveTo(px(15),py(25), px(50),py(25), px(50),py(25));
  c.bezierCurveTo(px(85),py(25), px(85),py(50), px(85),py(50));
  c.bezierCurveTo(px(85),py(80), px(50),py(85), px(50),py(85));
  c.bezierCurveTo(px(15),py(80), px(15),py(50), px(15),py(50));
  c.fillStyle = "#2c2c2c"; c.fill();

  if (hairOpacity > 0 && activeHair) {
    c.globalAlpha = hairOpacity;
    const hairPts = [
      [[28,26],[10,2],[38,20]],
      [[36,22],[30,-12],[48,16]],
      [[44,20],[50,-20],[56,20]],
      [[52,16],[70,-12],[64,22]],
      [[62,20],[90,2],[72,26]],
    ];
    hairPts.forEach(pts => poly(pts, activeHair, isGod ? strokeColor : null, 1));
    c.globalAlpha = 1;
  }

  c.beginPath();
  c.moveTo(px(20),py(60));
  c.bezierCurveTo(px(30),py(82), px(70),py(82), px(80),py(60));
  c.bezierCurveTo(px(85),py(45), px(70),py(45), px(50),py(55));
  c.bezierCurveTo(px(30),py(45), px(15),py(45), px(20),py(60));
  c.fillStyle = "#f5f5f5"; c.fill();

  c.save();
  c.translate(px(35),py(36)); c.rotate(-20*Math.PI/180);
  c.beginPath(); c.ellipse(0,0, 6*sc, 3*sc, 0, 0, Math.PI*2);
  c.fillStyle="#d7a15c"; c.fill(); c.restore();
  c.save();
  c.translate(px(65),py(36)); c.rotate(20*Math.PI/180);
  c.beginPath(); c.ellipse(0,0, 6*sc, 3*sc, 0, 0, Math.PI*2);
  c.fillStyle="#d7a15c"; c.fill(); c.restore();

  c.beginPath(); c.arc(px(35),py(46), eyeR, 0, Math.PI*2);
  c.fillStyle=eyeFill; c.fill();
  c.beginPath(); c.arc(px(65),py(46), eyeR, 0, Math.PI*2);
  c.fillStyle=eyeFill; c.fill();

  c.beginPath(); c.moveTo(px(18),py(53)); c.quadraticCurveTo(px(25),py(58),px(28),py(50));
  c.strokeStyle="#d7a15c"; c.lineWidth=4*sc; c.lineCap="round"; c.stroke();
  c.beginPath(); c.moveTo(px(82),py(53)); c.quadraticCurveTo(px(75),py(58),px(72),py(50));
  c.stroke();

  c.beginPath(); c.ellipse(px(50),py(58), 10*sc, 7*sc, 0, 0, Math.PI*2);
  c.fillStyle="#e0e0e0"; c.fill();

  poly([[46,55],[54,55],[50,60]], "#1a1a1a");

  c.beginPath();
  if (isGod) { c.moveTo(px(44),py(59)); c.quadraticCurveTo(px(50),py(52),px(56),py(59)); }
  else if (isCharging) { c.moveTo(px(44),py(61)); c.lineTo(px(56),py(61)); }
  else { c.moveTo(px(45),py(61)); c.quadraticCurveTo(px(50),py(65),px(55),py(61)); }
  c.strokeStyle="#1a1a1a"; c.lineWidth=2*sc; c.lineCap="round"; c.stroke();

  c.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y); ctx.arcTo(x+w, y, x+w, y+r, r);
  ctx.lineTo(x+w, y+h-r); ctx.arcTo(x+w, y+h, x+w-r, y+h, r);
  ctx.lineTo(x+r, y+h); ctx.arcTo(x, y+h, x, y+h-r, r);
  ctx.lineTo(x, y+r); ctx.arcTo(x, y, x+r, y, r);
  ctx.closePath();
}

function drawDivider(ctx, W, y, color) {
  const g = ctx.createLinearGradient(0, y, W, y);
  g.addColorStop(0, "transparent"); g.addColorStop(0.5, color+"44"); g.addColorStop(1, "transparent");
  ctx.fillStyle = g; ctx.fillRect(0, y, W, 1);
}

function ShareCard({ mode, day, statuses, tasks, onClose }) {
  const cfg = MODES[mode];
  const doneCount = statuses.filter(s => s === true).length;
  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,"0")}.${String(today.getDate()).padStart(2,"0")}`;
  const [quote] = useState(() => STOIC_QUOTES[Math.floor(Math.random() * STOIC_QUOTES.length)]);
  const [btnState, setBtnState] = useState("idle");
  const [previewUrl, setPreviewUrl] = useState(null);
  const ac = cfg.hairColor;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  async function handleShare() {
    setBtnState("generating");
    try {
      const cv = await generateShareImage({ mode, day, statuses, tasks, quote });
      const dataUrl = cv.toDataURL("image/png");

      try {
        const byteStr = atob(dataUrl.split(",")[1]);
        const arr = new Uint8Array(byteStr.length);
        for (let i = 0; i < byteStr.length; i++) arr[i] = byteStr.charCodeAt(i);
        const blob = new Blob([arr], { type: "image/png" });
        const file = new File([blob], "kuro_shiba_dojo.png", { type: "image/png" });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "黑柴修煉場",
            text: `第 ${day} 天 ${doneCount}/${tasks.length} 完成 🔥 @kuro_shiba_dojo`,
          });
          setBtnState("idle");
          return;
        }
      } catch (shareErr) {
        if (shareErr.name === "AbortError") { setBtnState("idle"); return; }
      }

      setPreviewUrl(dataUrl);
      setBtnState("preview");

    } catch (err) {
      setBtnState("idle");
    }
  }

  function handleClosePreview() {
    setPreviewUrl(null);
    setBtnState("idle");
  }

  if (btnState === "preview" && previewUrl) {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "rgba(5,8,18,0.98)",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "flex-start", zIndex: 9999,
        padding: "16px 12px 32px",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
      }}>
        <div style={{
          color: ac, fontSize: 13, fontWeight: 700,
          textAlign: "center", marginBottom: 12, letterSpacing: 1,
        }}>
          📸 長按圖片 → 儲存到相簿
        </div>
        <img
          src={previewUrl}
          alt="分享卡片"
          style={{
            width: "100%", maxWidth: 380, borderRadius: 16,
            border: `2px solid ${ac}`, boxShadow: `0 0 24px ${ac}44`,
            display: "block",
          }}
        />
        <button
          onClick={handleClosePreview}
          style={{
            marginTop: 16, width: "100%", maxWidth: 380,
            padding: 13, background: "#0d1220", color: "#00b4d8",
            border: "1px solid #1a2540", borderRadius: 12,
            fontSize: 15, fontWeight: 700, cursor: "pointer",
          }}
        >✕ 關閉，返回修煉場</button>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(5,8,18,0.97)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "flex-start", zIndex: 9999,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      padding: "10px 12px 40px",
    }}>
      <p style={{ color: "#3a5070", fontSize: 11, letterSpacing: 1, margin: "6px 0 8px", textAlign: "center", flexShrink: 0 }}>
        {isIOS ? "📸 點擊分享按鈕，可直接儲存或發布 IG 限動" : "📸 截圖後可直接發布 IG 限動"}
      </p>

      <div style={{
        width: "100%", maxWidth: 320,
        background: "linear-gradient(160deg,#0b0f1e 0%,#070a14 60%,#0c0810 100%)",
        border: `1.5px solid ${ac}`,
        borderRadius: 18, padding: "16px 14px 14px",
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", position: "relative", overflow: "hidden",
        boxShadow: `0 0 24px ${ac}28`, flexShrink: 0,
      }}>
        <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:2, borderRadius:2, background:ac, boxShadow:`0 0 14px 2px ${ac}` }} />

        <div style={{ fontSize:10, letterSpacing:3, color:ac, fontWeight:700, textTransform:"uppercase", marginBottom:3 }}>
          — kuro_shiba_dojo —
        </div>
        <div style={{ fontSize:10, color:"#3a4d6a", letterSpacing:1, marginBottom:1 }}>{dateStr}</div>

        <div style={{
          fontSize: 80, lineHeight: 0.85, letterSpacing: 3, fontWeight: 900,
          fontFamily: "Impact,'Arial Narrow',sans-serif",
          color: ac,
          textShadow: `0 0 24px ${ac}, 0 0 48px ${ac}55, 2px 2px 0 rgba(0,0,0,0.7)`,
          margin: "6px 0 1px",
        }}>{day}</div>
        <div style={{ fontSize:11, letterSpacing:4, color:"#5a7090", fontFamily:"Impact,'Arial Narrow',sans-serif", marginBottom:6 }}>DAY</div>

        <div style={{ fontSize:10, color:"#4a6080", letterSpacing:1, marginBottom:8 }}>{mode}天戒除廉價多巴胺挑戰</div>

        <div style={{ marginBottom:6 }}>
          <ShibaSVG doneCount={doneCount} totalCount={tasks.length} hairColor={cfg.hairColor} strokeColor={cfg.strokeColor} size={60} />
        </div>

        <div style={{ width:"100%", height:1, background:`linear-gradient(90deg,transparent,${ac}33,transparent)`, marginBottom:8 }} />

        <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:4, marginBottom:8, textAlign:"left" }}>
          {tasks.map((task, i) => {
            const done = statuses[i] === true;
            return (
              <div key={i} style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"4px 8px", background:"rgba(255,255,255,0.03)",
                borderRadius:6, border:"1px solid #111e35",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, fontWeight:600, color:"#c0d8f0", minWidth:0, overflow:"hidden" }}>
                  <span style={{flexShrink:0}}>{task.icon}</span>
                  <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.title}</span>
                </div>
                <span style={{
                  fontSize:9, fontWeight:900, padding:"2px 6px", borderRadius:4, flexShrink:0, marginLeft:4,
                  background: done ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.12)",
                  color: done ? "#10b981" : "#ef4444",
                }}>
                  {done ? "✓ 完成" : "未記錄"}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{
          width:"100%", border:`1.5px solid ${ac}`, borderRadius:10,
          padding:"6px 12px", marginBottom:7,
          background:"rgba(0,0,0,0.2)", boxShadow:`0 0 12px ${ac}18`,
        }}>
          <div style={{
            fontSize:36, lineHeight:1, letterSpacing:2, fontWeight:900,
            fontFamily:"Impact,'Arial Narrow',sans-serif",
            color:ac, textShadow:`0 0 16px ${ac}80`,
          }}>{doneCount} / {tasks.length}</div>
          <div style={{ fontSize:11, color:"#5a7090", marginTop:1 }}>今天的我也是超賽柴 🔥</div>
        </div>

        <div style={{ fontSize:9.5, lineHeight:1.5, color:"#8aa0b8", fontStyle:"italic", marginBottom:8, padding:"0 4px" }}>
          {quote}
        </div>

        <div style={{ width:"100%", height:1, background:`linear-gradient(90deg,transparent,${ac}33,transparent)`, marginBottom:7 }} />

        <div style={{ fontSize:14, letterSpacing:2, color:ac, fontFamily:"Impact,'Arial Narrow',sans-serif", fontWeight:900 }}>
          @kuro_shiba_dojo
        </div>
        <div style={{ fontSize:9, color:"#3a4d6a", letterSpacing:1, marginTop:1 }}>一起戒掉廉價多巴胺</div>
      </div>

      <div style={{ width:"100%", maxWidth:320, marginTop:14, display:"flex", flexDirection:"column", gap:8, flexShrink: 0 }}>
        <button
          onClick={handleShare}
          disabled={btnState === "generating"}
          style={{
            width:"100%", padding:14,
            background: btnState === "generating"
              ? "linear-gradient(90deg,#003d99,#0066cc)"
              : "linear-gradient(90deg,#0055cc,#0099ff)",
            color:"white", border:"none", borderRadius:12, fontSize:15, fontWeight:900,
            cursor: btnState === "generating" ? "not-allowed" : "pointer",
            boxShadow:"0 6px 24px rgba(0,100,255,0.35)",
            opacity: btnState === "generating" ? 0.8 : 1,
            letterSpacing: 1,
          }}
        >
          {btnState === "generating" ? "⏳ 生成圖片中..." : isIOS ? "📲 儲存 / 分享圖片" : "📤 下載分享圖片"}
        </button>
        <button
          onClick={onClose}
          style={{
            width:"100%", padding:12, background:"#0d1220", color:"#00b4d8",
            border:"1px solid #1a2540", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer",
          }}
        >✕ 關閉，返回修煉場</button>
      </div>
    </div>
  );
}

const LS_KEY = "kuro_shiba_dojo_v1";
function loadStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { mode: 7, days: { 7: 1, 30: 1, 60: 1 }, rounds: { 7: 1, 30: 1, 60: 1 }, startDates: {}, data: {} };
}
function saveStorage(obj) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(obj)); } catch (e) {}
}

export default function App() {
  const init = loadStorage();
  const [mode, setMode] = useState(init.mode || 7);
  const [days, setDays] = useState(init.days || { 7: 1, 30: 1, 60: 1 });
  const [rounds, setRounds] = useState(init.rounds || { 7: 1, 30: 1, 60: 1 });
  const [startDates, setStartDates] = useState(init.startDates || {});
  const [tab, setTab] = useState("daily");
  const [data, setData] = useState(init.data || {});
  const day = days[mode] || 1;
  const setDay = (d) => {
    const newDays = { ...days, [mode]: d };
    setDays(newDays);
    saveStorage({ mode, days: newDays, rounds, startDates, data });
  };
  const [showPopup, setShowPopup] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const { canvasRef, fire } = useParticles();

  const tasks = getTasks(mode);
  const round = rounds[mode] || 1;
  const dataKey = `day${day}_mode${mode}_r${round}`;
  const startDateKey = `mode${mode}_r${round}`;
  const startDateStr = startDates[startDateKey] || null;

  function getDayDate(dayNum) {
    if (!startDateStr) return null;
    const d = new Date(startDateStr);
    d.setDate(d.getDate() + dayNum - 1);
    return `${d.getMonth()+1}/${d.getDate()}`;
  }
  const statuses = data[dataKey] || Array(tasks.length).fill(null);
  const doneCount = statuses.filter(s => s === true).length;
  const cfg = MODES[mode];

  function getStatus() {
    if (doneCount === 0) return { title: cfg.lazyTitle, desc: cfg.lazyDesc };
    if (doneCount === tasks.length) return { title: cfg.godTitle, desc: cfg.godDesc };
    return { title: cfg.chargeTitle, desc: cfg.chargeDesc };
  }

  function toggle(idx) {
    const cur = [...(data[dataKey] || Array(tasks.length).fill(null))];
    cur[idx] = cur[idx] === true ? null : true;
    const newData = { ...data, [dataKey]: cur };
    setData(newData);
    let newStartDates = startDates;
    if (!startDates[startDateKey]) {
      const today = new Date();
      const iso = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
      newStartDates = { ...startDates, [startDateKey]: iso };
      setStartDates(newStartDates);
    }
    saveStorage({ mode, days, rounds, startDates: newStartDates, data: newData });
    const newDone = cur.filter(s => s === true).length;
    if (newDone === tasks.length && cur[idx] === true) {
      setFlashOn(true);
      setTimeout(() => setFlashOn(false), 700);
      fire(cfg.hairColor, cfg.strokeColor);
      setTimeout(() => setShowPopup(true), 1500);
    }
  }

  function wrapperStyle() {
    const base = { width:74, height:74, borderRadius:"50%", background:"#111827", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #1e3050", flexShrink:0, transition:"all 0.3s" };
    if (doneCount === 0) return base;
    const isGod = doneCount === tasks.length;
    const hc = cfg.hairColor;
    if (isGod) return { ...base, borderColor:hc, background: hc === "#fde047" ? "#2e2a14" : hc === "#ef4444" ? "#2a0e0e" : "#071828", boxShadow:`0 0 30px ${hc}, 0 0 50px ${cfg.strokeColor}`, animation:"saiyanPulse 0.8s infinite alternate" };
    return { ...base, borderColor:hc, boxShadow:`0 0 20px ${hc}` };
  }

  function calcStats() {
    let totalDone = 0, totalFail = 0, perfectDays = 0, streak = 0, maxStreak = 0;
    const habitHistory = tasks.map(() => []);
    for (let i = 1; i <= mode; i++) {
      const k = `day${i}_mode${mode}_r${round}`;
      const d = data[k] || Array(tasks.length).fill(null);
      let dayDone = 0;
      d.forEach((s, ti) => {
        habitHistory[ti].push(s);
        if (s === true) { totalDone++; dayDone++; } else if (s === false) totalFail++;
      });
      if (dayDone === tasks.length) { perfectDays++; streak++; maxStreak = Math.max(maxStreak, streak); }
      else streak = 0;
    }
    return { totalDone, totalFail, perfectDays, maxStreak, rate: Math.round(totalDone / (mode * tasks.length) * 100), habitHistory };
  }

  const { title: sTitle, desc: sDesc } = getStatus();
  const pct = Math.round(doneCount / tasks.length * 100);
  const barColor = doneCount === tasks.length
    ? (cfg.hairColor === "#fde047" ? "linear-gradient(90deg,#eab308,#fde047,#fefce8)"
      : cfg.hairColor === "#ef4444" ? "linear-gradient(90deg,#b91c1c,#ef4444,#fca5a5)"
      : "linear-gradient(90deg,#0284c7,#38bdf8,#e0f2fe)")
    : doneCount > 0 ? "linear-gradient(90deg,#0055cc,#0077ff)"
    : "#1a2540";

  return (
    <div style={{ fontFamily:"'PingFang TC','Microsoft JhengHei',sans-serif", background:"#070a12", color:"#fff", minHeight:"100vh", padding:12, display:"flex", flexDirection:"column", alignItems:"center" }}>
      <style>{`
        @keyframes saiyanPulse { 0%{transform:scale(1)} 100%{transform:scale(1.03)} }
        @keyframes auraFlare { 0%{transform:scaleY(0.95) scaleX(0.98);filter:brightness(0.9)} 100%{transform:scaleY(1.08) scaleX(1.03);filter:brightness(1.2)} }
        @keyframes starRot { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes lFlicker { 0%,100%{opacity:0.2} 50%{opacity:1} }
        @keyframes flashBurst { 0%{opacity:0;transform:scale(0.5)} 30%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(1.5)} }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#070a12} ::-webkit-scrollbar-thumb{background:#1a2540;border-radius:2px}
      `}</style>

      <canvas ref={canvasRef} style={{ position:"fixed", inset:0, width:"100vw", height:"100vh", pointerEvents:"none", zIndex:9998 }} />
      {flashOn && <div style={{ position:"fixed", inset:0, background:"radial-gradient(circle,rgba(0,180,216,0.35) 0%,rgba(0,119,255,0.15) 50%,transparent 80%)", pointerEvents:"none", zIndex:9997, animation:"flashBurst 0.7s ease-out forwards" }} />}

      <div style={{ width:"100%", maxWidth:390, padding:"0 10px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <span style={{ color:"#00b4d8", fontSize:13, fontWeight:"bold", letterSpacing:2, textTransform:"uppercase" }}>— kuro_shiba_dojo</span>
          <div style={{ display:"flex", background:"#0d1220", border:"1px solid #1a2540", borderRadius:20, padding:2 }}>
            {[7,30,60].map(d => (
              <button key={d} onClick={() => {
                if (d === mode) return;
                const r = rounds[d] || 1;
                const hasData = Object.keys(data).some(k => k.includes(`_mode${d}_r${r}`));
                if (hasData) {
                  setConfirmModal({ targetMode: d });
                } else {
                  setMode(d);
                  saveStorage({ mode: d, days, rounds, startDates, data });
                }
              }} style={{
                background: mode===d ? "#0077ff" : "none", border:"none",
                color: mode===d ? "#fff" : "#4a5568", fontSize:11, fontWeight:"bold",
                padding:"4px 10px", borderRadius:15, cursor:"pointer",
              }}>{d}日</button>
            ))}
          </div>
        </div>

        <h1 style={{ textAlign:"center", fontSize:20, margin:"6px 0 12px", fontWeight:800 }}>{mode}天戒除廉價多巴胺挑戰</h1>

        <div style={{ background:"#0d1220", border:"1px solid #1a2540", borderRadius:16, padding:14, display:"flex", flexDirection:"column", gap:10, marginBottom:16, boxShadow:"0 4px 24px rgba(0,100,255,0.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={wrapperStyle()}>
              <ShibaSVG doneCount={doneCount} totalCount={tasks.length} hairColor={cfg.hairColor} strokeColor={cfg.strokeColor} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:"bold", fontSize:13, marginBottom:3, color: doneCount===tasks.length&&doneCount>0 ? cfg.hairColor : "#fff" }}>{sTitle}</div>
              <div style={{ fontSize:11, color:"#5a7090", lineHeight:1.4 }}>{sDesc}</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ flex:1, height:12, background:"#07090f", borderRadius:6, border:"1px solid #1a2540", overflow:"hidden" }}>
              <div style={{ width:`${pct}%`, height:"100%", background:barColor, borderRadius:6, transition:"width 0.4s cubic-bezier(0.4,0,0.2,1)", boxShadow: doneCount>0 ? `0 0 10px ${cfg.hairColor}80` : "none" }} />
            </div>
            <span style={{ fontFamily:"monospace", fontSize:14, fontWeight:"bold", color: doneCount>0?cfg.hairColor:"#4a5568", minWidth:42, textAlign:"right" }}>{pct}%</span>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:18 }}>
          {["daily","overview"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab===t ? "#0077ff" : "#0d1220",
              color: tab===t ? "#fff" : "#4a5568",
              border: tab===t ? "1px solid #0077ff" : "1px solid #1a2540",
              padding:11, borderRadius:10, fontSize:14, fontWeight:"bold", cursor:"pointer",
              boxShadow: tab===t ? "0 0 12px rgba(0,119,255,0.3)" : "none",
            }}>{t==="daily"?"每日打卡":"總覽"}</button>
          ))}
        </div>

        {tab === "daily" && (
          <div>
            <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:10, marginBottom:15 }}>
              {Array.from({length:mode},(_,i)=>i+1).map(d => (
                <div key={d} onClick={() => setDay(d)} style={{
                  flex:"0 0 58px", height:62, background: day===d ? "#0d1a30" : "#0d1220",
                  border: day===d ? "2px solid #0077ff" : "1px solid #1a2540",
                  borderRadius:10, display:"flex", flexDirection:"column", alignItems:"center",
                  justifyContent:"center", cursor:"pointer",
                }}>
                  <span style={{ fontSize:10, color: day===d?"#00b4d8":"#3a4d6a", marginBottom:2 }}>第 {d} 天</span>
                  <span style={{ fontSize:15, fontWeight:"bold", color: day===d?"#fff":"#5a7090" }}>{d}</span>
                  {getDayDate(d) && <span style={{ fontSize:9, color: day===d?"#3a7090":"#2a3d5a", marginTop:1 }}>{getDayDate(d)}</span>}
                </div>
              ))}
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", color:"#5a7090", fontSize:13, marginBottom:20, borderBottom:"1px solid #0d1a2e", paddingBottom:10 }}>
              <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span>第 {day} 天</span>
                {getDayDate(day) && (
                  <span style={{ fontSize:11, color:"#00b4d8", background:"#0d1e3a", padding:"2px 8px", borderRadius:10, border:"1px solid #1a3060" }}>
                    {getDayDate(day)}
                  </span>
                )}
              </span>
              <span>已記錄 {doneCount} / {tasks.length} 項</span>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {tasks.map((task, idx) => {
                const done = statuses[idx] === true;
                return (
                  <div key={idx} style={{ background:"#0a0f1e", border:"1px solid #141e35", borderRadius:12, padding:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:15 }}>
                      <span style={{ fontSize:20 }}>{task.icon}</span>
                      <div>
                        <span style={{ background:"#0d1e3a", color:"#00b4d8", fontSize:9, padding:"2px 6px", borderRadius:4, fontWeight:"bold", border:"1px solid #1a3060" }}>{task.tag}</span>
                        <div style={{ fontSize:14, fontWeight:"bold", margin:"4px 0 2px" }}>{task.title}</div>
                        <div style={{ fontSize:11, color:"#3a4d6a" }}>{task.desc}</div>
                      </div>
                    </div>
                    <button onClick={() => toggle(idx)} style={{
                      background: done ? "#0d1e35" : "#0d1220",
                      color: done ? "#00b4d8" : "#3a4d6a",
                      border: done ? "1px solid rgba(0,180,216,0.35)" : "1px solid #1a2540",
                      padding:"8px 14px", borderRadius:6, fontSize:12, fontWeight:"bold", cursor:"pointer", whiteSpace:"nowrap",
                    }}>{done ? "已完成" : "未完成"}</button>
                  </div>
                );
              })}
            </div>

            <button onClick={() => setShowPopup(true)} style={{
              width:"100%", padding:14, background:"linear-gradient(90deg,#0055cc,#0099ff)",
              color:"white", border:"none", borderRadius:14, fontSize:16, fontWeight:900,
              letterSpacing:1, cursor:"pointer", marginTop:20, boxShadow:"0 6px 24px rgba(0,100,255,0.35)",
            }}>📲 分享成果</button>
          </div>
        )}

        {tab === "overview" && (() => {
          const { totalDone, totalFail, perfectDays, maxStreak, rate, habitHistory } = calcStats();
          return (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                {[
                  { label:"總完成率", val:`${rate}%`, color:"#00b4d8" },
                  { label:"完美天數", val:`${perfectDays}/${mode}`, color:"#10b981" },
                  { label:"總完成次數", val:totalDone, color:"#fff" },
                  { label:"總未完成次數", val:totalFail, color:"#fff" },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ background:"#0d1220", border:"1px solid #1a2540", borderRadius:12, padding:"14px 12px" }}>
                    <div style={{ fontSize:11, color:"#3a4d6a", fontWeight:"bold", marginBottom:10 }}>{label}</div>
                    <div style={{ fontSize:26, fontWeight:900, color }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{ background:"#0d1220", border:"1px solid #1a2540", borderRadius:14, padding:"18px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:30 }}>
                <span style={{ fontSize:13, color:"#5a7090", fontWeight:"bold" }}>最長連勝天數（全部完成）</span>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:24, fontWeight:900, color:"#0099ff" }}>{maxStreak}</span>
                  <span style={{ fontSize:20 }}>⚡</span>
                </div>
              </div>

              <div style={{ fontSize:14, fontWeight:"bold", marginBottom:15 }}>每項習慣表現</div>
              {tasks.map((task, ti) => {
                const hist = habitHistory[ti] || [];
                const done = hist.filter(s => s === true).length;
                const pct = Math.round(done / mode * 100);
                return (
                  <div key={ti} style={{ background:"#0a0f1e", border:"1px solid #141e35", borderRadius:12, padding:16, marginBottom:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                      <span style={{ fontSize:16 }}>{task.icon}</span>
                      <span style={{ fontSize:14, fontWeight:"bold", flex:1 }}>{task.title}</span>
                      <span style={{ fontSize:11, color:"#3a4d6a", fontFamily:"monospace" }}>{pct}%</span>
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {hist.map((s, di) => (
                        <div key={di} style={{ width:10, height:10, borderRadius:"50%", background: s===true?"#10b981":s===false?"#ef4444":"#1a2540" }} />
                      ))}
                    </div>
                  </div>
                );
              })}

              <div style={{ display:"flex", justifyContent:"center", gap:15, fontSize:11, color:"#3a4d6a", margin:"20px 0 30px" }}>
                {[["#10b981","完成"],["#ef4444","未完成"],["#1a2540","未記錄"]].map(([c,l]) => (
                  <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:c }} />{l}
                  </div>
                ))}
              </div>

              <button onClick={() => { if(confirm("確定要重置所有進度嗎？")) { setData({}); saveStorage({ mode, days, rounds, startDates, data: {} }); } }} style={{
                background:"none", border:"1px solid #1a2540", color:"#3a4d6a",
                borderRadius:10, width:"100%", padding:12, fontSize:14, fontWeight:"bold", cursor:"pointer",
              }}>重置挑戰</button>
            </div>
          );
        })()}
      </div>

      {showPopup && (
        <ShareCard
          mode={mode} day={day} statuses={statuses} tasks={tasks}
          onClose={() => setShowPopup(false)}
        />
      )}

      {confirmModal && (() => {
        const tMode = confirmModal.targetMode;
        const tRound = rounds[tMode] || 1;
        const cfg2 = MODES[tMode];
        return (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(5,8,18,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999, padding: "0 20px",
          }}>
            <div style={{
              width: "100%", maxWidth: 340,
              background: "linear-gradient(160deg,#0b0f1e,#0c0810)",
              border: `1.5px solid ${cfg2.hairColor}`,
              borderRadius: 20, padding: "28px 22px",
              textAlign: "center",
              boxShadow: `0 0 32px ${cfg2.hairColor}33`,
            }}>
              <div style={{ height: 2, borderRadius: 2, background: cfg2.hairColor, boxShadow: `0 0 12px ${cfg2.hairColor}`, marginBottom: 20 }} />
              <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: cfg2.hairColor, marginBottom: 8, letterSpacing: 1 }}>
                你已有 {tMode} 天挑戰紀錄
              </div>
              <div style={{ fontSize: 12, color: "#5a7090", lineHeight: 1.6, marginBottom: 24 }}>
                目前是第 {tRound} 輪紀錄<br/>
                要繼續累積，還是開始全新第 {tRound + 1} 輪？
              </div>
              <button onClick={() => {
                setMode(tMode);
                saveStorage({ mode: tMode, days, rounds, startDates, data });
                setConfirmModal(null);
              }} style={{
                width: "100%", padding: "13px 0", marginBottom: 10,
                background: `linear-gradient(90deg,${cfg2.strokeColor},${cfg2.hairColor})`,
                color: "#000", border: "none", borderRadius: 12,
                fontSize: 14, fontWeight: 900, cursor: "pointer",
                letterSpacing: 0.5,
              }}>
                繼續第 {tRound} 輪紀錄
              </button>
              <button onClick={() => {
                const newRound = tRound + 1;
                const newRounds = { ...rounds, [tMode]: newRound };
                const newDays = { ...days, [tMode]: 1 };
                setRounds(newRounds);
                setDays(newDays);
                setMode(tMode);
                saveStorage({ mode: tMode, days: newDays, rounds: newRounds, startDates, data });
                setConfirmModal(null);
              }} style={{
                width: "100%", padding: "13px 0", marginBottom: 10,
                background: "#0d1220", color: cfg2.hairColor,
                border: `1px solid ${cfg2.hairColor}55`, borderRadius: 12,
                fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}>
                🔄 開始全新第 {tRound + 1} 輪挑戰
              </button>
              <button onClick={() => setConfirmModal(null)} style={{
                width: "100%", padding: "10px 0",
                background: "none", color: "#3a4d6a",
                border: "1px solid #1a2540", borderRadius: 10,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>
                取消
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
