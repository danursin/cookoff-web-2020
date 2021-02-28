import { Header, Icon, Message } from "semantic-ui-react";
import React, { useContext } from "react";

import CookoffContext from "./CookoffContext";
import CookoffWinnersAndLosers from "./CookoffWinnersAndLosers";
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
            <CookoffWinnersAndLosers results={results} />

            <ResultsTable />

            {cookoff.CookoffID > fivePointCookoffCutoff && <ResultsChart />}

            <ParticipantTrendsTable />
        </>
    );
};

export default CookoffResults;
