import { Heading } from "@steffo/bluelib-react"
import Style from "./ServerTitle.module.css"

export default function ServerTitle({server}) {
    if(!server) {
        return (
            <span>Now connecting, please wait...</span>
        )
    }

    return (
        <div className={Style.ServerTitle}>
            <Heading level={1} className={Style.ServerHeading}>
                <img className={Style.ServerLogo} alt="" src={server.server.logo}/>
                <span>{server.server.name}</span>
            </Heading>
            <div className="text-muted">
                {server.server.motd}
            </div>
        </div>
    )
}