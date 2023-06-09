import { ResponsiveLine } from "@nivo/line";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRoute } from "../routeContext";

const LineChart3_1 = ({ isCustomLineColors = false, isDashboard = false }) => {
  const location = useLocation();
  const { route, setRoute } = useRoute();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  //const { fetchApi, setFetchApi } = useState(false);

  const [backendData, setBackendData] = useState([]);
  useEffect(() => {
    // console.log("route in Line 0", route);
    // let url = "/line";
    // if (route === "Time Series") {
    //   console.log("route in Line1 ", route);
    //   url = "/line";
    //   //setFetchApi(false);
    // } else if (route === "Time Series 2.1") {
    //   console.log("route in Line 2", route);
    //   url = "/line2_1";
    //   //setFetchApi(false);
    // } else if (route === "Time Series 2.2") {
    //   console.log("route in Line 3", route);
    //   url = "/line2_2";
    //   //setFetchApi(false);
    // } else if (route === "Time Series 3.1") {
    //   console.log("route in Line 4", route);
    //   url = "/line3_1";
    //   //setFetchApi(false);
    // } else if (route === "Time Series 3.2") {
    //   console.log("route in Line ", route);
    //   url = "/line3_2";
    //   //setFetchApi(false);
    // }
    //console.log("route in Line final", url);

    fetch("/line3_1", {
      mode: "no-cors",
    }).then(
      //data
      (response) =>
        response.json().then((data) => {
          console.log(data.data);
          setBackendData(data.data);
          console.log("backendData API ", backendData);
        })
    );
    
  }, []);

  const chartTheme = {
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
    tooltip: {
      container: {
        color: colors.main[500],
      },
    },
  };

  const chartColors = isDashboard ? { datum: "color" } : { scheme: "set2" };

  return (
    <ResponsiveLine
      //data={interestData}
      data={backendData ? backendData : []}
      theme={chartTheme}
      colors={chartColors}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="step"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: 36,
        legendPosition: "middle",
        tickValues: ["02/2022","03/2022","04/2022","05/2022","06/2022","07/2022","08/2022","09/2022","10/2022"]
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        //legend: isDashboard ? undefined : "Used languages",
        legendOffset: -40,
        legendPosition: "middle",
        tickValues:[2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5]
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
  );
};

export default LineChart3_1;

