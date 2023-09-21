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
import { useEffect } from "react";
import { AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_KEY} from "./envVariables";
import { ThemeState } from "./context/Theme/ThemeState";
import { Chat } from "./screens/Chat";



function App() {

  useEffect(()=>{
    try {
      AWS.config.update({
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
        region: AWS_REGION
      })
    } catch (error) {
      console.log(error)
    }
  },[])

  return (
    <Router basename="/">
    <ThemeState>
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
        {/* <Route exact path="/chats" element={<Chat/>}/> */}
      </Routes>
    </Userstate>
    </Poststate>
    </RightBarState>
    </GlobalAlertState>
    </ThemeState>
    </Router>

  );
}

export default App;
