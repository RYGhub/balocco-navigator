import React, {useEffect, useState} from 'react';
import Style from "./Landing.module.css";
import {Button, Form, Heading, Panel,} from "@steffo/bluelib-react";
import {useAppContext} from "../libs/Context";
import {useNavigate} from "react-router-dom";
import {schema} from "../env";

export default function Landing() {
    const {address, setAddress} = useAppContext()
    const navigator = useNavigate()
    const [addr, setAddr] = useState("");

    useEffect( () => {
        if (localStorage.getItem("address") && address == null) {
            let address = localStorage.getItem("address")
            setAddress(address)
            navigator("/srv/login")
        }
    })

    async function conn(){
        try{
            const response = await fetch(schema + addr + "/api/server/v1/planetarium", {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                let values = await response.json()
                setAddress(addr)
                localStorage.setItem("address", addr)
                navigator("/srv/login")
            }
            else{
                alert("No instance running at address.")
            }
        }
        catch (e) {
            alert("No instance running at address.")
        }
    }

    return(
        <div className={Style.Landing}>
            <div className={Style.lander} style={{minWidth: "unset"}}>
                <Heading level={1}>Balocco</Heading>
                <p className="text-muted">
                    An amazingly bad giveaway application.
                </p>

            </div>
            <Panel style={{minWidth: "unset"}}>
                <p>
                    To connect to an instance, write the backend address below and click on "Connect".
                </p>
                <Form>
                    <Form.Row>
                        <Form.Field onSimpleChange={e => setAddr(e)} value={addr} required={true}
                                    placeholder={""} label={"Address"}>
                        </Form.Field>
                    </Form.Row>
                    <Button bluelibClassNames={"color-lime"} onClick={conn}>
                        {"Connect"}
                    </Button>
                </Form>
            </Panel>
        </div>
    );
}