// Loader and Welcome
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hide');
      setTimeout(() => {
        showWelcomeAnim();
      }, 350);
    }, 1200);
  
    startRealtimeClock();
    startBgRGB();
    // Smooth scroll for scroll-down
    document.querySelectorAll('.scroll-down').forEach(el => {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({behavior: 'smooth'});
        }
      });
    });
    // Profile pop effect on click
    document.querySelectorAll('.hero-pfp').forEach(el => {
      el.addEventListener('click', () => {
        el.classList.add('pop-flash');
        setTimeout(() => el.classList.remove('pop-flash'), 550);
      });
    });
  });
  
  // Welcome Animation with AI Dialogue, now with skip feature!
  function showWelcomeAnim() {
    const welcome = document.getElementById('welcome-anim');
    const ai1 = document.getElementById('ai-msg-1');
    const ai2 = document.getElementById('ai-msg-2');
    const ai3 = document.getElementById('ai-msg-3');
    const text = welcome.querySelector('.welcome-text');
    const skipBtn = document.getElementById('dialogue-skip-btn');
    let skipRequested = false;
    // Dialogue lines
    const dialogue = [
      {el: ai1, text: "👋 Hello, I'm JuanAI. Welcome to my portfolio!"},
      {el: ai2, text: "Hi JuanAI! What can I find here?"},
      {el: ai3, text: "You can explore projects, see my skills, and get inspired. Let's get started!"}
    ];
    // Hide all messages and text first
    [ai1, ai2, ai3].forEach((el) => { el.style.opacity = 0; el.textContent = ""; });
    text.textContent = "";
    welcome.classList.add('show');
  
    // --- SKIP DIALOGUE logic ---
    function skipDialogue() {
      skipRequested = true;
      // Instantly show all messages & welcome text
      dialogue.forEach(d => { d.el.textContent = d.text; d.el.style.opacity = 1; });
      text.textContent = "Welcome to JuanDevID developments";
      text.style.opacity = 1;
      setTimeout(() => {
        welcome.classList.remove('show');
        // Reset for next time
        [ai1, ai2, ai3].forEach((el) => { el.style.opacity = 0; });
        text.textContent = "";
      }, 1000);
    }
    skipBtn.onclick = skipDialogue;
    skipBtn.onkeydown = (e) => {
      if(e.key === "Enter" || e.key === " ") skipDialogue();
    };
  
    // Dialogue typing animation
    let idx = 0;
    function typeDialogueLine(lineIdx) {
      if (skipRequested) return; // If skipped, do nothing
      if (!dialogue[lineIdx]) {
        setTimeout(() => {
          if (!skipRequested) typeWelcomeText();
        }, 500);
        return;
      }
      let curr = dialogue[lineIdx];
      let i = 0;
      curr.el.textContent = "";
      curr.el.style.opacity = 1;
      function typeChar() {
        if (skipRequested) return;
        curr.el.textContent = curr.text.slice(0, i);
        if (i < curr.text.length) {
          i++;
          setTimeout(typeChar, 18 + Math.random()*22);
        } else {
          setTimeout(() => typeDialogueLine(lineIdx+1), 550);
        }
      }
      setTimeout(typeChar, lineIdx === 0 ? 150 : 80);
    }
    function typeWelcomeText() {
      text.textContent = '';
      text.style.opacity = 1;
      const msg = "Welcome to JuanDevID Developments";
      let i = 0;
      function typeLetter() {
        if (skipRequested) return;
        text.textContent = msg.slice(0, i);
        if (i < msg.length) {
          i++;
          setTimeout(typeLetter, 38 + (Math.random() * 40));
        } else {
          setTimeout(() => {
            welcome.classList.remove('show');
            // Reset text for next time
            [ai1, ai2, ai3].forEach((el) => { el.style.opacity = 0; });
            text.textContent = "";
          }, 1700);
        }
      }
      setTimeout(typeLetter, 400);
    }
    typeDialogueLine(0);
  }
  
  
  // Animated Background (Advanced Particles, Lines, and Glow) + RGB effect (blue theme)
  const bg = document.querySelector('.bg-anim');
  const bgCanvas = document.createElement('canvas');
  bgCanvas.className = 'bg-anim-canvas';
  bg.appendChild(bgCanvas);
  
  let ctx = bgCanvas.getContext('2d');
  let w = window.innerWidth, h = window.innerHeight;
  let dpr = window.devicePixelRatio || 1;
  let particles = [];
  let lines = [];
  let rgbTime = 0;
  let rgbColor = "#3a8dff";
  
  function resizeBg() {
    w = window.innerWidth; h = window.innerHeight;
    bgCanvas.width = w * dpr;
    bgCanvas.height = h * dpr;
    bgCanvas.style.width = w + 'px';
    bgCanvas.style.height = h + 'px';
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resizeBg);
  resizeBg();
  
  function toBlueRGBColor(hue) {
    // Only blue/cyan spectrum: 195 - 220deg
    let blueHue = 195 + (Math.sin(hue/80) + 1) * 12.5; // 195-220
    return `hsl(${blueHue}, 93%, 62%)`;
  }
  
 // Animate the background (Blue RGB radial gradient + particles)
