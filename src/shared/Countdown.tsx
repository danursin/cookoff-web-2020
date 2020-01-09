import React, { useState } from "react";
import { Label } from "semantic-ui-react";
import { useEffect } from "react";
import { SemanticCOLORS, SemanticICONS } from "semantic-ui-react/dist/commonjs/generic";

interface CountdownProps {
    date: Date;
}

const threshold = {
    red: 2 * 60, // 2 minutes
    yellow: 5 * 60 // 5 minutes
};

const Countdown: React.FC<CountdownProps> = (props: CountdownProps) => {
    const { date } = props;

    const [secondsLeft, setSecondsLeft] = useState<number>((date.getTime() - new Date().getTime()) / 1000);

    useEffect(() => {
        const handle = setInterval(() => {
            const update = Math.max((date.getTime() - new Date().getTime()) / 1000, 0);
            setSecondsLeft(update);
        }, 1000);

        return () => {
            clearInterval(handle);
        };
    });

    const days = Math.floor(secondsLeft / (24 * 60 * 60));
    const hours = Math.floor(secondsLeft / (60 * 60)) % 24;
    const minutes = Math.floor(secondsLeft / 60) % 60;
    const seconds = Math.floor(secondsLeft) % 60;

    const dateParts: string[] = [];
    if (days) dateParts.push(`${days} day${days > 1 ? "s" : ""}`);
    if (hours || days) dateParts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    if (minutes) dateParts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    if (seconds) dateParts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);

    const color: SemanticCOLORS = secondsLeft > threshold.yellow ? "green" : secondsLeft <= threshold.red ? "red" : "yellow";
    const icon: SemanticICONS = secondsLeft < threshold.yellow ? "exclamation triangle" : "spoon";

    return (
        <Label
            color={color}
            content={dateParts.join(" ") || "Cookoff has ended"}
            icon={icon}
            style={{ width: "100%", textAlign: "center" }}
        />
    );
};

export default Countdown;
