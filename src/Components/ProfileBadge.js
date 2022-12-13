import React, {useEffect, useState} from "react";
import {Panel, Button} from "@steffo/bluelib-react";
import {useAuth0} from "@auth0/auth0-react";
import {useAppContext} from "../libs/Context";
import {useNavigate} from "react-router-dom";
import {audience, schema} from "../env";


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
        <Panel>
            <Panel>
                Logged in as {user.email}
            </Panel>
            {userData.admin_of.length!==0 && (<Button onClick={e => {navigator("/srv/admin")}}>
            Open admin panel
            </Button>)}
            <Button onClick={() => props.setReload(!props.reload)}>
                Reload
            </Button>
            <Button onClick={() => logout({returnTo: window.location.origin+"/"+address})}>
                Logout
            </Button>
        </Panel>

    );
}