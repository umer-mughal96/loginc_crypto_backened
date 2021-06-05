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

let connectedUsers = [];
let connectedAdmins = [];

const sendUsersToAllConnectedAdmins = () => {
  console.log("send users to admins on disconnect");
  for (let i = 0; i < connectedAdmins.length; i++) {
    io.to(connectedAdmins[i].socketId).emit("activeUsers", connectedUsers);
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
      package: info.data.package,
      firstName: info.data.firstName,
      lastName: info.data.lastName,
      paid: info.data.paid,
    };

    if (info.data.role == "admin") {
      let userSocketIdExist = connectedAdmins.find(
        (user) => user.socketId == socket.id
      );
      let userIdExist = connectedAdmins.find(
        (user) => user.id == info.data._id
      );

      if (!userSocketIdExist && !userIdExist) {
        connectedAdmins.push(userObj);
      }
      if (!userSocketIdExist && userIdExist) {
        let index = connectedAdmins.findIndex((i) => i.id == info.data._id);
        connectedAdmins[index] = userObj;
      }
      sendUsersToAllConnectedAdmins();
    } else {
      let userSocketIdExist = connectedUsers.find(
        (user) => user.socketId == socket.id
      );
      let userIdExist = connectedUsers.find((user) => user.id == info.data._id);
      if (!userSocketIdExist && !userIdExist) {
        connectedUsers.push(userObj);
      }
      if (!userSocketIdExist && userIdExist) {
        let index = connectedAdmins.findIndex((i) => i.id == info.data._id);
        connectedAdmins[index] = userObj;
      }
      console.log(
        "🚀 ~ file: server.js ~ line 43 ~ connectedUsers",
        connectedUsers
      );
      sendUsersToAllConnectedAdmins();
    }
  });

  //SEND CONNECTED USERS TO ALL CONNECTED ADMINS EVEN WHEN DISCONENCT

  socket.on("disconnect", function () {
    let index = connectedUsers.findIndex((user) => user.socketId == socket.id);
    connectedUsers.splice(index, 1);
    
    console.log(
      "🚀 ~ file: server.js ~ line 43 ~ connectedUsers",
      connectedUsers
    );
    sendUsersToAllConnectedAdmins();
  });
});
