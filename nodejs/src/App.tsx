import React from "react";
import CreateContainer from "./widgets/create/CreateContainer";
import ListContainer from "./widgets/list/ListContainer";
import TreeContainer from "./widgets/tree/TreeContainer";
import { Route, Switch } from "react-router-dom";

function App() {
  return (
    <Switch>
      <Route exact path="/" component={CreateContainer} />
      <Route path="/create" component={CreateContainer} />
      <Route path="/list" component={ListContainer} />
      <Route path="/tree" component={TreeContainer} />
    </Switch>
  );
}

export default App;
