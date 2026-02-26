const fastify = require("fastify");

const app = fastify();
const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
];

app.post("/users", function handler(request, response) {
  const data = request.body;
  if (!data.name) {
    return response.status(400).send({ error: "Name is required" });
  }
  const newUser = { id: users.length + 1, name: data.name };
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

// Run the server!
app.listen({ port: 3333 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log("Server is running on http://localhost:3333");
});
