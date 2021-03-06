import { Divider, Grid, Header, Icon, Popup, Table } from "semantic-ui-react";
import React, { CSSProperties, useContext } from "react";
import { first, last, orderBy } from "lodash";

import CookoffContext from "./CookoffContext";
import { ParticipantTrend } from "./types";
import SimpleLoader from "../../shared/SimpleLoader";
import { sproc } from "../../services/DataService";
import { useEffect } from "react";

const ParticipantTrendsTable: React.FC = () => {
    const { participantTrends, setParticipantTrends, cookoff } = useContext(CookoffContext);

    useEffect(() => {
        if (participantTrends) {
            return;
        }
        (async () => {
            const data = await sproc<ParticipantTrend>({
                objectName: "GetCookoffParticipantTrends",
                parameters: {
                    CookoffID: cookoff?.CookoffID as number
                }
            });
            setParticipantTrends(data);
        })();
    }, [cookoff, participantTrends, setParticipantTrends]);

    if (!participantTrends) {
        return <SimpleLoader message="Loading participant trends" />;
    }

    const sortByStandardDeviation = orderBy(participantTrends, ["StandardDeviation"], ["desc"]);
    const mostControversial = first(sortByStandardDeviation)?.StandardDeviation;
    const mostAgreement = last(sortByStandardDeviation)?.StandardDeviation;

    const highestScoreAvg = participantTrends[0].Average;
    const lowestScoreAvg = participantTrends[participantTrends.length - 1].Average;

    const highestScorers = participantTrends.filter((pt) => pt.Average === highestScoreAvg);
    const lowestScorers = participantTrends.filter((pt) => pt.Average === lowestScoreAvg);

    return (
        <div style={{ overflowY: "auto" }}>
            <Divider />
            <Header
                content="Participant Voting Trends"
                subheader="Must have scored half of the entries to be included"
                color="grey"
                icon="users"
            />
            <Grid columns="equal" verticalAlign="middle">
                {highestScoreAvg === lowestScoreAvg && (
                    <Grid.Column>
                        <Header size="small" icon="meh" color="orange" content="Turns out no one likes anything" />
                    </Grid.Column>
                )}
                {highestScoreAvg !== lowestScoreAvg && (
                    <>
                        <Grid.Column>
                            {highestScorers.length === 1 && (
                                <Header
                                    size="small"
                                    content={`${highestScorers[0].ParticipantName} likes chili the most`}
                                    icon="smile"
                                    color="green"
                                />
                            )}
                            {highestScorers.length > 1 && (
                                <Header
                                    size="small"
                                    content={`${highestScorers.map((s) => s.ParticipantName).join(", ")} really like chili`}
                                    icon="smile"
                                    color="green"
                                />
                            )}
                        </Grid.Column>
                        <Grid.Column>
                            {lowestScorers.length === 1 && (
                                <Header
                                    size="small"
                                    content={`${lowestScorers[0].ParticipantName} does not seem to like chili`}
                                    icon="smile"
                                    color="green"
                                />
                            )}
                            {lowestScorers.length > 1 && (
                                <Header
                                    size="small"
                                    content={`${lowestScorers.map((s) => s.ParticipantName).join(", ")} don't seem to like chili`}
                                    icon="smile"
                                    color="green"
                                />
                            )}
                        </Grid.Column>
                    </>
                )}
            </Grid>
            <Table compact unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell content="Rank" />
                        <Table.HeaderCell content="Participant" />
                        <Table.HeaderCell content="Avg" />
                        <Table.HeaderCell content="Min" />
                        <Table.HeaderCell content="Max" />
                        <Table.HeaderCell content="SD (σ)" />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {participantTrends.map((r) => {
                        const { ParticipantName, Average, Minimum, Maximum, StandardDeviation, Rank } = r;
                        const isMostAggreement = r.StandardDeviation === mostAgreement;
                        const isMostControversial = !isMostAggreement && r.StandardDeviation === mostControversial;
                        const accentedStyle: CSSProperties | undefined =
                            isMostAggreement || isMostControversial ? { fontWeight: "bold" } : undefined;
                        return (
                            <Table.Row
                                key={r.ParticipantID}
                                positive={isMostAggreement}
                                negative={isMostControversial}
                                style={accentedStyle}
                            >
                                <Table.Cell>
                                    {isMostAggreement && (
                                        <Popup
                                            content={`${ParticipantName} had the smallest score variability`}
                                            trigger={
                                                <span>
                                                    {Rank} <Icon name="info circle" />
                                                </span>
                                            }
                                        />
                                    )}
                                    {isMostControversial && (
                                        <Popup
                                            content={`${ParticipantName} had the largest score variability`}
                                            trigger={
                                                <span>
                                                    {Rank} <Icon name="info circle" />
                                                </span>
                                            }
                                        />
                                    )}
                                    {!isMostAggreement && !isMostControversial && <span>{Rank}</span>}
                                </Table.Cell>
                                <Table.Cell content={ParticipantName} />
                                <Table.Cell content={Average.toFixed(2)} />
                                <Table.Cell content={Minimum} />
                                <Table.Cell content={Maximum} />
                                <Table.Cell content={(StandardDeviation || 0).toFixed(2)} />
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </div>
    );
};

export default ParticipantTrendsTable;
