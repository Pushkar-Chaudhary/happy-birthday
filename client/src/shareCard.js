import { THEMES } from './constants.js';

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const words = text.trim().split(/\s+/);
  const lines = [];
  let line = '';

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);

  const visible = lines.slice(0, maxLines);
  if (lines.length > maxLines && visible.length) {
    let lastLine = visible[visible.length - 1];
    while (lastLine && ctx.measureText(`${lastLine}…`).width > maxWidth) lastLine = lastLine.slice(0, -1);
    visible[visible.length - 1] = `${lastLine.trimEnd()}…`;
  }

  visible.forEach((item, index) => ctx.fillText(item, x, y + index * lineHeight));
}

function drawFlowers(ctx, accent) {
  const colors = [accent, '#d7b26d', '#b8a4d8', '#e7c6a7'];
  ctx.lineCap = 'round';
  colors.forEach((color, flowerIndex) => {
    const x = 900 + flowerIndex * 54;
    const y = 240 + (flowerIndex % 2) * 34;
    ctx.strokeStyle = '#9bb59d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y + 10);
    ctx.quadraticCurveTo(920 + flowerIndex * 44, 420, 900 + flowerIndex * 42, 510);
    ctx.stroke();

    ctx.fillStyle = color;
    for (let petal = 0; petal < 6; petal += 1) {
      const angle = (Math.PI * 2 * petal) / 6;
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(angle) * 17, y + Math.sin(angle) * 17, 11, 16, angle, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#f2d98a';
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
  });
}

function createShareCard({ recipientName, message, theme, url }) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is unavailable.');

  const colors = THEMES[theme] || THEMES.rose;
  ctx.fillStyle = '#111214';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, 1140, 570);

  ctx.fillStyle = colors.accent;
  ctx.font = '700 21px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('WISHLY  ·  A BIRTHDAY SURPRISE', 80, 105);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 58px "Playfair Display", Georgia, serif';
  drawWrappedText(ctx, `For ${recipientName},`, 80, 210, 710, 68, 2);

  ctx.fillStyle = '#c6c7cb';
  ctx.font = '400 25px "Plus Jakarta Sans", Arial, sans-serif';
  drawWrappedText(ctx, message, 82, 290, 680, 39, 4);

  ctx.fillStyle = '#a4a6ad';
  ctx.font = '600 18px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('A little birthday joy, made just for you.', 82, 500);

  ctx.fillStyle = colors.accent;
  ctx.font = '600 17px "Plus Jakarta Sans", Arial, sans-serif';
  const displayUrl = url.length > 58 ? `${url.slice(0, 55)}…` : url;
  ctx.fillText(displayUrl, 82, 545);

  drawFlowers(ctx, colors.accent);
  return canvas;
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not encode the image.')), 'image/png');
  });
}

export async function shareWishCard(details) {
  const blob = await canvasToBlob(createShareCard(details));
  const filename = `wishly-${details.recipientName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'birthday'}.png`;
  const downloadImage = () => {
    const imageUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
  };

  if (typeof File !== 'undefined' && navigator.share && navigator.canShare?.({ files: [new File([blob], filename, { type: 'image/png' })] })) {
    try {
      const file = new File([blob], filename, { type: 'image/png' });
      await navigator.share({
        files: [file],
        title: `A birthday surprise for ${details.recipientName}`,
        text: 'Open your birthday surprise',
        url: details.url,
      });
      return;
    } catch (error) {
      if (error.name === 'AbortError') throw error;
    }
  }

  downloadImage();
}
