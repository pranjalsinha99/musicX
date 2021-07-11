import React from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
  Collapse,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function CreateRoomPage(props) {
  const update = false;
  const roomcode = null;
  const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause);
  const [voteToSkip, setVoteChange] = useState(props.voteToSkip);
  const [errorMSG, setErrorMSG] = useState("");
  const [successMSG, setSuccessMSG] = useState("");
  const title = props.update ? "Room Settings" : "Create a Room";

  const handleRoomButtonPressed = () => {
    // console.log(voteToSkip, guestCanPause);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guest_can_pause: guestCanPause,
        vote_to_skip: voteToSkip,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => props.history.push("/room/" + data.code));
  };

  // COMBINE RENDER CREATE BUTTONS AND UPDATE BUTTONS LOGIC
  function renderCreateButtons() {
    return (
      <Grid container spacing={1} align="center">
        <Grid item xs={12}>
          <Button
            color="primary"
            variant="contained"
            onClick={handleRoomButtonPressed}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }

  const handleUpdateButtonPressed = () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guest_can_pause: guestCanPause,
        vote_to_skip: voteToSkip,
        code: props.roomCode,
      }),
    };
    fetch("/api/update-room", requestOptions).then((response) => {
      if (response.ok) {
        setSuccessMSG("Room Updated Succesfully");
      } else {
        setErrorMSG("Error Updating Room!");
      }
    });
  };

  function renderUpdateButtons() {
    return (
      <Grid item xs={12}>
        <Button
          color="primary"
          variant="contained"
          onClick={handleUpdateButtonPressed}
        >
          Update Room
        </Button>
      </Grid>
    );
  }
  // COMBINE RENDER CREATE BUTTONS AND UPDATE BUTTONS LOGIC

  return (
    <Grid container spacing={1} align="center">
      <Grid item xs={12}>
        <Collapse in={errorMSG != "" || successMSG != ""}>
          {successMSG != "" ? (
            <Alert severity="success" onClose={() => setSuccessMSG("")}>
              {successMSG}
            </Alert>
          ) : (
            <Alert severity="error" onClose={() => setErrorMSG("")}>
              {errorMSG}
            </Alert>
          )}
        </Collapse>
      </Grid>
      <Grid item xs={12}>
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={guestCanPause.toString()}
            onChange={(e) => setGuestCanPause(e.target.value)}
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
      <Grid item xs={12}>
        <FormControl>
          <TextField
            required={true}
            type="number"
            onChange={(e) => setVoteChange(e.target.value)}
            defaultValue={voteToSkip}
            inputProps={{ min: 1, style: { textAlign: "center" } }}
          />
          <FormHelperText>
            <div align="center">Votes Required To Skip</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {props.update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
}

CreateRoomPage.defaultProps = {
  voteToSkip: 2,
  guestCanPause: true,
  update: false,
  roomCode: null,
  updateCallback: () => {},
};

export default CreateRoomPage;
