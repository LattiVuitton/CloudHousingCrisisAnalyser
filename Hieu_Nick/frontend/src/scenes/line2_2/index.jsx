import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart2_2";

const line_chart = () => {
  return (
    <Box m="25px">
      <Header title="Twitter Sentiment vs Bitcoin Index"  />
      <Box height="80vh">
        <LineChart />
      </Box>
    </Box>
  );
};

export default line_chart;
