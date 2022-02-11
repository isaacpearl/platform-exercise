const sqlite3 = require('sqlite3').verbose();
const open = require('sqlite').open;
let db;
(async () => {
    db = await open({
        filename: './fender_platform_exercise_data.db',
        driver: sqlite3.Database,
    });

    // Create users table 
    // TODO: what other fields do we need?
    const createUsersTableSql = `
        CREATE TABLE IF NOT EXISTS users ( 
          email TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          password TEXT NOT NULL
        )`;
    await db.run(createUsersTableSql)
        .catch((err) => {
            console.log(err);
        });
})();
