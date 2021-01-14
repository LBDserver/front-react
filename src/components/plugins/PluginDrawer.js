import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import {Button} from "@material-ui/core"
import useStyles from "@styles";

export default function MiniDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        className={classes.miniDrawer}
        classes={{ paper: classes.miniDrawerPaper }}
      >
        <div className={classes.toolbar}></div>
        <Divider />
        {["1"].map((text, index) => (
          <Button
            color="primary"
            startIcon={<InboxIcon style={{width: 30, height: 30, marginLeft: 20}} fontSize="large" />}
            style={{ marginLeft: -10}}
          />
        ))}
        <Divider />
      </Drawer>
    </div>
  );
}
