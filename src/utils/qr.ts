import QRCode from 'qrcode';

export const generateQrPngBase64 = async (text: string): Promise<string> => {
  const dataUrl = await QRCode.toDataURL(text, { margin: 1, width: 256 });
  // strip header
  return dataUrl.split(',')[1];
};
