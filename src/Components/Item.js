import {Heading, Box, Chapter, Panel, Button, Details, Form, Code, Preformatted} from "@steffo/bluelib-react";
import {useEffect, useState} from "react";
import {convert} from "../libs/timestamp_to_date";
import {schema} from "../env";
import {useAppContext} from "../libs/Context";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faNewspaper} from "@fortawesome/free-solid-svg-icons";
import Style from "./Dashboard.module.css";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { BaseElement } from "@steffo/bluelib-react";

export default function Item(props) {
    const [show, setShow] = useState()
    const {token, setToken} = useAppContext()
    const {address, setAddress} = useAppContext()
    const [data, setData] = useState(null)
    const [taken, setTaken] = useState(props.item.taken)
    const [genre, setGenre] = useState("")
    const [action, setAction] = useState("")
    const [usr, setUsr] = useState("")
    const [options, setOptions] = useState([])
    const [disable, setDisable] = useState(false)
    const {userData, setUserData} = useAppContext();

    async function setupOptions(users) {
        let tmp = []
        tmp["..."] = null
        users.forEach(e => {
            tmp[e.username] = e.id;
        })
        setOptions(tmp)
        setUsr("")
        console.debug(tmp)
    }

    async function get_users(){
        if(props.admin){
            return
        }
        const response = await fetch(window.location.protocol + "//" + address + "/api/user/v1/", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            let values = await response.json()
            return values
        }
    }


    async function get_item() {
        if (show === true) {
            return;
        }
        let users = await get_users()
        if(!props.admin){
            await setupOptions(users)
        }

        const response = await fetch(window.location.protocol + "//" + address + "/api/item/v1/" + props.item.id, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            let values = await response.json()
            await setData(values)
            let genres = ""
            if (values.data && values.data.genres) {
                setGenre(values.data.genres)
            }
        }
    }

    async function take_item() {
        if (props.admin) {
            return;
        }
        const response = await fetch(window.location.protocol + "//" + address + "/api/item/v1/take/" + props.item.id, {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            let values = await response.json()
            setAction(values.obtain_action)
            setTaken(values.taken)
        }
    }

    async function send_item(){
        if(usr===null){
            return;
        }
        const response = await fetch(window.location.protocol + "//" + address + "/api/item/v1/send/" + props.item.id, {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({user_id:usr})
        });
        if (response.status === 200) {
            let values = await response.json()
            alert("Item sent successfully.")
            setDisable(true)
        }
        else{
            alert("Something went wrong. Perhaps you no longer have access to this item.")
        }
    }
    if(!disable){
        return (
            <Panel style={{opacity: taken ? 0.3 : 1.0, transition: "60s opacity"}}>
                <Heading level={3}>{props.item.name}</Heading>
                {show && data && (
                    <div>
                        <Panel>
                            <FontAwesomeIcon icon={faUser}/> Gifted to: <BaseElement disabled={!Boolean(data.winner)} kind="span">{data.winner ? <b>{data.winner?.username}</b> : <small>Nobody yet</small>}</BaseElement>
                        </Panel>
                        <Chapter>
                            <Panel>
                                <a href={`https://store.steampowered.com/app/${data.data.appid}`}>
                                    <FontAwesomeIcon icon={faStore}/> Steam <Code style={{fontSize: "x-small"}}>{data.data.appid}</Code>
                                </a>
                            </Panel>
                            <Panel>
                                {genre?.map?.(g => g.description).join?.(", ")}
                            </Panel>
                        </Chapter>
                        {data.data && (
                            <div>
                                <Panel>
                                    <Details style={{fontSize: "small"}}>
                                        <Details.Summary>Description</Details.Summary>
                                        <Details.Content>
                                            {data.data.description}
                                        </Details.Content>
                                    </Details>
                                </Panel>

                                <Chapter>
                                    {data.winner_id === userData.id &&
                                        <Panel builtinColor="orange">
                                            <p>
                                                {taken ? "You have claimed this item." : "Once you claim the game, it will belong to you, and you won't be able to trade it anymore."}
                                            </p>
                                            <p>
                                                {action ? (
                                                    action.startsWith("https://") ? <a href={action}>{action}</a> : action
                                                ) : <Button onClick={event => (take_item())}>{taken ? "Show key" : "Claim game"}</Button>}
                                            </p>
                                        </Panel>
                                    }

                                    {!taken && (data.winner_id === userData.id || data.admin) && 
                                        <Panel builtinColor="cyan">
                                            <p>Since this item has not yet been redeemed, you can send it to someone else.</p>
                                            <Form>
                                                <Form.Row>
                                                    <Form.Select onSimpleChange={e => {setUsr(e); console.log(e);}} label={""} options={options}
                                                                value={usr}>

                                                    </Form.Select>
                                                </Form.Row>
                                                <Form.Row>
                                                    <Button onClick={event => (send_item())}> Send item </Button>
                                                </Form.Row>
                                            </Form>
                                        </Panel>
                                    }
                                </Chapter>
                            </div>
                        )}
                    </div>
                )}
                {!show && <Button onClick={e => {
                    get_item().then(e => {
                        setShow(!show)
                    })
                }}>Details</Button>}
            </Panel>
        )
    }
    else{
        return (<></>);
    }
}