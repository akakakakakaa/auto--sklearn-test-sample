import React from "react";
import ReactDOM from "react-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.scss";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    text: { primary: "#e0e0e0" /*"#eedba5"*/ },
  },
  typography: {
    fontFamily: ["GmarketSansMedium"].join(","),
  },
  overrides: {
    MuiTableRow: {
      root: {
        "&$selected": {
          backgroundColor: "rgba(224, 224, 224, 0.23)",
        },
        "&$selected:hover": {
          backgroundColor: "rgba(224, 224, 224, 0.23)",
        },
      },
    },
    MuiInputLabel: {
      root: {
        "&$focused": {
          color: "#94d6c5",
        },
      },
    },
    MuiInput: {
      underline: {
        "&:after": {
          borderBottom: "2px solid #94d6c5",
        },
      },
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
