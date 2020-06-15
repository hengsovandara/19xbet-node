const { fail, success, getRequestAct, login } = require('hasu')
const { parseEvent, validatePresence } = require("../utils/helpers");
const uuid = require('uuid/v4')

module.exports.handler = async (event) => {

  let { body } = parseEvent(event);
  const { uid, email, password, passwordConfirmation } = body;

  try {
    let token = ''
    switch (true) {
      case !!uid:
        token = await checkAndCreateUser({body})
        return success({token})
      case !!email && !!password && !!passwordConfirmation:
        token = await createCustomeUser(body);
        console.log("token", token);
        return success({ token });
      default:
        token = await userLogin({ email, password });
        return success({ token });
        
    }
  } catch (error) {
    return fail(error);
  }
}

const checkAndCreateUser = async ({ body = {}, variables, constraint = 'firebaseUID', index = 1 }) => {

  const { uid, displayName, email, phoneNumber, photoURL } = body;
  const token = uuid();
  const query = `
    mutation($values: [Credentials_insert_input!]!){
      insert_Credentials(objects: $values on_conflict:{
        constraint: Credentials_${constraint}_key
        update_columns: [token ${constraint}]
      }){ returning{ token } }
    }
  `;

  variables = variables || {
    values: {
      firebaseUID: uid, email, token,
      user: {
        data: { name: displayName, email, phone: phoneNumber, photoURL, firebaseUID: uid },
        on_conflict: {
          constraint: `Users_${constraint}_key`,
          update_columns: ["firebaseUID"]
        }
      }
    }
  };

  try {

    const {
      insert_Credentials: { returning }
    } = await getRequestAct("GQL", { query, variables });

    if (returning.length) return returning[0].token;
    throw "Oops! sorry can not sign-in.";
  } catch (error) {
    index += 1
    if (index > 3)
      throw error

    variables["values"]["user"]["on_conflict"] = {
      constraint: `Users_email_key`,
      update_columns: ["firebaseUID"]
    }

    return await checkAndCreateUser({ body, variables, constraint: 'email', index })
  }
};

const createCustomeUser = async body => {
  const token = uuid();
  const { name, phone, email, password, passwordConfirmation } = body;

  const { isValid, errors } = validatePresence({
    name,
    phone,
    email,
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
              token
            }
          }
        }
      `;

      const variables =  {
        values: { email, token, password,
          user: {
            data: { name, email, phone }
          }
        }
      };

      const {
        insert_Credentials: { returning }
      } = await getRequestAct("GQL", { query, variables });

      if (returning.length) return returning[0].token;
      throw { message: "email already exist.", statusCode: 401 };
    } catch (error) {
      console.log("error", error);
      throw {message: "email already exist.", statusCode: 401}
    }
  }
};

const userLogin = async({ email, password}) => {
  if(!email || !password)
    throw {message: "email or password can not be empty"}

  const token = uuid()
  const query = `
    mutation{
      update_Credentials(
        where: { _and: [{email: {_eq: "${email}"}}, {password: {_eq: "${password}"}}]}
        _set: { token: "${token}"}
      ){
        returning{ token }
      }
    }
  `;

  const {
    update_Credentials: { returning }
  } = await getRequestAct("GQL", { query });
  
  if(returning.length)
    return returning[0].token;
};

