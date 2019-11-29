import { Cookoff } from "../../types";
import { createContext } from "react";

interface ManageContextProps {
    cookoff?: Cookoff;
    setCookoff: (cookoff: Cookoff) => void;
}

export default createContext<ManageContextProps>({
    setCookoff: () => {
        throw new Error("not implemented");
    }
});
