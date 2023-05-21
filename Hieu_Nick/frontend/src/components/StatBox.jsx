import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

//formating to thousands
// const formattedTitle = (num) => {
//   if (num >= 1000000) {
//     const formattedNum = (num / 1000000).toFixed(0);
//     return `${formattedNum} M`;
//   }
//   return num.toString();
// };
const StatBox = ({ title, title2, subtitle, icon }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const formattedTitle = title.toLocaleString();
  //const formattedTitle = title.toFixed(2);

 
  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.light[100] }}
          >
            {/* {formattedTitle(title)} */}
            {formattedTitle}
            {title2}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" sx={{ color: colors.green[500] }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
