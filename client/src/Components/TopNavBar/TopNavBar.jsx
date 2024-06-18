import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import PetsIcon from '@mui/icons-material/Pets';
import { useNavigate } from 'react-router-dom'; // Import Link
import AuthService from '../../services/AuthService';

const settings = ['Profile', 'Logout'];

function NavBarMain() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate(); // Get the navigate function from React Router

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ top: 0, right: 0, left: 0, backgroundColor: '#e0e0e0', boxShadow: 'none'}}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h6"
            noWrap
            // component={Link}
            to="/"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 800,
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
              flexGrow: 1,
              paddingLeft : "240px",
              textAlign: 'center'
            }}
          >
            Pet Animal Clinic <PetsIcon sx={{ transform: "scale(1.3)" , color:"black"}}/>
         </Typography>
          
        </Box>

        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar alt="Profile" src="/static/images/avatar/2.jpg" />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {settings.map((setting) => (
            <MenuItem key={setting} onClick={setting === 'Logout' ? handleLogout : handleCloseUserMenu}>
              <Typography textAlign="center">{setting}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default NavBarMain;
