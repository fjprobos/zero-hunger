import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import validator from "validator";
import cors from "cors";
import "dotenv/config";
import jwt from "express-jwt";
import jwks from "jwks-rsa";

var requireAuth = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-ts6itprc.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://api.zero.hunger',
  issuer: 'https://dev-ts6itprc.us.auth0.com/',
  algorithms: ['RS256']
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

//create a user
app.post("/user", async (req, res) => {
  const { name, email } = req.body;
  if (validator.isEmpty(name) || !validator.isEmail(email)) {
    return res.status(400).json("Invalid user input");
  }

  const userFind = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!userFind) {
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
      },
    });

    res.status(200).json(user);
  }
});

//update a user
app.patch("/user/:id", requireAuth, async (req, res) => {
  const auth0Id = req.user.sub;
  const id = req.params.id;
  const { newName } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: id,
    },
  });

  if (!user) {
    return res.status(404).json(`User with  ${id} not found`);
  }

  const updateUser = await prisma.user.update({
    where: {
      email: id,
    },
    data: {
      name: newName,
    },
  });

  res.status(200).json(updateUser);
});

//get all users
app.get("/user", async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
});

//get user with email id
app.get("/user/:id", async (req, res) => {
  const emailId = req.params.id;

  const user = await prisma.user.findUnique({
    where: {
      email: emailId,
    },
  });

  if (!user) {
    return res.status(404).json(`User with email ${id} not found`);
  }

  res.status(200).json(user);
});

//create a order
app.post("/order", async (req, res) => {
  const { pickupAddress, deliveryAddress, orderName, orderImageUrl } = req.body;
  if (
    validator.isEmpty(pickupAddress) ||
    validator.isEmpty(deliveryAddress) ||
    validator.isEmpty(orderName) ||
    !validator.isURL(orderImageUrl)
  ) {
    return res.status(400).json("Invalid order input");
  }

  const order = await prisma.order.create({
    data: {
      pickupAddress,
      deliveryAddress,
      orderName,
      orderImageUrl,
    },
  });

  res.status(200).json(order);
});

//get all orders
app.get("/order", async (req, res) => {
  const orders = await prisma.order.findMany();
  res.status(200).json(orders);
});

//get order with id
app.get("/order/:id", async (req, res) => {
  const id = req.params.id;

  const order = await prisma.order.findUnique({
    where: {
      id,
    },
  });

  if (!order) {
    return res.status(404).json(`Order with  ${id} not found`);
  }

  res.status(200).json(order);
});

//update order to delivered
app.patch("/order/:id", requireAuth, async (req, res) => {
  const auth0Id = req.user.sub;
  const id = req.params.id;

  const order = await prisma.order.findUnique({
    where: {
      id,
    },
  });

  if (!order) {
    return res.status(404).json(`Order with  ${id} not found`);
  }

  const updateOrder = await prisma.order.update({
    where: {
      id,
    },
    data: {
      deliveryStatus: true,
    },
  });

  res.status(200).json(updateOrder);
});

//create orderHistory
app.post("/history", requireAuth, async (req, res) => {
  const auth0Id = req.user.sub;
  const { userEmailId, orderId } = req.body;
  if (!validator.isEmail(userEmailId) || validator.isEmpty(orderId)) {
    return res.status(400).json("Invalid input");
  }

  const history = await prisma.orderHistory.create({
    data: {
      userEmailId,
      orderId,
    },
  });

  res.status(200).json(history);
});

//get orderHistory with email id
app.get("/history/:id", requireAuth, async (req, res) => {
  const auth0Id = req.user.sub;
  const emailId = req.params.id;
  const history = await prisma.orderHistory.findMany({
    where: {
      userEmailId: emailId,
    },
  });

  if (!history) {
    return res.status(404).json(`History with email ${id} not found`);
  }

  res.status(200).json(history);
});

app.listen(process.env.PORT || 8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
