import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

export default function Title() {
  const useStyles = makeStyles((theme) => ({
    btn: {
      color: theme.palette.text.primary,
      paddingTop: theme.spacing(3),
      paddingLeft: theme.spacing(6),
    },
  }));
  const classes = useStyles();
  return (
    <Typography variant="h1" className={classes.btn}>
      AutoML
    </Typography>
  );
}
