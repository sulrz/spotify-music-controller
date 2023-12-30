import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RoomJoinPage from "./pages/RoomJoinPage";
import NotFoundPage from "./pages/NotFoundPage";
import CreateRoomPage from "./pages/CreateRoomPage";
import RoomPage from "./pages/RoomPage";

function App() {
    return (
        <main className="h-screen">
            <BrowserRouter>
                <Routes>
                    <Route index path="/" element={<HomePage />}></Route>
                    <Route path="/join" element={<RoomJoinPage />}></Route>
                    <Route
                        path="/create-room"
                        element={<CreateRoomPage />}
                    ></Route>
                    <Route
                        path="/room/:roomCode"
                        element={<RoomPage />}
                    ></Route>
                    <Route path="*" element={<NotFoundPage />}></Route>
                </Routes>
            </BrowserRouter>
        </main>
    );
}

export default App;
