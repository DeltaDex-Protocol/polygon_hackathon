import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DefaultNavbar from 'examples/Navbars/DefaultNavbar';
import Footer from "examples/Footer";
import Sidenav from 'examples/Sidenav';
import CssBaseline from "@mui/material/CssBaseline";
import routes from "routes";
import SoftBox from "components/SoftBox";
import Icon from "@mui/material/Icon";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";



import brand from "assets/images/logo-ct.png";



const sidenavColor = 'info';
// const brand = '';






const MyPositions = () => {


  const configsButton = (
    <SoftBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.5rem"
      height="3.5rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      // onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="default" color="inherit">
        settings
      </Icon>
    </SoftBox>
  );

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });


  return (
	<>
      <CssBaseline />
      <Sidenav
        color={sidenavColor}
        brand={brand}
        brandName="Soft UI Dashboard"
        routes={routes}
        // onMouseEnter={handleOnMouseEnter}
        // onMouseLeave={handleOnMouseLeave}
      />
      {configsButton}

	<DashboardLayout>
		<DashboardNavbar />

	</DashboardLayout>
	</>
	)
}

export default MyPositions;