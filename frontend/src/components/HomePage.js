import React from "react";
import { useState, useEffect } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import Home from "./Home";
import Info from "./info";
// import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link,
  Redirect,
} from "react-router-dom";

function HomePage(props) {
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    fetch("/api/userInRoom")
      .then((response) => response.json())
      .then((data) => setRoomCode(data.code));
  });

  const clearRoomCode = () => {
    setRoomCode(null);
  };

  return (
    <div>
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return roomCode ? (
                <Redirect to={`/room/${roomCode}`} />
              ) : (
                <Home />
              );
            }}
          />
          <Route path="/join" component={RoomJoinPage} />
          <Route path="/info" component={Info} />
          <Route path="/create" component={CreateRoomPage} />
          <Route
            path="/room/:roomCode"
            render={(props) => {
              return <Room {...props} leaveRoomCallback={clearRoomCode} />;
            }}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default HomePage;
