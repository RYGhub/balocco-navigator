import {Heading, Box, Chapter, Panel, Button, Details} from "@steffo/bluelib-react";
import {useState} from "react";
import {convert} from "../libs/timestamp_to_date";
import {schema} from "../env";
import {useAppContext} from "../libs/Context";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faNewspaper} from "@fortawesome/free-solid-svg-icons";
import Style from "./Dashboard.module.css";

export default function Item(props) {
    const [show, setShow] = useState()
    const {token, setToken} = useAppContext()
    const {address, setAddress} = useAppContext()
    const [data, setData] = useState(null)
    const [taken, setTaken] = useState(props.item.taken)
    const [genre, setGenre] = useState("")
    const [action, setAction] = useState("")

    async function get_item() {
        if (show === true) {
            return;
        }
        const response = await fetch(schema + address + "/api/item/v1/" + props.item.id, {
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
            await setData(values)
            let genres = ""
            if (values.data && values.data.genres) {
                for (let i = 0; i < values.data.genres.length; i++) {
                    genres += values.data.genres[i].description + "; ";
                }
                setGenre(genres)
            }
        }
    }

    async function take_item() {
        if (props.admin) {
            return;
        }
        const response = await fetch(schema + address + "/api/item/v1/take/" + props.item.id, {
            method: "PATCH",
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
            setAction(values.obtain_action)
            setTaken(values.taken)
        }
    }

    return (
        <Box>
            <Heading level={3}>{props.item.name} {!taken && (<FontAwesomeIcon icon={faNewspaper}/>)}</Heading>
            {show && (
                <div>
                    <Chapter>
                        <div>
                            Status: {data.obtainable ? ("Obtainable") : ("Non Obtainable")}
                        </div>
                        <div>
                            Won by: {data.winner ? (data.winner.username) : ("Nobody")}
                        </div>
                    </Chapter>
                    {data.data && (
                        <div>
                            <Details>
                                <Details.Summary>Description</Details.Summary>
                                <Details.Content>
                                    <Panel
                                        children={data.data.description}/>
                                </Details.Content>

                            </Details>
                            <p>Genres: {genre}</p>

                            {props.admin ? ("") : (
                                <Panel>
                                    <p>Once the key is shown, this game will belong to you, and you won't be able to
                                        trade it.</p>
                                    <Button onClick={event => (take_item())}> Show key </Button>
                                    <p>{action}</p>
                                </Panel>)}

                            <p>APPID: {data.data.appid}</p>
                        </div>
                    )}
                </div>
            )}
            <Button onClick={e => {
                get_item().then(e => {
                    setShow(!show)
                })
            }}>{(show ? ("Close") : ("Details"))}</Button>
        </Box>
    )
}