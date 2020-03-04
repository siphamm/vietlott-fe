import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect
} from 'react-router-dom';
import {
  TYPE_VIETLOTT645,
  TYPE_VIETLOTT655,
  TYPE_VIETLOTT655_7
} from './constants';
import App from './App';

export default function AppRouter() {
  return (
    <Router>
      <>
        <ul className="nav">
          <li>
            <NavLink to={`/${TYPE_VIETLOTT645}`}>Vietlott 645</NavLink>
          </li>
          <li>
            <NavLink to={`/${TYPE_VIETLOTT655}`}>Vietlott 655 (6 số)</NavLink>
          </li>
          <li>
            <NavLink to={`/${TYPE_VIETLOTT655_7}`}>Vietlott 655 (7 số)</NavLink>
          </li>
        </ul>

        <Switch>
          <Route exact path="/">
            <Redirect to={`/${TYPE_VIETLOTT645}`} />
          </Route>
          <Route path="/:type" children={<App />} />
        </Switch>
      </>
    </Router>
  );
}
