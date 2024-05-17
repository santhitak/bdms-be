import { ServerResponse } from "http";
import fs from "fs";

const readDb = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const writeDb = (filePath: string, data: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const sendResponse = (
  res: ServerResponse,
  statusCode: number,
  data: object
) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const handleError = (res: ServerResponse, error: any) => {
  sendResponse(res, 500, { success: false, error });
};

export { readDb, writeDb, sendResponse, handleError };
