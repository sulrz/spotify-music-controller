import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="h-12 p-6 pt-8 flex justify-center">
            <div className="w-full h-full flex items-center justify-between max-w-3xl">
                <h1>Music Controller</h1>
                <div className="flex space-x-4 ml-4">
                    <Link
                        to="/"
                        className="border border-black rounded-lg px-2 py-1 text-center"
                    >
                        Home
                    </Link>
                    <Link
                        to="/create-room"
                        className="border border-black rounded-lg px-2 py-1 text-center"
                    >
                        Create a Room
                    </Link>
                    <Link
                        to="/join"
                        className="border border-black rounded-lg px-2 py-1 text-center"
                    >
                        Join a Room
                    </Link>
                </div>
            </div>
        </nav>
    );
}
