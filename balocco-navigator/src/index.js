import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Auth0Provider} from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Auth0Provider domain={"fermitech.eu.auth0.com"} clientId={"dhkUeTUEkCb7uqs12w7kARvn9iKumk8h"}
                   redirectUri={"http://127.0.0.1:3000/srv/login"} audience={"test"}
                   scope={"read:current_user"}>
        <App/>
    </Auth0Provider>
);

reportWebVitals();
