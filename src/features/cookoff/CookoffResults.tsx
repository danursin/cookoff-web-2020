import React, { useContext } from "react";
import CookoffContext from "./CookoffContext";
import SimpleLoader from "../../shared/SimpleLoader";
import { Header, Message, Icon, Table, Popup } from "semantic-ui-react";
import { CSSProperties } from "react";

const CookoffResults = () => {
    const { results } = useContext(CookoffContext);

    if (!results) {
        return <SimpleLoader message="Loading results.." />;
    }

    const [winner] = results;
    if (!winner) {
        return <Message error icon="exclamation triangle" content="Something is wrong..." />;
    }

    const sortByStandardDeviation = [...results].sort((a, b) => {
        if (a.StandardDeviation === b.StandardDeviation) {
            return 0;
        }
        return a.StandardDeviation < b.StandardDeviation ? 1 : -1;
    });

    const mostControversial = sortByStandardDeviation[0];
    const mostAgreement = sortByStandardDeviation[results.length - 1];

    return (
        <>
            <Header textAlign="center" size="huge" color="blue" block>
                <Icon name="trophy" />
                <Header.Content>
                    {winner.ParticipantName}'s entry, {winner.Title}, is the winner!
                </Header.Content>
            </Header>

            <div style={{ overflowY: "auto" }}>
                <Table compact unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell content="Rank" />
                            <Table.HeaderCell content="Title" />
                            <Table.HeaderCell content="Entrant" />
                            <Table.HeaderCell content="Avg" />
                            <Table.HeaderCell content="Min" />
                            <Table.HeaderCell content="Max" />
                            <Table.HeaderCell content="SD (σ)" />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {results.map(r => {
                            const { Rank, Title, ParticipantName, Average, Minimum, Maximum, StandardDeviation } = r;
                            const positive = r === mostAgreement;
                            const negative = r === mostControversial;
                            const style: CSSProperties | undefined = positive || negative ? { fontWeight: "bold" } : undefined;
                            return (
                                <Table.Row key={r.CookoffEntryID} positive={positive} negative={negative} style={style}>
                                    <Table.Cell>
                                        {positive && (
                                            <Popup
                                                content="This was the most agreed upon entry"
                                                trigger={
                                                    <span>
                                                        {Rank} <Icon name="info circle" />
                                                    </span>
                                                }
                                            />
                                        )}
                                        {negative && (
                                            <Popup
                                                content="This was the most controversial entry"
                                                trigger={
                                                    <span>
                                                        {Rank} <Icon name="info circle" />
                                                    </span>
                                                }
                                            />
                                        )}
                                        {!positive && !negative && <span>{Rank}</span>}
                                    </Table.Cell>
                                    <Table.Cell content={Title} />
                                    <Table.Cell content={ParticipantName} />
                                    <Table.Cell content={Average.toFixed(2)} />
                                    <Table.Cell content={Minimum} />
                                    <Table.Cell content={Maximum} />
                                    <Table.Cell content={StandardDeviation.toFixed(2)} />
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            </div>
        </>
    );
};

export default CookoffResults;
