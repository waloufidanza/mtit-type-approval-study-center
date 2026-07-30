import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TypeApprovalRequest } from '../types/typeApproval';

/**
 * High-fidelity HTML to PDF Export Utility (RTL compliant with logo and graphics)
 */
export const exportElementToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);
  } catch (err) {
    console.error('Error generating PDF:', err);
  }
};

/**
 * Utility to generate PDF export for technical reports & certificates
 */
export const exportTechnicalReportPDF = (request: TypeApprovalRequest) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Background and title
  doc.setFillColor(245, 247, 250);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(10, 10, 190, 25, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('REPUBLIC OF YEMEN - MINISTRY OF TELECOMMUNICATIONS', 105, 22, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Technical Evaluation Report', 105, 29, { align: 'center' });

  // Details
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);

  let y = 45;
  doc.text(`Request Number: ${request.requestNumber}`, 15, y);
  doc.text(`Applicant: ${request.applicant.name}`, 120, y);
  y += 8;

  doc.text(`Equipment: ${request.equipmentType}`, 15, y);
  doc.text(`Brand / Model: ${request.brand} ${request.model}`, 120, y);
  y += 12;

  // Technical Opinion
  doc.setDrawColor(203, 213, 225);
  doc.line(15, y, 195, y);
  y += 8;

  doc.setFontSize(12);
  doc.text('Technical Evaluation Summary:', 15, y);
  y += 8;

  doc.setFontSize(10);
  doc.text(`Decision: ${request.technicalOpinion.finalRecommendation || 'Approval'}`, 15, y);
  y += 8;

  doc.text(`Justification: ${request.technicalOpinion.decisionJustification || 'Approved in compliance with national telecommunication standards.'}`, 15, y);
  y += 12;

  // Signatures
  y = 250;
  doc.line(15, y, 195, y);
  y += 10;
  doc.text('Reviewer Signature', 30, y);
  doc.text('General Director Stamp & Seal', 130, y);

  doc.save(`Technical-Report-${request.requestNumber}.pdf`);
};

export const exportCertificatePDF = (request: TypeApprovalRequest) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Certificate border
  doc.setLineWidth(1);
  doc.setDrawColor(217, 119, 6); // amber-600
  doc.rect(10, 10, 190, 277);

  doc.setLineWidth(0.3);
  doc.rect(12, 12, 186, 273);

  // Header
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.text('REPUBLIC OF YEMEN', 105, 25, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Ministry of Telecommunications & Information Technology', 105, 32, { align: 'center' });
  doc.setFontSize(10);
  doc.text('General Directorate of Telecommunications Regulation', 105, 38, { align: 'center' });

  // Main Title
  doc.setFontSize(18);
  doc.setTextColor(30, 58, 138); // blue-900
  doc.text('TYPE APPROVAL CERTIFICATE', 105, 55, { align: 'center' });

  // Certificate Number & Type
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text(`Certificate No: ${request.certificateNumber}`, 105, 63, { align: 'center' });

  // Body
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  let y = 80;

  doc.text('This is to certify that the telecommunication equipment detailed below', 105, y, { align: 'center' });
  y += 6;
  doc.text('has been evaluated and approved for use in the Republic of Yemen.', 105, y, { align: 'center' });
  y += 15;

  // Data Box
  doc.setFillColor(248, 250, 252);
  doc.rect(20, y, 170, 70, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(20, y, 170, 70, 'S');

  let boxY = y + 10;
  doc.text(`Certificate Holder: ${request.applicant.name}`, 25, boxY);
  boxY += 10;
  doc.text(`Manufacturer: ${request.manufacturer.companyName} (${request.manufacturer.country})`, 25, boxY);
  boxY += 10;
  doc.text(`Brand & Model: ${request.brand} ${request.model}`, 25, boxY);
  boxY += 10;
  doc.text(`Equipment Type: ${request.equipmentType}`, 25, boxY);
  boxY += 10;
  doc.text(`Issue Date: ${request.certificateIssueDate}`, 25, boxY);
  doc.text(`Expiry Date: ${request.certificateExpiryDate}`, 110, boxY);

  // Footer / Seal
  y = 230;
  doc.text('Official Digital Seal & Verification QR Code', 30, y);
  doc.text('Director General of Telecommunication Regulation', 110, y);

  doc.save(`Type-Approval-Certificate-${request.requestNumber}.pdf`);
};

