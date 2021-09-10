interface toJSONFunction {
    (): object
}

export type genericSlashCommandBuilder = {
    toJSON: toJSONFunction;
    name: string;
    description: string;
} & {
    [prop: string | number | symbol]: any
}