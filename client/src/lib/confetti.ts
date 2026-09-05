/**
 * Ultra-hafif ve akıcı Canvas Konfeti Efekti
 */
export function triggerConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "99999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const pieces: {
    x: number;
    y: number;
    color: string;
    radius: number;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
  }[] = [];

  const colors = [
    "#dfff62",
    "#17362c",
    "#f97316",
    "#e11d48",
    "#10b981",
    "#3b82f6",
    "#a855f7",
    "#fbbf24",
  ];

  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: width / 2 + (Math.random() - 0.5) * 160,
      y: height / 2 - 80,
      color: colors[Math.floor(Math.random() * colors.length)],
      radius: Math.random() * 6 + 4,
      speedX: (Math.random() - 0.5) * 14,
      speedY: Math.random() * -14 - 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
    });
  }

  let animationFrame: number;
  let startTime = Date.now();

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const elapsed = Date.now() - startTime;
    if (elapsed > 2400) {
      canvas.remove();
      cancelAnimationFrame(animationFrame);
      return;
    }

    pieces.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.speedY += 0.45; // Yerçekimi
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 1.5);
      ctx.restore();
    });

    animationFrame = requestAnimationFrame(render);
  }

  render();
}
