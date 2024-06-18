import React, { useState } from "react";
import {
  AppBar,
  Button,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PetsRoundedIcon from '@mui/icons-material/PetsRounded';
import DrawerComp from './DraweCopm';
import { Link } from "react-router-dom";

const LoginNavBar = () => {
  const [value, setValue] = useState();
  const theme = useTheme();
  console.log(theme);
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  console.log(isMatch);

  return (
    <React.Fragment>
      <AppBar position="static" sx={{ margin: "0 auto", background: "#ffffff", borderRadius: "100px", width:"90%",  marginTop: "10px" }}>
        <Toolbar >
          <PetsRoundedIcon sx={{ transform: "scale(1.5)" , color:"black"}} />
          {isMatch ? (
            <>
              <Typography sx={{ fontSize: "2rem", paddingLeft: "10%" , color:"black"}}>
                Pet Animal Clinic
              </Typography>
              <DrawerComp />
            </>
          ) : (
            <>
              <Tabs
                sx={{ marginLeft: "auto" ,color: "#000000", fontWeight: "bold"}}
                indicatorColor="secondary"
                textColor="#000000"
                value={value}
                onChange={(e, value) => setValue(value)}
              >
                <Tab label="About Us" />
                <Tab label="Services" />
                <Tab label="Contact" />
              </Tabs>
              <Button
                component={Link} // Use Link component from react-router-dom
                to="/login" // Route to the login page
                sx={{ marginLeft: "auto", background: "#FF7A00", borderRadius: "100px" }}
                variant="contained"
              >
                Login
              </Button>
              <Button
                component={Link} // Use Link component from react-router-dom
                to="/register" // Route to the register page
                sx={{ marginLeft: "10px", background: "#FF7A00", borderRadius: "100px" }}
                variant="contained"
              >
                SignUp
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default LoginNavBar;