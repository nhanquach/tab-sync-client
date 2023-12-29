import React, { useState } from "react";

import {
  KeyTwoTone,
  ExitToAppTwoTone,
  CloseTwoTone,
} from "@mui/icons-material";
import {
  Tooltip,
  IconButton,
  Avatar,
  CircularProgress,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  Slide,
  useMediaQuery,
} from "@mui/material";
import { User } from "@supabase/supabase-js";

import { TransitionProps } from "@mui/material/transitions";
import ChangePasswordForm from "./ChangePasswordForm";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IAccountSettingsProps {
  user?: User;
  onSignOut: () => void;
}

const AccountSettings: React.FC<IAccountSettingsProps> = ({
  user,
  onSignOut,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = React.useState(false);
  const [isLogingOut, setIsLogingOut] = useState(false);
  const [accountSettingsAchorEl, setAccountSettingsAnchorEl] =
    useState<null | HTMLElement>(null);

  const openProfile = Boolean(accountSettingsAchorEl);
  const handleOpenAccountSettings = (event: React.MouseEvent<HTMLElement>) => {
    setAccountSettingsAnchorEl(event.currentTarget);
  };
  const handleCloseAccountSettings = () => {
    setAccountSettingsAnchorEl(null);
  };

  const firstChar = user?.email?.charAt(0);

  const handleOpenChangePasswordDialog = () => {
    setOpen(true);
  };

  const handleCloseChangePasswordDialog = () => {
    setOpen(false);
  };

  const handleLogOut = () => {
    setIsLogingOut(true);

    setTimeout(() => {
      onSignOut();
    }, 500);
  };

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton onClick={handleOpenAccountSettings}>
          <Avatar
            variant={openProfile ? "square" : "circular"}
            sx={{
              bgcolor: theme.palette.primary.main,
            }}
          >
            {isLogingOut ? (
              <CircularProgress sx={{ color: "white" }} size={20} />
            ) : (
              firstChar
            )}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={accountSettingsAchorEl}
        id="account-menu"
        open={openProfile}
        onClick={handleCloseAccountSettings}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleOpenChangePasswordDialog}>
          {!isLogingOut && <KeyTwoTone />}
          <Typography
            ml={2}
            sx={{
              display: { xs: "none", md: "inline" },
            }}
          >
            Change password
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleLogOut}>
          <ExitToAppTwoTone />
          <Typography
            ml={2}
            sx={{
              display: { xs: "none", md: "inline" },
            }}
          >
            Sign out
          </Typography>
        </MenuItem>
      </Menu>

      <Dialog
        fullScreen={fullScreen}
        fullWidth
        open={open}
        onClose={handleCloseChangePasswordDialog}
        TransitionComponent={Transition}
        sx={{
          backdropFilter: "blur(8px)",
          backgroundColor: "transparent",
        }}
        className="change-password-dialog"
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <KeyTwoTone sx={{ color: theme.palette.primary.main, mr: 1 }} />
          Change password
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseChangePasswordDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseTwoTone />
        </IconButton>

        <ChangePasswordForm
          handleCloseChangePasswordDialog={handleCloseChangePasswordDialog}
        />

        {/* <DialogActions>
          <Button onClick={handleCloseChangePasswordDialog}>Close</Button>

          <Button
            variant="contained"
            // fullWidth
            onClick={() => {}}
            //   disabled={}
          >
            Change password
            {isLoading ? <CircularProgress size={20} /> : "Change password"}
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
};

export default AccountSettings;