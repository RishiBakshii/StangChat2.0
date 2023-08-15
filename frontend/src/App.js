import { Home } from "./screens/Home";
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import { Aboutfaculty } from "./screens/Aboutfaculty";
import { Settings } from "./screens/Settings";
import { Schedule } from "./screens/Schedule";
import { Profile } from "./screens/Profile";
import { Friends } from "./screens/Friends";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/aboutfaculty" element={<Aboutfaculty/>}/>
        <Route exact path="/settings" element={<Settings/>}/>
        <Route exact path="/upcomingclasses" element={<Schedule/>}/>
        <Route exact path="/profile" element={<Profile/>}/>
        <Route exact path="/friends" element={<Friends/>}/>
      </Routes>
    </Router>
  );
}

export default App;
