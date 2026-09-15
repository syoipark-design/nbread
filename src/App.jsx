import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import SplitAmount from './pages/SplitAmount';
import SplitFriends from './pages/SplitFriends';
import SplitConfirm from './pages/SplitConfirm';
import SplitStatus from './pages/SplitStatus';
import SplitReRequest from './pages/SplitReRequest';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#c0c2c5]">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/split" element={<SplitAmount />} />
          <Route path="/split/friends" element={<SplitFriends />} />
          <Route path="/split/confirm" element={<SplitConfirm />} />
          <Route path="/split/status" element={<SplitStatus />} />
          <Route path="/split/re-request" element={<SplitReRequest />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;