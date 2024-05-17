import http from "http";
import { IncomingMessage, ServerResponse } from "http";
import {
  getList,
  getTodoById,
  deleteTodoById,
  updateTodoById,
  addTodo,
} from "./controller";

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const pathSegments = url.pathname.split("/").filter((segment) => segment);
    const id = url.searchParams.get("id");

    if (pathSegments[0] === "todo") {
      if (req.method === "GET" && !id) {
        getList(req, res);
      } else if (req.method === "GET" && id) {
        getTodoById(req, res, parseInt(id));
      } else if (req.method === "POST") {
        addTodo(req, res);
      } else if (req.method === "DELETE" && id) {
        deleteTodoById(req, res, parseInt(id));
      } else if (req.method === "PUT" && pathSegments[1] === "update" && id) {
        updateTodoById(req, res, parseInt(id));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Route not found" }));
      }
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Route not found" }));
    }
  }
);

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

export { server };
