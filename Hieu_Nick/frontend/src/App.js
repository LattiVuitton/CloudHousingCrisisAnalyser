import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Dashboard2 from "./scenes/dashboard2";
import Dashboard3 from "./scenes/dashboard3";
import Bar from "./scenes/bar";
import Bar1_1 from "./scenes/bar1_1";
import Bar1_2 from "./scenes/bar1_2";
import Line from "./scenes/line";
import Line2_1 from "./scenes/line2_1";
import Line2_2 from "./scenes/line2_2";
import Line3_1 from "./scenes/line3_1";
import Geography from "./scenes/geography";
import Geography1_2 from "./scenes/geography1_2";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMode } from "./theme";
import { RouteProvider } from "./routeContext";

function App() {
  //   //fetching backend api
  //   const [backendData, setBackendData] = useState([null]);
  //   useEffect(() => {
  //     fetch("/data",{
  //       mode: 'no-cors',
  //     }).then(
  //       //data
  //       (response) => response.json()
  //       .then((data) => {setBackendData(data)})
  //     );
  //   }, [])

  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <RouteProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/2" element={<Dashboard2 />} />
              <Route path="/3" element={<Dashboard3 />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/bar1_1" element={<Bar1_1 />} />
              <Route path="/bar1_2" element={<Bar1_2 />} />
              <Route path="/line" element={<Line />} />
              <Route path="/line2_1" element={<Line2_1 />} />
              <Route path="/line2_2" element={<Line2_2 />} />
              <Route path="/line3_1" element={<Line3_1 />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/geography1_2" element={<Geography1_2 />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </RouteProvider>
  );
}

export default App;