function startBgRGB() {
    requestAnimationFrame(function animateBG() {
      rgbTime += 5 * 5; // <-- 1.2x faster
      let hue = (Date.now() / (35 / 5)); // <-- 1.2x faster
      rgbColor = toBlueRGBColor(hue);
      bg.style.background = `radial-gradient(ellipse at 60% 38%, #e4f3ff11 0%, ${rgbColor}99 28%, #131b2c 90%)`;
      drawBgAnim(rgbColor);
      requestAnimationFrame(animateBG);
    });
  }
  
  // Generate particles and moving lines
  function initBgAnim() {
    particles = [];
    lines = [];
    let count = Math.max(36, Math.floor(w * h / 8000));
    for (let i = 0; i < count; i++) {
      let speed = 0.11 + Math.random() * 0.16;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1.3 + Math.random() * 2.7,
        dx: (Math.random() - 0.5) * speed,
        dy: (Math.random() - 0.5) * speed,
        c: Math.random() > 0.78 ? rgbColor : "#e4f3ff",
        a: 0.12 + Math.random() * 0.22
      });
    }
    for (let i = 0; i < count/2; i++) {
      let a = Math.floor(Math.random() * count);
      let b = Math.floor(Math.random() * count);
      if (a !== b) lines.push([a, b]);
    }
  }
  initBgAnim();
  window.addEventListener('resize', initBgAnim);
  
  function drawBgAnim(rgb) {
    ctx.clearRect(0, 0, w, h);
    for (let p of particles) {
      ctx.save();
      ctx.globalAlpha = p.a;
      let grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*2.4);
      grad.addColorStop(0, (p.c === "#e4f3ff" ? "#e4f3ff" : rgb));
      grad.addColorStop(1, 'rgba(228,243,255,0)');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r*2.1, 0, 2 * Math.PI);
      ctx.fillStyle = grad;
      ctx.shadowColor = (p.c === "#e4f3ff" ? "#e4f3ff" : rgb);
      ctx.shadowBlur = 13 + p.r*3;
      ctx.fill();
      ctx.restore();
    }
    for (let [ai, bi] of lines) {
      let a = particles[ai], b = particles[bi];
      let dx = a.x - b.x, dy = a.y - b.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 140) {
        ctx.save();
        ctx.globalAlpha = 0.08 + 0.12 * (1 - dist/140);
        ctx.strokeStyle = (a.c === "#e4f3ff" && b.c === "#e4f3ff") ? "#e4f3ff" : rgb;
        ctx.lineWidth = 2 + 1.5 * (1 - dist/140);
        ctx.shadowBlur = 14;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.restore();
      }
    }
    // Move particles (FASTER: x2 speed)
    for (let p of particles) {
      p.x += p.dx * 10; // <-- 2x speed
      p.y += p.dy * 10; // <-- 2x speed
      if (p.x < -20 || p.x > w+20) p.dx *= -1;
      if (p.y < -20 || p.y > h+20) p.dy *= -1;
    }
  }
    // Move particles
    for (let p of particles) {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < -20 || p.x > w+20) p.dx *= -1;
      if (p.y < -20 || p.y > h+20) p.dy *= -1;
    }

    // --- GALAXY PARTICLES STATE ---
let galaxyStars = [];
let galaxyNebulas = [];

