import React, {useEffect, useState} from "react";
import {Panel, Button, Heading, Code, Chapter} from "@steffo/bluelib-react";
import {useAuth0} from "@auth0/auth0-react";
import {useAppContext} from "../libs/Context";
import {useNavigate} from "react-router-dom";
import {audience, schema} from "../env";
import { WeirdFlex } from "./WeirdFlex";
import UsernameChanger from "./UsernameChanger";


export default function ProfileBadge(props) {
    const {user, isAuthenticated, isLoading, getAccessTokenSilently} = useAuth0();
    const {logout} = useAuth0();
    const {address, setAddress} = useAppContext()
    const {token, setToken} = useAppContext();
    const {userData, setUserData} = useAppContext();
    const navigator = useNavigate()

    useEffect(() => {
        (async () => {
            try {
                const token = await getAccessTokenSilently({
                    audience: audience,
                    scope: "openid email profile"
                });
                if(address === undefined){
                    return;
                }
                const response = await fetch(schema + address + "/api/user/v1/self", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                let data = await response.json()
                setUserData(data);
                setToken(token);
            } catch (e) {

            }
        })();
    }, [getAccessTokenSilently]);


    if (isLoading) {
        return "";
    }

    if (userData === null) {
        return ""
    }

    return (
        isAuthenticated &&
        <Chapter>
            <Panel>
                <Heading level={2}>
                    Welcome
                </Heading>
                <p>
                    You are logged in as {} <Code>{user.email}</Code>.
                </p>
                <WeirdFlex>
                    <Button onClick={() => props.setReload(!props.reload)}>
                        Refresh data
                    </Button>
                    {userData.admin_of.length!==0 && (<Button onClick={e => {navigator("/srv/admin")}}>
                        Open admin panel
                    </Button>)}
                </WeirdFlex>
                <WeirdFlex>
                    <Button onClick={() => logout({returnTo: window.location.origin+"/"+address})} builtinColor="red">
                        Logout
                    </Button>
                </WeirdFlex>
            </Panel>
            <Panel>
                <UsernameChanger></UsernameChanger>
            </Panel>
        </Chapter>
    );
}