import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CreateRoomPage() {
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

    const [guestCanControl, setGuestCanControl] = useState(true);
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [error, setError] = useState("");

    async function createRoom() {
        try {
            const res = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/create-room",
                { guest_can_pause: guestCanControl, votes_to_skip: votesToSkip }
            );
            console.log(res);
            navigate("/");
        } catch (error: any) {
            setError(error.response.data.message);
        }
    }

    return (
        <div className="h-full flex justify-center items-center dark:bg-black">
            <Card className="w-[350px] border border-black dark:border-white dark:bg-black dark:text-white">
                <CardHeader>
                    <CardTitle className="text-center">Create a room</CardTitle>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-4">
                                <Label>Guest Can Control</Label>
                                <RadioGroup
                                    defaultValue="true"
                                    className="flex flex-row justify-around"
                                    onValueChange={(val) => {
                                        setGuestCanControl(val === "true");
                                    }}
                                    value={String(guestCanControl)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="true"
                                            id="r1"
                                            className="dark:bg-white"
                                        />
                                        <Label
                                            htmlFor="r1"
                                            className="cursor-pointer"
                                        >
                                            Play/Pause
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="false"
                                            id="r2"
                                            className="dark:bg-white"
                                        />
                                        <Label
                                            htmlFor="r2"
                                            className="cursor-pointer"
                                        >
                                            No Control
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="flex flex-col space-y-4 mt-2">
                                <Label htmlFor="votes">
                                    Votes Required To Skip Song
                                </Label>
                                <Input
                                    id="votes"
                                    type="number"
                                    placeholder="Votes to skip"
                                    className="border border-black dark:bg-black dark:border-white"
                                    min={1}
                                    max={999}
                                    value={votesToSkip}
                                    onChange={(event) =>
                                        setVotesToSkip(
                                            Number(event.target.value)
                                        )
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
                        onClick={createRoom}
                    >
                        Create
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
