import {Heading, Box, Chapter, Details, Button, Panel} from "@steffo/bluelib-react";
import {useEffect, useState} from "react";
import {convert} from "../libs/timestamp_to_date";
import {schema} from "../env";
import {useAppContext} from "../libs/Context";
import Modal from "./Modal";
import Item from "./Item";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGamepad} from "@fortawesome/free-solid-svg-icons";
import { WeirdFlex } from "./WeirdFlex";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function Giveaway(props) {
    const [show, setShow] = useState()
    const {token, setToken} = useAppContext()
    const {address, setAddress} = useAppContext()
    const {userData, setUserData} = useAppContext()
    const [subscribable, setSubscribable] = useState(false)
    const [showGames, setShowGames] = useState(false)
    const [items, setItems] = useState([])

    async function subscribe(){
        const response = await fetch(schema + address + "/api/giveaway/v1/join/"+props.giveaway.id, {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            setSubscribable(false)
        }
    }

    async function get_data(){
        try {
            const response = await fetch(schema + address + "/api/giveaway/v1/"+props.giveaway.id, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                },
            });
            let data = await response.json()
            let i = data.items
            i.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
            setItems(i)
            setShowGames(true)

        } catch (e) {
            console.error(e);
        }
    }

    async function check(){
        if(userData.signups.filter(element => element.giveaway.id===props.giveaway.id).length!==0){
            return;
        }
        setSubscribable(true)
    }

    useEffect(e => {
        check();
    }, [props.giveaway])

    return (
        <Panel>
            <Heading level={3}>{props.giveaway.name}</Heading>
            {show && (
                <>
                    {props.giveaway.description && <p>
                        {props.giveaway.description}
                    </p>}
                    <p>
                        Subscriptions open until: {convert(props.giveaway.closing_date)}
                    </p>
                    <p>
                        Giveaway starts at: {convert(props.giveaway.assignment_date)}
                    </p>
                    <WeirdFlex>
                        {subscribable ? (
                            <Button onClick={event => {subscribe()}}><FontAwesomeIcon icon={faPlus}/>&nbsp;Subscribe</Button>
                        ) : (<Button disabled={true}><FontAwesomeIcon icon={faCheckCircle}/>&nbsp;Subscribed!</Button>)}

                        <Button onClick={() => {
                            get_data()
                        }}><FontAwesomeIcon icon={faGamepad}/>&nbsp;Show items</Button>
                    </WeirdFlex>

                    {props.children}

                    <Modal show={showGames} onClose={() => {
                        setShowGames(false)
                    }}>
                        <Heading level={3}>Items</Heading>
                        <Panel>
                            {items.map(item=><Item item={item} key={item.id} admin={true}/>)}
                        </Panel>
                    </Modal>
                </>
            )}
            <Button onClick={e => {
                setShow(!show)
            }}>{(show ? ("Less") : ("More"))}</Button>
        </Panel>
    )
}