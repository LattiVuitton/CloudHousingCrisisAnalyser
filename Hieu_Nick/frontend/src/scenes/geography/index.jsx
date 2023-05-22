// import { Box, useTheme } from "@mui/material";
// import GeographyChart from "../../components/GeographyChart";
// import GeoChart from '../../components/Googlemap'
// //import GeoChart from '../../components/Leafletmap'
// import Header from "../../components/Header";
// import { tokens } from "../../theme";

// //google map chart
// const Geography = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   return (
//     <Box m="20px">
//       <Header title="Geography" subtitle="Simple Geography Chart" />
//         <GeoChart />
//      </Box>
//   );
// };

// export default Geography;

import { Box, useTheme } from "@mui/material";
import MapComponent from '../../components/Leaflet-test'; // Ensure the path is correct
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Geography = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
    <Box m="20px">
      <Header title="Geography" subtitle="Simple Geography Chart" />
      <MapComponent />
    </Box>
  );
};

export default Geography;

