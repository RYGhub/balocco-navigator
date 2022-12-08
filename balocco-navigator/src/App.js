import Routes from "./Routing";
import './App.css';
import {AppContext} from "./libs/Context"
import React, {useEffect, useState} from "react";
import {Bluelib} from "@steffo/bluelib-react";
import {LayoutThreeCol} from "@steffo/bluelib-react";
import {Auth0Provider} from "@auth0/auth0-react";
import {client_id, audience, domain} from "./oauth_config";


function App() {
    const [token, setToken] = useState(null);
    const [address, setAddress] = useState(null)
    const [userData, setUserData] = useState(null)
    const [auth0Data, setAuth0Data] = useState({domain: "", clientId: "", audience: ""})

    useEffect(() => {
        onLoad();
    }, []);


    async function onLoad() {
        document.body.style = 'background: #161616;';
        if(localStorage.getItem("address")){
            setAddress(localStorage.getItem("address"))
        }
    }

    return (
        <Auth0Provider domain={domain} clientId={client_id}
                       redirectUri={"http://127.0.0.1:3000/srv/login"} audience={audience}
                       scope={"read:current_user"}>
            <Bluelib theme={"amber"} backgroundColor={"#161616"} accentColor={"#346751"} foregroundColor={"#ECDBBA"}>
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
                                setAuth0Data
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
