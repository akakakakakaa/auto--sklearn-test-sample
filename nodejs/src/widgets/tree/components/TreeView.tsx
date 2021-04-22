import React, { useEffect, useState } from "react";
import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import {
  fade,
  makeStyles,
  withStyles,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem, { TreeItemProps } from "@material-ui/lab/TreeItem";
import Collapse from "@material-ui/core/Collapse";
import { useSpring, animated } from "react-spring";
import { TransitionProps } from "@material-ui/core/transitions";
import TreeviewSearchField from "./TreeviewSearchField";
import FolderIcon from "@material-ui/icons/Folder";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import Typography from "@material-ui/core/Typography";
import AppsIcon from "@material-ui/icons/Apps";
import BarChartIcon from "@material-ui/icons/BarChart";
import {
  green,
  teal,
  purple,
  amber,
  deepOrange,
} from "@material-ui/core/colors";
import { treeClickState } from "../treeClickState";
import getWorkflow from "../../../api/oldServer/getWorkflow";

function MinusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props: SvgIconProps) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    from: { opacity: 0, transform: "translate3d(20px,0,0)" },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style as any}>
      <Collapse {...props} />
    </animated.div>
  );
}

const StyledTreeItem = withStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      "& .close": {
        opacity: 0.3,
      },
    },
    group: {
      marginLeft: 7,
      paddingLeft: 18,
      borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
  })
)((props: TreeItemProps) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
));

const useStyles = makeStyles(
  createStyles({
    root: {
      maxHeight: "90vh",
      flexGrow: 1,
      maxWidth: "20vw",
      color: "#e0e0e0",
    },
  })
);

type modelType = {
  id: number;
  name: string;
  status: string;
  created_on: string;
  finished_time: string;
};

type expType = {
  id: number;
  name: string;
  type: string;
  date: string;
  workflows: Array<workflowType>;
};

type workflowType = {
  created_on: string;
  do_id: number;
  do_name: string;
  finished_time: string;
  id: number;
  name: string;
  serve_status: string;
  status: string;
};

function ExpLeaf(props: {
  exp: expType;
  setSelected: React.Dispatch<React.SetStateAction<treeClickState>>;
  searchText: string;
  folderType: string;
}) {
  const { id, name, type, date, workflows } = props.exp;
  const [models, setModels] = useState<expType[]>([]);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    workflows.map((workflow) =>
      getWorkflow(type, id, workflow.id).then((d) =>
        setModels(models.concat(d.models))
      )
    );
  }, []);

  useEffect(() => {
    setHidden(true);
    if (props.searchText.length === 0) setHidden(false);
    else if (name.includes(props.searchText)) {
      setHidden(false);
    } else {
      for (let model of models) {
        if (model.name.includes(props.searchText)) {
          setHidden(false);
          return;
        }
      }

      for (
        let workflowIndex = 1;
        workflowIndex <= workflows.length;
        workflowIndex++
      ) {
        if (`version-${workflowIndex}.0`.includes(props.searchText)) {
          setHidden(false);
          return;
        }
      }
    }
  }, [props]);

  if (type !== props.folderType) return null;

  if (props.folderType === "mllab" && !hidden)
    return (
      <StyledTreeItem
        nodeId={`test-mllab-${id}`}
        label={`test-mllab-${id}`}
        onClick={() =>
          props.setSelected({
            expId: -1,
            modelId: -1,
            type: "mllab",
            view: "mllab",
          })
        }
      />
    );
  else if (props.folderType === "predefinedai" && !hidden)
    return (
      <StyledTreeItem
        nodeId={`predefinedai-${id}`}
        label={`test-predefinedai-${id}`}
        onClick={() =>
          props.setSelected({
            expId: -1,
            modelId: -1,
            type: "predefinedai",
            view: "predefinedai",
          })
        }
      />
    );
  else if (props.folderType === "automl" && !hidden) {
    return (
      <StyledTreeItem
        nodeId={`exp-${id}-${type}`}
        label={`[${type}] ${name}`}
        onClick={() =>
          props.setSelected({
            expId: id,
            modelId: -1,
            type: type,
            view: "experiment",
          })
        }
      >
        {workflows.map((workflow, index) => (
          <StyledTreeItem
            nodeId={`exp-${id}-${type}-${index + 1}-versions`}
            label={`version-${index + 1}.0`}
            onClick={() =>
              props.setSelected({
                expId: -1,
                modelId: -1,
                type: "",
                view: "",
              })
            }
          >
            <TreeItem
              nodeId={`exp-${id}-${type}-${index + 1}-versions-summary`}
              label={`summary`}
              onClick={() =>
                props.setSelected({
                  expId: id,
                  modelId: -1,
                  type: type,
                  view: "version",
                })
              }
            ></TreeItem>
            {models.map((model) => (
              <StyledTreeItem
                nodeId={`version-${id}-${type}-${index + 1}-${model.name}`}
                label={`${model.name}-version-v${index + 1}.0`}
                onClick={() =>
                  props.setSelected({
                    expId: -1,
                    modelId: -1,
                    type: "",
                    view: "",
                  })
                }
              >
                <TreeItem
                  nodeId={`confusionmatrix-${id}-${type}-${index + 1}-${
                    model.name
                  }`}
                  label={`confusion matrix`}
                  onClick={() =>
                    props.setSelected({
                      expId: id,
                      modelId: model.id,
                      type: type,
                      view: "confusionmatrix",
                    })
                  }
                  icon={<AppsIcon style={{ color: deepOrange[300] }} />}
                />
                <TreeItem
                  nodeId={`featureimportance-${id}-${type}-${index + 1}-${
                    model.name
                  }`}
                  label={`featrue importance`}
                  onClick={() =>
                    props.setSelected({
                      expId: id,
                      modelId: model.id,
                      type: type,
                      view: "featureimportance",
                    })
                  }
                  icon={<BarChartIcon style={{ color: teal[300] }} />}
                />
                <TreeItem
                  nodeId={`serving-${id}-${type}-${index + 1}-${model.name}`}
                  label={`serving`}
                  onClick={() =>
                    props.setSelected({
                      expId: id,
                      modelId: model.id,
                      type: type,
                      view: "serving",
                    })
                  }
                  icon={<BarChartIcon style={{ color: amber[600] }} />}
                />
              </StyledTreeItem>
            ))}
          </StyledTreeItem>
        ))}
      </StyledTreeItem>
    );
  } else {
    return null;
  }
}

