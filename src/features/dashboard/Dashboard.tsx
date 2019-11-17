import React, { useState } from "react";
import { Header, Card } from "semantic-ui-react";
import { useContext } from "react";
import AppContext from "../../shared/AppContext";
import { useEffect } from "react";
import { query } from "../../services/DataService";
import AuthContext from "../../shared/AuthContext";
import { CookoffParticipant, Cookoff } from "../../types";
import SimpleLoader from "../../shared/SimpleLoader";
import moment from "moment";
import { Link } from "react-router-dom";
import { uniqBy, orderBy } from "lodash";

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const { userCookoffs, setUserCookoffs } = useContext(AppContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (userCookoffs) {
            setLoading(false);
            return;
        }
        (async () => {
            setLoading(true);

            const [userCookoffResult, userHostedCookoffResult] = await Promise.all([
                query<CookoffParticipant>({
                    table: "CookoffParticipant",
                    relations: ["Cookoff"],
                    where: {
                        ParticipantID: user!.ParticipantID
                    }
                }),
                user!.IsAdmin
                    ? query<Cookoff>({
                          table: "Cookoff",
                          where: {
                              HostParticipantID: user!.ParticipantID
                          }
                      })
                    : undefined
            ]);

            const cookoffs: Cookoff[] = orderBy(
                uniqBy([...userCookoffResult.map(c => c.Cookoff!), ...(userHostedCookoffResult || [])], "CookoffID"),
                ["CookoffID"],
                ["desc"]
            );

            setUserCookoffs(cookoffs);
            setLoading(false);
        })();
    }, [user, userCookoffs, setUserCookoffs]);

    if (!userCookoffs || loading) {
        return <SimpleLoader message="Loading cookoffs..." />;
    }

    return (
        <>
            <Header icon="spoon" content="Your Cookoffs" color="grey" textAlign="center" size="huge" />
            <Card.Group>
                {userCookoffs.map(c => {
                    const { CookoffID, Title, EventStartDate, EventEndDate } = c;
                    const startDate = moment(EventStartDate.replace("Z", ""));
                    const endDate = moment(EventEndDate.replace("Z", ""));

                    const eventDayString = startDate.format("dddd, MMMM Do YYYY");
                    const eventStartTimeString = startDate.format("h A");
                    const eventEndTimeString = endDate.format("h A");
                    return (
                        <Card fluid color="grey" as={Link} to={`/cookoff/${CookoffID}`} key={CookoffID}>
                            <Card.Content>
                                <Card.Header content={Title} />
                                <Card.Description content={eventDayString} />
                                <Card.Meta content={`${eventStartTimeString} to ${eventEndTimeString}`} />
                            </Card.Content>
                        </Card>
                    );
                })}
            </Card.Group>
        </>
    );
};

export default Dashboard;
