const http = require("http");
const fs = require("fs");
const path = require("path");
const { graphql, buildSchema } = require("graphql");
const { DB } = require("./db");
const resolver = require("./resolver");
const errors = require("./ErrorList.json");

const PORT = 4000;

console.log("Loading schema from schema.gql...");
const schemaPath = path.join(__dirname, "schema.gql");

const schemaContent = fs.readFileSync(schemaPath, { encoding: "utf-8" });
console.log("Schema content loaded.");

if (!schemaContent) {
    console.error("Schema file is empty or could not be read!");
    process.exit(1);
}

let schema;
try {
    schema = buildSchema(schemaContent);
    console.log("GraphQL schema built successfully.");
}
catch (error) {
    console.error("Schema build error:", error.message);
    process.exit(1);
}

let database;
DB((err, dbInstance) => {
    if (err) {
        console.error("DB connection failed:", err);
        process.exit(1);
    }
    console.log("DB connection established.");
    database = dbInstance;
});

http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/graphql") {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });
        req.on("end", async () => {
            try {
                const requestBody = JSON.parse(body);
                console.log("Received GraphQL query:", requestBody.query);
                if (!schema) {
                    throw new Error("GraphQL schema is not defined.");
                }
                const result = await graphql({
                    schema,
                    source: requestBody.query,
                    rootValue: resolver,
                    contextValue: database,
                    variableValues: requestBody.variables || {}
                });
                console.log("GraphQL Response:", JSON.stringify(result));
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(result));
            }
            catch (err) {
                console.error("Error processing request:", err.message);
                error_handler(res, 0);
            }
        });
    }
    else {
        error_handler(res, 1);
    }
}).listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const error_handler = (res, errorNumber) => {
    res.writeHead(errors[errorNumber].statusCode, {
        "Content-Type": "application/json",
    });
    res.end(JSON.stringify({
        error: errors[errorNumber].error,
        message: errors[errorNumber].message,
    }));
};