// Generate galaxy stars and nebulas
function initGalaxy() {
  galaxyStars = [];
  galaxyNebulas = [];
  // Stars
  let galaxyStarCount = Math.floor(70 + (w * h / 16000));
  for (let i = 0; i < galaxyStarCount; i++) {
    galaxyStars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 0.8 + 0.5,
      o: 0.75 + Math.random() * 0.23,
      t: Math.random() * Math.PI * 2,
      blinkSeed: Math.random() * 1000,
      hue: 195 + Math.random() * 40 // blueish-white
    });
  }
  // Nebulas (blurry color clouds)
  let nebulaCount = 3 + Math.floor(Math.random() * 2);
  for(let i=0; i<nebulaCount; i++) {
    let scale = 0.6 + Math.random() * 0.9;
    galaxyNebulas.push({
      x: w * (0.2 + Math.random()*0.6),
      y: h * (0.15 + Math.random()*0.7),
      r: Math.max(w, h) * (0.17 + Math.random()*0.12) * scale,
      c1: `hsla(${200+Math.random()*30},90%,70%,0.18)`,
      c2: `hsla(${225+Math.random()*18},95%,70%,0.06)`,
      blur: 48 + Math.random()*42
    });
  }
}
initGalaxy();
window.addEventListener('resize', () => {
  resizeBg();
  initBgAnim();
  initGalaxy();
});

// Draw galaxy stars and nebulas
function drawGalaxy(ctx) {
  // Nebulas
  for (let n of galaxyNebulas) {
    let grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
    grad.addColorStop(0, n.c1);
    grad.addColorStop(1, n.c2);
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.filter = `blur(${n.blur}px)`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, 2 * Math.PI);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }
  // Stars
  let now = Date.now();
  for (let s of galaxyStars) {
    let blink = 0.5 + 0.5 * Math.sin((now/830 + s.blinkSeed));
    ctx.save();
    ctx.globalAlpha = s.o * (0.8 + 0.45 * blink);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * (1.2 + 0.25 * blink), 0, 2 * Math.PI);
    ctx.fillStyle = `hsl(${s.hue},100%,93%)`;
    ctx.shadowColor = `hsl(${s.hue},100%,92%)`;
    ctx.shadowBlur = 5 + 5 * blink;
    ctx.fill();
    ctx.restore();
  }
}
// ... (semua kode sebelumnya tetap) ...

