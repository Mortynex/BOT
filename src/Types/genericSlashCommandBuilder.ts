interface toJSONFunction {
    (): object
}

export type genericSlashCommandBuilder = {
    toJSON: toJSONFunction;
    readonly name: string;
    readonly description: string;
    readonly defaultPermission?: boolean | undefined;
    setDefaultPermission?: (permission: boolean) => any;
} & {
    [prop: string | number | symbol]: any
}
