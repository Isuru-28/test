import * as React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PetsIcon from '@mui/icons-material/Pets';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InventoryIcon from '@mui/icons-material/Vaccines';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone';


const SideNavBar = ({ role }) => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user.userId || '';

  const navItems = {
    admin: [
      { text: 'Dashboard', icon: <MarkEmailUnreadIcon sx={{ color: '#000000' }} />, link: 'dashboard' },
      { text: 'Appointments', icon: <CalendarMonthIcon sx={{ color: '#000000' }} />, link: 'appointments' },
      { text: 'Pets', icon: <PetsIcon sx={{ color: '#000000' }} />, link: 'pets' },
      { text: 'Payments', icon: <AssessmentIcon sx={{ color: '#000000' }} />, link: 'reports' },
      { text: 'Inventory', icon: <InventoryIcon sx={{ color: '#000000' }} />, link: 'inventory' },
      { text: 'View Users', icon: <PeopleAltIcon sx={{ color: '#000000' }} />, link: 'view-users' },
      { text: 'Profile', icon: <ManageAccountsTwoToneIcon sx={{ color: '#000000' }} />, link: 'user-profile' },
    ],
    doctor: [
      { text: 'Appointments', icon: <CalendarMonthIcon sx={{ color: '#000000' }} />, link: 'appointments' },
      { text: 'Pets', icon: <PetsIcon sx={{ color: '#000000' }} />, link: 'pets' },
      // { text: 'Reports', icon: <AssessmentIcon sx={{ color: '#000000' }} />, link: 'reports' },
      { text: 'Inventory', icon: <InventoryIcon sx={{ color: '#000000' }} />, link: 'inventory' },
      { text: 'Profile', icon: <ManageAccountsTwoToneIcon sx={{ color: '#000000' }} />, link: 'user-profile' },
    ],
    receptionist: [
      { text: 'Appointments', icon: <CalendarMonthIcon sx={{ color: '#000000' }} />, link: 'appointments' },
      { text: 'Pets', icon: <PetsIcon sx={{ color: '#000000' }} />, link: 'pets' },
      { text: 'Payments', icon: <AssessmentIcon sx={{ color: '#000000' }} />, link: 'reports' },
      { text: 'Inventory', icon: <InventoryIcon sx={{ color: '#000000' }} />, link: 'inventory' },
      { text: 'Billing', icon: <LocalAtmIcon sx={{ color: '#000000' }} />, link: 'billing' },
      { text: 'Profile', icon: <ManageAccountsTwoToneIcon sx={{ color: '#000000' }} />, link: 'user-profile' },
    ],
    petOwner: [
      { text: 'Appointments', icon: <CalendarMonthIcon sx={{ color: '#000000' }} />, link: 'appointments' },
      { text: 'Payments', icon: <AssessmentIcon sx={{ color: '#000000' }} />, link: 'payments' },
      { text: 'Vaccinations', icon: <InventoryIcon sx={{ color: '#000000' }} />, link: `pets/${userId}` },
      { text: 'Notifications', icon: <MarkEmailUnreadIcon sx={{ color: '#000000' }} />, link: 'notificationspets' },
      { text: 'Profile', icon: <ManageAccountsTwoToneIcon sx={{ color: '#000000' }} />, link: 'user-profile' },
    ],
  };

  return (   
    <div className="SideNavBar">
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 250,
          backgroundColor: "#FCA14D",
          zIndex: 1000,
        }}
        role="presentation"
      >
        <List sx={{ paddingTop: '45px' }}>
          {navItems[role].map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton component={Link} to={item.link} sx={{ paddingTop: '10px' }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={{ color: '#ffffff' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
    
  );
}

export default SideNavBar;
