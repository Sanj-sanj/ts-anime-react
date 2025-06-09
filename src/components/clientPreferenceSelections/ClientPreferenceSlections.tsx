import { ChangeEvent } from "react";

export default function ClientPreferenceSelections(
    labelTitle: string,
    couple: string,
    selectValues: string[],
    language: 'romaji' | 'english',
    showOngoing: boolean,
    callback: (e?: ChangeEvent<HTMLSelectElement>) => void
) {
    return (
        <div className="flex border border-slate-300 dark:border-slate-400 mr-2">
            <label
                className="bg-slate-100 dark:bg-zinc-500 h-full border-r border-slate-300 dark:border-slate-400 p-2 w-24 text-center"
                htmlFor={couple}
            >
                {labelTitle}
            </label>
            <select
                name=""
                id={couple}
                className="w-32 pl-1 dark:bg-zinc-200"
                onChange={callback}
                defaultValue={
                    couple === "title-lang"
                        ? `${language
                        .slice(0, 1)
                        .toUpperCase()
                        .concat(language.slice(1))}`
                        : showOngoing
                            ? "Show ongoing"
                            : "Hide ongoing"
                }
            >
                {selectValues.map((item) => (
                    <option value={item} key={item}>
                        {item}
                    </option>
                ))}
            </select>
        </div>
    );
}
