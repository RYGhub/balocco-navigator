import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../libs/Context";
import {schema} from "../env";
import {Heading, Panel, Form, Button, Image} from "@steffo/bluelib-react";
import {useAuth0} from "@auth0/auth0-react";
import Dashboard from "./Dashboard";
import ServerTitle from "./ServerTitle";

export default function Login() {
    const {token, setToken} = useAppContext()
    const {address, setAddress} = useAppContext()
    const {loginWithRedirect, user, isAuthenticated, } = useAuth0();
    const [server, setServer] = useState(null)
    const {auth0Data, setAuth0Data} = useAppContext()
    const {theme, setTheme} = useAppContext()

    const navigate = useNavigate()

    useEffect( () => {
        if (localStorage.getItem("address") ) {
            if(address===null){
                let address = localStorage.getItem("address")
                console.debug(address)
                setAddress(address)
            }
            get_server_data(address)
        }
    }, [isAuthenticated])

    async function get_server_data(address) {
        if(address==null){
            return;
        }
        console.debug(address)
        try{
            const response = await fetch(`${window.location.protocol}//${address}/api/server/v1/planetarium`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                let values = await response.json()
                console.debug(values)
                setServer(values)
                if(values.server.custom_colors){
                    setTheme(values.server.custom_colors)
                }
                setAuth0Data({domain: values.domain, clientId: values.oauth_public, audience: values.audience})
            }
        }
        catch (e) {
        }
    }

    return (
        <div>
            <ServerTitle server={server}/>
            {!isAuthenticated  && (
                <Panel>
                    <Button children={"Login"} onClick={e => loginWithRedirect()}/>
                </Panel>)}
            {isAuthenticated  && (
                <Dashboard/>
            )}
        </div>
    )
}