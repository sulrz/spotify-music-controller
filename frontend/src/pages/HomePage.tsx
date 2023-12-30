import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

export default function HomePage() {
    const navigate = useNavigate();
    const [activeCode, setActiveCode] = useState("");

    if (activeCode) {
        navigate("/room/" + activeCode);
    }

    useEffect(() => {
        (async () => {
            const res = await axios.get(
                import.meta.env.VITE_BACKEND_URL + "/api/user-in-room"
            );
            console.log(res);
            if (res?.data?.code) {
                setActiveCode(res.data.code);
            }
        })();
    }, []);

    return (
        <div className="h-full flex justify-center items-center dark:bg-black">
            <Card className="w-[350px] border border-black dark:border-white dark:bg-black dark:text-white">
                <CardHeader>
                    <CardTitle className="text-center">
                        Spotify Music Controller
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex justify-between">
                    <Button
                        className="w-36 border border-black"
                        variant="secondary"
                        onClick={() => navigate("/join")}
                    >
                        Join a Room
                    </Button>
                    <Button
                        className="w-36 border dark:bg-black"
                        onClick={() => navigate("/create-room")}
                    >
                        Create a Room
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
