import { useEffect, useState } from "react";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import TwitterIcon from '@mui/icons-material/Twitter';
import MessageIcon from '@mui/icons-material/Message';
import Header from "../../components/Header";
import LineChart from "../../components/LineChart2_1";
import LineChart2 from "../../components/LineChart2_2";
import MapComponent from "../../components/Leafletmap";
import MapComponent2 from "../../components/Fullmap";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [backendData, setBackendData] = useState([null]);
  useEffect(() => {
    fetch("/data",{
      mode: 'no-cors',
    }).then(
      //data
      (response) => response.json()
      .then((data) => {setBackendData(data)
      })
    );
  }, [])

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to the dashboard" />
      </Box>
      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.main[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.light[100]}
              >
                Twitter Sentiment vs All Ordinaries Index
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={false} />
          </Box>
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.main[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.light[100]}
              >
                Twitter Sentiment vs Bitcoin Index
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart2 isDashboard={false} />
          </Box>
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 12"
          gridRow="span 5"
          backgroundColor={colors.main[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "25px" }}
          >
            Geography
          </Typography>
          <Box height="200px">
            <MapComponent isDashboard={false} />
          </Box>
        </Box>
        <Box
          gridColumn="span 12"
          gridRow="span 5"
          backgroundColor={colors.main[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "25px" }}
          >
            Geography
          </Typography>
          <Box height="200px">
            <MapComponent2 isDashboard={false} />
          </Box>
        </Box>
        
      </Box>
    </Box>
  );
};

export default Dashboard;
