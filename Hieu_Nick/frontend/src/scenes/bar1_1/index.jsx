import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart1_1 from "../../components/BarChart1_1";

const Bar = () => {
  return (
    <Box m="20px">
      <Header title="Usage of Languages on Twitter vs Mastodon" />
      <Box height="75vh">
        <BarChart1_1 />
      </Box>
    </Box>
  );
};

export default Bar;
