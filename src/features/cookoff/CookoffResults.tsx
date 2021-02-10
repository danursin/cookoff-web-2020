import { Header, Icon, Message } from "semantic-ui-react";
import React, { useContext } from "react";

import CookoffContext from "./CookoffContext";
import ParticipantTrendsTable from "./ParticipantTrendsTable";
import ResultsChart from "./ResultsChart";
import ResultsTable from "./ResultsTable";
import SimpleLoader from "../../shared/SimpleLoader";

const fivePointCookoffCutoff = 7;

const CookoffResults: React.FC = () => {
    const { results, cookoff } = useContext(CookoffContext);

    if (!results) {
        return <SimpleLoader message="Loading results.." />;
    }

    if (!cookoff?.CookoffID) {
        return <Message error content="Somehow results are tying to be displayed but there is no cookoff available" />;
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

            {cookoff.CookoffID > fivePointCookoffCutoff && <ResultsChart />}

            <ParticipantTrendsTable />
        </>
    );
};

export default CookoffResults;
