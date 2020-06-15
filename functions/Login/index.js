const { fail, success, getRequestAct, login }          = require('hasu')
const { parseEvent } = require("../utils/helpers");
const uuid = require('uuid/v4')

module.exports.handler = async (event) => {

  let { body } = parseEvent(event);
  let { email, phoneNumber = '', password } = body;

  try {
    // validator(userName, password, phoneNumber);
    phoneNumber = phoneNumber.replace(/^0/, '')

    let query = `
      query{
        Credentials(where: { _and: [{ password:{ _eq: "${password}"} }, {
          _or:[{email: { _eq: "${email}"}}, { phoneNumber:{ _eq:"${phoneNumber}"}}]
        }]}){
          id
        }
      }
    `

    const {
      Credentials: [credentials] 
    } = await getRequestAct("GQL", { query });

    if(!credentials.id)
      throw { message: "unauthorised", statusCode: 401}

    query = `
      mutation{
        insert_Sessions(objects: { credentialId: "${credentials.id}"}){
          returning { token }
        }
      }
    `;

    const {
      insert_Sessions: { returning  }
    } = await getRequestAct("GQL", { query });

    if (!returning.length) return fail({message: 'unauthorised', statusCode: 401})
    const { token } = returning[0] || {}

    return success({ token });
  } catch (error) {
    return error
  }
}

function validator(username, password) {
  switch (undefined) {
    case username:
      throw fail({"username": "username cannot be blank."}, 401)
    case password:
      throw fail({"password": "password cannot be blank."}, 401)
  }
}