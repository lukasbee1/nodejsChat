class Chat {
  constructor(name) {
    this.name = name;
    this.users = [];
    this.state = false;
    this.id = `f${(+new Date()).toString(16)}`;
  }

  addUser(user) {
    this.users.push(user);
    console.log(`user with ID: ${user.id} added`);
  }

  removeUser(user) {
    const index = this.users.indexOf(user);
    this.users.splice(index, 1);
  }

  setState(state) {
    this.state = state;
  }

  inChat(user) {
    return this.users.includes(user);
  }

  getID() {
    return this.id;
  }

  static getChatByID(id, chatList) {
    return chatList.filter(chat => chat.id.toString() === id.trim())[0];
  }
}
module.exports = Chat;
