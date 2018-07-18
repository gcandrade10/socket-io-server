import React, { Component } from "react";
import { Route, Switch } from 'react-router-dom';
import Admin from "./Admin";
import Client from "./Client";


class App extends Component {
  render() {
    return (
      <main>
       <Switch>
          <Route exact path='/admin' component={Admin}/>
          <Route path='/' component={Client}/>
  	   </Switch>
      </main>
    );
  }
}
export default App;