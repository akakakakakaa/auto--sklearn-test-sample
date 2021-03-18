import React from "react";
import TouchAppOutlinedIcon from "@material-ui/icons/TouchAppOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

export default function Title() {
  const useStyles = makeStyles((theme) => ({
    container: {
      paddingTop: theme.spacing(3),
      paddingLeft: theme.spacing(3),
      paddingBottom: theme.spacing(2),
    },
    text: {
      color: theme.palette.text.primary,
      verticalAlign: "middle",
      display: "inline-block",
      fontFamily: "SDSamliphopangche_Outline",
      borderBottom: "3px solid white",
    },
    icon: {
      fontSize: "inherit",
      verticalAlign: "middle",
      display: "inline-block",
      paddingRight: theme.spacing(1),
    },
  }));
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography variant="h1" className={classes.text}>
        <TouchAppOutlinedIcon className={classes.icon} />
        Touch.AI&nbsp;&nbsp;
      </Typography>
    </div>
  );
}
