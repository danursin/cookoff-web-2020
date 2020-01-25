import React from "react";
import { useContext } from "react";
import CookoffContext from "./CookoffContext";
import SimpleLoader from "../../shared/SimpleLoader";
import Highcharts, { SeriesColumnOptions } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Header, Divider } from "semantic-ui-react";

const colorMap: { [key: number]: string } = {
    1: "red",
    2: "darkorange",
    3: "gold",
    4: "lawngreen",
    5: "green"
};

const scoreMap: { [key: string]: number } = {
    red: 1,
    darkorange: 2,
    gold: 3,
    lawngreen: 4,
    green: 5
};

const ResultsChart: React.FC = () => {
    const { results } = useContext(CookoffContext);

    if (!results) {
        return <SimpleLoader message="Loading score results" />;
    }

    const categories = results!.map(r => r.Title);
    const series: SeriesColumnOptions[] = [5, 4, 3, 2, 1].map(score => {
        return {
            name: `Score ${score}`,
            type: "column",
            data: results.map(s => s["Count_" + score]),
            color: colorMap[score]
        };
    });
    const chartConfig: Highcharts.Options = {
        chart: {
            type: "column"
        },
        title: {
            text: undefined
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        xAxis: {
            title: {
                text: "Entry Title"
            },
            categories
        },
        yAxis: {
            min: 0,
            title: {
                text: "Total Number of Votes"
            }
        },
        tooltip: {
            formatter: function() {
                const title = (this.x as unknown) as string;
                const count = this.y;
                const percentage = this.percentage!.toFixed(0);
                const entry = results!.find(r => r.Title === title)!;
                return `
                        <b>Entry ${title} - ${entry.ParticipantName}</b><br/>
                        <b>Votes: </b> ${count} <br/>
                        <b>Score: ${scoreMap[this.point.color as string]}</b><br/>
                        <b>Percentage: </b> ${percentage}%
                    `;
            }
        },
        plotOptions: {
            column: {
                stacking: "normal"
            }
        },
        series: series
    };

    return (
        <>
            <Divider />
            <Header content="Score Distribution by Entry" color="grey" icon="bar chart" />
            <HighchartsReact highcharts={Highcharts} options={chartConfig} />
        </>
    );
};

export default ResultsChart;
