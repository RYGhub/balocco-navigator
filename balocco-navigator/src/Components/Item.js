import {Heading, Box, Chapter, Details, Button} from "@steffo/bluelib-react";
import {useState} from "react";
import {convert} from "../libs/timestamp_to_date";
import schema from "../config";
import {useAppContext} from "../libs/Context";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faNewspaper} from "@fortawesome/free-solid-svg-icons";

export default function Item(props) {
    const [show, setShow] = useState()
    const {token, setToken} = useAppContext()
    const {address, setAddress} = useAppContext()
    const [data, setData] = useState(null)
    const [taken, setTaken] = useState(props.item.taken)

    async function get_item(){
        const response = await fetch(schema + address + "/api/item/v1/"+props.item.id, {
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
            setData(values)
            console.debug(values)
            if(!values.taken){
                await take_item()
                setTaken(true)
            }
        }
    }

    async function take_item(){

        const response = await fetch(schema + address + "/api/item/v1/take/"+props.item.id, {
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
        }
    }

    return (
        <Box>
            <Heading level={3}>{props.item.name} {!taken && (<FontAwesomeIcon icon={faNewspaper}/>)}</Heading>
            {show && (
                <div>
                    {(data ? (<div>
                        {data.obtain_action}
                    </div>):(<div>Loading...</div>))}
                </div>
            )}
            <Button onClick={e => {
                setShow(!show)
                get_item()
            }}>{(show ? ("Close") : ("Details"))}</Button>
        </Box>
    )
}