const { fail, success, getRequestAct, login }          = require('hasu')
const { parseEvent } = require("../utils/helpers");
const uuid = require('uuid/v4')

module.exports.handler = async (event) => {

  let { body } = parseEvent(event);
  let { userName, password } = body;

  try {
    validator(userName, password);

    const token = uuid();

    const query = `
      mutation{
        update_Credentials(_set: { token: "${token}"} where: { _and: [{userName: {_eq:"${userName}"}}, { password: { _eq: "${password}"}}]}){
          affected_rows
        }
      }
    `;

    const {
      update_Credentials: { affected_rows  }
    } = await getRequestAct("GQL", { query });

    if (affected_rows > 0) return success({ token });

    return fail({message: 'unauthorised', statusCode: 401})
  } catch (error) {
    return error
  }
}

function validator(username, password) {
  switch (undefined) {
    case username:
      throw fail({"username": "username cannot be blank."}, {}, 401)
    case password:
      throw fail({"password": "password cannot be blank."}, {}, 401)
  }
}