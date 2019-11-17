import React from "react";
import { RouteComponentProps } from "react-router-dom";

interface CookoffProps extends RouteComponentProps<{ id: string }> {}

const Cookoff: React.FC<CookoffProps> = (props: CookoffProps) => {
    const { id } = props.match.params;
    return <p>Cookoff</p>;
};

export default Cookoff;
