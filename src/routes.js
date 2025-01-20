import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  // Users routes
  {
    method: "GET",
    path: buildRoutePath("/users"),
    handler: (req, res) => {
      const { search } = req.query;
      const users = database.select("users", search ? { name: search, email: search } : null);
      return res.end(JSON.stringify(users));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/users"),
    handler: (req, res) => {
      const { name, email } = req.body;
      const user = { id: randomUUID(), name: name, email: email };
      database.insert("users", user);
      return res.writeHead(201).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/users/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      database.delete("users", id);
      return res.writeHead(204).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/users/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { name, email } = req.body;
      database.update("users", id, { name, email });
      return res.writeHead(204).end();
    },
  },

  // Tasks routes
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;
      const tasks = database.select(
        "tasks",
        search ? { title: search, description: search } : null
      );
      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;
      const created_at = new Date().toISOString();
      const task = {
        id: randomUUID(),
        title: title,
        description: description,
        created_at: created_at,
        updated_at: null,
        completed_at: null,
      };
      database.insert("tasks", task);
      return res.writeHead(201).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      database.delete("tasks", id);
      return res.writeHead(204).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;
      const updated_at = new Date().toISOString();

      const task = database.select("tasks", { id });
      if (task.length === 0) {
        return res.writeHead(404).end("Tarefa não encontrada");
      }

      const updatedData = {
        title: title || task[0].title,
        description: description || task[0].description,
        created_at: task[0].created_at,
        updated_at: updated_at,
        completed_at: task[0].completed_at,
      };

      database.update("tasks", id, updatedData);
      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/completed"),
    handler: (req, res) => {
      const { id } = req.params;

      const completed_at = new Date().toISOString();
      const updatedData = { completed_at };

      database.partialUpdate("tasks", id, updatedData);
      return res.writeHead(204).end();
    },
  },
];
