import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

let ip = process.env.REACT_APP_IP_DEV;
let apiPort = process.env.REACT_APP_API_PORT_DEV;
let basePath = process.env.REACT_APP_BASE_PATH_DEV;
let apiPath = process.env.REACT_APP_API_PATH_DEV;

import {CookiesProvider} from 'react-cookie';


if (process.env.NODE_ENV === 'production') {

    ip = process.env.REACT_APP_IP;
    apiPort = process.env.REACT_APP_API_PORT;
    basePath = process.env.REACT_APP_BASE_PATH;
    apiPath = process.env.REACT_APP_API_PATH;

}


ReactDOM.render(
    <CookiesProvider>
        <App ip={ip} port={apiPort} basePath={basePath} apiUrl={apiPath}/>
    </CookiesProvider>
    ,

    document.getElementById('root')
);


