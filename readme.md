### Start Project

```
npm i
npm start
```

Server will be serve on `http://localhost:3000`

### Endpoints

1. Get All To-do

   Method `GET`

   ```
   http://localhost:3000/todo
   ```

2. Get To-do by id

   Method `GET`

   ```
   http://localhost:3000/todo/?id=1
   ```

3. Update To-do by id

   Method `PUT`

   ```
   http://localhost:3000/todo/update/?id=1
   ```

   Payload

   ```
   {
     "content": ""
   }
   ```

4. Delete To-do by id

   Method `DELETE`

   ```
   http://localhost:3000/todo/delete/?id=1
   ```

5. Add To-do

   Method `POST`

   ```
   http://localhost:3000/todo
   ```

   Payload

   ```
   {
     "content": ""
   }
   ```
