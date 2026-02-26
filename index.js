const fastify = require("fastify");

const app = fastify();
const users = [
    { id: 1, name: "Alice", age: 30 },
    { id: 2, name: "Bob", age: 25 },
    { id: 3, name: "Charlie", age: 35 },
];

app.post("/users", function handler(request, response) {
  const data = request.body;
  if (!data.name || !data.age) {
    return response.status(400).send({ error: "Name and age are required" });
  }
  const newUser = { id: users.length + 1, name: data.name, age: data.age };
  users.push(newUser);

  response.status(201).send(newUser);
});

app.get("/users", function handler(request, response) {
    const query = request.query;
    if (query.name) {
        const filteredUsers = users.filter(user => user.name.toLowerCase().includes(query.name.toLowerCase()));
        return response.send(filteredUsers);
    }
    response.send(users);
});

app.get("/users/:id", function handler(request, response) {
  const id = parseInt(request.params.id);
  const user = users.find(user => user.id === id);
  if (!user) {
    return response.status(404).send({ error: "User not found" });
  }
  response.send(user);
});

app.patch("/users/:id", function handler(request, response) {
  const id = parseInt(request.params.id);
  const user = users.find(user => user.id === id);
  if (!user) {
    return response.status(404).send({ error: "User not found" });
  }
  const data = request.body;
  if (data.name) {
    user.name = data.name;
  }
  response.send(user);
});

app.delete("/users/:id", function handler(request, response) {
  const id = parseInt(request.params.id);
  const userId = users.findIndex(user => user.id === id);

    if (userId === -1) {
      return response.status(404).send({ error: "User not found" });
    }
    users.splice(userId, 1);
    response.send({ message: "User deleted successfully" });
});

// Run the server!
app.listen({ port: 3333 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log("Server is running on http://localhost:3333");
});
