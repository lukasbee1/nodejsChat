class Chat {
  constructor(name) {
      this.chatName = name;
      this.users = [];
      this.state = false;
  }
  addUser(user) {
      this.users.push(user);
      console.log('user with ID: ' + user.remotePort + ' added');
  }
  removeUser(user) {
    const index = this.users.indexOf(user);
    this.users.splice(index, 1);
  }
  setState(state) {
    this.state = state;
  }
  inChat = (user) => {
    if (this.users.includes(user))
        return true;
    else 
        return false;
}

}
module.exports = Chat; 