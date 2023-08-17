import './App.css';

import { Routes, Route} from "react-router-dom";
import Frame from './pages/Frame'
import Home from './pages/home';
import Transactions from './pages/Transactions';
import SearchParams from './components/SearchParams';
import Transaction from './pages/Transaction';
import Trips from './pages/Trips';
import Friends from './pages/Friends';
import Manage from './pages/Manage';
import Inbox from './pages/Inbox';
import Trip from './pages/Trip'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Frame/>} >
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} >
            <Route path=":id" element={<Transaction/>} />
          </Route>
          <Route path="/trips" element={<Trips/>} />
          <Route path="/friends" element={<Friends/>} />
          <Route path="/inbox" element={<Inbox/>} />
          <Route path="/manage" element={<Manage/>} />
          <Route path="/transactions/trip/:id" element={<Trip/>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
