import { useTheme } from "@mui/material";
import { ResponsiveBar  } from "@nivo/bar";
import { tokens } from "../theme";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRoute } from "../routeContext";

const BarChart1_1 = ({ isDashboard = false }) => {
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [backendData, setBackendData] = useState([]);
  useEffect(() => {
    fetch("/bar1_1", {
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
      //keys={["am","ar","art","bg","bn","ca","ckb","cs","cy","da","de","el","es","et","eu","fa","fi","fr","gu","hi","ht","hu","hy","in","is","it","iw","ja","ka","kn","ko","lt","lv","ml","mr","my","ne","nl","no","pa","pl","ps","pt","qam","qct","qht","qme","qst","ro","ru","sd","si","sl","sr","sv","ta","te","th","tl","tr","uk","ur","vi","zh","zxx","aa","af","ak","am","ar","art","ast","be","bg","bn","br","bs","ca","cs","cy","da","de","el","en","en-gb","en-us","enMo","eo","es","et","eu","fa","fi","fo","fr","fy","ga","gd","gl","ha","he","hi","hr","ht","hu","hy","id","ig","in","is","it","ja","jv","kk","km","ko","ky","la","lb","lfn","lt","lv","mg","mi","mk","mn","mr","ms","mt","nb","ne","nl","nn","no","ny","oc","pl","pt","pt-br","ptPt","qht","qme","qst","ro","ru","sco","sd","sk","sl","sm","sn","so","sq","sr","st","startrek_it","su","sv","sw","ta","th","tl","tok","tr","uk","und","vi","xh","yo","zh","zh-cn","zhCn","zhTw","zu","zxx"]}
      keys={['Twitter','MA']}
      indexBy="Language"
      margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
      padding={0.3}
      height={450}
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
        tickPadding: 20,
        tickRotation: 0,
        tickRotation: 270,
        legend: isDashboard ? undefined : "Language Used", 
        legendPosition: "middle",
        legendOffset: 45,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        
        legend: isDashboard ? undefined : "Number of Uses", 
        legendPosition: "middle",
        legendOffset: -55,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor="#737373"
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right", 
          direction: "row",
          //direction: "column"
          justify: false,
          translateX: 0, 
          translateY: 100, 
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

export default BarChart1_1;
