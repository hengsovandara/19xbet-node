const { fail, success, getRequestAct } = require('hasu')
const { parseEvent, validatePresence } = require("../utils/helpers");
const uuid = require('uuid/v4')

module.exports.handler = async (event) => {

  let { token, body } = parseEvent(event);
 b
  try {
    let token = ''
    switch (true) {
      case (!!email || !!phoneNumber) && !!password && !!passwordConfirmation:
        token = await createCustomeUser(body);
        return success({ token });
      default:
        token = await userLogin({ email, phoneNumber, password });
        return success({ token });
        
    }
  } catch (error) {
    return fail(error);
  }
}

const createCustomeUser = async body => {
  const token = uuid();
  const { name, phone, email, password, passwordConfirmation } = body;
  let phoneNumber = body.phoneNumber && body.phoneNumber.replace(/^0/, '')
  const { isValid, errors } = validatePresence({
    name,
    password,
    passwordConfirmation
  });

  if(isValid){
    if (password !== passwordConfirmation)
      throw { message: "password not match.", statusCode: 401 };
    try {
      const query = `
        mutation($values: [Credentials_insert_input!]!){
          insert_Credentials(objects: $values){
            returning{
              sessions{ token}
            }
          }
        }
      `;

      const variables =  {
        values: { email, password, phoneNumber,
          user: { data: { name, email, phoneNumber } },
          sessions: { data: {} }
        }
      };

      const {
        insert_Credentials: { returning }
      } = await getRequestAct("GQL", { query, variables });

      if (returning.length) return returning[0].sessions[0].token;
      throw { message: "email already exist.", statusCode: 401 };
    } catch (error) {
      console.log("error", error);
      throw {message: "email already exist.", statusCode: 401}
    }
  }
  throw {message: errors, statusCode: 401}
};

const userLogin = async({ email, phoneNumber, password}) => {
  if((!email && !phoneNumber) || !password)
    throw {message: "email or password can not be empty"}
  console.log("asdsadsadsa")
  try{
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
      Credentials: [credentials = {}] 
    } = await getRequestAct("GQL", { query });

    if(credentials && !credentials.id)
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

    return token
  } catch (error) {
    throw error
  }
};

