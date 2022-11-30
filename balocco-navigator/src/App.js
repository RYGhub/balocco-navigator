import Routes from "./Routing";
import './App.css';
import {AppContext} from "./libs/Context"
import React, {useEffect, useState} from "react";
import {Bluelib} from "@steffo/bluelib-react";
import {LayoutThreeCol} from "@steffo/bluelib-react";


function App() {
    const [token, setToken] = useState(null);
    const [address, setAddress] = useState(null)

    useEffect(() => {
        onLoad();
    }, []);


    async function onLoad() {
        document.body.style = 'background: #161616;';
    }

    return (
        <Bluelib theme={"amber"} backgroundColor={"#161616"} accentColor={"#346751"} foregroundColor={"#ECDBBA"}>
            <LayoutThreeCol>
                <LayoutThreeCol.Center>
                    <div className="App">
                        <AppContext.Provider value={{token, setToken, address, setAddress}}>
                            <Routes/>
                        </AppContext.Provider>
                    </div>
                </LayoutThreeCol.Center>
            </LayoutThreeCol>
        </Bluelib>
    );
}

export default App;
