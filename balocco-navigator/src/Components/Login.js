import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../libs/Context";
import schema from "../config";
import {Heading, Panel, Form, Button, Chapter} from "@steffo/bluelib-react";
import {useAuth0} from "@auth0/auth0-react";

export default function Login() {
    const {token, setToken} = useAppContext()
    const {address, setAddress} = useAppContext()
    const {loginWithRedirect, user, isAuthenticated, } = useAuth0();

    const navigate = useNavigate()

    useEffect( () => {
        console.debug(address)
        if (localStorage.getItem("address") && address == null) {
            let address = localStorage.getItem("address")
            console.debug(address)
            setAddress(address)
        }
    })

    async function get_server_data(address) {
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
        }
    }

    return (
        <div>
            <Heading level={1}>ACMEDeliver Login</Heading>
            <p className="text-muted">
                Benvenuto su {address}
            </p>
            {!isAuthenticated  && (
            <Button children={"Accedi"} onClick={e => loginWithRedirect()}></Button>)}
        </div>
    )
}