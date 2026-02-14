import dotenv from "dotenv";
dotenv.config({
  path: process.env.DOTENV_CONFIG_PATH || "./.env",
});

const env = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017",
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN
};

export default env;
