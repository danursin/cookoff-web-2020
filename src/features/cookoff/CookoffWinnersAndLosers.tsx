import { Header, Icon, Image } from "semantic-ui-react";

import { CookoffResult } from "./types";
import React from "react";
import boot from "../../img/boot.svg";

interface CookoffWinnersAndLosersProps {
    results: CookoffResult[];
}

const CookoffWinnersAndLosers: React.FC<CookoffWinnersAndLosersProps> = ({ results }) => {
    const winningRank = results[0].Rank;
    const losingRankRank = results[results.length - 1].Rank;

    if (winningRank === losingRankRank) {
        return (
            <Header size="huge" color="red" block>
                <Image src={boot} />
                <Header.Content>Everyone loses!</Header.Content>
            </Header>
        );
    }

    const winners = results.filter((r) => r.Rank === winningRank);
    const losers = results.filter((r) => r.Rank === losingRankRank);

    return (
        <>
            {winners.length === 1 && (
                <Header
                    size="huge"
                    color="blue"
                    block
                    icon="trophy"
                    content={
                        <>
                            {winners[0].ParticipantName}'s entry, {winners[0].Title}, is the winner!
                        </>
                    }
                />
            )}
            {winners.length > 1 && (
                <Header
                    size="huge"
                    color="blue"
                    block
                    icon="trophy"
                    content={
                        <>
                            There's a {winners.length}-way tie!
                            <br />
                            {winners.map((w) => w.ParticipantName).join(", ")} have to rock-paper-scissors for the ladle.
                        </>
                    }
                />
            )}
            {losers.length === 1 && (
                <Header size="huge" color="red" block>
                    <Image src={boot} />
                    <Header.Content>
                        {losers[0].ParticipantName}'s entry, {losers[0].Title}, takes the shoe!
                    </Header.Content>
                </Header>
            )}
            {losers.length > 1 && (
                <Header size="huge" color="red" block>
                    <Image src={boot} />
                    <Header.Content>
                        There's a {losers.length}-way tie!
                        <br />
                        {losers.map((w) => w.ParticipantName).join(", ")} have to rock-paper-scissors for the shoe.
                    </Header.Content>
                </Header>
            )}
        </>
    );
};

export default CookoffWinnersAndLosers;
