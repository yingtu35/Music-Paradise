import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Grid, Typography, Button} from "@mui/material"

export default function Room(props) {
    const navigate = useNavigate();
    const[votesToSkip, setVotesToSkip] = useState(2);
    const[guestCanPause, setGuestCanPause] = useState(false);
    const[isHost, setIsHost] = useState(false);

    const { roomCode } = useParams();

    const handleLeaveRoomButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        };
        fetch("/api/leave-room", requestOptions)
            .then((response) => {
                if (response.ok) {
                    props.leaveRoomCallback();
                    navigate("/");
                }
            });
    }
    fetch("/api/get-room" + "?code=" + roomCode)
    .then((response) => response.json())
    .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host)
    });

    return (<Grid container spacing={1} align="center">
        <Grid item xs={12}>
            <Typography component="h4" variant="h4">
                {roomCode}
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography component="body1" variant="string">
                Votes: {votesToSkip}
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography component="body1" variant="string">
                Guest Can Pause: {String(guestCanPause)}
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography component="body1" variant="string">
                Host: {String(isHost)}
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Button 
                color="secondary" 
                variant="contained"
                onClick={handleLeaveRoomButtonPressed} 
            >
                Leave Room
            </Button>
        </Grid>
    </Grid>)
};

// Class component does not work as this.props.match is not working anymore

// export default class Room extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             votesToSkip: 2,
//             guestCanPause: false,
//             isHost: false,
//         };
//         this.roomCode = this.props.match.params.roomCode;
//     }

//     render() {
//         return (
//             <div>
//                 <h3>{this.roomCode}</h3>
//                 <p>Votes: {this.state.votesToSkip}</p>
//                 <p>Guest Can Pause: {String(this.state.guestCanPause)}</p>
//                 <p>Host: {String(this.state.isHost)}</p>
//             </div>
//         )
//     }
// }