import React from 'react';

// #todo.1 = login,signup  make roter 
//router
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router';

// components

import loadable from '@loadable/component'

const LogIn = loadable(() => import('@pages/login'));
const SignUp = loadable(() => import('@pages/signup'));
const WorkSpace = loadable(() => import('@layouts/workSpace'));


const App = () => {
  return( 
    <BrowserRouter>
    <Switch>
      <Redirect exact to='/login' from='/'></Redirect>
      <Route path={`/signup`} component={SignUp}></Route>
      <Route path={`/login`} component={LogIn}></Route>
      <Route path={`/workspace`} component={WorkSpace}></Route>
      {/* <Route exact path={`/workspace/dm`} component={DirectMassege}></Route> */}
    </Switch>
  </BrowserRouter>
  )    
};

export default App;


// pages ==> router
// components ==> 작은 컴포넌트
// layouts ==> 공통 레이아웃