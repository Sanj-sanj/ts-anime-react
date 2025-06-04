import { APIVariables, Formats } from "../interfaces/apiResponseTypes";
import { Actions, ValidFormats } from "../interfaces/initialConfigTypes";

type FormatTypeButton = React.BaseSyntheticEvent<globalThis.MouseEvent, EventTarget & HTMLButtonElement, EventTarget>

function isValidFormat(format: string): format is ValidFormats {
    return ["TV", "MOVIE", "OVA"].includes(format);
}
export default function changeFormat(e: FormatTypeButton, variables: APIVariables, dispatch: React.Dispatch<Actions>) {
    const target = e.currentTarget as HTMLButtonElement;
    const whichFormat = target.value;
    if (!isValidFormat(whichFormat)) return;

    const formats: { [k in ValidFormats]: Formats } = {
        TV: ["TV", "TV_SHORT"],
        MOVIE: ["MOVIE", "SPECIAL"],
        OVA: ["ONA", "OVA"],
    };
    dispatch({
        type: "UPDATE_VARIABLES",
        payload: {
            ...variables,
            format_in: formats[whichFormat],
            format: whichFormat,
        },
    });
}
