import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart2_1";

const line_chart = () => {
  return (
    <Box m="25px">
      <Header title="Twitter Sentiment vs All Ordinaries Index" />
      <Box height="80vh">
        <LineChart />
      </Box>
    </Box>
  );
};

export default line_chart;
