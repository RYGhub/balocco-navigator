import Routes from "./Routing";
import './App.css';
import {AppContext} from "./libs/Context"
import React, {useEffect, useState} from "react";
import {Bluelib} from "@steffo/bluelib-react";
import {LayoutThreeCol} from "@steffo/bluelib-react";
import {Auth0Provider} from "@auth0/auth0-react";
import {client_id, audience, domain, redirect} from "./oauth_config";


function App() {
    const [token, setToken] = useState(null);
    const [address, setAddress] = useState(null)
    const [userData, setUserData] = useState(null)
    const [auth0Data, setAuth0Data] = useState({domain: "", clientId: "", audience: ""})
    const [theme, setTheme] = useState({background:"#161616", accent:"#346751", foreground:"#ECDBBA"})

    useEffect(() => {
        onLoad();
    }, []);

    useEffect(() => {
        document.body.style.background = theme.background;
    }, [theme])


    async function onLoad() {
        document.body.style = 'background: #161616;';
        if(localStorage.getItem("address")){
            setAddress(localStorage.getItem("address"))
        }
    }

    return (
        <Auth0Provider domain={domain} clientId={client_id}
                       redirectUri={redirect} audience={audience}
                       scope={"read:current_user"}>
            <Bluelib theme={"amber"} backgroundColor={theme.background} accentColor={theme.accent} foregroundColor={theme.foreground}>
                <LayoutThreeCol>
                    <LayoutThreeCol.Center>
                        <div className="App">
                            <AppContext.Provider value={{
                                token,
                                setToken,
                                address,
                                setAddress,
                                userData,
                                setUserData,
                                auth0Data,
                                setAuth0Data,
                                theme,
                                setTheme
                            }}>
                                <Routes/>
                            </AppContext.Provider>
                        </div>
                    </LayoutThreeCol.Center>
                </LayoutThreeCol>
            </Bluelib>
        </Auth0Provider>
    );
}

export default App;
