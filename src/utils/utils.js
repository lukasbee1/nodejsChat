const generateChatId = () => (`f${(+new Date()).toString(16)}`); // not used at all
const generateUserId = () => `_${Math.random().toString(36).substr(2, 5)}`;

module.exports = {
  generateChatId,
  generateUserId,
};
