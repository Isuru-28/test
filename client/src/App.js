// import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './layouts/LoginLayout';
import RegisterPage from './layouts/RegisterLayout';
import AdminLayout from './layouts/AdminLayout';
import DoctorLayout from './layouts/DoctorLayout';
import PetOwnerLayout from './layouts/PetOwnerLayout';
import ReceptionistLayout from './layouts/ReceptionistLayout';
import AppTable from './Pages/CommonPages/AppTable';
// import DocReports from './Pages/CommonPages/DocReports';
import Inventory from './Pages/CommonPages/Inventory';
import PetTable from './Pages/CommonPages/PetTable';
import PetTable2 from './Pages/CommonPages/PetTable2';
import PrivateRoute from './services/PrivateRoute';
import ViewUsers from './Pages/Admin/ViewUsers';
import AppTable2 from './Pages/CommonPages/AppTable2';
// import Notifications from './Pages/CommonPages/Notifications';
import NotificationPet from './Pages/Pet/NotificationPet';
import BillingPage from './Pages/Receptionist/BillingPage';
import Payments from './Pages/CommonPages/Payments';
import PaymentsPet from './Pages/Pet/PaymentsPet';
import Dashboard from './Pages/CommonPages/Dashboard';
import UserProfile from './Pages/CommonPages/UserProfile';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />        
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage/>} />
        
        
          <Route path="/admin/*" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="appointments" element={<AppTable2 />} />
            <Route path="pets" element={<PetTable />} />
            <Route path="pets/:petId" element={<PetTable2 />} />
            <Route path="reports" element={<Payments />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="view-users" element={<ViewUsers />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="user-profile" element={<UserProfile />} />
          </Route>
        
        
        
          <Route path="/doctor/*" element={<PrivateRoute><DoctorLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="appointments" />} />
            <Route path="appointments" element={<AppTable2 />} />
            <Route path="pets" element={<PetTable />} />
            <Route path="pets/:petId" element={<PetTable2 />} />
            {/* <Route path="reports" element={<DocReports />} /> */}
            <Route path="inventory" element={<Inventory />} />
            <Route path="user-profile" element={<UserProfile />} />
          </Route>
        
        
        
          <Route path="/receptionist/*" element={<PrivateRoute><ReceptionistLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="appointments" />} />
            <Route path="appointments" element={<AppTable2 />} />
            <Route path="pets" element={<PetTable />} />
            <Route path="pets/:petId" element={<PetTable2 />} />
            <Route path="reports" element={<Payments />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="user-profile" element={<UserProfile />} />
          </Route>
        
        
        
          <Route path="/pet-owner/*" element={<PrivateRoute><PetOwnerLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="appointments" />} />
            <Route path="appointments" element={<AppTable />} />
            <Route path="payments" element={<PaymentsPet />} />
            <Route path="pets/:petId" element={<PetTable2 />} />
            <Route path="notificationspets" element={<NotificationPet />} />
            <Route path="user-profile" element={<UserProfile />} />
          </Route>
        
      </Routes>

    </Router>
  );
}

export default App;
