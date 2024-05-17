import { IncomingMessage, ServerResponse } from "http";
import { readDb, sendResponse, handleError, writeDb } from "../helper/helper";
import path from "path";
import { TodoListData } from "../type";

const allowedProperties = ["content"];
const isValidRequest = (payload: TodoListData): boolean => {
  return (
    Object.keys(payload).length !== 1 ||
    !allowedProperties.includes("content") ||
    typeof payload.content !== "string"
  );
};

const addTodo = async (req: IncomingMessage, res: ServerResponse) => {
  let data = "";

  req.on("data", (chunk) => {
    data += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const payload: TodoListData = JSON.parse(data);
      const filePath = path.join(__dirname, "../db/db.json");
      const fileData = await readDb(filePath);
      const todos: TodoListData[] = JSON.parse(fileData);

      if (isValidRequest(payload)) {
        sendResponse(res, 400, {
          success: false,
          message: "Invalid input data",
        });
        return;
      }

      payload.id = todos.length ? todos[todos.length - 1].id + 1 : 1;
      todos.push(payload);

      await writeDb(filePath, JSON.stringify(todos));
      sendResponse(res, 201, { success: true, message: payload });
    } catch (err) {
      handleError(res, err);
    }
  });
};

const getList = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const data = await readDb(path.join(__dirname, "../db/db.json"));
    sendResponse(res, 200, { success: true, message: JSON.parse(data) });
  } catch (err) {
    handleError(res, err);
  }
};

const getTodoById = async (
  req: IncomingMessage,
  res: ServerResponse,
  id: number
) => {
  try {
    const filePath = path.join(__dirname, "../db/db.json");
    const data = await readDb(filePath);
    const todoList: TodoListData[] = JSON.parse(data);
    const todo = todoList.find((t) => t.id === id);

    if (todo) {
      sendResponse(res, 200, { success: true, message: todo });
    } else {
      sendResponse(res, 404, { success: false, message: "to-do not found" });
    }
  } catch (err) {
    handleError(res, err);
  }
};

const updateTodoById = (
  req: IncomingMessage,
  res: ServerResponse,
  id: number
) => {
  let data = "";

  req.on("data", (dataList) => {
    data += dataList.toString();
  });

  req.on("end", async () => {
    try {
      const payload = JSON.parse(data);
      const filePath = path.join(__dirname, "../db/db.json");
      const fileData = await readDb(filePath);
      const todoList: TodoListData[] = JSON.parse(fileData);

      if (isValidRequest(payload)) {
        sendResponse(res, 400, {
          success: false,
          message: "Invalid input data",
        });
        return;
      }

      const index = todoList.findIndex((t) => t.id === id);
      if (index === -1) {
        sendResponse(res, 404, { success: false, message: "to-do not found" });
        return;
      }

      todoList[index] = { ...todoList[index], ...payload };
      await writeDb(filePath, JSON.stringify(todoList)).then(() =>
        sendResponse(res, 200, { success: true, message: todoList[index] })
      );
    } catch (err) {
      handleError(res, err);
    }
  });
};

const deleteTodoById = async (
  req: IncomingMessage,
  res: ServerResponse,
  id: number
) => {
  try {
    const filePath = path.join(__dirname, "../db/db.json");
    const data = await readDb(filePath);
    let todoList: TodoListData[] = JSON.parse(data);
    const initialLength = todoList.length;

    todoList = todoList.filter((t) => t.id !== id);

    if (todoList.length === initialLength) {
      sendResponse(res, 404, { success: false, message: "to-do not found" });
    } else {
      await writeDb(filePath, JSON.stringify(todoList)).then(() =>
        sendResponse(res, 200, {
          success: true,
          message: `todo id ${id} deleted`,
        })
      );
    }
  } catch (err) {
    handleError(res, err);
  }
};

export { addTodo, getList, getTodoById, updateTodoById, deleteTodoById };
