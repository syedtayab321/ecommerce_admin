import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper function for currency formatting
const formatMoney = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const generateInvoicePDF = (order) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // ===== HEADER SECTION =====
    doc.setFontSize(24);
    doc.setTextColor(33, 37, 41);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 105, 30, { align: 'center' });
    
    // Invoice metadata
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${order.id}`, 15, 40);
    doc.text(`Date: ${new Date(order.orderDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, 15, 45);
    doc.text(`Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`, 15, 50);

    // ===== COMPANY & CUSTOMER INFO =====
    // Company info (left)
    doc.setFontSize(12);
    doc.setTextColor(33, 37, 41);
    doc.setFont('helvetica', 'bold');
    doc.text('Your Company Name', 15, 65);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text('123 Business Avenue', 15, 70);
    doc.text('New York, NY 10001', 15, 75);
    doc.text('Phone: (555) 123-4567', 15, 80);
    doc.text('Email: info@yourcompany.com', 15, 85);

    // Customer info (right)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 37, 41);
    doc.text('Bill To:', 120, 65);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`Customer ID: ${order.userId}`, 120, 70);
    doc.text(`Shipping: ${order.shippingAddress}`, 120, 75);
    doc.text(`Payment: ${order.paymentMethod}`, 120, 80);

    // ===== ITEMS TABLE =====
    // Table header background
    doc.setFillColor(41, 128, 185);
    doc.rect(15, 95, 180, 8, 'F');
    
    // Table header text
    doc.setFontSize(11);
    doc.setTextColor(255);
    doc.setFont('helvetica', 'bold');
    doc.text('PRODUCT', 20, 100);
    doc.text('PRICE', 100, 100);
    doc.text('QTY', 130, 100);
    doc.text('TOTAL', 170, 100, { align: 'right' });

    // Table rows
    let yPos = 105;
    order.items.forEach((item, index) => {
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(15, yPos - 5, 180, 8, 'F');
      }

      // Product name (with variants if available)
      doc.setFontSize(10);
      doc.setTextColor(33, 37, 41);
      doc.setFont('helvetica', 'normal');
      doc.text(item.name, 20, yPos);
      
      // Variants info
      if (item.color || item.size) {
        doc.setFontSize(8);
        doc.setTextColor(100);
        const variants = [];
        if (item.color) variants.push(`Color: ${item.color}`);
        if (item.size) variants.push(`Size: ${item.size}`);
        doc.text(variants.join(' | '), 20, yPos + 4);
      }

      // Price, quantity and total
      doc.setFontSize(10);
      doc.setTextColor(33, 37, 41);
      doc.text(formatMoney(item.price), 100, yPos);
      doc.text(item.quantity.toString(), 130, yPos);
      doc.text(formatMoney(item.price * item.quantity), 170, yPos, { align: 'right' });

      // Add subtle separator line
      doc.setDrawColor(230, 230, 230);
      doc.line(15, yPos + 6, 195, yPos + 6);

      yPos += 10;
    });

    // ===== TOTALS SECTION =====
    const subtotal = order.totalAmount;
    const discountAmount = subtotal * (order.discount / 100);
    const total = subtotal - discountAmount;

    // Position after items
    yPos += 10;

    // Subtotal
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Subtotal:', 150, yPos);
    doc.text(formatMoney(subtotal), 190, yPos, { align: 'right' });

    // Discount if applicable
    if (order.discount > 0) {
      yPos += 6;
      doc.text(`Discount (${order.discount}%):`, 150, yPos);
      doc.setTextColor(220, 53, 69); // Red color for discount
      doc.text(`-${formatMoney(discountAmount)}`, 190, yPos, { align: 'right' });
    }

    // Total
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 37, 41);
    doc.text('TOTAL:', 150, yPos);
    doc.text(formatMoney(total), 190, yPos, { align: 'right' });

    // Bottom border
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPos + 5, 195, yPos + 5);

    // ===== FOOTER =====
    yPos += 20;
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your business!', 15, yPos);
    doc.text('Terms: Payment due within 15 days of invoice date', 15, yPos + 5);
    doc.text('Late payments are subject to a 5% monthly fee', 15, yPos + 10);

    // Company info at bottom
    doc.text('Your Company Name • 123 Business Avenue • New York, NY 10001', 105, 285, { align: 'center' });

    // Save the PDF
    doc.save(`Invoice_${order.id}_${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw new Error('Failed to generate invoice PDF');
  }
};