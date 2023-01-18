import React, { useState, useEffect } from "react";
import { Box, Card, CardMedia, Grid, IconButton, Typography, LinearProgress, CardContent, Collapse, Alert} from "@mui/material"
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

export default function MusicPlayer(props) {
    const defaultImg = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
    const [title, setTitle] = useState(props.title || 'Unknown Title');
    const [artist, setArtist] = useState(props.artist || 'Unknown Artist');
    const [duration, setDuration] = useState(props.duration || 100);
    const [time, setTime] = useState(props.time || 0);
    const [image_url, setImageUrl] = useState(props.image_url || defaultImg);
    const [is_playing, setIsPlaying] = useState(props.is_playing || false);
    const [votes, setVotes] = useState(props.votes || 0);
    const [id, setId] = useState(props.id || "");

    const[errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        setTitle(props.title || 'Unknown Title');
        setArtist(props.artist || 'Unknown Artist');
        setDuration(props.duration || 100);
        setTime(props.time || 0);
        setImageUrl(props.image_url || defaultImg);
        setIsPlaying(props.is_playing || false);
        setVotes(props.votes || 0);
        setId(props.id || "");
    }, [props.title, props.artist, props.duration, props.time, props.image_url, props.is_playing, props.votes, props.id])

    const progress = (time / duration) * 100;

    function handlePauseButtonPressed() {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      }
      fetch("/spotify/pause-song", requestOptions)
      .then((response) => {
        if (response.status === 403) {
          setErrorMsg("Forbidden. No access to pause the song.");
          return
        } else if(!response.ok) {
          setErrorMsg("Error occurred. Please retry or check if song is loaded.");
          return
        } else{
          return response.json();
        }
      })
    }

    function handlePlayButtonPressed() {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      }
      fetch("/spotify/play-song", requestOptions)
      .then((response) => {
        if (response.status === 403) {
          setErrorMsg("Forbidden. No access to play the song.");
          return
        } else if(!response.ok) {
          setErrorMsg("Error occurred. Please retry or check if song is loaded.");
          return
        } else{
          return response.json();
        }
      })
    }

    function handleSkipNextButtonPressed() {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      }
      fetch("/spotify/skip-to-next", requestOptions)
      .then((response) => {
        if (!response.ok) {
          setErrorMsg("Error occurred. Please retry or check if song is loaded.");
          return
        } else{
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      })
    }

    function handleSkipPreviousButtonPressed() {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      }
      fetch("/spotify/skip-to-previous", requestOptions)
      .then((response) => {
        if (!response.ok) {
          setErrorMsg("Error occurred. Please retry or check if song is loaded.");
          return
        } else{
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      })
    }

    return (
        <Card>
        <Grid container alignItems="center">
          <Grid item xs={12} >
              <Collapse in={errorMsg != ""}>
                  <Alert severity="error" onClose={() => setErrorMsg("")}> {errorMsg} </Alert>
              </Collapse>
          </Grid>
          <Grid item align="center" xs={8}>
            <Typography component="h5" variant="h5">
              {title}
            </Typography>
            <Typography color="text.secondary" variant="subtitle1">
              {artist}
            </Typography>
            <div>
            <IconButton >
                <SkipPreviousIcon onClick={handleSkipPreviousButtonPressed} sx={{ height: 45, width: 45 }}/>
              </IconButton>
              <IconButton>
                {is_playing ? <PauseIcon onClick={handlePauseButtonPressed} sx={{ height: 45, width: 45 }}/> : 
                                    <PlayArrowIcon onClick={handlePlayButtonPressed} sx={{ height: 45, width: 45 }}/>}
              </IconButton>
              <IconButton>
                <SkipNextIcon onClick={handleSkipNextButtonPressed} sx={{ height: 45, width: 45 }}/>
              </IconButton>
            </div>
          </Grid>
          <Grid item align="center" xs={4}>
            <img src={image_url} height="100%" width="100%" />
          </Grid>
        </Grid>
        <LinearProgress variant="determinate" value={progress} />
      </Card>
    )
}