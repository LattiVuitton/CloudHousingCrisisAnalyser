import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useEffect, useState } from "react";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [backendData, setBackendData] = useState([]);
  useEffect(() => {
    fetch("/bar", {
      mode: "no-cors",
    }).then(
      (response) =>
        response.json().then((data) => {
          console.log(data.data);
          setBackendData(data.data);
        })
    );
  }, []);

  const dataValues = backendData.map(item => item.Sentiment);
  const minValue = Math.min(...dataValues);
  const maxValue = Math.max(...dataValues);

  return (
    <ResponsiveBar
      data={backendData ? backendData : []}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.light[100],
            },
          },
          legend: {
            text: {
              fill: colors.light[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.light[100],
              strokeWidth: 1,
            },
            text: {
              fill: "white",
            },
          },
        },
      }}
      keys={["Sentiment"]}
      indexBy="Platform/Country"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear", min: minValue - 0.03, max: maxValue + 0.03  }}
      indexScale={{ type: "band", round: true }}
      colors={(bar) => (bar.data.Sentiment > 0 ? '#9AFF66' : '#EE4033')}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Platform/Country",
        legendPosition: "middle",
        legendOffset: 45,
        legendTextStyle: {
            fill: 'white',
        },
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Average sentiment",
        legendPosition: "middle",
        legendOffset: -50,
        legendTextStyle: {
            fill: 'white',
        },
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor="#737373"
      tooltipFormat={(value) => value.toFixed(2)}
      role="application"
      barAriaLabel={(e) =>
        e.id + ": " + e.formattedValue + " in country: " + e.indexValue
      }
    />
  );
};

export default BarChart;
