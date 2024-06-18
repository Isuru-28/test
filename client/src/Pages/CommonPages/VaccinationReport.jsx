// VaccinationReport.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const VaccinationReport = ({ petId, onGenerateComplete }) => {
  const [pet, setPet] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const petResponse = await axios.get(`http://localhost:3001/api/pets/${petId}`);
        setPet(petResponse.data);

        const prescriptionResponse = await axios.get(`http://localhost:3001/api/prescriptions/${petId}`);
        // Sort prescriptions by date (latest last)
        const sortedPrescriptions = prescriptionResponse.data.sort((a, b) => new Date(a.presdate) - new Date(b.presdate));
        setPrescriptions(sortedPrescriptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [petId]);

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
      doc.save('vaccination_report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      onGenerateComplete();
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (pet && prescriptions.length > 0 && !isGenerating) {
      generatePDF();
    }
  }, [pet, prescriptions, isGenerating]);

  const currentDate = new Date().toLocaleDateString();

  return (
    <div id="report-content" style={{ padding: '20px', backgroundColor: '#fff', width: '210mm', minHeight: '297mm', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
        <h1 style={{ margin: '0', fontSize: '24px' }}>Vaccination Report</h1>
        <h2 style={{ margin: '0', fontSize: '18px' }}>Pet Animal Clinic</h2>
        <p style={{ margin: '5px 0' }}>Total Pet Care, Mailagas Junction, Anuradhapura</p>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          <div>
            <p><strong>Client Code:</strong> {pet && pet.p_id}</p>
            <p><strong>Name:</strong> {pet && pet.pet_name}</p>
            <p><strong>Owner:</strong> {pet && pet.first_name}</p>
            <p><strong>Weight:</strong> {pet && pet.weight} Kg</p>
            <p><strong>Date of Birth:</strong> {pet && pet.dob}</p>
            <p><strong>Breed:</strong> {pet && pet.breed}</p>
          </div>
          <div>
            <p><strong>Email:</strong> totalpetcare@gmail.com</p>
            <p><strong>Contact:</strong> (071) 838-8371</p>
            <p><strong>Report issued date:</strong> {currentDate}</p>
          </div>
        </div>
      </div>
      <div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '0.1px solid #ccc', padding: '5px' }}>Vaccine</th>
              <th style={{ border: '0.1px solid #ccc', padding: '5px' }}>Dosage</th>
              <th style={{ border: '0.1px solid #ccc', padding: '5px' }}>Description</th>
              <th style={{ border: '0.1px solid #ccc', padding: '5px' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map(prescription => (
              <tr key={prescription.pres_id}>
                <td style={{ border: '0.1px solid #ccc', padding: '5px' }}>{prescription.drug_name}</td>
                <td style={{ border: '0.1px solid #ccc', padding: '5px', textAlign: 'center' }}>{prescription.dosage}</td>
                <td style={{ border: '0.1px solid #ccc', padding: '5px' }}>{prescription.des}</td>
                <td style={{ border: '0.1px solid #ccc', padding: '5px' }}>{new Date(prescription.presdate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '0.1px solid #ccc', marginTop: 'auto' }}>
        <div>
          <p>Veterinarian Signature: ________________________</p>
        </div>
        <div>
          <p>Date: ________________________</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '2px solid #000', paddingTop: '10px' }}>
        <p>Thank you for visiting our clinic!</p>
        <p>For inquiries, call us at (071) 838-8371</p>
      </div>
    </div>
  );
};

export default VaccinationReport;
