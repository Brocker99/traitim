const music = document.getElementById("bg-music");
const playMusiconce = () => {
  music.play().catch((e) => console.log("Music play blocked:", e));
  window.removeEventListener("click", playMusiconce);
};
window.addEventListener("click", playMusiconce);

const message = [
  "Bé iu là ánh sáng trong cuộc đời anh.",
  "Bé iu là lý do anh mỉm cười mỗi ngày.",
  "Bé iu là giấc mơ đẹp nhất mà anh từng có.",
  "Bé iu là người anh muốn bên cạnh mãi mãi.",
  "Bé iu là ngọn lửa sưởi ấm trái tim anh.",
  "Bé iu là bản nhạc ngọt ngào trong cuộc sống anh.",
  "Bé iu là lý do anh tin vào tình yêu.",
  "Bé iu là ánh sao sáng nhất trong bầu trời đêm của anh.",
];
const fallingText = [];

function createFallingText() {
  const text = message[Math.floor(Math.random() * message.length)];
  const fontSize = Math.random() * 10 + 10; // Random font size between 10px and 30px
  ctx.font = "bold ${fontSize}px Pacifico";
  const textWidth = ctx.measureText(text).width;
  const x = Math.random() * (width - textWidth);

  fallingText.push({
    text,
    x,
    y: -10,
    speed: Math.random() * 2 + 2,
    alpha: 1, // Start at the top of the canvas
    fontSize,
    hue: Math.random() * 360, // Random speed between 1 and 3
  });
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

const star = [];
const heartstar = [];
const meteors = [];

let mouseX = width / 2;
let mouseY = height / 2;
let heartBeat = 1;
let heartScale = Math.min(width, height) * 0.025;

function heartShape(t, scale = 1) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t)
  );
  return { x: x * scale, y: y * scale };
}

function createHeartStars(count = 1600) {
  const centerX = width / 2;
  const centerY = height / 2 + 20;

  for (let i = 0; i < count; i++) {
    const t = (i / count) * 2 * Math.PI;
    const heart = heartShape(t, heartScale);
    const offsetX = (Math.random() - 0.5) * 15;
    const offsetY = (Math.random() - 0.5) * 15;

    const targetX = centerX + heart.x + offsetX;
    const targetY = centerY + heart.y + offsetY;

    heartstar.push({
      x: Math.random() * width,
      y: Math.random() * height,
      targetX,
      targetY,
      originalX: targetX,
      originalY: targetY,
      size: Math.random() * 3 + 1,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      brightness: Math.random() * 0.5 + 0.5,
      hue: Math.random() * 360 + 300,
      mode: "flying",
    });
  }
}

function createBackgroundStars() {
  for (let i = 0; i < 200; i++) {
    star.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.01 + 0.005,
      brightness: Math.random() * 0.3 + 0.2,
    });
  }
}

function createMeteor() {
  meteors.push({
    x: Math.random() * width,
    y: -50,
    length: Math.random() * 80 + 50,
    speed: Math.random() * 6 + 6,
    alpha: 1,
    angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
  });
}

