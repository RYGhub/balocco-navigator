import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../libs/Context";
import ProfileBadge from "./ProfileBadge";
import {Heading, Panel, Form, Button, Chapter} from "@steffo/bluelib-react";
import schema from "../config";
import Giveaway from "./Giveaway";

export default function Dashboard() {
    const {token, setToken} = useAppContext()
    const {address, setAddress} = useAppContext()
    const [giveaways, setGiveaways] = useState([])

    useEffect(()=>{
        if(address!=null && token!=null){
            get_giveaways()
        }
    }, [address, token])

    async function get_giveaways(){
        const response = await fetch(schema + address + "/api/giveaway/v1/", {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': process.env.DOMAIN,
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            let values = await response.json()
            console.debug(values)
            setGiveaways(values)
        }
    }

    const navigate = useNavigate()

    return (
        <div>
            <ProfileBadge/>
            <Chapter>
                <Panel>
                    <Heading level={2}>Ongoing giveaways</Heading>
                    {giveaways.filter(giveaway => giveaway.active === true).map(giveaway => <Giveaway giveaway={giveaway} key={giveaway.id}></Giveaway>)}
                </Panel>
                <Panel>
                    <Heading level={2}>Won items</Heading>
                </Panel>
            </Chapter>
        </div>
    )
}