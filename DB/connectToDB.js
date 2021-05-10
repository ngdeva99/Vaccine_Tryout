
const {Pool,Client, ClientBase} = require('pg');
const client = new Client({
    host : "localhost",
    port : 5432,
    user : "devanathan",
    password : "1234",
    database : "sampledb"
})

client.on("connect", () => {
    console.log("Database Connection established");
})

client.on("end", () => {
    console.log("Database Connection end");
})

module.exports = client;