export default (input: any) => {
  const keyStr =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  let i = 0;

  while (i < input.length) {
    chr1 = input[i++];
    chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
    chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output +=
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4);
  }
  return output;
};

export const rgbImageBufferToBase64 = (target: any) => {
  if (!target) {
    return '';
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const width = (canvas.width = target.width);
  const height = (canvas.height = target.height);

  const rowBytes = width * 4;
  for (let row = 0; row < height; row++) {
    const srow = row;
    const imageData = ctx.createImageData(width, 1);
    const start = srow * width * 4;
    for (let i = 0; i < rowBytes; i++) {
      imageData.data[i] = target.buffer[start + i];
    }

    ctx.putImageData(imageData, 0, row);
  }

  return canvas.toDataURL('image/png');
};
