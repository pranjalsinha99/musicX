import React from "react";
import { useState, useEffect } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

function Room(props) {
  const [voteToSkip, setVoteToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const roomCode = props.match.params.roomCode;
  const [showSettings, setShowSettings] = useState(false);
  const [SpotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});

  useEffect(() => {
    getRoomDetails();
    const interval = setInterval(getCurrentSong, 500);

    return function cleanup() {
      clearInterval(interval);
    };
  }, [getRoomDetails]);

  function getRoomDetails() {
    fetch("/api/get-room" + "?code=" + roomCode)
      .then((response) => {
        if (!response.ok) {
          props.leaveRoomCallback();
          props.history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        setVoteToSkip(data.vote_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
      });
    if (isHost) {
      authenticateSpotify();
    }
  }

  // useEffect(() => {
  //   fetch("/api/get-room" + "?code=" + roomCode)
  //     .then((response) => {
  //       if (!response.ok) {
  //         props.leaveRoomCallback();
  //         props.history.push("/");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setVoteToSkip(data.vote_to_skip);
  //       setGuestCanPause(data.guest_can_pause);
  //       setIsHost(data.is_host);
  //     });
  //   if (isHost) {
  //     authenticateSpotify();
  //   }
  // });

  function authenticateSpotify() {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setSpotifyAuthenticated(data.status);
        console.log(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  }

  function getCurrentSong() {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setSong(data);
        console.log(data);
      });
  }

  function leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((_response) => {
      props.leaveRoomCallback();
      props.history.push("/");
    });
  }

  function renderSettings() {
    return (
      <Grid container spacing={1} align="center">
        <Grid item xs={12}>
          <CreateRoomPage
            update={true}
            voteToSkip={voteToSkip}
            guestCanPause={guestCanPause}
            roomCode={roomCode}
            updateCallback={null}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }

  function renderSettingsButton() {
    return (
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  }

  if (showSettings) {
    return renderSettings();
  }
  return (
    <Grid container spacing={1} align="center">
      <Grid item xs={12}>
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      {/* <Grid item xs={12}>
        <Typography variant="h6" component="h6">
          Votes: {voteToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" component="h6">
          Guest Can Pause: {guestCanPause.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" component="h6">
          Host: {isHost.toString()}
        </Typography>
      </Grid> */}
      <MusicPlayer {...song} />
      {isHost ? renderSettingsButton() : null}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="secondary"
          onClick={leaveButtonPressed}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}

export default Room;
