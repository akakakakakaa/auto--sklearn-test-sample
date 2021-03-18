import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import CreateStepper from "./components/CreateStepper";
import Title from "../common/Title";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginLeft: theme.spacing(3),
    },
  })
);

export default function CreateContainer() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Title />
      <CreateStepper />
    </div>
  );
}
