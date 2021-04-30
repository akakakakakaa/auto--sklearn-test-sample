import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import PostAddIcon from "@material-ui/icons/PostAdd";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { useHistory } from "react-router-dom";
import DonationDialog from "./DonationDialog";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialContainer: {
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
  { icon: <MailOutlineIcon />, name: "구독하기", url: "subscribe" },
  { icon: <PostAddIcon />, name: "실험 생성하기", url: "create" },
  { icon: <FormatListBulletedIcon />, name: "실험 목록보기", url: "list" },
  {
    icon: <AccountTreeOutlinedIcon />,
    name: "실험 목록보기 (나무)",
    url: "tree",
  },
];

export default function SpeedDialTooltipOpen() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const [subscribeOpen, setSubscribeopen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (url?: string) => {
    setOpen(false);
    if (!!url) history.push(`/${url}`);
  };

  function handleAction(url: string) {
    if (url === "subscribe") return () => setSubscribeopen(true);
    else if (url === "list")
      return window.location.pathname === "/list"
        ? () => window.location.reload()
        : () => handleClose(url);
    else if (url === "create") return () => handleClose(url);
    else if (url === "tree") return () => handleClose(url);
    else return () => null;
  }

  return (
    <div className={classes.dialContainer}>
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
            onClick={handleAction(action.url)}
            classes={classes}
          />
        ))}
      </SpeedDial>
      <DonationDialog open={subscribeOpen} setOpen={setSubscribeopen} />
    </div>
  );
}
