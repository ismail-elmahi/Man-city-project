import React from 'react';
import Layout from './Hoc/Layout';
import {Switch} from 'react-router-dom';

import PrivateRoutes from './Components/AuthRoutes/PrivateRoutes';
import PublicRoutes from './Components/AuthRoutes/PublicRoutes';

import Home from './Components/Home/index'
import SignIn from './Components/Signin/index';
import NotFound from './Components/ui/NotFound'
import Dashboard from './Components/Admin/Dashboard';
import AdminMatches from './Components/Admin/Matches';
import TheTeam from './Components/TheTeam/TheTeam';
import TheMatches from './Components/TheMatches/TheMatches'

import AddMatcheEdit from './Components/Admin/Matches/AddMatcheEdit'
import Players from './Components/Admin/Players/index';
import AddEditPlayer from './Components/Admin/Players/AddEditPlayer';


const Routes = (props) => {

  // console.log(props)
// the routes from react gives us this props 
//  to checking if the user login or not 
  return(
    <Layout>
      <Switch>
        
        <PrivateRoutes {...props} path="/admin_players/add_players" exact  component={AddEditPlayer}/> 
        <PrivateRoutes {...props} path="/admin_players/add_player/:id" exact  component={AddEditPlayer}/>  
        <PrivateRoutes {...props} path="/admin_players" exact  component={Players}/>
        <PrivateRoutes {...props} path="/admin_matches/edit_match" exact  component={AddMatcheEdit}/> 
        <PrivateRoutes {...props} path="/admin_matches/edit_match/:id" exact  component={AddMatcheEdit}/>        
        <PrivateRoutes {...props} path="/admin_matches" exact  component={AdminMatches}/>
        <PrivateRoutes {...props} path="/dashboard" exact  component={Dashboard}/>
        <PublicRoutes {...props} restricted={true} exact component={SignIn} path="/sign_in" />
        <PublicRoutes {...props} restricted={false} exact component={TheMatches} path="/the_matches" />
        <PublicRoutes {...props} restricted={false} exact component={TheTeam} path="/the_team" />
        <PublicRoutes {...props} restricted={false} exact component={Home} path="/" />
        <PublicRoutes {...props} restricted={false} component={NotFound} />
      </Switch>
    </Layout>
  )
}

export default Routes;
