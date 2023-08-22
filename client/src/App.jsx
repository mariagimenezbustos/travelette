import './App.css';

import { Routes, Route } from "react-router-dom";
import Frame from './pages/Frame'
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import SearchParams from './components/SearchParams';
import Transaction from './pages/Transaction';
import Trips from './pages/Trips';
import Friends from './pages/Friends';
import Manage from './pages/Manage';
import Inbox from './pages/Inbox';
import Trip from './pages/Trip';
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";


function App() {
  return (
      <Routes>
        <Route path="/" element={<Frame/>} >
          <Route path="/" element={<Login />} />
          <Route path="/transactions/user/:username" element={<Transactions />} />
          <Route path="/transactions/:id" element={<Transaction />}/>
          <Route path="/trips" element={<Trips/>} />
          <Route path="/friends" element={<Friends/>} />
          <Route path="/inbox" element={<Inbox/>} />
          <Route path="/manage" element={<Manage/>} />
          <Route path="/transactions/trip/:id" element={<Trip/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/register" element={<Register />}/>
        </Route>
      </Routes>
  )
}

export default App
