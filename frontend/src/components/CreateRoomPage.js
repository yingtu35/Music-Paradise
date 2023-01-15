import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Grid, FormControl, FormHelperText, Typography, RadioGroup, FormControlLabel, TextField, Button, Radio, Collapse, Alert } from "@mui/material";

export default function CreateRoomPage(props) {
    const { update = false,
         votes_to_skip = 2,
          guest_can_pause = true,
           roomCode = null,
            updateCallback = () => {} } = props;

    const navigate = useNavigate();

    const[guestCanPause, setGuestCanPause] = useState(guest_can_pause);
    const[votesToSkip, setVotesToSkip] = useState(votes_to_skip);

    const title = update? "Update Room" : "Create A Room";

    const[successMsg, setSuccessMsg] = useState("");
    const[errorMsg, setErrorMsg] = useState("");

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

    function handleUpdateRoomButtonPressed() {
        const requestOptions = {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
                code: roomCode,
            }),
        };
        fetch("/api/update-room", requestOptions)
            .then((response) => {
                if (response.ok) {
                    props.updateCallback(response.json());
                    setSuccessMsg("Room updated successfully!");
                } else{
                    setErrorMsg("Error updating room...");
                }})
    };

    function renderCreateButtons() {
        return (<Grid container spacing={1} align="center">
        <Grid item xs={12}>
            <Button
                color="primary"
                variant="contained"
                onClick={handleCreateRoomButtonPressed}
            >
                Create A Room
            </Button>
        </Grid>
        <Grid item xs={12}>
            <Button color="secondary" variant="contained" to="/" component={Link}>
                Back
            </Button>
        </Grid>
    </Grid>)
    };

    function renderUpdateButtons() {
        return (<Grid container spacing={1} align="center">
        <Grid item xs={12}>
            <Button
                color="primary"
                variant="contained"
                onClick={handleUpdateRoomButtonPressed}
            >
                Update Room
            </Button>
        </Grid>
    </Grid>)
    }

    return (<Grid container spacing={1} align="center">
        <Grid item xs={12} >
            <Collapse in={successMsg != "" || errorMsg != ""}>
                {successMsg != "" ? (
                <Alert severity="success" onClose={() => setSuccessMsg("")}> {successMsg} </Alert>
                ) : (
                <Alert severity="error" onClose={() => setErrorMsg("")}> {errorMsg} </Alert>
                )}
            </Collapse>
        </Grid>
        <Grid item xs={12} >
            <Typography component="h4" variant="h4">
                {title}
            </Typography>
        </Grid>
        <Grid item xs={12} >
            <FormControl component="fieldset">
                <FormHelperText>
                <div >Guest Control of Playback State</div>
                </FormHelperText>
                <RadioGroup
                    row
                    defaultValue={guestCanPause}
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
        <Grid item xs={12} >
            <FormControl>
                <TextField
                required={true}
                type="number"
                onChange={handleVotesChange}
                defaultValue={votesToSkip}
                inputProps={{
                    min: 1,
                    style: { textAlign: "center" },
                }}
                />
                <FormHelperText>
                <div >Votes Required To Skip a Song</div>
                </FormHelperText>
            </FormControl>
        </Grid>
        {update? renderUpdateButtons() : renderCreateButtons()}
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