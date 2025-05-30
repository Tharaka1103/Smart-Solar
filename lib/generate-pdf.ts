import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export async function generatePDF(quotation: any, userData: any) {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Function to safely format content
  const formatContent = (content: any): string => {
    if (!content) return '';
    
    if (typeof content === 'object') {
      try {
        return Object.entries(content)
          .map(([key, value]) => `• ${key}: ${value}`)
          .join('\n');
      } catch (e) {
        return JSON.stringify(content);
      }
    }
    
    return String(content);
  };
  
  // Ensure all quotation properties are strings
  const safeQuotation = {
    systemOverview: formatContent(quotation.systemOverview),
    components: formatContent(quotation.components),
    technicalSpecs: formatContent(quotation.technicalSpecs),
    costBreakdown: formatContent(quotation.costBreakdown),
    financialAnalysis: formatContent(quotation.financialAnalysis),
    environmentalImpact: formatContent(quotation.environmentalImpact),
    recommendations: formatContent(quotation.recommendations)
  };
  
  // Add logo and headers with styling
  doc.setFillColor(0, 128, 0);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("Luminex Engineering", 14, 20);
  doc.setFontSize(16);
  doc.text("Solar System Quotation", 14, 35);
  
  // Add date and reference in a styled box
  doc.setFillColor(240, 240, 240);
  doc.rect(10, 45, 190, 20, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 55);
  doc.text(`Reference: SS-${Math.floor(Math.random() * 10000)}`, 120, 55);
  
  // Define starting position
  let yPosition = 70;
  
  // Client Information Table
  const clientInfo = [
    ["Name", userData.name || ''],
    ["Email", userData.email || ''],
    ["Phone", userData.phone || ''],
    ["Location", userData.city || ''],
    ["Building Type", userData.buildingType || '']
  ];
  
  autoTable(doc, {
    startY: yPosition,
    head: [["Client Information", ""]],
    body: clientInfo,
    theme: 'striped',
    headStyles: { fillColor: [0, 128, 0], textColor: 255 },
    styles: { fontSize: 10 },
    columnStyles: { 0: { cellWidth: 60 } },
    margin: { top: 10 },
    didDrawPage: (data) => {
        yPosition = data.cursor?.y ?? yPosition;
    }
  });
  
  // Increment yPosition for spacing
  yPosition += 10;
  
  // System Overview Table
  autoTable(doc, {
    startY: yPosition,
    head: [["System Overview"]],
    body: [[safeQuotation.systemOverview]],
    headStyles: { fillColor: [0, 128, 0], textColor: 255 },
    styles: { fontSize: 10 },
    margin: { top: 10 },
    didDrawPage: (data) => {
        yPosition = data.cursor?.y ?? yPosition;
    }
  });
  
  // Increment yPosition for spacing
  yPosition += 10;
  
  // Components Table
  autoTable(doc, {
    startY: yPosition,
    head: [["System Components"]],
    body: [[safeQuotation.components]],
    headStyles: { fillColor: [0, 128, 0], textColor: 255 },
    styles: { fontSize: 10 },
    margin: { top: 10 },
    didDrawPage: (data) => {
        yPosition = data.cursor?.y ?? yPosition;
    }
  });
  
  // Increment yPosition for spacing
  yPosition += 10;
  
  // Check if we need a new page
  if (yPosition > 230) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Technical Specifications Table
  autoTable(doc, {
    startY: yPosition,
    head: [["Technical Specifications"]],
    body: [[safeQuotation.technicalSpecs]],
    headStyles: { fillColor: [0, 128, 0], textColor: 255 },
    styles: { fontSize: 10 },
    margin: { top: 10 },
    didDrawPage: (data) => {
        yPosition = data.cursor?.y ?? yPosition;
    }
  });
  
  // Increment yPosition for spacing
  yPosition += 10;
  
  // Check if we need a new page
  if (yPosition > 230) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Cost Breakdown Table
  autoTable(doc, {
    startY: yPosition,
    head: [["Cost Breakdown"]],
    body: [[safeQuotation.costBreakdown]],
    headStyles: { fillColor: [0, 128, 0], textColor: 255 },
    styles: { fontSize: 10 },
    margin: { top: 10 },
    didDrawPage: (data) => {
        yPosition = data.cursor?.y ?? yPosition;
    }
  });
  
  // Increment yPosition for spacing
  yPosition += 10;
  
  // Check if we need a new page
  if (yPosition > 230) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Financial Analysis Table
  autoTable(doc, {
    startY: yPosition,
    head: [["Financial Analysis"]],
    body: [[safeQuotation.financialAnalysis]],
    headStyles: { fillColor: [0, 128, 0], textColor: 255 },
    styles: { fontSize: 10 },
    margin: { top: 10 },
    didDrawPage: (data) => {
      yPosition = data.cursor?.y ?? yPosition;
    }
  });
  
  // Increment yPosition for spacing
  yPosition += 10;
  
  // Check if we need a new page
  if (yPosition > 230) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Environmental Impact Table
  autoTable(doc, {
    startY: yPosition,
    head: [["Environmental Impact"]],
    body: [[safeQuotation.environmentalImpact]],
    headStyles: { fillColor: [0, 128, 0], textColor: 255 },
    styles: { fontSize: 10 },
    margin: { top: 10 },
    didDrawPage: (data) => {
        yPosition = data.cursor?.y ?? yPosition;
    }
  });
  
  // Increment yPosition for spacing
  yPosition += 10;
  
  // Check if we need a new page
  if (yPosition > 230) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Recommendations Table
  autoTable(doc, {
    startY: yPosition,
    head: [["Additional Recommendations"]],
    body: [[safeQuotation.recommendations]],
    headStyles: { fillColor: [0, 128, 0], textColor: 255 },
    styles: { fontSize: 10 },
    margin: { top: 10 }
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(0, 128, 0);
    doc.rect(0, doc.internal.pageSize.getHeight() - 20, doc.internal.pageSize.getWidth(), 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(
      "Luminex Engineering - Leading Solar Energy Provider in Sri Lanka",
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 20,
      doc.internal.pageSize.getHeight() - 10
    );
  }
  
  // Disclaimer on the last page
  doc.setPage(pageCount);
  doc.setFillColor(245, 245, 245);
  doc.rect(10, doc.internal.pageSize.getHeight() - 40, doc.internal.pageSize.getWidth() - 20, 15, 'F');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  const disclaimer = "Disclaimer: This is an AI-generated estimate based on the information provided. Actual costs may vary. Please contact Luminex Engineering for a precise quotation.";
  const disclaimerText = doc.splitTextToSize(disclaimer, 180);
  doc.text(disclaimerText, 14, doc.internal.pageSize.getHeight() - 32);
  
  // Save the PDF with a safe filename
  const safeName = userData.name ? userData.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') : 'User';
  doc.save(`Smart_Solar_Quotation_${safeName}.pdf`);
}
