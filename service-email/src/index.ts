import { createServer } from "node:http";
import { parse } from "node:url";

const REQUIRED_ENV_VARS = [
  "DATABASE_HOST",
  "DATABASE_PORT",
  "DATABASE_PASSWORD",
  "DATABASE_NAME",
  "DATABASE_USER"
];
for (const varName of REQUIRED_ENV_VARS) {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 3000;

const server = createServer((req, res) => {
  const parsedUrl = parse(req.url || "", true);

  if (parsedUrl.pathname === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Test Ok" }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
