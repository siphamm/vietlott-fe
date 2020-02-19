import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect
} from 'react-router-dom';
import App from './App';

export default function AppRouter() {
  return (
    <Router>
      <>
        <ul className="nav">
          <li>
            <NavLink to="/vietlott645">Vietlott 645</NavLink>
          </li>
          <li>
            <NavLink to="/vietlott655">Vietlott 655</NavLink>
          </li>
        </ul>

        <Switch>
          <Route exact path="/">
            <Redirect to="/vietlott645" />
          </Route>
          <Route path="/:type" children={<App />} />
        </Switch>
      </>
    </Router>
  );
}
