import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  Box,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { useRoute } from "../../routeContext";

const Item = ({ title, to, icon, selected, setSelected, handleClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  //const { route, setRoute } = useRoute();
  //setRoute(title);
  // if(selected === title) {
  //   //handleClick();
  //   console.log("title at the moment clicked ", title);
  //   setRoute(title);
  // }
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.light[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link
        to={to}
      />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [alignment, setAlignment] = useState("1");
  const { route, setRoute } = useRoute();

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.main[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      {/* <div className='sidebar' height={5500}> */}
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.light[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.light[100]}>
                  COMP90024
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                {/* <img
                  width="120px"
                  height="150px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                /> */}
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.light[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Group 49
                </Typography>
                <Typography variant="h5" color={colors.green[500]}>
                  Hello world
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Typography
              variant="h6"
              color={colors.light[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Scenario
            </Typography>

            {/* Align buttons to other icons */}
            <ToggleButtonGroup
              color="primary"
              value={alignment}
              exclusive
              onChange={handleAlignment}
              aria-label="Platform"
            >
              <ToggleButton value="1">1</ToggleButton>
              <ToggleButton value="2">2</ToggleButton>
              <ToggleButton value="3">3</ToggleButton>
            </ToggleButtonGroup>
            
            <Typography
              variant="h6"
              color={colors.light[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Dashboard
            </Typography>
            {alignment === "1" && (
            <Item
            title="Home"
            to="/"
            icon={<HomeOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
            handleClick={() => {}}
          />
            )}
            {alignment === "2" && (
             
             <Item
             title="Home"
             to="/2"
             icon={<HomeOutlinedIcon />}
             selected={selected}
             setSelected={setSelected}
             handleClick={() => {}}
           />
             )}
             {alignment === "3" && (
             
             <Item
             title="Home"
             to="/3"
             icon={<HomeOutlinedIcon />}
             selected={selected}
             setSelected={setSelected}
             handleClick={() => {}}
           />
             )}

            <Typography
              variant="h6"
              color={colors.light[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>

            {alignment === "1" && (
              <>
                <Item
                  title="Bar Chart 1"
                  to="/bar"
                  icon={<BarChartOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  handleClick={() => (alignment === "1" && selected === "Bar Chart 1") && {}}
                />
              </>
            )}

            {/* <Item
              title="Pie Chart"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            {alignment === "1" && (
              <Item
                title="Time Series"
                to="/line"
                icon={<TimelineOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                handleClick={() => (alignment === "1" && selected === "Time Series") && {}}
              />
            )}
            {(alignment === "2") && (
              <>
                <Item
                  title="Time Series 2.1"
                  to="/line2_1"
                  icon={<TimelineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  handleClick={() => (alignment === "2" && selected === "Time Series 2.1") && {}}
                />
                <Item
                  title="Time Series 2.2"
                  to="/line2_2"
                  icon={<TimelineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  handleClick={() => (alignment === "2" && selected === "Time Series 2.2") && {}}
                />
              </>
            )}
             {(alignment === "3") && (
              <>
                <Item
                  title="Time Series 3.1"
                  to="/line3_1"
                  icon={<TimelineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  handleClick={() => (alignment === "3" && selected === "Time Series 3.1") && {}}
                />
                <Item
                  title="Time Series 3.2"
                  to="/line3_2"
                  icon={<TimelineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  handleClick={() => (alignment === "3" && selected === "Time Series 3.2") && {}}
                />
              </>
            )}

            {/* {alignment === "1" && (
              <Item
                title="Map"
                to="/geography"
                icon={<MapOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )} */}
            {alignment === "2" && (
              <>
                <Item
                  title="Map 1"
                  to="/geography"
                  icon={<MapOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  handleClick={() => (alignment === "2" && selected === "Map 1") && {}}
                />
                <Item
                  title="Map 2"
                  to="/geography1_2"
                  icon={<MapOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  handleClick={() => (alignment === "2" && selected === "Map 2") && {}}
                />
                <Item
                  title="Map 3"
                  to="/geography2_1"
                  icon={<MapOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  handleClick={() => (alignment === "2" && selected === "Map 3") && {}}
                />
                <Item
                  title="Map 4"
                  to="/geography2_2"
                  icon={<MapOutlinedIcon/>}
                  selected={selected}
                  setSelected={setSelected}
                  handleClick={() => (alignment === "2" && selected === "Map 4") && {}}
                  />
              </>
            )}
          </Box>
        </Menu>
      </ProSidebar>
      {/* </div> */}
    </Box>
  );
};

export default Sidebar;
