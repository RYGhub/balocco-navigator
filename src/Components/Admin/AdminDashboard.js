import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../../libs/Context";
import {Heading, Panel, Button, Chapter} from "@steffo/bluelib-react";
import {schema} from "../../env";
import Style from "../Dashboard.module.css";
import GiveawayAdmin from "./GiveawayAdmin";
import Modal from "../Modal";
import NewGiveaway from "./NewGiveaway";
import NewItem from "./NewItem";
import { WeirdFlex } from "../WeirdFlex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

export default function AdminDashboard() {
    const {token} = useAppContext()
    const {address, setAddress} = useAppContext()
    const [giveaways, setGiveaways] = useState([])
    const [reload, setReload] = useState(false)
    const navigator = useNavigate()
    const [add, setAdd] = useState(false)
    const [addItems, setAddItems] = useState(false)

    async function get_giveaways() {
        const response = await fetch(window.location.protocol + address + "/api/giveaway/v1/", {
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

    useEffect(() => {
        if (address != null) {
            if(token==null){
                navigator("/srv/login")
                return
            }
            get_giveaways()

        }
    }, [reload])

    useEffect(()=>{
        if(address!=null){
            return;
        }

        let addr = localStorage.getItem("address")
        if(address){
            setAddress(addr)
        }
        else{
            navigator("/")
        }

    }, [reload])


    const navigate = useNavigate()

    return (
        <div>
            <Heading level={1}>Admin Dashboard</Heading>
            <Panel>
                <Heading level={2}>
                    Actions
                </Heading>
                <WeirdFlex>
                    <Button onClick={e => {
                        navigate("/" + address)
                    }}>Go back</Button>
                    <Button onClick={e => {
                        setReload(!reload)
                    }}>Refresh</Button>
                </WeirdFlex>
            </Panel>
            <Chapter>
                <Panel>
                    <Heading level={2}>Giveaways</Heading>
                    <div className={Style.scrollable}>
                        {giveaways.map(giveaway => <GiveawayAdmin
                            giveaway={giveaway} reload={reload} setReload={setReload} key={giveaway.id}/>)}
                    </div>
                    <Button onClick={e=>{setAdd(true)}}><FontAwesomeIcon icon={faCirclePlus}/>&nbsp;Add giveaway</Button>
                    <Modal show={add} onClose={() => {
                        setAdd(false)
                    }}>
                        <NewGiveaway reload={reload} setReload={setReload}/>
                    </Modal>
                </Panel>
                <Panel>
                    <Heading level={2}>Items</Heading>
                    <Button onClick={e=>{setAddItems(true)}}><FontAwesomeIcon icon={faCirclePlus}/>&nbsp;Add items</Button>
                    <Modal show={addItems} onClose={() => {
                        setAddItems(false)
                    }}>
                        <NewItem giveaways={giveaways}/>
                    </Modal>
                </Panel>
            </Chapter>
        </div>
    )
}