import React, { useEffect, useState } from "react"
import CreateRoomPage from "./CreateRoomPage";
import JoinRoomPage from "./JoinRoomPage";
import Room from "./Room";
import { BrowserRouter as Router, Routes, Route, Link, Navigate} from "react-router-dom";
import NotFound from "./NotFound";
import { render } from "react-dom";
import HomePage from "./HomePage";


export default function App(props) {
    var responseClone;
    const [code, setCode] = useState(null);

    useEffect(() => {
        async function autoEnter() {
        fetch("/api/user-in-room")
        .then((response) => {
            responseClone = response.clone();
            return response.json()})
        // Error: not returning the Json format
        .then((data) => setCode(data.code), (rejectReason) => {
            console.log('Error parsing JSON from response:', rejectReason, responseClone);
            responseClone.text()
            .then((bodyText) => console.log('Received the following instead of valid JSON:', bodyText))
        })
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
                {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
        </Router>
        </div>       
      )

};

const appDiv = document.getElementById("app");
// render the App component inside appDiv
render(<App />, appDiv)