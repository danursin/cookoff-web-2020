import React, { CSSProperties, useContext } from "react";
import { Table, Popup, Icon, Header } from "semantic-ui-react";
import { orderBy, first, last } from "lodash";
import CookoffContext from "./CookoffContext";

const ResultsTable: React.FC = () => {
    const { results } = useContext(CookoffContext);
    const sortByStandardDeviation = orderBy(results, ["StandardDeviation"], ["desc"]);
    const mostControversial = first(sortByStandardDeviation);
    const mostAgreement = last(sortByStandardDeviation);
    return (
        <div style={{ overflowY: "auto" }}>
            <Header content="Entry Statistics" color="grey" icon="calculator" />
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
                    {results!.map(r => {
                        const { Rank, Title, ParticipantName, Average, Minimum, Maximum, StandardDeviation } = r;
                        const positive = r === mostAgreement;
                        const negative = !positive && r === mostControversial;
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
                                <Table.Cell content={(StandardDeviation || 0).toFixed(2)} />
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </div>
    );
};

export default ResultsTable;
