import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
      light: {
          100: "#eeecec",
          200: "#dcdad8",
          300: "#cbc7c5",
          400: "#b9b5b1",
          500: "#a8a29e",
          600: "#86827e",
          700: "#65615f",
          800: "#43413f",
          900: "#222020"
      },
      main: {
          100: "#ccd6d1",
          200: "#9aada3",
          300: "#678576",
          400: "#355c48",
          500: "#02331a",
          600: "#022915",
          700: "#011f10",
          800: "#01140a",
          900: "#000a05"
},
green: {
    100: "#dbf8e6",
    200: "#b7f2cc",
    300: "#92ebb3",
    400: "#6ee599",
    500: "#4ade80",
    600: "#3bb266",
    700: "#2c854d",
    800: "#1e5933",
    900: "#0f2c1a"
},
red: {
    100: "#f1d2d2",
    200: "#e3a4a4",
    300: "#d57777",
    400: "#c74949",
    500: "#b91c1c",
    600: "#941616",
    700: "#6f1111",
    800: "#4a0b0b",
    900: "#250606"
},
indigo: {
    100: "#d3e0fb",
    200: "#a8c1f7",
    300: "#7ca1f3",
    400: "#5182ef",
    500: "#2563eb",
    600: "#1e4fbc",
    700: "#163b8d",
    800: "#0f285e",
    900: "#07142f"
},
      }
    : {}),
  });

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            main: {
              main: colors.main[500],
            },
            secondary: {
              main: colors.green[500],
            },
            neutral: {
              dark: colors.light[700],
              main: colors.light[500],
              light: colors.light[100],
            },
            background: {
              dark: colors.main[500],
            },
          }
        : {}),
    },
    typography: {
      fontFamily: ["Montserrat", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Montserrat", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Montserrat", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Montserrat", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Montserrat", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Montserrat", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Montserrat", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// context for color mode
// export const ColorModeContext = createContext({
//   toggleColorMode: () => {},
// });

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "dark" )),
    }),
    []
  );
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
