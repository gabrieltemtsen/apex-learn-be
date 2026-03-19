import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit') as typeof import('pdfkit');
import * as QRCode from 'qrcode';

export interface CertificateData {
  recipientName: string;
  courseTitle: string;
  instructorName: string;
  tenantName: string;
  certificateNumber: string;
  issuedAt: Date;
  qrCodeData: string;
  category?: string;
}

@Injectable()
export class PdfService {
  async generateCertificatePdf(data: CertificateData): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        // Generate QR code as data URL
        const qrDataUrl = await QRCode.toDataURL(data.qrCodeData, {
          width: 120,
          margin: 1,
          color: { dark: '#1e1b4b', light: '#ffffff' },
        });
        const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margins: { top: 0, bottom: 0, left: 0, right: 0 },
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const W = 841.89; // A4 landscape width in pts
        const H = 595.28; // A4 landscape height in pts

        // ── Background ──────────────────────────────────────────────────────────
        // Dark navy base
        doc.rect(0, 0, W, H).fill('#0f172a');

        // Subtle gradient overlay — top-left indigo fade
        doc.rect(0, 0, W * 0.5, H * 0.5).fill('#1e1b4b').opacity(0.3);
        doc.opacity(1);

        // Top decorative border stripe
        doc.rect(0, 0, W, 8).fill('#6366f1');

        // Bottom decorative border stripe
        doc.rect(0, H - 8, W, 8).fill('#6366f1');

        // Left accent bar
        doc.rect(0, 8, 6, H - 16).fill('#818cf8');

        // Right accent bar
        doc.rect(W - 6, 8, 6, H - 16).fill('#818cf8');

        // ── Corner ornaments ────────────────────────────────────────────────────
        const cornerSize = 40;
        const cornerInset = 20;
        // Top-left
        doc.rect(cornerInset, cornerInset, cornerSize, 3).fill('#6366f1');
        doc.rect(cornerInset, cornerInset, 3, cornerSize).fill('#6366f1');
        // Top-right
        doc.rect(W - cornerInset - cornerSize, cornerInset, cornerSize, 3).fill('#6366f1');
        doc.rect(W - cornerInset - 3, cornerInset, 3, cornerSize).fill('#6366f1');
        // Bottom-left
        doc.rect(cornerInset, H - cornerInset - 3, cornerSize, 3).fill('#6366f1');
        doc.rect(cornerInset, H - cornerInset - cornerSize, 3, cornerSize).fill('#6366f1');
        // Bottom-right
        doc.rect(W - cornerInset - cornerSize, H - cornerInset - 3, cornerSize, 3).fill('#6366f1');
        doc.rect(W - cornerInset - 3, H - cornerInset - cornerSize, 3, cornerSize).fill('#6366f1');

        // ── Header ───────────────────────────────────────────────────────────────
        doc.fontSize(11)
          .font('Helvetica')
          .fillColor('#a5b4fc')
          .text('CERTIFICATE OF COMPLETION', 0, 55, { align: 'center', characterSpacing: 4 });

        // Logo / org name
        doc.fontSize(28)
          .font('Helvetica-Bold')
          .fillColor('#ffffff')
          .text('Apex', W / 2 - 80, 80, { continued: true })
          .fillColor('#818cf8')
          .text('Learn™', { continued: false });

        // Divider line
        doc
          .moveTo(W * 0.2, 125)
          .lineTo(W * 0.8, 125)
          .lineWidth(1)
          .strokeColor('#334155')
          .stroke();

        // ── Body ─────────────────────────────────────────────────────────────────
        doc.fontSize(13)
          .font('Helvetica')
          .fillColor('#94a3b8')
          .text('This is to certify that', 0, 148, { align: 'center' });

        // Recipient name
        doc.fontSize(38)
          .font('Helvetica-Bold')
          .fillColor('#ffffff')
          .text(data.recipientName, 0, 170, { align: 'center' });

        // Name underline
        const nameWidth = Math.min(doc.widthOfString(data.recipientName) + 60, 500);
        const nameX = (W - nameWidth) / 2;
        doc.moveTo(nameX, 218).lineTo(nameX + nameWidth, 218).lineWidth(2).strokeColor('#6366f1').stroke();

        doc.fontSize(13)
          .font('Helvetica')
          .fillColor('#94a3b8')
          .text('has successfully completed', 0, 230, { align: 'center' });

        // Course title
        doc.fontSize(22)
          .font('Helvetica-Bold')
          .fillColor('#e2e8f0')
          .text(data.courseTitle, 80, 255, { align: 'center', width: W - 160 });

        // ── Footer row ───────────────────────────────────────────────────────────
        const footerY = H - 115;

        // Instructor signature block
        doc.fontSize(10).font('Helvetica').fillColor('#64748b').text('INSTRUCTOR', 90, footerY, { characterSpacing: 2 });
        doc.moveTo(80, footerY + 28).lineTo(260, footerY + 28).lineWidth(1).strokeColor('#334155').stroke();
        doc.fontSize(13).font('Helvetica-Bold').fillColor('#cbd5e1').text(data.instructorName, 80, footerY + 34);

        // Issued by block (center)
        doc.fontSize(10).font('Helvetica').fillColor('#64748b').text('ISSUED BY', W / 2 - 60, footerY, { characterSpacing: 2, width: 120, align: 'center' });
        doc.fontSize(13).font('Helvetica-Bold').fillColor('#cbd5e1').text(data.tenantName, W / 2 - 80, footerY + 34, { width: 160, align: 'center' });

        // Date block
        const dateStr = data.issuedAt.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' });
        doc.fontSize(10).font('Helvetica').fillColor('#64748b').text('DATE ISSUED', W - 270, footerY, { characterSpacing: 2 });
        doc.moveTo(W - 270, footerY + 28).lineTo(W - 90, footerY + 28).lineWidth(1).strokeColor('#334155').stroke();
        doc.fontSize(13).font('Helvetica-Bold').fillColor('#cbd5e1').text(dateStr, W - 270, footerY + 34);

        // ── QR Code ──────────────────────────────────────────────────────────────
        doc.image(qrBuffer, W - 175, H - 180, { width: 90, height: 90 });
        doc.fontSize(7).font('Helvetica').fillColor('#475569')
          .text('Scan to verify', W - 175, H - 82, { width: 90, align: 'center' });

        // ── Certificate number ───────────────────────────────────────────────────
        doc.fontSize(8).font('Helvetica').fillColor('#334155')
          .text(`Cert. No: ${data.certificateNumber}`, 0, H - 28, { align: 'center', characterSpacing: 1 });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}
