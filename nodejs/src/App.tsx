import React from "react";
import CreateContainer from "./widgets/create/CreateContainer";
import ListContainer from "./widgets/list/ListContainer";
import { Route, Switch } from "react-router-dom";

function App() {
  return (
    <Switch>
      <Route exact path="/" component={CreateContainer} />
      <Route path="/create" component={CreateContainer} />
      <Route path="/list" component={ListContainer} />
      <Route path="/donate" component={ListContainer} />
    </Switch>
  );
}

export default App;
