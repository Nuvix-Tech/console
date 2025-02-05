import { Models } from "@nuvix/console";
import React from "react";

export interface ConsoleContextData {
    user: Models.User<{}>;
    [key: string]: any
}

export const ConsoleContext = React.createContext<{
    data: Partial<ConsoleContextData>,
    dispatch: React.Dispatch<React.SetStateAction<Partial<ConsoleContextData>>>
}>({
    data: {},
    dispatch: () => { }
})
