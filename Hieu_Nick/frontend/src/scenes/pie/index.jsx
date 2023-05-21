import { Box } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";

const pie_chart = () => {
  return (
    <Box m="25px">
      <Header title="Pie Chart" subtitle="Simple Pie Chart" />
      <Box height="80vh">
        <PieChart />
      </Box>
    </Box>
  );
};

export default pie_chart;
