import React, { useEffect, useState } from "react"
import CreateRoomPage from "./CreateRoomPage";
import JoinRoomPage from "./JoinRoomPage";
import Room from "./Room";
import { BrowserRouter as Router, Routes, Route, Link, Navigate} from "react-router-dom";
import NotFound from "./NotFound";
import { render } from "react-dom";
import HomePage from "./HomePage";


export default function App(props) {
    const [code, setCode] = useState(null);

    useEffect(() => {
        async function autoEnter() {
        fetch("api/user-in-room")
        .then((response) => response.json())
        .then((data) => setCode(data.code));
        };

        autoEnter();
    }, []);

    const clearRoomCode = () => {
        setCode(null);
    };

    return (
        <div className="center">
        <Router>
            <Routes>
                <Route path="/" element={code ? <Navigate to={`/room/${code}`} /> : <HomePage />} />
                <Route path="/join" element={<JoinRoomPage />} />
                <Route path="/create" element={<CreateRoomPage />} />
                <Route path="/room/:roomCode" element={<Room leaveRoomCallback={clearRoomCode}/>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
        </div>       
      )

};

const appDiv = document.getElementById("app");
// render the App component inside appDiv
render(<App />, appDiv)