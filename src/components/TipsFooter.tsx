import React from "react";

import { LightbulbTwoTone } from "@mui/icons-material";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ITtipsFooterProps {
  // isOpenTabsView: boolean;
}

const TipsFooter: React.FC<ITtipsFooterProps> = () => {
  const theme = useTheme();
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <Box
      sx={{ textAlign: "center", my: 4, p: 2 }}
      bgcolor={isDarkMode ? theme.palette.grey[800] : theme.palette.grey[200]}
      borderRadius={2}
    >
      <LightbulbTwoTone fontSize="large" color="primary" />

      <Typography>
        We only sync <strong>Your tabs</strong>
      </Typography>
      <Typography>
        We do not sync or store any or your sensitive information such as
        Cookies, Session or Login Credentials.
      </Typography>
      <Typography sx={{ mt: 1, fontSize: "0.875rem", opacity: 0.8 }}>
        <strong>Free Tier Limit:</strong> The most recent 200 Open and 200 Archived tabs are synced.
      </Typography>
    </Box>
  );
};

export default TipsFooter;
