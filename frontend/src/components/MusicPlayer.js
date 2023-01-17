import React from "react";
import { Box, Card, CardMedia, Grid, IconButton, Typography, LinearProgress, CardContent} from "@mui/material"
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

export default function MusicPlayer(props) {

    const progress = (props.time / props.duration) * 100;

    return (
        <Card>
        <Grid container alignItems="center">
          <Grid item align="center" xs={8}>
            <Typography component="h4" variant="h4">
              {props.title}
            </Typography>
            <Typography color="text.secondary" variant="subtitle1">
              {props.artist}
            </Typography>
            <div>
            <IconButton >
                <SkipPreviousIcon sx={{ height: 45, width: 45 }}/>
              </IconButton>
              <IconButton>
                {props.is_playing ? <PauseIcon sx={{ height: 45, width: 45 }}/> : <PlayArrowIcon sx={{ height: 45, width: 45 }}/>}
              </IconButton>
              <IconButton>
                <SkipNextIcon sx={{ height: 45, width: 45 }}/>
              </IconButton>
            </div>
          </Grid>
          <Grid item align="center" xs={4}>
            <img src={props.image_url} height="100%" width="100%" />
          </Grid>
        </Grid>
        <LinearProgress variant="determinate" value={progress} />
      </Card>
    )
}