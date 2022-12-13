import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../../libs/Context";
import {Heading, Panel, Button} from "@steffo/bluelib-react";
import {schema} from "../../env";
import Style from "../Dashboard.module.css";
import GiveawayAdmin from "./GiveawayAdmin";
import Modal from "../Modal";
import NewGiveaway from "./NewGiveaway";
import NewItem from "./NewItem";

export default function AdminDashboard() {
    const {token} = useAppContext()
    const {address, setAddress} = useAppContext()
    const [giveaways, setGiveaways] = useState([])
    const [reload, setReload] = useState(false)
    const navigator = useNavigate()
    const [add, setAdd] = useState(false)
    const [addItems, setAddItems] = useState(false)

    async function get_giveaways() {
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
    })

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

    })


    const navigate = useNavigate()

    return (
        <div>
            <Heading level={1}>Admin Dashboard</Heading>
            <Button onClick={e => {
                navigate("/" + address)
            }}>Go back</Button>
            <Button onClick={e => {
                setReload(!reload)
            }}>Reload</Button>
            <Panel>
                <Heading level={2}>Giveaways</Heading>
                <div className={Style.scrollable}>
                    {giveaways.map(giveaway => <GiveawayAdmin
                        giveaway={giveaway} reload={reload} setReload={setReload} key={giveaway.id}/>)}
                </div>
                <Button onClick={e=>{setAdd(true)}}>Add giveaway</Button>
                <Modal show={add} onClose={() => {
                    setAdd(false)
                }}>
                    <NewGiveaway reload={reload} setReload={setReload}/>
                </Modal>
            </Panel>
            <Panel>
                <Heading level={2}>Items</Heading>
                <Button onClick={e=>{setAddItems(true)}}>Add items</Button>
                <Modal show={addItems} onClose={() => {
                    setAddItems(false)
                }}>
                    <NewItem giveaways={giveaways}/>
                </Modal>
            </Panel>
        </div>
    )
}