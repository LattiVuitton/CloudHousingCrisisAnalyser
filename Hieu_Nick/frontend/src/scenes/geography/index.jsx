import { Box, useTheme } from "@mui/material";
//import GeographyChart from "../../components/GeographyChart";
import GeographyChart from "../../components/Leafletmap";
import Header from "../../components/Header";
import { tokens } from "../../theme";

//nivo chart
const Geography = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="What is the sentiment of people who tweet about housing and the levels of rental index change?" subtitle="Average Sentiment by Suburbs with Different Rental Index Change" />

      <Box
        height="65vh"
        border={`1px solid ${colors.light[100]}`}
        borderRadius="4px"
      >
        <GeographyChart />
      </Box>
    </Box>
  );
};

export default Geography;
