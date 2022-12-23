import {Heading, Panel, Form, Button} from "@steffo/bluelib-react";
import {useEffect, useState} from "react";
import {schema} from "../../env";
import {useAppContext} from "../../libs/Context";
import {CSVToArray} from "../../libs/CSVParser";

export default function NewItem(props) {
    const {token} = useAppContext()
    const {address} = useAppContext()

    const [file, setFile] = useState(null)
    const [filepath, setFilepath] = useState("")
    const [started, setStarted] = useState(false)
    const [giveaway, setGiveaway] = useState("")
    const [options, setOptions] = useState([])
    const [name, setName] = useState("")

    useEffect(e =>{
        console.debug(props.giveaways)

        let tmp = []
        tmp["..."] = null
        props.giveaways.forEach(e=>{
            tmp[e.name]=e.id;
        })
        setOptions(tmp)
        setGiveaway("")
    }, [props.giveaways])

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    async function batch_save() {
        if (started || file == null) {
            return;
        }
        if(giveaway === ""){
            alert("Select a giveaway.")
            return;
        }
        setStarted(true)
        let reader = new FileReader();
        reader.onload = async function () {
            let text = reader.result
            let data = CSVToArray(text, ";")
            for (let i = 1; i < data.length; i++) {
                if (data[i][0] === "") {
                    continue
                }
                setName("Now processing "+data[i][0]+": contacting steam... ("+i+"/"+(data.length-1)+")")
                let sdata = null
                try {
                    sdata = await get_steam_data(data[i][0]);
                } catch (e) {
                    setName("Can't find on steam "+data[i][0]+" ("+i+"/"+(data.length-1)+")")
                }
                sdata = sdata[data[i][0]].data

                setName("Now processing "+data[i][0]+" ( "+sdata.name+" ): saving into the database... ("+i+"/"+(data.length-1)+")")
                let gamedata = {
                    name: sdata.name,
                    giveaway_id: giveaway,
                    data: {
                        description: sdata.about_the_game.replaceAll(/<\/?[^>]+(>|$)/g, "").replaceAll("&quot;", '"'),
                        genres: sdata.genres,
                        platforms: sdata.platforms,
                        appid: data[i][0],

                    },
                    obtain_action: data[i][1]
                }
                await save(gamedata)
                await delay(1000)
            }
            setStarted(false)
            setName("Completed.")
        }
        reader.readAsText(file)

    }

    async function get_steam_data(appid) {
        const response = await fetch(window.location.protocol + "//" + address + "/api/item/v1/steam/" + appid, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });
        let data = await response.json()
        return data.data
    }

    async function save(data) {
        try {
            const response = await fetch(window.location.protocol + "//" + address + "/api/item/v1/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            await response.json()
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Panel>
            <Heading level={3}>Add item(s)</Heading>
            <p>Please select a CSV file formatted in such a way: APPID;REDEEM_URL</p>
            <Form hidden={started}>
                <Form.Row>
                    <input type={"file"} onChange={e => {
                        setFile(e.target.files[0]);
                        setFilepath(e.target.value)
                    }} value={filepath}
                           placeholder={"..."} accept={"text/csv"}>
                    </input>
                </Form.Row>
                <Form.Row>
                    <Form.Select onSimpleChange={e => {setGiveaway(e); console.log(e);}} label={"Giveaway?"} options={options}
                    value={giveaway}>

                    </Form.Select>
                </Form.Row>
                <Button bluelibClassNames={"color-lime"} onClick={() => {
                    batch_save()
                }}>
                    {"Save"}
                </Button>

            </Form>
            <p>
                {name}
            </p>
        </Panel>
    )
}