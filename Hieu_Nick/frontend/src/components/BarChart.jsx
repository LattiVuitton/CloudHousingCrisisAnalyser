import { useTheme } from "@mui/material";
import { ResponsiveBar  } from "@nivo/bar";
import { tokens } from "../theme";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRoute } from "../routeContext";

const BarChart = ({ isDashboard = false }) => {
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [backendData, setBackendData] = useState([]);
  useEffect(() => {
    fetch("/bar", {
      mode: "no-cors",
    }).then(
      //data
      (response) =>
        response.json().then((data) => {
          console.log(data.data);
          setBackendData(data.data);
        })
    );
  }, []);


  return (
    <ResponsiveBar
      //data={data}
      data={backendData ? backendData : []}
      theme={{
        // added
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
              fill: colors.light[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.light[100],
          },
        },
      }}
      keys={["Sentiment"]}
      indexBy="Platform/Country"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
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
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        
        legend: isDashboard ? undefined : "Average sentiment", 
        legendPosition: "middle",
        legendOffset: -45,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor="#737373"
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      barAriaLabel={function (e) {
        return e.id + ": " + e.formattedValue + " in country: " + e.indexValue;
      }}
    />
  );
};

export default BarChart;
