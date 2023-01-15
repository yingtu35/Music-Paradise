import React from "react"
import { Link } from "react-router-dom";
import { Grid, Typography, Button, ButtonGroup } from "@mui/material"

export default function HomePage(props) {

  return (<Grid container spacing={3} align="center">
  <Grid item xs={12} >
    <Typography variant="h3" component="h3">
      Music Paradise
    </Typography>
  </Grid>
  <Grid item xs={12} >
    <ButtonGroup disableElevation variant="contained">
      <Button color="primary" to="/create" component={Link}>
        Create a Room
      </Button>
      <Button color="secondary" to="/join" component={Link}>
        Join a Room
      </Button>
    </ButtonGroup>
  </Grid>
</Grid>)
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