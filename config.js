module.exports.debug                 = false;
module.exports.reSignUp              = true;
module.exports.env                   = 'test';

module.exports.HASURA_ENDPOINT =
  process.env.HASURA_ENDPOINT || "http://localhost:8085/v1/graphql";
module.exports.HASURA_ACCESSKEY = process.env.HASURA_ACCESSKEY || "19xbet2022";
module.exports.BOT_TOKEN = process.env.BOT_TOKEN || "5074802843:AAF0PSVXUJIqA2cpLVN4RnYvlSjgzUX6GZc";
module.exports.REGISTER_CHAT_ID = process.env.REGISTER_CHAT_ID || "1001790840024";
module.exports.DEPOSIT_CHAT_ID = process.env.DEPOSIT_CHAT_ID || "1001612919233";
module.exports.WITHDRAW_CHAT_ID = process.env.WITHDRAW_CHAT_ID || "1001626303211";
