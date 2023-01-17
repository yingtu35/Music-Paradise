import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Grid, Typography, Button} from "@mui/material"
import CreateRoomPage from "./CreateRoomPage";

export default function Room(props) {
    const navigate = useNavigate();

    const[votesToSkip, setVotesToSkip] = useState(2);
    const[guestCanPause, setGuestCanPause] = useState(false);
    const[isHost, setIsHost] = useState(false);
    const[updateSettings, setUpdateSettings] = useState(false);
    const { roomCode } = useParams();
    const[spotifyAuth, setSpotifyAuth] = useState(false);

    var responseClone;

    const handleLeaveRoomButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"}
        };
        fetch("/api/leave-room", requestOptions)
            .then((response) => {
                if (response.ok) {
                    props.leaveRoomCallback();
                    navigate("/");
                }
            });
    }

    const handleSettingsButtonPressed = (value) => { setUpdateSettings(value) };

    const renderSettingsButton = () => {
        return (<Grid item xs={12}>
            <Button 
                color="primary" 
                variant="contained"
                onClick={handleSettingsButtonPressed} 
            >
                Settings
            </Button>
        </Grid>)
    };

    const renderSettings = () => {
        return (
            <Grid container spacing={1} align="center">
                <Grid item xs={12}>
                <CreateRoomPage 
                    update={true} 
                    votes_to_skip={votesToSkip} 
                    guest_can_pause={guestCanPause} 
                    roomCode = {roomCode}
                    updateCallback={getRoomSettings}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button 
                        color="secondary" 
                        variant="contained"
                        onClick={() => {setUpdateSettings(false)}} 
                    >
                        Close
                    </Button>
                </Grid>
            </Grid>)
    }

    function authenticateSpotify() {
        fetch("/spotify/is-authenticated")
        .then((response) => {
            responseClone = response.clone();
            return response.json()})
        .then((data) => {
            setSpotifyAuth(data.status);
            // console.log(data.status);
            if (!data.status) {
            fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => window.location.replace(data.url));
            }}, (rejectReason) => {
            console.log('Error parsing JSON from response:', rejectReason, responseClone);
            responseClone.text()
                .then((bodyText) => console.log('Received the following instead of valid JSON:', bodyText))
            })
    }

    function getRoomSettings () {
        fetch("/api/get-room" + "?code=" + roomCode)
        .then((response) => response.json())
        .then((data) => {
            setVotesToSkip(data.votes_to_skip);
            setGuestCanPause(data.guest_can_pause);
            setIsHost(data.is_host);
            if (data.is_host) {
                authenticateSpotify();
            }
        });
    }

    useEffect(() => {
        getRoomSettings();
        return () => {
            // clean up previous effect here
        }
    }, [roomCode]);

    if (updateSettings){
        return renderSettings();
    }
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
        {isHost ? renderSettingsButton() : null}
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