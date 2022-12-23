import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../libs/Context";
import ProfileBadge from "./ProfileBadge";
import {Heading, Panel, Form, Box, Chapter, Button} from "@steffo/bluelib-react";
import {schema} from "../env";
import Giveaway from "./Giveaway";
import Item from "./Item";
import Style from "./Dashboard.module.css";
import UsernameChanger from "./UsernameChanger";

export default function Dashboard() {
    const {token, setToken} = useAppContext()
    const {address, setAddress} = useAppContext()
    const [giveaways, setGiveaways] = useState([])
    const {userData, setUserData} = useAppContext()
    const [reload, setReload] = useState(false)

    useEffect(() => {
        if (address != null && token != null) {
            get_giveaways()
        }
    }, [address, token])

    useEffect(() => {
        if (address != null && token != null) {
            get_giveaways()
            get_user_data()
        }
    }, [reload])

    async function get_giveaways() {
        const response = await fetch(schema + address + "/api/giveaway/v1/", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            let values = await response.json()
            setGiveaways(values)
        }
    }

   async function get_user_data(){
        const response = await fetch(schema + address + "/api/user/v1/self", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        let data = await response.json()
        setUserData(data);
    }

    const navigate = useNavigate()

    return (
        <div>
            <ProfileBadge reload={reload} setReload={setReload}/>
            <Chapter>
                <Panel>
                    <Heading level={2}>Ongoing giveaways</Heading>
                    <div className={Style.scrollable}>
                        {giveaways.filter(giveaway => giveaway.active === true).map(giveaway => <Box key={giveaway.id}><Giveaway
                            giveaway={giveaway}/></Box>)}
                    </div>
                </Panel>
                <Panel>
                    <Heading level={2}>Gifts received</Heading>
                    <div className={Style.scrollable}>
                        {userData && (
                            userData.wins.map(item => <Item item={item} key={item.id}/>))}
                    </div>
                </Panel>
            </Chapter>
        </div>
    )
}