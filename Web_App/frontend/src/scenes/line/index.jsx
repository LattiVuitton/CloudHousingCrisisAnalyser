import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";

const line_chart = () => {
  return (
    <Box m="25px">
      <Header title="Line Chart" subtitle="Simple Line Chart" />
      <Box height="80vh">
        <LineChart />
      </Box>
    </Box>
  );
};

export default line_chart;
