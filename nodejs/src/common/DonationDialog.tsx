import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function validateEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

export default function FormDialog(props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState(false);
  const handleClose = () => {
    props.setOpen(false);
  };
  const handleSubmit = () => {
    if (validateEmail(email)) {
      handleClose();
    } else setError(true);
  };
  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">구독하기</DialogTitle>
      <DialogContent>
        <DialogContentText>
          이메일을 알려주신다면&nbsp;
          <div style={{ display: "inline", color: "#94d6c5" }}>Farseer.AI</div>
          의 개발 소식을 놓치지 않을 거에요.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Email Address"
          fullWidth
          //error={error}
          onChange={(event) => setEmail(event.target.value)}
          helperText={
            error
              ? "이메일 형식을 확인해주세요. (예: someone@something.co.kr)"
              : ""
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button onClick={handleSubmit}>
          <text style={{ color: "#94d6c5" }}>구독하기</text>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
