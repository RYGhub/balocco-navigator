import React, {useEffect} from 'react';
import Style from "./Landing.module.css";
import {Heading, Panel,} from "@steffo/bluelib-react";
import {useAppContext} from "../libs/Context";
import {useNavigate} from "react-router-dom";

export default function Landing() {
    const {address, setAddress} = useAppContext()
    const navigator = useNavigate()

    useEffect( () => {
        if (localStorage.getItem("address") && address == null) {
            let address = localStorage.getItem("address")
            setAddress(address)
            navigator("/login")
        }
    })

    return(
        <div className={Style.Landing}>
            <div className={Style.lander} style={{minWidth: "unset"}}>
                <Heading level={1}>Balocco</Heading>
                <p className="text-muted">
                    An amazingly bad giveaway application.
                </p>

            </div>
            <Panel style={{minWidth: "unset"}}>
                "A Balocco and some more."
            </Panel>
        </div>
    );
}