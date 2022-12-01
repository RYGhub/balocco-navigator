import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../libs/Context";
import schema from "../config";
import {Heading, Panel, Form, Button, Chapter} from "@steffo/bluelib-react";
import {useAuth0} from "@auth0/auth0-react";
import Dashboard from "./Dashboard";

export default function Login() {
    const {token, setToken} = useAppContext()
    const {address, setAddress} = useAppContext()
    const {loginWithRedirect, user, isAuthenticated, } = useAuth0();
    const [server, setServer] = useState(null)

    const navigate = useNavigate()

    useEffect( () => {
        if (localStorage.getItem("address") && address == null) {
            let address = localStorage.getItem("address")
            console.debug(address)
            setAddress(address)
            get_server_data(address)
        }
    }, [])

    async function get_server_data(address) {
        if(address==null){
            return;
        }
        console.debug(address)
        try{
            const response = await fetch(schema + address + "/api/server/v1/planetarium", {
                method: "GET",
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': process.env.DOMAIN
                },
            });
            if (response.status === 200) {
                let values = await response.json()
                console.debug(values)
                setServer(values)
            }
            else{
                alert("Instance is not running.")
            }
        }
        catch (e) {
            alert("Instance is not running.")
        }
    }

    return (
        <div>
            <Heading level={1}>{(server ? (server.server.name) : (address) )}</Heading>
            <p className="text-muted">
                {(server ? (server.server.motd) : ("Now connecting, please wait...") )}
            </p>
            {!isAuthenticated  && (
                <Button children={"Login using Auth0"} onClick={e => loginWithRedirect()}/>)}
            {isAuthenticated  && (
                <Dashboard/>
            )}
        </div>
    )
}