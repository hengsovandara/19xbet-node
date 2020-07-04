module.exports.debug                 = false;
module.exports.reSignUp              = true;
module.exports.env                   = 'test';

module.exports.HASURA_ENDPOINT =
  process.env.HASURA_ENDPOINT || "http://localhost:8085/v1/graphql";
module.exports.HASURA_ACCESSKEY = process.env.HASURA_ACCESSKEY || "pingkh";
module.exports.BOT_TOKEN = process.env.BOT_TOKEN || "1176212955:AAHEP1J5wGBA1-cWuIkIX9IfRg4w5rYBxDs";
module.exports.CHAT_ID = process.env.CHAT_ID || "-1001258030805";
