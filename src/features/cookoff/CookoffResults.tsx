import React, { useContext } from "react";
import CookoffContext from "./CookoffContext";
import SimpleLoader from "../../shared/SimpleLoader";
import { Header, Message, Icon } from "semantic-ui-react";
import ResultsTable from "./ResultsTable";
import ResultsChart from "./ResultsChart";
import ParticipantTrendsTable from "./ParticipantTrendsTable";

const fivePointCookoffCutoff = 7;

const CookoffResults = () => {
    const { results, cookoff } = useContext(CookoffContext);

    if (!results) {
        return <SimpleLoader message="Loading results.." />;
    }

    const [winner] = results;
    if (!winner) {
        return <Message error icon="exclamation triangle" content="Something is wrong..." />;
    }

    return (
        <>
            <Header textAlign="center" size="huge" color="blue" block>
                <Icon name="trophy" />
                <Header.Content>
                    {winner.ParticipantName}'s entry, {winner.Title}, is the winner!
                </Header.Content>
            </Header>

            <ResultsTable />

            {cookoff!.CookoffID! > fivePointCookoffCutoff && <ResultsChart />}

            <ParticipantTrendsTable />
        </>
    );
};

export default CookoffResults;
