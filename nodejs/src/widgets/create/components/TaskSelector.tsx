import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
//import classificationIcon from "../../../images/classification.svg";
//import regressionIcon from "../../../images/regression.svg";
//import classificationSelectedIcon from "../../../images/classificationSelected.svg";
//import regressionSelectedIcon from "../../../images/regressionSelected.svg";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import { taskType } from "../../../common/Constants";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    icon: {
      width: "15%",
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(5),
    },
    card: {
      margin: theme.spacing(2),
      width: "37%",
      "& button": {
        display: "flex",
        justifyContent: "end",
        padding: theme.spacing(2),
        height: "100%",
      },
    },
    title: { paddingBottom: theme.spacing(1) },
    description: { whiteSpace: "pre-wrap" },
    divider: { marginBottom: theme.spacing(1) },
    bgSelected: {
      background: "#60c2a9 !important",
      color: "#0a0c11 !important",
    },
    bg: { background: "#283040 !important" },
  })
);

const taskList: taskType[] = ["classification", "regression", "timeseries"];

export default function TaskSelector(props: {
  task: taskType;
  setTask: React.Dispatch<React.SetStateAction<taskType>>;
}) {
  const { task, setTask } = props;
  const classes = useStyles();
  //const [task, setTask] = React.useState<taskType>("classification");
  const textList = [
    [
      "분류",
      "- 평가지표: 정확도 (Accuracy)",
      "- 대상의 범주를 예측합니다.",
      "- 예) 구매 여부, 고객 등급",
    ],
    [
      "회귀",
      "- 평가지표: 평균 제곱근 오차 (RMSE)",
      "- 연속된 숫자값을 에측합니다.",
      "- 예) 매출액, 재고 수량",
    ],
    /*[
      "시계열",
      "- 평가지표: 무언가(Something)",
      "- 대상의 무언가를 예측합니다.",
      "- 예) 차주 로또 번호, 티맥스가 나아갈 방향",
    ],*/
  ];

  /*const iconList = [classificationIcon, regressionIcon, regressionIcon];
  const iconSelectedList = [
    classificationSelectedIcon,
    regressionSelectedIcon,
    regressionSelectedIcon,
  ];*/

  const handleClick = (name: taskType) => {
    setTask(name);
    console.log(task);
  };

  return (
    <div className={classes.root}>
      {textList.map((text: string[], index: number) => (
        <Card
          key={index}
          elevation={3}
          className={`${classes.card} ${
            taskList[index] === task ? classes.bgSelected : classes.bg
          }`}
        >
          <CardActionArea onClick={() => handleClick(taskList[index])}>
            {/*<img
              src={
                taskList[index] === task
                  ? iconSelectedList[index]
                  : iconList[index]
              }
              className={classes.icon}
            />*/}
            <CardContent>
              <Typography className={classes.title} variant="h5">
                {text[0]}
              </Typography>
              <Divider className={classes.divider} />
              <Typography className={classes.description}>{text[1]}</Typography>
              <Typography className={classes.description}>{text[2]}</Typography>
              <Typography className={classes.description}>{text[3]}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </div>
  );
}
