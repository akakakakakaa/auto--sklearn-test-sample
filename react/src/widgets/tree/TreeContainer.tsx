import React, { useState, useEffect } from "react";
import Title from "../common/Title";
import Dial from "../common/Dial";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import TreeView from "./components/TreeView";
import { treeClickState } from "./treeClickState";
import getExperiments from "../../api/oldServer/getExperiments";
import PageVeiw from "./page/PageView";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginLeft: theme.spacing(3),
    },
  })
);
export default function ListContainer() {
  const classes = useStyles();
  const [selected, setSelected] = useState<treeClickState>({
    expId: -1,
    modelId: -1,
    type: "",
    view: "",
  });
  const [expList, setExpList] = useState([]);
  useEffect(() => {
    getExperiments().then((data) => setExpList(data));
  }, []);

  return (
    <div className={classes.container}>
      <Title />
      <TreeView expList={expList} setSelected={setSelected} />
      <PageVeiw selected={selected} />
      <Dial />
    </div>
  );
}
