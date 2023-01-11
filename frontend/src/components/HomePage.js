import React from "react"
import CreateRoomPage from "./CreateRoomPage";
import JoinRoomPage from "./JoinRoomPage";
import Room from "./Room";
import { BrowserRouter as Router, Routes, Route, Link, Redirect } from "react-router-dom";
import NotFound from "./NotFound";

export default function HomePage(props) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<p>This is the home page</p>} />
        <Route path="/join" element={<JoinRoomPage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path="/room/:roomCode" element={<Room />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
};

// Class component version
// export default class HomePage extends Component {
//     constructor(props) {
//         super(props);
//     }

//     render () {
//         return (
//             <Router>
//               <Routes>
//                 <Route path="/" element={<p>This is home page</p>} />
//                 <Route path="/join" element={<JoinRoomPage />} />
//                 <Route path="/create" element={<CreateRoomPage />} />
//                 <Route path="/room/:roomCode" element={<Room />} />
//                 <Route path="*" element={<NotFound />} />
//               </Routes>
//             </Router>
//           );
//     }
// }