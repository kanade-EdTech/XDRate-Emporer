/** Prepare a bounded local JPEG for browser storage and offline export. */
export async function preparePortrait(file: File): Promise<string> {
  const supportedType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
  const supportedUnknownType = !file.type && /\.(?:jpe?g|png|webp)$/i.test(file.name);
  if (!supportedType && !supportedUnknownType) throw new Error('请选择 JPEG、PNG 或 WebP 图片');
  if (file.size > 12_000_000) throw new Error('图片超过 12 MB');
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    try { await image.decode(); } catch { throw new Error('无法读取图片，请选择有效的图片文件'); }
    if (!image.naturalWidth || !image.naturalHeight) throw new Error('图片尺寸无效');
    let scale = Math.min(1, 900 / Math.max(image.naturalWidth, image.naturalHeight));
    for (let attempt = 0; attempt < 5; attempt++) {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('无法处理图片');
      context.fillStyle = '#f3ead7';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const result = canvas.toDataURL('image/jpeg', 0.78);
      if (result.length <= 350_000 && result.startsWith('data:image/jpeg;base64,')) return result;
      scale *= 0.75;
    }
    throw new Error('图片压缩后仍然过大');
  } finally {
    URL.revokeObjectURL(url);
  }
}
