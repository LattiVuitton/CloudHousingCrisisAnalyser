import { Box, useTheme } from "@mui/material";
import MapComponent2 from "../../components/Fullmap";
import Header from "../../components/Header";
import { tokens } from "../../theme";

//nivo chart
const Geography = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="What is the sentiment of people who tweet in general and the levels of rental index change?" 
      subtitle="Average Sentiment by Suburb and Rental Index Change" />

      <Box>
        <MapComponent2 />
      </Box>
    </Box>
  );
};

export default Geography;
