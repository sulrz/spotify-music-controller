import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function RoomPage() {
    const navigate = useNavigate();

    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanControl, setGuestCanControl] = useState(false);
    const [settingsVotesToSkip, setSettingsVotesToSkip] = useState(2);
    const [settingsGuestCanControl, setSettingsGuestCanControl] =
        useState(false);
    const [isHost, setIsHost] = useState(false);
    const [error, setError] = useState("");
    const { roomCode } = useParams();

    useEffect(() => {
        getRoom();
    }, []);

    async function getRoom() {
        try {
            const res = await axios.get(
                import.meta.env.VITE_BACKEND_URL +
                    "/api/get-room?code=" +
                    roomCode,
                { withCredentials: true }
            );
            setVotesToSkip(res.data.votes_to_skip);
            setGuestCanControl(res.data.guest_can_pause);
            setIsHost(res.data.is_host);
            console.log(res.data);
        } catch (error: any) {
            navigate("/");
            setError(error.response.data.message);
        }
    }

    async function updateRoom(event: HTMLFormElement) {
        event.preventDefault();
        try {
            const res = await axios.patch(
                import.meta.env.VITE_BACKEND_URL + "/api/update-room",
                {
                    guest_can_pause: guestCanControl,
                    votes_to_skip: votesToSkip,
                    code: roomCode,
                }
            );

            console.log(res);
            setVotesToSkip(settingsVotesToSkip);
            setGuestCanControl(settingsGuestCanControl);
        } catch (error: any) {
            console.log(error.response.data);
            setError(error.response.data.message);
        }
    }

    async function leaveRoom() {
        const res = await axios.post(
            import.meta.env.VITE_BACKEND_URL + "/api/leave-room"
        );
        console.log(res);
        navigate("/");
    }

    return (
        <div className="h-full flex justify-center items-center dark:bg-black">
            <Card className="w-[400px] border border-black dark:border-white dark:bg-black dark:text-white">
                <CardHeader>
                    <CardTitle className="text-center">
                        Room {roomCode}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-lg font-semibold flex justify-between ml-4 mr-10">
                        <p>Votes to Skip: </p> <p>{votesToSkip}</p>
                    </div>
                    <div className="text-lg font-semibold flex justify-between ml-4 mr-10">
                        <p>Guest can Control: </p>
                        <p>{guestCanControl.toString()}</p>
                    </div>
                    <div className="text-lg font-semibold flex justify-between ml-4 mr-10">
                        <p>You are Host: </p>
                        <p>{isHost.toString()}</p>
                    </div>

                    {isHost && (
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full px-4"
                        >
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Settings</AccordionTrigger>
                                <AccordionContent>
                                    <form>
                                        <div className="grid w-full items-center gap-4">
                                            <div className="flex flex-col space-y-4">
                                                <Label>Guest Can Control</Label>
                                                <RadioGroup
                                                    defaultValue="true"
                                                    className="flex flex-row justify-around"
                                                    onValueChange={(val) => {
                                                        setSettingsGuestCanControl(
                                                            val === "true"
                                                        );
                                                    }}
                                                    value={String(
                                                        settingsGuestCanControl
                                                    )}
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
                                                    value={settingsVotesToSkip}
                                                    onChange={(event) =>
                                                        setSettingsVotesToSkip(
                                                            Number(
                                                                event.target
                                                                    .value
                                                            )
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        {error && (
                                            <div className="w-full flex items-center justify-center mt-4">
                                                <p className="text-red-500">
                                                    {error}
                                                </p>
                                            </div>
                                        )}
                                        <div className="text-center mt-8">
                                            <Button
                                                onClick={(event: any) =>
                                                    updateRoom(event)
                                                }
                                            >
                                                Update Room
                                            </Button>
                                        </div>
                                    </form>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button
                        className="w-36 border border-black"
                        variant="secondary"
                        onClick={leaveRoom}
                    >
                        Leave Room
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
