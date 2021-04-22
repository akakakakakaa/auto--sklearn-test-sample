import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      marginBottom: theme.spacing(1),
    },
  })
);

export default function TreeviewSearchField(props: {
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}) {
  const classes = useStyles();

  return (
    <div className={classes.margin}>
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
          <SearchIcon style={{ color: "#e0e0e0" }} />
        </Grid>
        <Grid item>
          <TextField
            id="input-with-icon-grid"
            //label="검색"
            onChange={(e) => props.setSearchText(e.target.value)}
          />
        </Grid>
      </Grid>
    </div>
  );
}
