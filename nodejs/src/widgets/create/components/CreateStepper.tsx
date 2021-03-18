import React, { useEffect, useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CheckIcon from "@material-ui/icons/Check";
import SettingsIcon from "@material-ui/icons/Settings";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import DataObjectSelectTable from "./DataObjectSelectTable";
import DataObjectSampleTable from "./DataObjectSampleTable";
import TaskSelector from "./TaskSelector";
import { taskType } from "../../../common/Constants";
import HyperGlobe from "../../common/HyperGlobe";
//import { useHistory } from "react-router-dom";

const iconHeight = "32px";
const icons = [
  <CheckIcon height={iconHeight} />,
  <SettingsIcon height={iconHeight} />,
  <TrackChangesIcon height={iconHeight} />,
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "50%",
      "& div": {
        backgroundColor: "transparent",
      },
    },
    button: {
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
    indicatorText: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(3),
    },
  })
);

interface Data {
  id: string;
  dataObject: string;
  dataType: string;
  author: string;
  dataSource: string;
  createdOn: string;
  lastModified: string;
}

function createData(
  id: string,
  dataObject: string,
  dataType: string,
  author: string,
  dataSource: string,
  createdOn: string,
  lastModified: string
): Data {
  return {
    id,
    dataObject,
    dataType,
    author,
    dataSource,
    createdOn,
    lastModified,
  };
}

const taskMap = {
  0: "regression",
  1: "classification",
  4: "timeseires",
};

export default function CreateStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]); // DataObject Name
  const [selectedId, setSelectedId] = useState("-1"); // DataObject ID
  const [selectedColumn, setSelectedColumn] = useState("");
  const [expName, setExpName] = useState("");
  const [task, setTask] = useState<taskType>("classification");
  //const history = useHistory();
  const [doList, setDoList] = useState<Data[]>([]);
  const [sampleColumns, setSampleColumns] = useState<string[]>([]);
  const [sampleRows, setSampleRows] = useState<string[][]>([]);
  const [numUniqueVal, setNumUniqueVal] = useState(-1);

  const setSample = (c: string[], r: string[][]) => {
    setSampleColumns(c);
    setSampleRows(r);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //if (activeStep === steps.length - 1)
    //  createExperiment(expName, selectedColumn, task, selectedId);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //const handleHome = () => {
  //  history.push("/experiments");
  //};

  const stepIds = Array(3)
    .fill(0)
    .map((_, id) => id);
  function getSteps() {
    return ["데이터 준비", "실험 구성", "목적 선택"];
  }
  const steps = getSteps();

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <>
            <Typography className={classes.indicatorText}>
              학습할 데이터를 선택해주십시오.
            </Typography>
            <DataObjectSelectTable
              doList={doList}
              selected={selected}
              setSelected={setSelected}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          </>
        );
      case 1:
        return (
          <>
            <Typography className={classes.indicatorText}>
              선택한 데이터를 확인하시고, 대상 열과 실험 이름을 입력해주십시오.
            </Typography>
            <DataObjectSampleTable
              columns={sampleColumns}
              rows={sampleRows}
              selectedColumn={selectedColumn}
              setSelectedColumn={setSelectedColumn}
              setExpName={setExpName}
              expName={expName}
            />
          </>
        );
      case 2:
        return (
          <>
            <Typography className={classes.indicatorText}>
              학습의 목적을 선택해주십시오.
            </Typography>
            <TaskSelector task={task} setTask={setTask} />
          </>
        );
      default:
        return "Unknown step";
    }
  }

  useEffect(() => {
    /*getDataObjects()
      .then((data) =>
        data.map(
          (
            row: {
              id: string;
              name: string;
              type: string;
              author: string;
              source: string;
              created_on: string;
              last_edited: string;
            },
            index: number
          ) =>
            createData(
              row.id,
              row.name,
              row.type,
              row.author,
              row.source,
              row.created_on,
              row.last_edited
            )
        )
      )
      .then((DOs: Data[]) => setDoList(DOs));*/
    setDoList([
      createData(
        "1",
        "테스트 데이터 1",
        "File",
        "Simulacre7",
        "test1.csv",
        "1994.02.21 23:59:59",
        "2100.12.25 23:59:59"
      ),
      createData(
        "2",
        "테스트 데이터 2",
        "File",
        "Simulacre7",
        "test1.csv",
        "2222.02.21 23:59:59",
        "3333.12.25 23:59:59"
      ),
      createData(
        "3",
        "테스트 데이터 3",
        "File",
        "Simulacre7",
        "test3.csv",
        "4444.02.21 23:59:59",
        "5555.12.25 23:59:59"
      ),
      createData(
        "4",
        "테스트 데이터 4",
        "File",
        "Simulacre7",
        "test4.csv",
        "4444.02.21 23:59:59",
        "5555.12.25 23:59:59"
      ),
      createData(
        "5",
        "테스트 데이터 5",
        "File",
        "Simulacre7",
        "test5.csv",
        "4444.02.21 23:59:59",
        "5555.12.25 23:59:59"
      ),
      createData(
        "6",
        "테스트 데이터 6",
        "File",
        "Simulacre7",
        "test6.csv",
        "4444.02.21 23:59:59",
        "5555.12.25 23:59:59"
      ),
      createData(
        "7",
        "테스트 데이터 7",
        "File",
        "Simulacre7",
        "test7.csv",
        "4444.02.21 23:59:59",
        "5555.12.25 23:59:59"
      ),
    ]);
  }, []);

  useEffect(() => {
    /*if (selectedId !== "-1") {
      getDataObjectSample(selectedId).then((data) =>
        setSample(data.columns, data.rows)
      );
    }*/
    setSample(
      ["col 1", "col 2", "col 3", "col 4", "col 5"],
      [
        [selectedId, selectedId, selectedId, selectedId, selectedId],
        ["0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0"],
      ]
    );
  }, [selectedId]);

  /*useEffect(() => {
    getRecommendedTask(selectedId, selectedColumn).then((data) => {
      setTask(taskMap[data.task_type]);
      setNumUniqueVal(data.num_unique_val);
    });
  }, [selectedColumn]);*/

  return (
    <>
      {activeStep + 1 >= 1 ? <HyperGlobe step={1} /> : null}
      {activeStep + 1 >= 2 ? <HyperGlobe step={2} /> : null}
      {activeStep + 1 >= 3 ? <HyperGlobe step={3} /> : null}
      <div className={classes.root}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {stepIds.map((index) => (
            <Step key={index}>
              <StepLabel icon={icons[index]}>
                <Typography variant="h6">{steps[index]}</Typography>
              </StepLabel>
              <StepContent>
                <Typography>{getStepContent(index)}</Typography>
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      disabled={
                        selectedId === "-1" ||
                        (activeStep === 1 &&
                          (selectedColumn === "" || expName === ""))
                      }
                      variant="contained"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            {/*<Typography>{`${selectedId} ${selectedColumn} ${expName} ${task} ${getTaskCode(
            task
          )}`}</Typography>*/}
            <Typography>AutoML 실험이 시작됩니다.</Typography>
            <Typography>학습에는 상당 시간이 소요될 수 있습니다.</Typography>
            {/*<Button onClick={handleReset} className={classes.button}>
            Reset
        </Button>*/}
            <Button
              variant="contained"
              //onClick={handleHome}
              className={classes.button}
            >
              Home
            </Button>
          </Paper>
        )}
      </div>
    </>
  );
}
