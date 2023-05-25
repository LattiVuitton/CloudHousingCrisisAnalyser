import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import TwitterIcon from '@mui/icons-material/Twitter';
import MessageIcon from '@mui/icons-material/Message';
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import BarChart1_1 from "../../components/BarChart1_1";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [backendDataTW, setBackendDataTW] = useState([null]);
  useEffect(() => {
    fetch("/counttw",{
      mode: 'no-cors',
    }).then(
      (response) => response.json()
      .then((data) => {setBackendDataTW(data)
        console.log("backendData API ", backendDataTW);
      })
    );
  }, [])
  const [backendDataMA, setBackendDataMA] = useState([null]);
  useEffect(() => {
    fetch("/countma",{
      mode: 'no-cors',
    }).then(
      (response) => response.json()
      .then((data) => {setBackendDataMA(data)
        console.log("backendData API ", backendDataMA);
      })
    );
  }, [])

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="SCENARIO 1" subtitle="General" />
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
          gridColumn="span 3"
          backgroundColor={colors.main[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={[backendDataTW.data]}
            subtitle="Number of Twitter posts"
            icon={
              <TwitterIcon
                sx={{ color: colors.green[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.main[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={([backendDataMA.data])}
            subtitle="Number of Mastodon posts"
            icon={
              <MessageIcon
                sx={{ color: colors.green[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        {/* <Box> */}
          {/* <StatBox
            title="32,441"
            subtitle="sth sth"
            // icon={
            //   <PersonAddIcon
            //     sx={{ color: colors.green[600], fontSize: "26px" }}
            //   />
            // }
          /> */}
        {/* </Box> */}
        
        
        {/* ROW 2 */}
        <Box
          gridColumn="span 6"
          gridRow="2 / span 3"
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
                Use of languages
              </Typography>
            </Box>
          </Box>
          <Box height="375px" width ="600px" ml="50px">
          <BarChart isDashboard={false} />
          </Box>
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 6"
          gridRow="span 4"
          backgroundColor={colors.main[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Average sentiment in different platforms and regions
          </Typography>
          <Box height="500px" width ="600px" mt="20px" ml= "25px">
          <BarChart1_1 isDashboard={false} />
          </Box>
        </Box>
        {/* <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.main[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Usage of Languages on Twitter vs Mastodon
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={false} />
          </Box>
        </Box> */}
        {/* <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.main[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography
          </Typography>
          <Box height="200px"length="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
};

export default Dashboard;
