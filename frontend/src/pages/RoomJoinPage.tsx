import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoomJoinPage() {
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

    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    async function join() {
        try {
            const res = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/join-room",
                { code: code }
            );
            console.log(res);
            navigate(`/room/${code}`);
        } catch (error: any) {
            setError(error.response?.data?.message);
        }
    }

    return (
        <div className="h-full flex justify-center items-center dark:bg-black">
            <Card className="w-[350px] border border-black dark:border-white dark:bg-black dark:text-white">
                <CardHeader>
                    <CardTitle className="text-center">Join a Room</CardTitle>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-4">
                                <Label htmlFor="code">Code</Label>
                                <Input
                                    id="code"
                                    placeholder="Enter a Room Code"
                                    className="border border-black dark:bg-black dark:border-white"
                                    value={code}
                                    onChange={(event) =>
                                        setCode(event.target.value)
                                    }
                                />
                            </div>
                        </div>
                        {error && (
                            <div className="w-full flex items-center justify-center mt-4">
                                <p className="text-red-500">{error}</p>
                            </div>
                        )}
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        className="border border-black w-24"
                        variant="secondary"
                        onClick={() => navigate("/")}
                    >
                        Back
                    </Button>
                    <Button
                        className="w-24 border dark:bg-black"
                        onClick={join}
                    >
                        Join
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
