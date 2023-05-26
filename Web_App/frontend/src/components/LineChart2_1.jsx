import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";

const LineChart2_1 = () => {
  const theme = useTheme();

  const [backendData, setBackendData] = useState([]);

  useEffect(() => {
    fetch("/line2_1", { mode: "no-cors" })
      .then((response) => response.json())
      .then((data) => {
        const scaledData = data.data.map((item) => {
          if (item.id === 'Twitter sentiment') {
            return {
              ...item,
              data: item.data.map((point) => ({
                ...point,
                y: (1 + point.y) * 7000,
              })),
            };
          } else {
            return item;
          }
        });
        setBackendData(scaledData);
      });
  }, []);

  const chartTheme = {
    axis: {
      domain: {
        line: {
          stroke: theme.palette.text.primary,
        },
      },
      legend: {
        text: {
          fill: theme.palette.text.primary,
        },
      },
      ticks: {
        line: {
          stroke: theme.palette.text.primary,
        },
        text: {
          fill: theme.palette.text.primary,
        },
      },
    },
    legends: {
      text: {
        fill: theme.palette.text.primary,
      },
    },
    tooltip: {
      container: {
        color: theme.palette.text.primary,
        background: theme.palette.background.default,
      },
    },
  };

  return (
    <>
    <ResponsiveLine
      data={backendData ? backendData : []}
      theme={chartTheme}
      colors={{ scheme: "set2" }}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ 
        type: "time", 
        format: "%Y-%m-%d", 
        useUTC: false, 
        precision: "day" 
    }}
    
      yScale={{
        type: "linear",
        min: 5800, 
        max: 8200, 
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="linear"
      axisTop={null}
      axisRight={null}
      enableSlices="x"
      enablePoints={false}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Dates",
        legendOffset: 36,
        legendPosition: "middle",
        tickValues: ["2022-02-01", "2022-04-01","2022-06-01","2022-08-01"],
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Values",
        legendOffset: -40,
        legendPosition: "middle",
        tickValues: [6000, 6500, 7000, 7500, 8000],
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
    <p style={{textAlign: "center", fontSize: "0.85em"}}>
      Note: Average Twitter sentiment is scaled using the formula (Average sentiment+1) * 7000
    </p>
    </>
  );
};

export default LineChart2_1;
