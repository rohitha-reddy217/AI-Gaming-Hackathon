import PDFDocument from "pdfkit";
import { PassThrough } from "stream";

export const generateGstInvoice = async ({
  teamId,
  amount,
  transactionId
}: {
  teamId: string;
  amount: number;
  transactionId: string;
}) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const stream = new PassThrough();
  const chunks: Buffer[] = [];

  doc.pipe(stream);
  stream.on("data", (chunk) => chunks.push(chunk));

  doc.fontSize(20).text("GST Invoice", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Team ID: ${teamId}`);
  doc.text(`Transaction: ${transactionId}`);
  doc.text(`Amount: INR ${amount}`);
  doc.text(`Tax: Included`);
  doc.moveDown();
  doc.text("Issued by IncuXai - India's Ultimate AI Gaming Hackathon");

  doc.end();

  await new Promise((resolve) => stream.on("end", resolve));

  return Buffer.concat(chunks);
};
