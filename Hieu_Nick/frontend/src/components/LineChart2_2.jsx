// import { ResponsiveLine } from "@nivo/line";
// import { Box, useTheme } from "@mui/material";
// import { tokens } from "../theme";
// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { useRoute } from "../routeContext";

// const LineChart2_2 = ({ isCustomLineColors = false, isDashboard = false }) => {
//   const location = useLocation();
//   const { route, setRoute } = useRoute();
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   //const { fetchApi, setFetchApi } = useState(false);

//   const [backendData, setBackendData] = useState([]);
//   useEffect(() => {
 
//     fetch(
//       "/line2_2", {
//       //url,{
//         mode: "no-cors",
//       }
//     ).then((response) =>
//       response.json().then((data) => {
//         const scaledData = data.data.map((item) => {
//           return {
//             ...item,
//             data: item.data.map((point) => {
//               return {
//                 ...point,
//                 y: (1+ point.y) * 25000,
//               };
//             }),
//           };
//         });
//         setBackendData(scaledData);
//         console.log("backendData API ", scaledData);
//       })
//     );
//   }, []);

//   const chartTheme = {
//     axis: {
//       domain: {
//         line: {
//           stroke: colors.light[100],
//         },
//       },
//       legend: {
//         text: {
//           fill: colors.light[100],
//         },
//       },
//       ticks: {
//         line: {
//           stroke: colors.light[100],
//         },
//         text: {
//           fill: colors.light[100],
//         },
//       },
//     },
//     legends: {
//       text: {
//         fill: colors.light[100],
//       },
//     },
//     tooltip: {
//       container: {
//         color: colors.main[500],
//       },
//     },
//   };

//   const chartColors = isDashboard ? { datum: "color" } : { scheme: "set2" };

//   return (
//     <>
//     <ResponsiveLine
//       data={backendData ? backendData : []}
//       theme={chartTheme}
//       colors={chartColors}
//       margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
//       xScale={{ type: "point" }}
//       yScale={{
//         type: "linear",
//         min: 5000, 
//         max: 60000,
//         stacked: false,
//         reverse: false,
//       }}
//       yFormat=" >-.2f"
//       curve="linear"
//       enableSlices="x"
//       enablePoints={false}
//       axisTop={null}
//       axisRight={null}
//       axisBottom={{
//         orient: "bottom",
//         tickSize: 0,
//         tickPadding: 5,
//         tickRotation: 0,
//         legendOffset: 36,
//         tickValues: ["2022-02-01", "2022-04-01","2022-06-01","2022-08-01"],
//         legendPosition: "middle",
//       }}
//       axisLeft={{
//         orient: "left",
//         tickValues: 5,
//         tickSize: 3,
//         tickPadding: 5,
//         tickRotation: 0,
//         legendOffset: -40,
        
//         legendPosition: "middle",
//       }}
      
    
//       enableGridX={false}
//       enableGridY={false}
//       pointSize={8}
//       pointColor={{ theme: "background" }}
//       pointBorderWidth={2}
//       pointBorderColor={{ from: "serieColor" }}
//       pointLabelYOffset={-12}
//       useMesh={true}
//       legends={[
//         {
//           anchor: "bottom-right",
//           direction: "column",
//           justify: false,
//           translateX: 100,
//           translateY: 0,
//           itemsSpacing: 0,
//           itemDirection: "left-to-right",
//           itemWidth: 80,
//           itemHeight: 20,
//           itemOpacity: 0.75,
//           symbolSize: 12,
//           symbolShape: "circle",
//           symbolBorderColor: "rgba(0, 0, 0, .5)",
//           effects: [
//             {
//               on: "hover",
//               style: {
//                 itemBackground: "rgba(0, 0, 0, .03)",
//                 itemOpacity: 1,
//               },
//             },
//           ],
//         },
//       ]}
//     />
//     <p style={{textAlign: "center", fontSize: "0.85em"}}>
//       Note: Average Twitter sentiment are scaled using the formula (Average sentiment+1) * 25000
//     </p>
//     </>
//   );
// };

// export default LineChart2_2;
import { ResponsiveLine } from "@nivo/line";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRoute } from "../routeContext";

const LineChart2_2 = ({ isCustomLineColors = false, isDashboard = false }) => {
  const location = useLocation();
  const { route, setRoute } = useRoute();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [backendData, setBackendData] = useState([]);
  useEffect(() => {
 
    fetch("/line2_2", {
      mode: "no-cors",
    })
    .then((response) => response.json())
    .then((data) => {
      const scaledData = data.data.map((item) => {
        if (item.id === 'Twitter sentiment') {
          return {
            ...item,
            data: item.data.map((point) => {
              return {
                ...point,
                y: (1+ point.y) * 25000,
              };
            }),
          };
        } else {
          return item;
        }
      });
      
      setBackendData(scaledData);
      console.log("backendData API ", scaledData);
    });
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
    <>
    <ResponsiveLine
      data={backendData ? backendData : []}
      theme={chartTheme}
      colors={chartColors}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: 5000, 
        max: 60000,
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="linear"
      enableSlices="x"
      enablePoints={false}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: 36,
        tickValues: ["2022-02-01", "2022-04-01","2022-06-01","2022-08-01"],
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: -40,
        
        legendPosition: "middle",
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
      Note: Average Twitter sentiment are scaled using the formula (Average sentiment+1) * 25000
    </p>
    </>
  );
};

export default LineChart2_2;