// --- BLACKHOLE & BLUE SUN ---
let blackhole = {
    x: 0, y: 0, r: 0
  };
  let bluesun = {
    x: 0, y: 0, r: 0, eaten: 0
  };
  let blackholeFrame = 0;
  
  // Setup Blackhole & Blue Sun positions (center, sun offset)
  function initBlackholeSun() {
    blackhole.r = Math.max(w, h) * 0.15;
    blackhole.x = w * 0.6;
    blackhole.y = h * 0.55;
  
    bluesun.r = Math.max(w, h) * 0.085;
    // Sun start at left of blackhole, will move to blackhole
    bluesun.x = blackhole.x - blackhole.r * 1.7;
    bluesun.y = blackhole.y - blackhole.r * 0.5;
    bluesun.eaten = 0;
  }
  initBlackholeSun();
  window.addEventListener('resize', () => {
    resizeBg();
    initBgAnim();
    initGalaxy();
    initBlackholeSun();
  });
  
  // Draw blackhole accretion, event horizon, lensing, and blue sun being eaten
  function drawBlackholeAndSun(ctx, frame) {
    // Blackhole core
    ctx.save();
    let bhGrad = ctx.createRadialGradient(blackhole.x, blackhole.y, blackhole.r*0.22, blackhole.x, blackhole.y, blackhole.r*1.08);
    bhGrad.addColorStop(0, "#000010");
    bhGrad.addColorStop(0.38, "#112a44");
    bhGrad.addColorStop(0.64, "#3a8dff22");
    bhGrad.addColorStop(0.75, "#e4f3ff09");
    bhGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.beginPath();
    ctx.arc(blackhole.x, blackhole.y, blackhole.r*1.13, 0, 2 * Math.PI);
    ctx.fillStyle = bhGrad;
    ctx.globalAlpha = 0.93;
    ctx.filter = "blur(2px)";
    ctx.fill();
    ctx.restore();
  
    // Event horizon glow
    ctx.save();
    let ehGrad = ctx.createRadialGradient(blackhole.x, blackhole.y, blackhole.r*0.94, blackhole.x, blackhole.y, blackhole.r*1.30);
    ehGrad.addColorStop(0, "rgba(20,50,90,0.13)");
    ehGrad.addColorStop(0.7, "#3a8dff44");
    ehGrad.addColorStop(1, "rgba(60,160,255,0.12)");
    ctx.beginPath();
    ctx.arc(blackhole.x, blackhole.y, blackhole.r*1.25, 0, 2 * Math.PI);
    ctx.strokeStyle = "#3a8dffbb";
    ctx.lineWidth = blackhole.r*0.08;
    ctx.globalAlpha = 0.62 + 0.18*Math.sin(frame/23);
    ctx.shadowColor = "#3a8dff";
    ctx.shadowBlur = 32;
    ctx.stroke();
    ctx.globalAlpha = 0.32;
    ctx.fillStyle = ehGrad;
    ctx.fill();
    ctx.restore();
  
    // Accretion disk (rotating)
    ctx.save();
    ctx.translate(blackhole.x, blackhole.y);
    ctx.rotate(frame/90);
    for (let i = 0; i < 7; i++) {
      let angle = i/7 * 2*Math.PI + Math.sin(frame/100 + i)*0.2;
      let r1 = blackhole.r*1.12;
      let r2 = r1 + 18 + 11*Math.sin(frame/60+i);
      let thickness = 16 + 7*Math.sin(frame/70+i);
      ctx.beginPath();
      ctx.ellipse(
        Math.cos(angle)*r1, Math.sin(angle)*r1,
        r2, thickness,
        angle+frame/60, 0, 2*Math.PI
      );
      let grad = ctx.createLinearGradient(-r2,0,r2,0);
      grad.addColorStop(0.1,"#e4f3ff02");
      grad.addColorStop(0.4,"#3a8dff55");
      grad.addColorStop(0.7,"#e4f3ff99");
      grad.addColorStop(1,"#3a8dff02");
      ctx.globalAlpha = 0.13 + 0.1*Math.abs(Math.sin(frame/80+i));
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.4+2*Math.abs(Math.sin(frame/90+i));
      ctx.shadowColor = "#e4f3ff";
      ctx.shadowBlur = 10;
      ctx.stroke();
    }
    ctx.restore();
  
    // Sun being eaten
    ctx.save();
    // Sun path: lerp from start (bluesun.x) to blackhole.x
    let eatProgress = Math.min(1, bluesun.eaten);
    let sunX = bluesun.x + (blackhole.x-bluesun.x)*eatProgress;
    let sunY = bluesun.y + (blackhole.y-bluesun.y)*eatProgress;
    // Main sun body
    let sunGrad = ctx.createRadialGradient(sunX, sunY, bluesun.r*0.4, sunX, sunY, bluesun.r*1.13);
    sunGrad.addColorStop(0, "#e4f3ff");
    sunGrad.addColorStop(0.16, "#97ccff");
    sunGrad.addColorStop(0.46, "#3a8dff");
    sunGrad.addColorStop(0.9, "rgba(58,141,255,0.05)");
    sunGrad.addColorStop(1, "rgba(30,60,160,0.01)");
    ctx.beginPath();
    ctx.arc(sunX, sunY, bluesun.r, 0, 2*Math.PI);
    ctx.globalAlpha = 0.94;
    ctx.shadowColor = "#e4f3ff";
    ctx.shadowBlur = 35+25*Math.sin(frame/60);
    ctx.fillStyle = sunGrad;
    ctx.filter = `blur(${2+4*Math.sin(frame/100)}px)`;
    ctx.fill();
    ctx.restore();
  
    // Sun corona
    ctx.save();
    let coronaGrad = ctx.createRadialGradient(sunX, sunY, bluesun.r*0.8, sunX, sunY, bluesun.r*2.2);
    coronaGrad.addColorStop(0, "rgba(90,192,255,0.18)");
    coronaGrad.addColorStop(1, "rgba(58,141,255,0)");
    ctx.beginPath();
    ctx.arc(sunX, sunY, bluesun.r*2.1, 0, 2*Math.PI);
    ctx.globalAlpha = 0.41;
    ctx.fillStyle = coronaGrad;
    ctx.filter = "blur(7px)";
    ctx.fill();
    ctx.restore();
  
    // Tidal disruption effect (sun stretching toward blackhole)
    if (eatProgress > 0.1 && eatProgress < 0.98) {
      ctx.save();
      let segs = 30;
      ctx.beginPath();
      for(let i=0;i<=segs;i++){
        let theta = Math.PI * (i/segs);
        let sx = sunX + bluesun.r * Math.cos(theta);
        let sy = sunY + bluesun.r * Math.sin(theta);
        // Stretch to blackhole
        let stretch = 1 + 1.5*eatProgress*Math.abs(Math.sin(theta+frame/30));
        sx += (blackhole.x - sunX) * 0.12 * stretch * Math.pow(Math.sin(theta),2);
        sy += (blackhole.y - sunY) * 0.04 * stretch * Math.pow(Math.sin(theta),2);
        ctx.lineTo(sx, sy);
      }
      for(let i=segs;i>=0;i--){
        let theta = Math.PI * (i/segs);
        let sx = sunX + bluesun.r * Math.cos(theta);
        let sy = sunY - bluesun.r * Math.sin(theta);
        let stretch = 1 + 1.5*eatProgress*Math.abs(Math.sin(theta+frame/30));
        sx += (blackhole.x - sunX) * 0.12 * stretch * Math.pow(Math.sin(theta),2);
        sy += (blackhole.y - sunY) * 0.04 * stretch * Math.pow(Math.sin(theta),2);
        ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      let tidGrad = ctx.createLinearGradient(sunX, sunY, blackhole.x, blackhole.y);
      tidGrad.addColorStop(0, "#e4f3ffcc");
      tidGrad.addColorStop(0.2,"#3a8dffcc");
      tidGrad.addColorStop(1, "#000010");
      ctx.globalAlpha = 0.23+0.19*Math.sin(frame/20);
      ctx.fillStyle = tidGrad;
      ctx.filter = "blur(2.5px)";
      ctx.fill();
      ctx.restore();
    }
  }
  
  // Animate the background (Blue RGB radial gradient + particles + galaxy + blackhole & sun)
  function startBgRGB() {
    requestAnimationFrame(function animateBG() {
      rgbTime += 0.5 * 1.2; // 1.2x faster
      let hue = (Date.now() / (35 / 1.2)); // 1.2x faster
      rgbColor = toBlueRGBColor(hue);
      bg.style.background = `radial-gradient(ellipse at 60% 38%, #e4f3ff11 0%, ${rgbColor}99 28%, #131b2c 90%)`;
      ctx.clearRect(0, 0, w, h);
      drawGalaxy(ctx); // Draw galaxy first
      drawBlackholeAndSun(ctx, blackholeFrame); // Draw blackhole and sun
      drawBgAnim(rgbColor); // Draw particles and lines above
      blackholeFrame++;
      // Animate sun being eaten
      if (bluesun.eaten < 1.0) {
        bluesun.eaten += 0.0022 * (1 + 0.65*Math.sin(blackholeFrame/37));
        if (bluesun.eaten > 1.0) bluesun.eaten = 1.0;
      }
      requestAnimationFrame(animateBG);
    });
  }
  

// Animate the background (Blue RGB radial gradient + particles + galaxy)
function startBgRGB() {
  requestAnimationFrame(function animateBG() {
    rgbTime += 0.5 * 1.2; // 1.2x faster
    let hue = (Date.now() / (35 / 1.2)); // 1.2x faster
    rgbColor = toBlueRGBColor(hue);
    bg.style.background = `radial-gradient(ellipse at 60% 38%, #e4f3ff11 0%, ${rgbColor}99 28%, #131b2c 90%)`;
    // Clear and draw galaxy
    ctx.clearRect(0, 0, w, h);
    drawGalaxy(ctx); // Draw galaxy first
    drawBgAnim(rgbColor); // Draw particles and lines above galaxy
    requestAnimationFrame(animateBG);
  });
}
  
  // Real-time clock logic
  function startRealtimeClock() {
    const clock = document.getElementById('realtime-clock');
    function pad(n) { return n < 10 ? "0" + n : n; }
    function updateClock() {
      const date = new Date();
      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const dayName = weekdays[date.getDay()];
      const day = pad(date.getDate());
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());
      clock.innerHTML = `<span>${dayName}, ${day} ${month} ${year}</span><br><span>${hours}:${minutes}:${seconds}</span>`;
      // Update footer year
      const footerYear = document.getElementById('footer-year');
      if (footerYear) footerYear.textContent = year;
    }
    updateClock();
    setInterval(updateClock, 1000);
  }