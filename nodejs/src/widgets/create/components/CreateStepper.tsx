import React, { useEffect, useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CheckIcon from "@material-ui/icons/Check";
import SettingsIcon from "@material-ui/icons/Settings";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import DataObjectSampleTable from "./DataObjectSampleTable";
import TaskSelector from "./TaskSelector";
// import { taskType } from "../../../common/Constants";
import HyperGlobe from "../../common/HyperGlobe";
import Animated from "react-mount-animation";
import TrainingChart from "./TrainingChart";
import FileUploader from "./FileUploader";
import createExperiment from "../../../api/createExperiment";
import { taskType } from "../../../api/config";
import "./CreateStepper.scss";

// fetch("http://localhost:5500/autosklearn/139741141624576/history").then(response => (response.json())).then(json => console.dir(json))

const iconHeight = "32px";
const icons = [
  <CheckIcon height={iconHeight} />,
  <SettingsIcon height={iconHeight} />,
  <TrackChangesIcon height={iconHeight} />,
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "60%",
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

export default function CreateStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedCSV, setCSV] = useState<File>();
  const [selectedColumn, setSelectedColumn] = useState("");
  const [expName, setExpName] = useState("");
  const [task, setTask] = useState<taskType>("classification");
  const [sampleColumns, setSampleColumns] = useState<string[]>([]);
  const [sampleRows, setSampleRows] = useState<string[][]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [expId, setExpId] = useState("");
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
            {/*<DataObjectSelectTable
              doList={doList}
              selected={selected}
              setSelected={setSelected}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />*/}
            <FileUploader setCSV={setCSV} />
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
    const readCSV = async () => {
      const txt = await uploadedCSV?.text();
      if (!!txt) {
        const txtArr = txt.split("\n");
        const column = txtArr[0].split(",");
        const row = txtArr.slice(1, 5).map((t) => t.split(","));
        setSample(column, row);
      }
    };
    readCSV();
  }, [uploadedCSV]);

  useEffect(() => {
    const metric = "accuracy";
    const memory_limit = 3000;
    const training_time = 120;
    createExperiment(
      task,
      expName,
      training_time,
      memory_limit,
      metric,
      selectedColumn,
      uploadedCSV!
    ).then((response) => setExpId(response.id));
    //.then((history) => console.dir(history));
  }, [isTraining]);

  const stepper = (
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
                  {activeStep !== steps.length - 1 ? (
                    <Button
                      disabled={
                        //selectedId === "-1" ||
                        uploadedCSV === undefined ||
                        (activeStep === 1 &&
                          (selectedColumn === "" || expName === ""))
                      }
                      variant="contained"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      Next
                    </Button>
                  ) : null}
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
  );

  return (
    <>
      {activeStep + 1 >= 1 ? <HyperGlobe step={1} /> : null}
      {activeStep + 1 >= 2 ? <HyperGlobe step={2} /> : null}
      {activeStep + 1 >= 3 ? (
        <HyperGlobe step={3} setIsTraining={setIsTraining} />
      ) : null}
      <Animated.div
        show={!isTraining}
        unmountAnim={` 
            0% {opacity: 1}
            100% {opacity: 0}
        `} /*10% { transform: translate3d(0,20vh,0); }*/
      >
        {stepper}
      </Animated.div>

      <Animated.div
        id="training-chart"
        show={isTraining}
        delay={1.4}
        mountAnim={` 
            0% {opacity: 0}
            100% {opacity: 1}
        `}
        style={{ height: "75vh", width: "60vw" }}
      >
        <>
          <TrainingChart expId={expId} />
        </>
      </Animated.div>
    </>
  );
}
