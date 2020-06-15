const { loginResult, success, fail, getRequestAct } = require("hasu");
const { globalQuery } = require('../utils/queries');
const { parseEvent }  = require('../utils/helpers');

module.exports.handler = async (event, context) => {

  const { token } = parseEvent(event);

  const query = globalQuery(
    "Credentials",
    `where: { sessions: { token: { _eq: "${token}"} }}`,
    `staff { id role } user { id }`
  );

  try {
    const {
      Credentials: [credential]
    } = await getRequestAct("GQL", { query });

    if (!credential) return loginResult(401, {});

    const { staff, user } = credential;
    let id;
    let role = 'admin'

    if (staff) {
      role = staff.role;
      id = staff.id;
    } else {
      role = "admin";
      id = user.id;
    }

    return loginResult(200, {
      "X-Hasura-User-Id": id,
      "X-Hasura-Role": role
    });
  } catch (error) {
    console.log("error", error);
    return loginResult(401, {});
  }
};