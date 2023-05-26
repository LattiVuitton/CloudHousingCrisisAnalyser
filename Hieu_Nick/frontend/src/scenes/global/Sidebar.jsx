import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  Box,
  Typography,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
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
      {Array.isArray(title) ? title.map((line, i) => <Typography key={i}>{line}</Typography>) : <Typography>{title}</Typography>}
      <Link
        to={to}
      />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [alignment, setAlignment] = useState("1");
  const { route, setRoute } = useRoute();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("Overview");

const handleAlignment = (event, newAlignment) => {
  if (newAlignment === null) {
    navigate(`/${alignment}`);
  } else {
    setAlignment(newAlignment);
    setSelected("Overview");  // Set "Overview" as selected item
    navigate(`/${newAlignment}`);
  }
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
      <ProSidebar>
        <Menu iconShape="square">
          <MenuItem
            style={{
              margin: "10px 0 20px 0",
              color: colors.light[0],
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              ml="0px"
            >
              <Typography variant="h2" color={colors.light[100]}>
                COMP90024
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              ml="0px"
            >
              <Typography variant="h3"
                color={colors.light[100]}
                fontWeight="bold"
                sx={{ m: "2px 0 0 0" }} >
                Group 49
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt = "5px"
            >
              <Typography variant="h6" color={colors.green[500]}>
                Navdeep Beniwal (1279517)
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" color={colors.green[500]}>
                Aditya Desu (1000447)
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" color={colors.green[500]}>
                Hieu (Nick) Huu (1329582)
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" color={colors.green[500]}>
                Jonathan Latti (1083374)
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb = "30px"
            >
              <Typography variant="h6" color={colors.green[500]}>
                Patricia Widjojo (913557)
              </Typography>
            </Box>
          </MenuItem>
          

          

          <Box ml = "0px">
            <Typography
              variant="h4"
              color={colors.light[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Scenarios
            </Typography>

            <Box display="flex" ml = "30px" mt="10px">
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
                        </Box>

                        <Typography
                          variant="h4"
                          color={colors.light[300]}
                          sx={{ m: "30px 0 5px 20px" }}
                        >
                          Dashboard
                        </Typography>
                        {alignment === "1" && (
                        <Item
                        title="Overview"
                        to="/1"
                        icon={<HomeOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                        )}
                        {alignment === "2" && (
                         
                         <Item
                         title="Overview"
                         to="/2"
                         icon={<HomeOutlinedIcon />}
                         selected={selected}
                         setSelected={setSelected}
                       />
                         )}
                         {alignment === "3" && (
                         
                         <Item
                         title="Overview"
                         to="/3"
                         icon={<HomeOutlinedIcon />}
                         selected={selected}
                         setSelected={setSelected}
                       />
                         )}
                        
            

                        <Typography
                          variant="h4"
                          color={colors.light[300]}
                          sx={{ m: "25px 0 5px 20px" }}
                        >
                          Charts In-Detail
                        </Typography>
            
                        {alignment === "1" && (
                          <>
                            <Item
                              title="Global Sentiment"
                              to="/bar"
                              icon={<BarChartOutlinedIcon />}
                              selected={selected}
                              setSelected={setSelected}
                            />
                          </>
                        )}
            
                        {alignment === "1" && (
                          <Item
                            title="Language Use"
                            to="/bar1_1"
                            icon={<BarChartOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                          />
                        )}
                        {(alignment === "2") && (
                          <>
                            <Item
                              title={["All Ordinaries Index"]}
                              to="/line2_1"
                              icon={<TimelineOutlinedIcon />}
                              selected={selected}
                              setSelected={setSelected}
                            />
                            <Item
                              title={["Bitcoin Index"]}
                              to="/line2_2"
                              icon={<TimelineOutlinedIcon />}
                              selected={selected}
                              setSelected={setSelected}
                            />
                             <Item
                            title={["Income and Sentiment"]}
                            to="/geography2_1"
                            icon={<MapOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                          />
                           <Item
                            title={["Income and Offensive", "Language Use"]}
                            to="/geography2_2"
                            icon={<MapOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                          />
                          </>
                        )}
            
                        {alignment === "3" && (
                          <>
                          <Item
                            title={["Rental Index and", "All Tweets"]}
                            to="/geography1_2"
                            icon={<MapOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                          />
                          <Item
                            title={["Rental Index and", "Housing Tweets"]}
                            to="/geography"
                            icon={<MapOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                          />
                            
                          </>
                        )}
                      </Box>

                     

                      
                    </Menu>
                  </ProSidebar>
                </Box>
              );
            };
            
            export default Sidebar;
            