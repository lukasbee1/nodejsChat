const soceketList = {
  connections: [],
  addUser(socket) {
    this.connections.push(socket);
  },

  removeUser(socket) {
    this.connections = this.connections.filter(el => el !== socket);
  },
};


module.exports = soceketList;
