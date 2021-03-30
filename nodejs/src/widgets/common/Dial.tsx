import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import PostAddIcon from "@material-ui/icons/PostAdd";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import LocalCafeIcon from "@material-ui/icons/LocalCafe";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      //transform: "translateZ(0px)",
      flexGrow: 1,
      zIndex: theme.zIndex.drawer + 1,
    },
    speedDial: {
      position: "absolute",
      bottom: theme.spacing(4),
      right: theme.spacing(4),
      "& button": {
        backgroundColor: "#94d6c5 !important",
        color: "#1e2430 !important",
      },
    },
    staticTooltipLabel: {
      backgroundColor: "transparent !important",
      boxShadow: "none",
      whiteSpace: "nowrap",
    },
  })
);

const actions = [
  { icon: <LocalCafeIcon />, name: "개발자 후원하기", url: "donate" },
  { icon: <PostAddIcon />, name: "실험 생성하기", url: "create" },
  { icon: <FormatListBulletedIcon />, name: "실험 목록보기", url: "list" },
];

export default function SpeedDialTooltipOpen() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const history = useHistory();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (url?: string) => {
    setOpen(false);
    if (!!url) history.push(`/${url}`);
  };

  return (
    <div className={classes.root}>
      <SpeedDial
        ariaLabel="SpeedDial"
        className={classes.speedDial}
        icon={<SpeedDialIcon />}
        onClose={() => handleClose()}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={() => handleClose(action.url)}
            classes={classes}
          />
        ))}
      </SpeedDial>
    </div>
  );
}