setInterval(() => {
  if (Math.random() < 0.8) createFallingText();
}, 2000);
function drawSmallHeart(ctx, x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 15, size / 15); // 15 là kích thước gốc
  ctx.beginPath();
  ctx.moveTo(0, -5);
  ctx.bezierCurveTo(-5, -15, -15, -5, 0, 10);
  ctx.bezierCurveTo(15, -5, 5, -15, 0, -5);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  heartBeat += 0.1;

  // Draw background stars
  star.forEach((star) => {
    star.twinkle += star.twinkleSpeed;
    const flicker = Math.random() < 0.005 ? 1 : 0;

    const baseOpacity = star.brightness * (0.4 + 0.6 * Math.sin(star.twinkle));
    const opacity = Math.min(1, baseOpacity + flicker);

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = flicker ? 20 : 0;
    ctx.shadowColor = flicker ? "#fff" : "transparent";
    ctx.beginPath();
    drawSmallHeart(
      ctx,
      star.x,
      star.y,
      star.size * 5,
      `hsl(${star.hue}, 70%, 80%)`
    );
  });

  // Draw meteors
  meteors.forEach((m, i) => {
    const dx = Math.cos(m.angle) * m.length;
    const dy = Math.sin(m.angle) * m.length;
    ctx.save();
    ctx.globalAlpha = m.alpha;
    ctx.strokeStyle = `rgba(255, 255, 255, 0.8)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(m.x - dx, m.y - dy);
    ctx.stroke();
    ctx.restore();
    m.x += Math.cos(m.angle) * m.speed;
    m.y += Math.sin(m.angle) * m.speed;
    m.alpha -= 0.05;
    if (m.alpha <= 0) {
      meteors.splice(i, 1);
    }
  });

  fallingText.forEach((t, i) => {
    ctx.save();
    ctx.font = `bold ${t.fontSize}px Pacifico`;
    ctx.fillStyle = `hsla(${t.hue}, 100%, 85%, ${t.alpha})`;
    ctx.shadowBlur = 5;
    ctx.shadowColor = `hsla(${t.hue}, 100%, 70%, ${t.alpha})`;
    ctx.fillText(t.text, t.x, t.y);
    ctx.restore();

    t.y += t.speed;
    t.alpha -= 0.005;

    if (t.y > height + 30 || t.alpha <= 0) {
      fallingText.splice(i, 1);
    }
  });

  heartstar.forEach((star, i) => {
    star.twinkle += star.twinkleSpeed;
    const centerX = width / 2;
    const centerY = height / 2 + 20;

    if (star.mode === "flying") {
      const dx = star.targetX - star.x;
      const dy = star.targetY - star.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = 0.03;
      if (dist > 1) {
        star.x += dx * speed;
        star.y += dy * speed;
      } else {
        star.mode = "heart";
      }
    } else {
      const deltaX = star.originalX - centerX;
      const deltaY = star.originalY - centerY;
      const beatScale = 1 + 0.05 * Math.sin(heartBeat);
      star.x = centerX + deltaX * beatScale;
      star.y = centerY + deltaY * beatScale;

      const distanceToMouse = Math.hypot(mouseX - star.x, mouseY - star.y);
      let interactionForce = (100 - distanceToMouse) / 100;

      if (distanceToMouse < 100) {
        interactionForce = (100 - distanceToMouse) / 100;
        const angle = Math.atan2(star.y - mouseY, star.x - mouseX);
        star.x += Math.cos(angle) * interactionForce * 10;
        star.y += Math.sin(angle) * interactionForce * 10;
      }
    }

    const twinkleOpacity =
      star.brightness * (0.6 + 0.4 * Math.sin(star.twinkle));
    ctx.save();
    ctx.globalAlpha = twinkleOpacity;
    ctx.fillStyle = `hsl(${star.hue}, 70%, 80%)`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = `hsl(${star.hue}, 70%, 60%)`;
    drawSmallHeart(
      ctx,
      star.x,
      star.y,
      star.size * 3,
      `hsl(${star.hue}, 70%, 80%)`
    );

    ctx.restore();
  });

  requestAnimationFrame(animate);
}

canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

canvas.addEventListener("click", (e) => {
  const centerX = width / 2;
  const centerY = height / 2 + 20;
  heartScale *= 1.015;
  heartstars.forEach((star, i) => {
    if (star.mode === "heart") {
      const t = (i / heartstar.length) * 2 * Math.PI;
      const heart = heartShape(t, heartScale);
      const offsetX = (Math.random() - 0.5) * 15;
      const offsetY = (Math.random() - 0.5) * 15;
      star.originalX = centerX + heart.x + offsetX;
      star.originalY = centerY + heart.y + offsetY;
    }
  });

  for (let i = 0; i < 10; i++) {
    const t = Math.random() * 2 * Math.PI;
    const heart = heartShape(t, heartScale);
    const targetX = centerX + heart.x;
    const targetY = centerY + heart.y;

    heartstar.push({
      x: e.clientX + (Math.random() - 0.5) * 50,
      y: e.clientY + (Math.random() - 0.5) * 50,
      targetX,
      targetY,
      originalX: targetX,
      originalY: targetY,
      size: Math.random() * 3 + 2,
      twinkleSpeed: Math.random() * 0.03 + 0.02,
      brightness: Math.random() * 0.8 + 0.6,
      hue: Math.random() * 60 + 300,
      mode: "flying",
    });
  }
});

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  heartScale = Math.min(width, height) * 0.015;
  heartstar.length = 0;
  star.length = 0;
  createBackgroundStars();
  createHeartStars();
});

setInterval(() => {
  if (Math.random() < 0.7) createMeteor();
}, 3000);

createBackgroundStars();
createHeartStars();
animate();
