const connectedUsers = [];
const connectedAdmins = [];

const findUser = (payload, condition) => {
  if (condition == "admin") {
    return connectedAdmins.find((user) => user.payload == payload);
  }
  if (condition == "user") {
    return connectedUsers.find((user) => user.payload == payload);
  }
};

const addUser = (obj, condition) => {
  if (condition == "admin") {
    connectedAdmins.push(obj);
  }
  if (condition == "user") {
    connectedUsers.push(obj);
  }
};

const updateUser = (obj, condition, index) => {
  if (condition == "admin") {
    connectedAdmins[index] = obj;
  }
  if (condition == "user") {
    connectedUsers[index] = obj;
  }
};

const removeUser = (index, condition) => {
  if (condition == "admin") {
    connectedAdmins.splice(index, 1);
  } else {
    connectedUsers.splice(index, 1);
  }
};

const findIndex = (socketId, condition) => {
  if (condition == "admin") {
    let index = connectedAdmins.findIndex((user) => user.socketId == socketId);
    return {
      index,
      condition,
    };
  } else {
    let index = connectedUsers.findIndex((user) => user.socketId == socketId);
    return {
      index,
      condition,
    };
  }
};

module.exports = {
  findUser,
  connectedUsers,
  connectedAdmins,
  findIndex,
  addUser,
  updateUser,
  removeUser,
};
