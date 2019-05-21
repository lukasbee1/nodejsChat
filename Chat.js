class Chat {
  constructor(name) {
      this.users = [];
      this.chatName = name;
  }
  addUser(user) {
      this.users.push(user);
      console.log('user with ID: ' + user.remotePort + ' added');
  }

}
module.exports = Chat; 