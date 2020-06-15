const { fail, success, getRequestAct, login } = require('hasu')
const { parseEvent } = require("../utils/helpers");
const { sendNotification } = require('./sendNotification')
const _ = require('lodash')

module.exports.handler = async (event) => {

  let { body: { event: { data } } } = parseEvent(event);
  const newData = data.new

  let { status, index } = newData || {}
  const length = index.toString().length > 7 ? index.toString().length : 7
  const id = index.toString().padStart(length, '0')
  try {
    if (status !== "pending")
      return fail()
    const query = `
      query { Staffs{ messagingToken } }
    `;

    const { Staffs } = await getRequestAct("GQL", { query })

    let messagingToken = Staffs.filter(staff => staff.messagingToken.length && staff.messagingToken).map(staff => staff.messagingToken)

    messagingToken = _.flatten(messagingToken)

    if (!messagingToken.length)
      return fail()

    notification = {
      title: `Order ${status}`,
      body: `There is one new order id: ${id}.`
    }

    data = { key: status }
    await sendNotification({ tokens: messagingToken, data, notification })

    return success()
  } catch (error) {
    return fail(error)
  }
}