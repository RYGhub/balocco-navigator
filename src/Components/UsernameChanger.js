import React, {useState} from "react"

import {useAppContext} from "../libs/Context";
import {Form, Button} from "@steffo/bluelib-react";
import {schema} from "../env";


export default function UsernameChanger() {
    const {token} = useAppContext()
    const {address} = useAppContext()
    const {userData, setUserData} = useAppContext()
    const [username, setUsername] = useState(userData.username)

    async function save() {
        try {
            console.debug(token)
            const response = await fetch(schema + address + "/api/user/v1/self", {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': process.env.DOMAIN,
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: username,
                })
            });
            if (response.status === 200) {
                let data = await response.json()
                let u = userData
                u.username = data.username
                setUserData(u)
                alert("Username changed successfully.")
            } else {
                alert("Something went wrong.")
            }

        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div>
            <p>
                If your username wasn't automatically set-up, or you want to change it, do it so here. Keep in mind that
                this username will be needed by other users to identify you.
            </p>
            <Form>
                <Form.Row>
                    <Form.Field onSimpleChange={e => setUsername(e)} value={username}
                                placeholder={""} label={"Username"}>
                    </Form.Field>
                    <Button onClick={() => {
                        save()
                    }}>
                        {"Update"}
                    </Button>
                </Form.Row>

            </Form>
        </div>
    )
}