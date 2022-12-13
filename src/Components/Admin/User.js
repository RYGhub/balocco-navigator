import {Heading, Panel, Chapter, Details, Button} from "@steffo/bluelib-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faNewspaper} from "@fortawesome/free-solid-svg-icons";
import Style from "../Dashboard.module.css";

export default function User(props) {

    return (
        <div className={Style.scrollable}>
            {props.user.username}
        </div>
    )
}