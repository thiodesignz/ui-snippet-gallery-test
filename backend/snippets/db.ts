import { SQLDatabase } from 'encore.dev/storage/sqldb';

export const snippetsDB = new SQLDatabase("snippets", {
  migrations: "./migrations",
});
