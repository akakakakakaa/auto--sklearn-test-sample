import React from "react";
import FingerprintIcon from "@material-ui/icons/Fingerprint";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

export default function Title() {
  const useStyles = makeStyles((theme) => ({
    container: {
      paddingTop: theme.spacing(3),
      paddingLeft: theme.spacing(3),
    },
    text: {
      color: theme.palette.text.primary,
      verticalAlign: "middle",
      display: "inline-block",
      fontFamily: "SDSamliphopangche_Outline",
    },
    icon: {
      fontSize: "inherit",
      verticalAlign: "middle",
      display: "inline-block",
    },
  }));
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography variant="h1" className={classes.text}>
        <FingerprintIcon className={classes.icon} />
        AutoML
      </Typography>
    </div>
  );
}
