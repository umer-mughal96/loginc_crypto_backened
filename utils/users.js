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

const removeUser = (index) => {
  connectedUsers.splice(index, 1);
};

module.exports = {
  findUser,
  connectedUsers,
  connectedAdmins,
  addUser,
  updateUser,
  removeUser,
};
