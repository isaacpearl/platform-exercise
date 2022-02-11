const sqlite3 = require('sqlite3').verbose();
const open = require('sqlite').open;
let db;
(async () => {
    db = await open({
        filename: './fender_platform_exercise_data.db',
        driver: sqlite3.Database,
    });

    // Create users table 
    const createUsersTableSql = `
        CREATE TABLE IF NOT EXISTS users ( 
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          password TEXT NOT NULL
        )`;
    await db.run(createUsersTableSql)
        .catch((err) => {
            console.log(err);
        });

    // Create blacklist table
    const createBlackListTableSql = `
        CREATE TABLE IF NOT EXISTS blacklist ( 
          token TEXT PRIMARY KEY,
          expiration_date INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          FOREIGN KEY (user_id)
               REFERENCES users (id) 
        )`;
    await db.run(createBlackListTableSql)
        .catch((err) => {
            console.log(err);
        });
    await db.close();
})();
