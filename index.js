const fastify = require("fastify");

const app = fastify();
const users = [
  { id: 1, username: "alice", age: 30, password: "123" },
  { id: 2, username: "bob", age: 25, password: "123" },
  { id: 3, username: "pedro", age: 35, password: "123" },
];

const bcrypt = require("bcrypt");

async function createHash(purePassword) {
  const saltRounds = 5;

  const hash = await bcrypt.hash(purePassword, saltRounds);

  return hash;
}

app.post("/users", async function handler(request, response) {
  const data = request.body;
  if (!data.username || !data.age || !data.password) {
    return response
      .status(400)
      .send({ error: "Username, age, and password are required" });
  }
  const newUser = {
    id: users.length + 1,
    username: data.username,
    age: data.age,
    password: await createHash(data.password),
  };
  users.push(newUser);

  response.status(201).send(newUser);
});

app.get("/users", function handler(request, response) {
  const query = request.query;
  if (query.username) {
    const filteredUsers = users.filter((user) =>
      user.username.toLowerCase().includes(query.username.toLowerCase()),
    );
    return response.send(filteredUsers);
  }
  response.send(users);
});

app.get("/users/:id", function handler(request, response) {
  const id = parseInt(request.params.id);
  const user = users.find((user) => user.id === id);
  if (!user) {
    return response.status(404).send({ error: "User not found" });
  }
  response.send(user);
});

app.patch("/users/:id", function handler(request, response) {
  const id = parseInt(request.params.id);
  const user = users.find((user) => user.id === id);
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
  const userId = users.findIndex((user) => user.id === id);

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
