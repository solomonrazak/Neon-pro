// a pool manages multiple client connections to the database, allowing for efficient query execution and connection reuse.
// opening a new connection for every query can be resource-intensive and lead to performance issues, especially under high load. By using a pool, you can maintain a set of open connections that can be reused for multiple queries, reducing the overhead of establishing new connections and improving the overall performance of your application.

import {Pool }from "pg";

const pool = new Pool({
    user: "postgres",
    password: "12345",
    host: "localhost",
    port: 5432,
    database: "todoDB"
});

export default pool;