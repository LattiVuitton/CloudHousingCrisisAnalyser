import { useEffect, useState } from "react";
import { Box,  Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart3_1";
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
        <Header title="SCENARIO 3" subtitle="Housing" />
      </Box>
      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
       

        {/* ROW 3 */}
        <Box
          gridColumn="span 6"
          gridRow="span 4"
          backgroundColor={colors.main[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Rental Index and All Tweets
          </Typography>
          <Box height="200px">
            <MapComponent2 />
          </Box>
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 4"
          backgroundColor={colors.main[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Rental Index and Housing Related Tweets
          </Typography>
          <Box >
            <MapComponent />
          </Box>
        </Box>
        


      </Box>
    </Box>
  );
};

export default Dashboard;
