import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Landing from "./Components/Landing";
import Login from "./Components/Login";
import Redirect from "./Components/Redirect";
import AdminDashboard from "./Components/Admin/AdminDashboard";

export default function Routing(){
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing/>}/>
                <Route path="/srv/login" element={<Login/>}/>
                <Route path="/srv/admin" element={<AdminDashboard/>}/>
                <Route path="/:addr" element={<Redirect/>}/>
            </Routes>
        </Router>
    )
}