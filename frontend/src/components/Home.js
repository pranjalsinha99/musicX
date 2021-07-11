import React from "react";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Grid container spacing={3} align="center">
      <Grid item xs={12}>
        <Typography variant="h3" component="h3">
          MusicX
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <ButtonGroup disableElevation variant="contained" color="primary">
          <Button color="primary" to="/join" component={Link}>
            Join a Room
          </Button>
          <Button color="secondary" to="/create" component={Link}>
            Create a Room
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}

export default Home;
