const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createConnection } = require("typeorm");
const { connection } = require("./tools");
const { checkAuth } = require("./middlewares");

const port = 3000; //
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use middleware for providing database connection
const conn = createConnection(connection);
app.use(async (req, res, next) => {
  req.conn = await conn;
  next();
});

// ROUTES
const auth = require("./routes/auth");
const users = require("./routes/users");
const others = require("./routes/others");
const services = require("./routes/services");
const business = require("./routes/business");
const invoices = require("./routes/invoices");
const customers = require("./routes/customers");

app.use("/auth", auth);
app.use("/users", users);
app.use("/others", checkAuth, others);
app.use("/services", checkAuth, services);
app.use("/business", checkAuth, business);
app.use("/invoices", checkAuth, invoices);
app.use("/customers", checkAuth, customers);

// Start server
app.listen(port, () => console.log(`Server listening on port ${port}!`));
