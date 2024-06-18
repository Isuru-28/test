import React from 'react'
import { Outlet } from 'react-router-dom';
import SideNavBar from '../Components/SideNavBar/SideNavBar';
import TopNavBar from '../Components/TopNavBar/TopNavBar';

function ReceptionistLayout() {
  return (
    <div style={{ position: 'relative', display: 'flex', height: '100vh' }}>
      <SideNavBar role="receptionist" style={{ position: 'fixed', top: 0, bottom: 0, zIndex: 1000, width: '250px' }} />
      <div style={{ marginLeft: '250px', flex: '1', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
        <TopNavBar style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1001 }} />
        <div style={{ paddingTop: '64px', paddingLeft: '16px', paddingRight: '16px', paddingBottom: '16px' }}>
          {/* Padding top is set to accommodate the fixed top navbar */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ReceptionistLayout;
