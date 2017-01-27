import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {blue400, blue700} from 'material-ui/styles/colors';
import Opinion, {Welcome} from '../components/welcome/';
import Dashboard from '../components/dashboard/';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    textColor: blue700,
    primary1Color: blue400,
    primary2Color: blue700
  },
  appBar: {
    height: 50
  }
});

ReactDOM.render(
  <MuiThemeProvider muiTheme={muiTheme}>
  <Router history = {hashHistory}>
  <Route path = "/" component = {Opinion}/>
  <Route path = "/welcome" component = {Welcome}>
  <IndexRoute component = {Dashboard}/>
  <Route path = "/dashboard" component = {Dashboard}/>
  </Route>
  </Router>
  </MuiThemeProvider>,
  document.getElementById('search')
  );
