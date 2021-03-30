import React from "react";
import Title from "../common/Title";
import Dial from "../common/Dial";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginLeft: theme.spacing(3),
    },
  })
);
export default function ListContainer() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Title />
      <Dial />
    </div>
  );
}
