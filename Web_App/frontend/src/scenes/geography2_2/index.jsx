import { Box, useTheme } from "@mui/material";
import MapComponent4 from "../../components/Income-offensivemap";
import Header from "../../components/Header";
import { tokens } from "../../theme";


//nivo chart
const Geography2_2 = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="Do people from different income regions send more offensive tweets? Melb vs Syd" subtitle="Total No of Offensive Tweets by SA3 Level of Median Income" />

      <Box
        height="75vh"
        border={`1px solid ${colors.light[100]}`}
        borderRadius="4px"
      >
        <MapComponent4 />
      </Box>
    </Box>
  );
};

export default Geography2_2;
