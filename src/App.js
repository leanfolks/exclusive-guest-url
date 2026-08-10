import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./global.scss";
import BookingPage from "./pages/BookingPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:randomString" element={<BookingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
