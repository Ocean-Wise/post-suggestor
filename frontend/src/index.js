import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import App from './components/App';
import Backend from './components/Backend';
import Calendar from './components/Calendar';
import Landing from './components/Landing';
import { Landing as Root } from './components/Landing';
import Idea from './components/Idea';
import Reservation from './components/Reservation';

// Authentication

// Disable react dev tools
// if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__ && Object.keys(window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers).length) {
//   window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers = {};
// }

  ReactDOM.render((
    <Router history={browserHistory}>
      <Route path="/" isAdmin={false} component={Root}>
        <IndexRoute component={Landing} />
        <Route path="suggestor" component={App} />
        <Route path="idea" component={Idea} />
        <Route path="reserve" component={Reservation} />
        <Route path="posts" component={Backend} />
        <Route path="calendar" component={Calendar} />
      </Route>
      <Route path="/admin" isAdmin component={Root}>
        <IndexRoute isAdmin component={Backend} />
        <Route path="suggestor" isAdmin component={App} />
        <Route path="idea" isAdmin component={Idea} />
        <Route path="reserve" isAdmin component={Reservation} />
        <Route path="landing" isAdmin component={Landing} />
        <Route path="calendar" isAdmin component={Calendar} />
      </Route>
    </Router>
    ), document.getElementById('root'),
  );
