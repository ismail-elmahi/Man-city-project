import React from 'react';
import ReactDOM from 'react-dom';
import './Resources/css/app.css';
import  {BrowserRouter} from 'react-router-dom';
import Routes from './routes';
import { firebase } from './firebase';


const App = (props) => {
    return (
        <BrowserRouter>
            <Routes {...props}/>
        </BrowserRouter>
    )
}
// we send the user to the router and we cheking if the user is login or not 
firebase.auth().onAuthStateChanged((user) => {
    ReactDOM.render(<App user={user}/>, document.getElementById('root'));
})



