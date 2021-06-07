const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const exchangeRoute = require("./routes/exchanges/exchange");
const adminRoute = require("./routes/admin/admin");
const {
  findUserById,
  findUserBySocketId,
  findIndex,
  connectedAdmins,
  connectedUsers,
  addUser,
  updateUser,
  removeUser,
} = require("./utils/users");

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ extended: false }));
dotenv.config({ path: "config/config.env" });

connectDB();
const PORT = process.env.PORT || 3001;

//Exchange Routes

app.use("/logiccrypto/api/v1/exchange", exchangeRoute);

//User Routes
app.use("/logiccrypto/api/v1/auth", authRoute);
app.use("/logiccrypto/api/v1/user", userRoute);

app.use("/logiccrypto/api/v1/admin", adminRoute);

const server = app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  );
});
const io = require("./socket").init(server);

const sendUsersToAllConnectedAdmins = () => {
  if (connectedAdmins.length > 0) {
    for (let i = 0; i < connectedAdmins.length; i++) {
      io.to(connectedAdmins[i].socketId).emit("activeUsers", connectedUsers);
    }
  }
};

io.on("connection", (socket) => {
  io.emit("userConnected", { msg: "Connected" });

  //SEND CONNECTED USERS TO ALL CONNECTED ADMINS

  socket.on("userInfo", (info) => {
    let userObj = {
      socketId: socket.id,
      id: info.data._id,
      email: info.data.email,
      package: info.data.package ? info.data.package : "No PACKAGE",
      paid: info.data.paid ? info.data.paid : "No PAID",
      firstName: info.data.firstName,
      lastName: info.data.lastName,
      active: info.data.active,
    };

    let id = info.data._id;
    let socketId = socket.id;

    if (info.data.role == "admin") {
      let userSocketIdExist = findUserBySocketId(socketId, "admin");
      let userIdExist = findUserById(id, "admin");

      if (!userSocketIdExist && !userIdExist) {
        addUser(userObj, "admin");
      }
      if (!userSocketIdExist && userIdExist) {
        let index = connectedAdmins.findIndex((i) => i.id == info.data._id);
        updateUser(userObj, "admin", index);
      }
      sendUsersToAllConnectedAdmins();
    } else {
      let userSocketIdExist = findUserBySocketId(socketId, "user");
      let userIdExist = findUserById(id, "user");
      if (!userSocketIdExist && !userIdExist) {
        addUser(userObj, "user");
      }
      if (!userSocketIdExist && userIdExist) {
        let index = connectedUsers.findIndex((i) => i.id == info.data._id);
        updateUser(userObj, "user", index);
      }
      sendUsersToAllConnectedAdmins();
    }
  });

  //SEND CONNECTED USERS TO ALL CONNECTED ADMINS EVEN WHEN DISCONENCT

  socket.on("disconnect", function () {
    let indexCondition;
    let isAdminDisconnect = connectedAdmins.find(
      (x) => x.socketId == socket.id
    );
    if (isAdminDisconnect) {
      indexCondition = findIndex(socket.id, "admin");
    } else {
      indexCondition = findIndex(socket.id, "user");
    }
    if (indexCondition.condition == "admin") {
      removeUser(indexCondition.index, "admin");
    } else {
      removeUser(indexCondition.index, "user");
      sendUsersToAllConnectedAdmins();
    }
  });
});
