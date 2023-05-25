import { Box, useTheme } from "@mui/material";
import MapComponent3 from "../../components/Incomemap";
import Header from "../../components/Header";
import { tokens } from "../../theme";


//nivo chart
const Geography2_1 = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="What is the sentiment of people who tweet from different levels of income? Melb vs Syd" subtitle="Average Sentiment by SA3 level area and Median Income" />

      <Box
        height="75vh"
        border={`1px solid ${colors.light[100]}`}
        borderRadius="4px"
      >
        <MapComponent3 />
      </Box>
    </Box>
  );
};

export default Geography2_1;
