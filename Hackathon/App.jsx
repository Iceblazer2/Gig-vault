import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import WorkerList from "./pages/WorkerList";
import WorkerProfile from "./pages/WorkerProfile";
import Booking from "./pages/Booking";
import Confirmation from "./pages/Confirmation";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workers" element={<WorkerList />} />
        <Route path="/workers/:id" element={<WorkerProfile />} />
        <Route path="/book/:id" element={<Booking />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </BrowserRouter>
  );
}
