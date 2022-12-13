import {Heading, Panel, Box, Form, Button, Chapter} from "@steffo/bluelib-react";
import {useEffect, useState} from "react";
import schema from "../../config";
import {useAppContext} from "../../libs/Context";
import Modal from "../Modal";
import Giveaway from "../Giveaway";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWrench, faGears, faClose, faUsers, faGamepad} from "@fortawesome/free-solid-svg-icons";
import User from "./User";
import Item from "../Item";

export default function GiveawayAdmin(props) {
    const [show, setShow] = useState(false)
    const [showUsers, setShowUsers] = useState(false)
    const [showGames, setShowGames] = useState(false)
    const [signups, setSignups] = useState([])
    const [items, setItems] = useState([])
    const {token, setToken} = useAppContext()
    const {address, setAddress} = useAppContext()

    const [name, setName] = useState(props.giveaway.name)
    //TODO: make it so dates are parsed correctly
    const [time, setTime] = useState("")
    const [time2, setTime2] = useState("")
    const [desc, setDesc] = useState(props.giveaway.description)

    useEffect(e=>{
        get_data()
    }, [props.giveaway])

    async function get_data(){
        try {
            const response = await fetch(schema + address + "/api/giveaway/v1/"+props.giveaway.id, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            let data = await response.json()
            setSignups(data.signups)
            setItems(data.items)

        } catch (e) {
            console.error(e);
        }
    }

    async function update(){
        try {
            const response = await fetch(schema + address + "/api/giveaway/v1/"+props.giveaway.id, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    name: name,
                    description:desc,
                    closing_date: time,
                    assignment_date: time2
                })
            });
            let data = await response.json()
            props.setReload(props.reload)
        } catch (e) {
            console.error(e);
        }
    }

    async function close(){
        try {
            const response = await fetch(schema + address + "/api/giveaway/v1/close/"+props.giveaway.id, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            let data = await response.json()
            alert("Giveaway is now closed.")
        } catch (e) {
            console.error(e);
        }
    }

    async function run(){
        try {
            const response = await fetch(schema + address + "/api/giveaway/v1/provide/"+props.giveaway.id, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            let data = await response.json()
            alert("Giveaway is now running...")
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Box>
            <Giveaway giveaway={props.giveaway}/>
            <Chapter>
                <div>
                    <Button onClick={() => {
                        setShowUsers(true)
                    }}><FontAwesomeIcon icon={faUsers}/></Button>
                </div>
                <div>
                    <Button onClick={() => {
                        setShowGames(true)
                    }}><FontAwesomeIcon icon={faGamepad}/></Button>
                </div>
            </Chapter>
            <Chapter>
                <div>
                    <Button onClick={() => {
                        setShow(true)
                    }}><FontAwesomeIcon icon={faWrench}/></Button>
                </div>
                <div>
                    <Button onClick={() => {
                        close()
                    }}><FontAwesomeIcon icon={faClose}/></Button>
                </div>
                <div>
                    <Button onClick={() => {
                        run()
                    }}><FontAwesomeIcon icon={faGears}/></Button>
                </div>
            </Chapter>


            <Modal show={show} onClose={() => {
                setShow(false)
            }}>
                <Panel>
                    <Heading level={3}>Editing {props.giveaway.name}</Heading>
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
                        <Form.Row >
                            <input type={"datetime-local"} style={{background_color:"#FFFFFF", color:"#000000"}} value={time} onChange={event => {setTime(event.target.value)}}/>
                            <input type={"datetime-local"} style={{background_color:"#FFFFFF", color:"#000000"}} value={time2} onChange={event => {setTime2(event.target.value)}}/>
                        </Form.Row>
                        <Button bluelibClassNames={"color-lime"} onClick={() => {update()}}>
                            {"Update"}
                        </Button>
                    </Form>
                </Panel>
            </Modal>
            <Modal show={showUsers} onClose={() => {
                setShowUsers(false)
            }}>
                <Heading level={3}>Users</Heading>
                <Panel>
                    {signups.map(signup=><User user={signup.user} key={signup.user.id}/>)}
                </Panel>
            </Modal>
            <Modal show={showGames} onClose={() => {
                setShowGames(false)
            }}>
                <Heading level={3}>Items</Heading>
                <Panel>
                    {items.map(item=><Item item={item} key={item.id} admin={true}/>)}
                </Panel>
            </Modal>
        </Box>
    )
}