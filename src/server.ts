import app from "./app";
import http from "http";
import env from "./config/env";
import { connectDB } from "./config/db";

const server = http.createServer(app);

connectDB().then(() => {
  server.listen(env.PORT, () => {
    console.log(`Server running on: http://localhost:${env.PORT}`);
  });
});
