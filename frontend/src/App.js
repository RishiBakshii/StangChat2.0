import { Home } from "./screens/Home";
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import { Settings } from "./screens/Settings";
import { Profile } from "./screens/Profile";
import { Friends } from "./screens/Friends";
import { Login } from "./screens/Login";
import { Signup } from "./screens/Signup";
import LeftbarMobile from "./components/LeftbarMobile";
import { Userstate } from "./context/user/Userstate";
import { Poststate } from "./context/posts/Poststate";
import { Search } from "./screens/Search";
import {Explore } from './screens/Explore'
import { RightBarState } from "./context/rigthbar/RightbarState";
import { LeaderBoard } from "./screens/LeaderBoard";
import { NotFound } from "./screens/NotFound";
import { GlobalAlertState } from "./context/globalAlert/GlobalAlertState";
import { GlobalChat } from "./screens/GlobalChat";
import AWS from 'aws-sdk';
import { useContext, useEffect } from "react";
import { AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_KEY } from "./envVariables";
import { GlobalAlertContext } from "./context/globalAlert/GlobalAlertContext";

function App() {

  // const setGlobalAlertOpen=useContext(GlobalAlertContext)

  useEffect(()=>{
    try {
      AWS.config.update({
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
        region: AWS_REGION
      })

      // setGlobalAlertOpen({state:true,message:"🎉✅🎉✅"})
    } catch (error) {
      // setGlobalAlertOpen({state:true,message:"Error establishing the connection with cloud servers😖"})
      console.log(error)
    }
  },[])

  return (
    <Router basename="/">
    <GlobalAlertState>
    <RightBarState>
    <Poststate>
    <Userstate>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/settings" element={<Settings/>}/>
        <Route exact path="/profile/:username" element={<Profile/>}/>
        <Route exact path="/friends" element={<Friends/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/signup" element={<Signup/>}/>
        <Route exact path="/leftbarmobile" element={<LeftbarMobile/>}/>
        <Route exact path="/search" element={<Search/>}/>
        <Route exact path="/explore" element={<Explore/>}/>
        <Route exact path="/leaderboard" element={<LeaderBoard/>}/>
        <Route exact path="/globalchat" element={<GlobalChat/>}/>
        <Route exact path="*" element={<NotFound/>}/>
      </Routes>
    </Userstate>
    </Poststate>
    </RightBarState>
    </GlobalAlertState>
    </Router>

  );
}

export default App;
