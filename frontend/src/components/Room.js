import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Grid, Typography, Button} from "@mui/material"
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default function Room(props) {
    const navigate = useNavigate();

    const[votesToSkip, setVotesToSkip] = useState(2);
    const[guestCanPause, setGuestCanPause] = useState(false);
    const[isHost, setIsHost] = useState(false);
    const[updateSettings, setUpdateSettings] = useState(false);
    const { roomCode } = useParams();
    const[spotifyAuth, setSpotifyAuth] = useState(false);
    const[song, setSong] = useState({});

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

    function getCurrentSong() {
        fetch("/spotify/current-song")
        .then((response) => {
            if (!response.ok){
                return {};
            } else{
                return response.json();
            }
        })
        .then((data) => {
            setSong(data);
            console.log(data);
        })
    };

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
        // effect 1: get the information of the room
        getRoomSettings();
        return () => {
            // clean up previous effect here
        }
    }, [roomCode]);

    useEffect(() => {
        // effect 2: get the current song information
        const interval = setInterval(getCurrentSong, 1000);
    
        return () => {
            clearInterval(interval);
        }
    }, []);

    if (updateSettings){
        return renderSettings();
    }
    return (<Grid container spacing={1} align="center">
        <Grid item xs={12}>
            <Typography component="h4" variant="h4">
                {roomCode}
            </Typography>
        </Grid>
        <MusicPlayer {...song}/>
        {/* {song} */}
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