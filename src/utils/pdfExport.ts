import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Trigger browser native print dialogue.
 * This utilizes CSS @media print for 100% crisp, selectable vector text and crisp images.
 */
export function triggerNativePrint(): void {
  window.print();
}

/**
 * Generate and download a PDF file directly from an HTML element using html2canvas & jsPDF.
 */
export async function downloadElementAsPdf(
  elementId: string,
  fileName: string = 'Information_Report.pdf',
  onProgress?: (progress: number) => void
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  onProgress?.(10);

  // Configure high-definition canvas capture
  const canvas = await html2canvas(element, {
    scale: 2, // 2x resolution for crisp high-DPI text and photos
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
  });

  onProgress?.(50);

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  
  // Standard A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pdfWidth;
  const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

  let heightLeft = imgHeight;
  let position = 0;

  // First page
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pdfHeight;

  // Additional pages if report exceeds 1 page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;
  }

  onProgress?.(90);

  // Save the generated PDF
  pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);

  onProgress?.(100);
}
