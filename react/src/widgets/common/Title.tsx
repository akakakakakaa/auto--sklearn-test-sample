import React, { useEffect, useRef } from "react";
import Eye from "./Eye";
import TouchAppOutlinedIcon from "@material-ui/icons/TouchAppOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

export default function Title() {
  const eyeEl = useRef<HTMLDivElement>(null);
  const useStyles = makeStyles((theme) => ({
    container: {
      paddingTop: theme.spacing(3),
      paddingLeft: theme.spacing(3),
      paddingBottom: theme.spacing(2),
    },
    text: {
      color: theme.palette.text.primary,
      verticalAlign: "middle",
      display: "flex",
      fontFamily: "SDSamliphopangche_Outline",
      //marginLeft: 115,
    },
    icon: {
      fontSize: "inherit",
      verticalAlign: "middle",
      display: "inline-block",
      paddingRight: theme.spacing(1),
    },
    eye: {
      paddingRight: theme.spacing(3),
    },
  }));
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h1" className={classes.text}>
        {/*<TouchAppOutlinedIcon className={classes.icon} />*/}
        <Typography variant="caption" className={classes.eye}>
          <Eye />
        </Typography>
        Farseer.AI
      </Typography>
    </div>
  );
}
