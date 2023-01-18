import React, { useState, useEffect, useRef } from "react";
import { Box, Card, CardMedia, Grid, IconButton, Typography, LinearProgress, CardContent, Collapse, Alert, Stack, Slider} from "@mui/material"
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";

export default function MusicPlayer(props) {
    const defaultImg = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
    const [title, setTitle] = useState(props.title || 'Unknown Title');
    const [artist, setArtist] = useState(props.artist || 'Unknown Artist');
    const [duration, setDuration] = useState(props.duration || 100);
    const [time, setTime] = useState(props.time || 0);
    const [image_url, setImageUrl] = useState(props.image_url || defaultImg);
    const [is_playing, setIsPlaying] = useState(props.is_playing || false);
    const [votes_next, setVotesNext] = useState(props.votes_next || 0);
    const [votes_prev, setVotesPrev] = useState(props.votes_prev || 0);
    const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip || 1);
    const [id, setId] = useState(props.id || "");

    const [volume, setVolume] = useState(50);

    const[errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        setTitle(props.title || 'Unknown Title');
        setArtist(props.artist || 'Unknown Artist');
        setDuration(props.duration || 100);
        setTime(props.time || 0);
        setImageUrl(props.image_url || defaultImg);
        setIsPlaying(props.is_playing || false);
        setVotesNext(props.votes_next || 0);
        setVotesPrev(props.votes_prev || 0);
        setVotesToSkip(props.votesToSkip || 1);
        setId(props.id || "");
    }, [props.title, props.artist, props.duration, props.time, props.image_url, props.is_playing, props.votes_next, props.votes_prev, props.votesToSkip, props.id])

    const progress = (time / duration) * 100;

    function formatTime(value) {
      const minute = Math.floor(value / 1000 / 60);
      const secondLeft = Math.floor((value / 1000) % 60);
      return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
    }

    // currently cannot get volume information about the song when using iOS device
    function handleVolumeChange(e, value) {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "volume_percent": value })
      }
      fetch("/spotify/set-volume", requestOptions)
      .then((response) => {
        if (response.status === 403) {
          setErrorMsg("Forbidden. No access to change the volume.");
          return
        } else if(!response.ok) {
          setErrorMsg("Error occurred. Please retry or check if song is loaded.");
          return
        } else{
          setVolume(value);
          return response.json();
        }
      })
    }

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
        if (response.status === 403) {
          setErrorMsg("You already voted.");
          return
        } else if (!response.ok) {
          setErrorMsg("Error occurred. Please retry or check if song is loaded.");
          return response.json();
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
        if (response.status === 403) {
          setErrorMsg("You already voted.");
          return
        } else if (!response.ok) {
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
              <Collapse in={errorMsg != ""} timeout={1000}>
                  <Alert severity="error" onClose={() => setErrorMsg("")}> {errorMsg} </Alert>
              </Collapse>
          </Grid>
          <Grid item align="center" xs={8} p={1}>
            <Typography component="h5" variant="h5">
              {title}
            </Typography>
            <Typography color="text.secondary" variant="subtitle1">
              {artist}
            </Typography>
            <Grid item align="center" xs={8} p={2} mx={4}>
              <LinearProgress variant="determinate" value={progress} sx={{mb: 1}} />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 1,
                  }}
                >
                  <Typography component="caption" variant="caption">
                    {formatTime(time)}
                  </Typography>
                  <Typography component="caption" variant="caption">
                    {formatTime(duration)}
                  </Typography>
                </Box>
            </Grid>
            <Grid item align="center" xs={8} mt={-2}>
               <Typography component="button" variant="button">
                  {votes_prev} / {votesToSkip}
                </Typography>
              <IconButton >
                <SkipPreviousIcon onClick={handleSkipPreviousButtonPressed} sx={{ height: 40, width: 40 }}/>
              </IconButton>
              <IconButton>
                {is_playing ? <PauseIcon onClick={handlePauseButtonPressed} sx={{ height: 40, width: 40 }}/> : 
                                    <PlayArrowIcon onClick={handlePlayButtonPressed} sx={{ height: 40, width: 40 }}/>}
              </IconButton>
              <IconButton>
                <SkipNextIcon onClick={handleSkipNextButtonPressed} sx={{ height: 40, width: 40 }}/>
              </IconButton>
              <Typography component="button" variant="button">
                {votes_next} / {votesToSkip}
              </Typography>
            </Grid>
            <Grid item align="center" xs={8} mt={2}>
              <Stack spacing={2} direction="row" sx={{ mb: 1, px: 4 }} alignItems="center">
                  <VolumeDown />
                  <Slider disabled
                          aria-label="Disabled slider" 
                          defaultValue={50}
                          // value={volume}
                          valueLabelDisplay="auto"
                          step={5}
                          min={0}
                          max={100}
                          // onChangeCommitted={handleVolumeChange}
                          />
                  <VolumeUp />
                </Stack>
            </Grid> 
          </Grid>
          <Grid item align="center" xs={4}>
            <img src={image_url} height="100%" width="100%" />
          </Grid>
        </Grid>
      </Card>
    )
}