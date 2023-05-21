import { Box, useTheme } from "@mui/material";
//import GeographyChart from "../../components/GeographyChart";
import GeoChart from './components/Googlemap'
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Geography = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    // <Box m="20px">
    //   <Header title="Geography" subtitle="Simple Geography Chart" />

    //   <Box
    //     height="75vh"
    //     border={`1px solid ${colors.light[100]}`}
    //     borderRadius="4px"
    //   >
        <GeoChart />
    //   </Box>
    // </Box>
  );
};

export default Geography;