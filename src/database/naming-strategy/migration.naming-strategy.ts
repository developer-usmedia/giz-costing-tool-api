export const validateMigrationName = (timestamp: string, name?: string) => {
    if (!name) throw new Error('Specify migration name via `mikro-orm migration:create --name=...`');

    return `Migration${timestamp}_${name}`;
};