export default function CustomizedTreeView(props: {
  setSelected: React.Dispatch<React.SetStateAction<treeClickState>>;
  expList: never[];
}) {
  const classes = useStyles();
  const [searchText, setSearchText] = useState("");

  return (
    <div style={{ display: "inline-block" }}>
      <TreeviewSearchField setSearchText={setSearchText} />
      <TreeView
        className={classes.root}
        defaultExpanded={["exp-1", "exp-1-1-versions"]}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}
      >
        <TreeItem
          nodeId="AutoML"
          collapseIcon={<FolderIcon style={{ color: "#94d6c5" }} />}
          expandIcon={<FolderOpenIcon style={{ color: "#94d6c5" }} />}
          endIcon={<FolderIcon style={{ color: "#94d6c5" }} />}
          label={<Typography variant="body2">AutoML</Typography>}
        >
          {props.expList.map((exp: any) => (
            <ExpLeaf
              exp={exp}
              setSelected={props.setSelected}
              searchText={searchText}
              folderType="automl"
            />
          ))}
        </TreeItem>

        <TreeItem
          nodeId="ML lab"
          collapseIcon={<FolderIcon style={{ color: "#FFD700" }} />}
          expandIcon={<FolderOpenIcon style={{ color: "#FFD700" }} />}
          endIcon={<FolderIcon style={{ color: "#FFD700" }} />}
          label={<Typography variant="body2">ML lab</Typography>}
        >
          {props.expList.map((exp: any) => (
            <ExpLeaf
              exp={exp}
              setSelected={props.setSelected}
              searchText={searchText}
              folderType="mllab"
            />
          ))}
        </TreeItem>

        <TreeItem
          nodeId="Predefined AI"
          collapseIcon={<FolderIcon style={{ color: "#FF8C00" }} />}
          expandIcon={<FolderOpenIcon style={{ color: "#FF8C00" }} />}
          endIcon={<FolderIcon style={{ color: "#FF8C00" }} />}
          label={<Typography variant="body2">Predefined AI</Typography>}
        >
          {props.expList.map((exp: any) => (
            <ExpLeaf
              exp={exp}
              setSelected={props.setSelected}
              searchText={searchText}
              folderType="predefinedai"
            />
          ))}
        </TreeItem>
      </TreeView>
    </div>
  );
}
