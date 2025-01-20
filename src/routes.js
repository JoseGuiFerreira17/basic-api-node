import { Database } from "./database.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: "/users",
    handler: (req, res) => {},
  },
  {
    method: "POST",
    path: "/users",
    handler: (req, res) => {},
  },
];
