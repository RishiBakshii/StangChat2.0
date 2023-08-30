import { Home } from "./screens/Home";
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import { Aboutfaculty } from "./screens/Aboutfaculty";
import { Settings } from "./screens/Settings";
import { Schedule } from "./screens/Schedule";
import { Profile } from "./screens/Profile";
import { Friends } from "./screens/Friends";
import { Login } from "./screens/Login";
import { Signup } from "./screens/Signup";
import LeftbarMobile from "./components/LeftbarMobile";
import { Userstate } from "./context/user/Userstate";
import { Poststate } from "./context/posts/Poststate";
import { Search } from "./screens/Search";

function App() {
  return (
    <>
    <Poststate>
    <Userstate>
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/aboutfaculty" element={<Aboutfaculty/>}/>
        <Route exact path="/settings" element={<Settings/>}/>
        <Route exact path="/upcomingclasses" element={<Schedule/>}/>
        <Route exact path="/profile/:username" element={<Profile/>}/>
        <Route exact path="/friends" element={<Friends/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/signup" element={<Signup/>}/>
        <Route exact path="/leftbarmobile" element={<LeftbarMobile/>}/>
        <Route exact path="/search" element={<Search/>}/>
      </Routes>
    </Router>
    </Userstate>
    </Poststate>
    </>
  );
}

export default App;
