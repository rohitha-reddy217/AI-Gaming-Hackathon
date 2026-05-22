import QRCode from "qrcode";

export const generateQrDataUrl = async (payload: string) => {
  return QRCode.toDataURL(payload, { margin: 1, width: 256 });
};

export const generateQrBuffer = async (payload: string) => {
  return QRCode.toBuffer(payload, { margin: 1, width: 256 });
};
