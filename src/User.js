class User {
  constructor(email, login, name, pass) {
    this.login = login;
    this.name = name;
    this.uniqueId = User.setID();
    this.pass = pass;
    this.chats = [];
    this.email = email;
  }

  static getUserByID(id, users) {
    return users.filter(user => user.id.toString() === id.trim())[0];
  }

  static getUsersByName(id, chatList) {
    return chatList.filter(chat => chat.id.toString() === id.trim());
  }

  static setID = () => `_${Math.random().toString(36).substr(2, 5)}`;

  // static getClientByID = id => clients.filter(client => client.id === id.trim())[0];
}

module.exports = User;
