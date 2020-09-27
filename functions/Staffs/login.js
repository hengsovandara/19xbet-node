const { fail, success, getRequestAct, login }          = require('hasu')
const { parseEvent } = require("../utils/helpers");
const uuid = require('uuid/v4')

module.exports.handler = async (event) => {

  let { body } = parseEvent(event);
  let { email, phoneNumber = '', password } = body;

  try {
    phoneNumber = phoneNumber && phoneNumber.replace(/^0/, '')
    validator(email, password, phoneNumber);

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

function validator(email, password, phoneNumber) {
  if(!phoneNumber && !email)
    throw fail({"password": "password cannot be blank."}, 401)

  if(!password)
    throw fail({"password": "password cannot be blank."}, 401)

}