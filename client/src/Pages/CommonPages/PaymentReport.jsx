import React, { useEffect, useState } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PaymentReport = ({ month, year, onGenerateComplete }) => {
  const [payments, setPayments] = useState([]);
  const [totalCurrentMonthIncome, setTotalCurrentMonthIncome] = useState(0);
  const [totalPreviousMonthIncome, setTotalPreviousMonthIncome] = useState(0);
  const [totalNextMonthIncome, setTotalNextMonthIncome] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/payments/PaymentsByMonthYear', {
          params: { month, year }
        });
        setPayments(response.data);

        // Calculate total income for the current month
        const totalIncome = response.data.reduce((acc, payment) => acc + parseFloat(payment.total_amount), 0);
        setTotalCurrentMonthIncome(totalIncome);
      } catch (error) {
        console.error('Error fetching payment data:', error);
      }
    };

    const fetchIncomes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/payments/presum', {
          params: { month, year }
        });

        setTotalPreviousMonthIncome(parseFloat(response.data.totalPreviousMonthIncome));
        setTotalNextMonthIncome(parseFloat(response.data.totalNextMonthIncome));
      } catch (error) {
        console.error('Error fetching incomes:', error);
      }
    };

    fetchPayments();
    fetchIncomes();
  }, [month, year]);

  const generatePDF = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    const doc = new jsPDF('p', 'mm', 'a4');
    const pdfContent = document.getElementById('report-content');

    if (!pdfContent) {
      console.error('PDF content element not found');
      setIsGenerating(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      doc.save('payment_report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      onGenerateComplete();
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (payments.length > 0 && !isGenerating) {
      generatePDF();
    }
  }, [payments, isGenerating]);

  const currentDate = new Date().toLocaleDateString();

  const calculateGrowthRate = (current, previous) => {
    if (previous === 0) {
      return 'N/A'; // To handle division by zero case.
    }
    const growthRate = ((current - previous) / previous) * 100;
    return `${growthRate.toFixed(2)}%`;
  };

  return (
    <div id="report-content" style={{ padding: '20px', backgroundColor: '#fff', width: '210mm', minHeight: '297mm', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2>Income Report</h2>
        <p>Total Pet Care, Mailagas Junction, Anuradhapura</p>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          <div>
            <p><strong>Report Month:</strong> {new Date(year, month - 1).toLocaleString('default', { month: 'long' })} {year}</p>
          </div>
          <div>
            <p><strong>Report issued date:</strong> {currentDate}</p>
          </div>
        </div>
      </div>
      <div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '0.1px solid #ccc', padding: '5px' }}>Bill ID</th>
              <th style={{ border: '0.1px solid #ccc', padding: '5px' }}>Bill To</th>
              <th style={{ border: '0.1px solid #ccc', padding: '5px' }}>Pet Name</th>
              <th style={{ border: '0.1px solid #ccc', padding: '5px' }}>Prescription ID</th>
              <th style={{ border: '0.1px solid #ccc', padding: '5px' }}>Payment Date</th>
              <th style={{ border: '0.1px solid #ccc', padding: '5px' }}>Bill Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.bill_id}>
                <td style={{ border: '0.1px solid #ccc', padding: '5px' }}>{payment.bill_id}</td>
                <td style={{ border: '0.1px solid #ccc', padding: '5px' }}>{payment.first_name}</td>
                <td style={{ border: '0.1px solid #ccc', padding: '5px' }}>{payment.pet_name}</td>
                <td style={{ border: '0.1px solid #ccc', padding: '5px' }}>{payment.pres_id}</td>
                <td style={{ border: '0.1px solid #ccc', padding: '5px' }}>{new Date(payment.payment_date).toLocaleDateString()}</td>
                <td style={{ border: '0.1px solid #ccc', padding: '5px' }}>{payment.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <div style={{ flex: 1 }}>
          <p><strong>Total Income of {new Date(year, month - 1).toLocaleString('default', { month: 'long' })} :</strong> {totalCurrentMonthIncome.toFixed(2)}</p>
          <p><strong>Total Income of {new Date(year, month - 2).toLocaleString('default', { month: 'long' })} :</strong> {totalPreviousMonthIncome.toFixed(2)}</p>
          <p><strong>Total Income of {new Date(year, month).toLocaleString('default', { month: 'long' })} :</strong> {totalNextMonthIncome.toFixed(2)}</p>
        </div>
        <div style={{ flex: 1 }}>
          <p><strong>Income Growth Metrics:</strong></p>
          <p><strong>Growth from {new Date(year, month - 2).toLocaleString('default', { month: 'long' })} to {new Date(year, month - 1).toLocaleString('default', { month: 'long' })}:</strong> {calculateGrowthRate(totalCurrentMonthIncome, totalPreviousMonthIncome)}</p>
          <p><strong>Growth from {new Date(year, month - 1).toLocaleString('default', { month: 'long' })} to {new Date(year, month).toLocaleString('default', { month: 'long' })}:</strong> {calculateGrowthRate(totalNextMonthIncome, totalCurrentMonthIncome)}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '0.1px solid #ccc', marginTop: 'auto' }}>
        <div>
          <p>Prepared by: ________________________</p>
        </div>
        <div>
          <p>Date: ________________________</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '2px solid #000', paddingTop: '10px' }}>
        <p>Thank you for choosing our clinic!</p>
        <p>For inquiries, call us at (071) 838-8371</p>
      </div>
    </div>
  );
};

export default PaymentReport;
