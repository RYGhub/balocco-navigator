import {Heading, Panel, Box, Form, Button} from "@steffo/bluelib-react";
import {useEffect, useState} from "react";
import schema from "../../config";
import {useAppContext} from "../../libs/Context";
import Modal from "../Modal";

export default function NewGiveaway(props) {
    const {token} = useAppContext()
    const {address} = useAppContext()

    const [name, setName] = useState("")
    //TODO: make it so dates are parsed correctly
    const [time, setTime] = useState("")
    const [time2, setTime2] = useState("")
    const [desc, setDesc] = useState("")

    async function save() {
        try {
            const response = await fetch(schema + address + "/api/giveaway/v1/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    description: desc,
                    closing_date: time,
                    assignment_date: time2
                })
            });
            let data = await response.json()
            console.debug(data)
            props.setReload(props.reload)
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Panel>
            <Heading level={3}>New Giveaway</Heading>
            <Form>
                <Form.Row>
                    <Form.Field onSimpleChange={e => setName(e)} value={name} required={true}
                                placeholder={"..."} label={"Name"}>
                    </Form.Field>
                    <Form.Field inputMode={"datetime"} onSimpleChange={e => setDesc(e)} value={desc}
                                required={true}
                                placeholder={"..."} label={"Description"}>
                    </Form.Field>

                </Form.Row>
                <Form.Row>
                    <p>Closing time / Giveaway time</p>
                </Form.Row>
                <Form.Row>
                    <input type={"datetime-local"} style={{background_color:"#FFFFFF", color:"#000000"}} value={time} onChange={event => {setTime(event.target.value)}}/>
                    <input type={"datetime-local"} style={{background_color:"#FFFFFF", color:"#000000"}} value={time2} onChange={event => {setTime2(event.target.value)}}/>
                </Form.Row>
                <Button bluelibClassNames={"color-lime"} onClick={() => {
                    save()
                }}>
                    {"Save"}
                </Button>
            </Form>
        </Panel>
    )
}