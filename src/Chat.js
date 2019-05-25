/* eslint-disable no-console */
class Chat {
  constructor(name) {
    this.chatName = name;
    this.users = [];
    this.state = false;
    this.id = `f${(+new Date()).toString(16)}`;
  }

  addUser(user) {
    this.users.push(user);
    console.log(`user with ID: ${user.remotePort} added`);
  }

  removeUser(user) {
    const index = this.users.indexOf(user);
    this.users.splice(index, 1);
  }

  setState(state) {
    this.state = state;
  }

  inChat(user) {
    if (this.users.includes(user)) return true;
    return false;
  }

  getID() {
    return this.id;
  }

  static getChatByID(id, chatList) {
    return chatList.filter(chat => chat.id.toString() === id.trim())[0];
  }
}
module.exports = Chat;
