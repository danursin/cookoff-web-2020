import React, { CSSProperties, useContext } from "react";
import { Table, Popup, Icon, Header, Grid, Divider } from "semantic-ui-react";
import { orderBy, first, last } from "lodash";
import CookoffContext from "./CookoffContext";
import { useEffect } from "react";
import { sproc } from "../../services/DataService";
import { ParticipantTrend } from "./types";
import SimpleLoader from "../../shared/SimpleLoader";

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
                    CookoffID: cookoff!.CookoffID!
                }
            });
            setParticipantTrends(data);
        })();
    }, [cookoff, participantTrends, setParticipantTrends]);

    if (!participantTrends) {
        return <SimpleLoader message="Loading participant trends" />;
    }

    const sortByStandardDeviation = orderBy(participantTrends, ["StandardDeviation"], ["desc"]);
    const mostControversial = first(sortByStandardDeviation);
    const mostAgreement = last(sortByStandardDeviation);

    const { ParticipantName: highestScorer } = first(participantTrends)!;
    const { ParticipantName: lowestScorer } = last(participantTrends)!;

    return (
        <div style={{ overflowY: "auto" }}>
            <Divider />
            <Header content="Participant Voting Trends" color="grey" icon="users" />
            <Grid columns="equal" verticalAlign="middle">
                <Grid.Column>
                    <Header size="small" content={`${highestScorer} likes chili the most`} icon="smile" color="green" />
                </Grid.Column>
                <Grid.Column>
                    <Header size="small" content={`${lowestScorer} does not seem to like chili`} icon="frown" color="red" />
                </Grid.Column>
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
                    {participantTrends.map(r => {
                        const { ParticipantName, Average, Minimum, Maximum, StandardDeviation, Rank } = r;
                        const isMostAggreement = r === mostAgreement;
                        const isMostControversial = !isMostAggreement && r === mostControversial;
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
