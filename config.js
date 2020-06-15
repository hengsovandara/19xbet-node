module.exports.debug                 = false;
module.exports.reSignUp              = true;
module.exports.env                   = 'test';

module.exports.HASURA_ENDPOINT =
  process.env.HASURA_ENDPOINT || "http://localhost:8085/v1/graphql";
module.exports.HASURA_ACCESSKEY = process.env.HASURA_ACCESSKEY || "pingkh";
