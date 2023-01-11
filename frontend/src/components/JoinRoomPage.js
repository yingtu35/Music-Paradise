import { Grid, Typography, FormControl, TextField, FormHelperText, Button } from "@mui/material";
import React, { useState }  from "react";
import { Link, useNavigate } from "react-router-dom";

export default function JoinRoomPage(props) {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const handleCodeChange = (e) => {
        setCode(e.target.value);
    };

    const navigate = useNavigate();
    const handleJoinRoomButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                code: code,
            }),
        };

        fetch("/api/join-room", requestOptions)
        .then((response) => {
            if (response.ok) {
                navigate("/room/" + code);
            } else {
                setError("Room Not Found");
            }
        })
        .catch((error) => {
            console.log(error);
        });
    };

    // return <p>This is the join room page.</p>
    return (<Grid container spacing={1} align="center">
        <Grid item xs={12} >
            <Typography component="h4" variant="h4">
                Join Room
            </Typography>
        </Grid>
        <Grid item xs={12} >
            <FormControl>
                <TextField
                error={error}
                label="Code"
                placeholder= "Enter a Room Code"
                value = {code}
                required={true}
                type="text"
                helperText = {error}
                onChange={handleCodeChange}
                inputProps={{
                    style: { textAlign: "center" },
                }}
                />
            </FormControl>
        </Grid>
        <Grid item xs={12} >
            <Button
                color="primary"
                variant="contained"
                onClick={handleJoinRoomButtonPressed}
            >
                Enter Room
            </Button>
        </Grid>
        <Grid item xs={12} >
            <Button color="secondary" variant="contained" to="/" component={Link}>
                Back
            </Button>
        </Grid>
    </Grid>)
}



// export default class JoinRoomPage extends Component {
//     constructor(props) {
//         super(props);
//     }

//     render () {
//         return <p>This is the join room page.</p>;
//     }
// }