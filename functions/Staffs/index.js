const { fail, success, getRequestAct } = require("hasu");
const { globalQuery } = require("../utils/queries");
const { parseEvent, parseProfile } = require("../utils/helpers");

module.exports.handler = async (event, context) => {
  try {
    const { authorization, token, body } = parseEvent(event);

    const query = `
      mutation($values: [Staffs_insert_input!]! ){
        insert_Staffs(objects: $values
        on_conflict: {
          constraint: Staffs_pkey, 
          update_columns: [name email address role phoneNumbers firebaseUID]
        }){
          returning {
            id name email address role phoneNumbers
          }
        }
      }
    `;

    return success(account, "Update profile success.");
  } catch (err) {
    return fail((err.message && err.message) || err);
  }
};

