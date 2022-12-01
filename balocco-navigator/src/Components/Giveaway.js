import {Heading, Box, Chapter, Details, Button} from "@steffo/bluelib-react";
import {useState} from "react";
import {convert} from "../libs/timestamp_to_date";
import schema from "../config";
import {useAppContext} from "../libs/Context";

export default function Giveaway(props) {
    const [show, setShow] = useState()
    const {token, setToken} = useAppContext()
    const {address, setAddress} = useAppContext()
    const {userData, setUserData} = useAppContext()
    const [subscribable, setSubscribable] = useState(false)

    async function subscribe(){
        const response = await fetch(schema + address + "/api/giveaway/v1/join/"+props.id, {
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
            setSubscribable(false)
        }
    }

    async function check(){
        if(userData.signups.filter(element => element.giveaway.id===props.giveaway.id)){
            return;
        }
        setSubscribable(true)
    }

    return (
        <Box>
            <Heading level={3}>{props.giveaway.name}</Heading>
            {show && (
                <div>
                    <p>
                        {props.giveaway.description}
                    </p>
                    <p>
                        Subscriptions open until: {convert(props.giveaway.closing_date)}
                    </p>
                    <p>
                        Giveaway starts at: {convert(props.giveaway.assignment_date)}
                    </p>
                    {subscribable ? (
                        <Button onClick={event => {subscribe()}}>Subscribe</Button>
                    ) : (<Button disabled={true}>You are already subscribed.</Button>)}
                </div>
            )}
            <Button onClick={e => {
                setShow(!show)
            }}>{(show ? ("Less") : ("More"))}</Button>
        </Box>
    )
}