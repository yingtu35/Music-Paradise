import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Grid, FormControl, FormHelperText, Typography, RadioGroup, FormControlLabel, TextField, Button, Radio } from "@mui/material";

export default function CreateRoomPage(props) {
    const navigate = useNavigate();
    const[defaultVotes, setDefaultVotes] = useState(2);
    const[guestCanPause, setGuestCanPause] = useState(true);
    const[votesToSkip, setVotesToSkip] = useState(defaultVotes);

    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value);
    };

    const handleGuestCanPauseChange = (e) => {
        setGuestCanPause(e.target.value)
    };

    const handleCreateRoomButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
            }),
        };
        fetch("/api/create-room", requestOptions)
            .then((response) => response.json())
            .then((data) => navigate("/room/" + data.code));
    };

    return (<Grid container spacing={1}>
        <Grid item xs={12} align="center">
            <Typography component="h4" variant="h4">
                Create A Room
            </Typography>
        </Grid>
        <Grid item xs={12} align="center">
            <FormControl component="fieldset">
                <FormHelperText>
                <div align="center">Guest Control of Playback State</div>
                </FormHelperText>
                <RadioGroup
                    row
                    defaultValue="true"
                    onChange={handleGuestCanPauseChange}
                >
                    <FormControlLabel
                            value="true"
                            control={<Radio color="primary" />}
                            label="Play/Pause"
                            labelPlacement="bottom"
                    />
                    <FormControlLabel
                        value="false"
                        control={<Radio color="secondary" />}
                        label="No Control"
                        labelPlacement="bottom"
                    />
                </RadioGroup>
            </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
            <FormControl>
                <TextField
                required={true}
                type="number"
                onChange={handleVotesChange}
                defaultValue={defaultVotes}
                inputProps={{
                    min: 1,
                    style: { textAlign: "center" },
                }}
                />
                <FormHelperText>
                <div align="center">Votes Required To Skip a Song</div>
                </FormHelperText>
            </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
            <Button
                color="primary"
                variant="contained"
                onClick={handleCreateRoomButtonPressed}
            >
                Create A Room
            </Button>
        </Grid>
        <Grid item xs={12} align="center">
            <Button color="secondary" variant="contained" to="/" component={Link}>
                Back
            </Button>
        </Grid>
    </Grid>)
};

    // Class component does not work as this.props.history is not working anymore
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         guestCanPause: true,
    //         votesToSkip: this.defaultVotes,
    //     };
        
    //     // allow methods to get access to "this"
    //     this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
    //     this.handleVotesChange = this.handleVotesChange.bind(this);
    //     this.handleCreateRoomButtonPressed = this.handleCreateRoomButtonPressed.bind(this);
    // }

    // handleVotesChange(e) {
    //     this.setState({
    //         votesToSkip: e.target.value
    //     })
    // }

    // handleGuestCanPauseChange(e) {
    //     this.setState({
    //         guestCanPause: e.target.value === "true" ? true : false
    //     })
    // }

    // handleCreateRoomButtonPressed() {
    //     const requestOptions = {
    //         method: "POST",
    //         headers: {"Content-Type": "application/json"},
    //         body: JSON.stringify({
    //             votes_to_skip: this.state.votesToSkip,
    //             guest_can_pause: this.state.guestCanPause,
    //         }),
    //     };
    //     fetch("/api/create-room", requestOptions)
    //         .then((response) => response.json())
    //         .then((data) => this.props.history.push("/room/" + data.code));
    // }