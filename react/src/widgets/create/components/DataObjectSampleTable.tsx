import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Select, MenuItem, TextField } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { taskType } from "../../../common/Constants";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      height: 323,
    },
    formControl: {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(1),
      minWidth: 120,
    },
    textFieldContainer: {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(5),
    },
  })
);

function _DataObjectSampleTable(props: {
  columns: string[];
  rows: string[][];
  selectedColumn: string;
  setSelectedColumn: React.Dispatch<React.SetStateAction<string>>;
  setExpName: React.Dispatch<React.SetStateAction<string>>;
  expName: string;
}) {
  const {
    columns,
    rows,
    selectedColumn,
    setSelectedColumn,
    setExpName,
    expName,
  } = props;
  const classes = useStyles();

  const handleSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedColumn(event.target.value as string);
  };

  const handleTextField = (event: React.ChangeEvent<{ value: unknown }>) => {
    setExpName(event.target.value as string);
  };

  return (
    <div>
      <TableContainer className={classes.table} component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow style={{ borderBottom: "2px solid rgb(224, 224, 224)" }}>
              {columns.map((column) => (
                <TableCell style={{ fontWeight: "bold" }} align="left">
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {row.map((cell: String) => (
                  <TableCell align="left" component="th" scope="row">
                    <div
                      style={{
                        display: "fixed",
                        maxHeight: "80px",
                        overflow: "hidden",
                      }}
                    >
                      {cell}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ display: "flex" }}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">대상 열</InputLabel>
          <Select value={selectedColumn} onChange={handleSelect}>
            {columns.map((column) => (
              <MenuItem value={column}>{column}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <form
          noValidate
          autoComplete="off"
          className={classes.textFieldContainer}
        >
          <TextField
            onChange={handleTextField}
            label={"실험 이름"}
            defaultValue={expName}
          />
        </form>
      </div>
    </div>
  );
}

const DataObjectSampleTable = React.memo(_DataObjectSampleTable);

export default DataObjectSampleTable;
