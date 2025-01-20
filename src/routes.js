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

      if (!name || !email) {
        return res.writeHead(422).end(JSON.stringify({ message: "Nome e Email são obrigatórios" }));
      }

      if (name.length < 3 || email.length < 3) {
        return res
          .writeHead(422)
          .end(JSON.stringify({ message: "Nome e Email devem ter pelo menos 3 caracteres" }));
      }

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

      const [user] = database.select("users", { id });

      if (!user) {
        return res.writeHead(404).end(JSON.stringify({ message: "Usuário não encontrado." }));
      }

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

      if (!name || !email) {
        return res.writeHead(422).end("Nome e Email são obrigatórios");
      }

      if (name.length < 3 || email.length < 3) {
        return res.writeHead(422).end("Nome e Email devem ter pelo menos 3 caracteres");
      }

      const [user] = database.select("users", { id });

      if (!user) {
        return res.writeHead(404).end(JSON.stringify({ message: "Usuário não encontrado" }));
      }

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

      if (!title || !description) {
        return res
          .writeHead(422)
          .end(JSON.stringify({ message: "Título e Descrição são obrigatórios" }));
      }

      if (title.length < 3 || description.length < 3) {
        return res
          .writeHead(422)
          .end(JSON.stringify({ message: "Título e Descrição devem ter pelo menos 3 caracteres" }));
      }

      const created_at = new Date().toISOString();
      const task = {
        id: randomUUID(),
        title: title,
        description: description,
        created_at: created_at,
        updated_at: created_at,
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

      const [task] = database.select("tasks", { id });

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ message: "Tarefa não encontrada" }));
      }

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

      if (!title || !description) {
        return res.writeHead(422).end("Título e Descrição são obrigatórios");
      }

      if (title.length < 3 || description.length < 3) {
        return res.writeHead(422).end("Título e Descrição devem ter pelo menos 3 caracteres");
      }

      const updated_at = new Date().toISOString();

      const [task] = database.select("tasks", { id });

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ message: "Tarefa não encontrada" }));
      }

      database.update("tasks", id, {
        title: title ?? task.title,
        description: description ?? task.description,
        updated_at,
      });
      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/completed"),
    handler: (req, res) => {
      const { id } = req.params;

      const [task] = database.select("tasks", { id });

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ message: "Tarefa não encontrada" }));
      }

      const isCompleted = task.completed_at !== null;
      const completed_at = isCompleted ? null : new Date().toISOString();

      database.update("tasks", id, { completed_at });
      return res.writeHead(204).end();
    },
  },
];
