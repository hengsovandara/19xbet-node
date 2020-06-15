const { fail, success, getRequestAct, login } = require('hasu')
const { parseEvent } = require("../utils/helpers");
const uuid = require('uuid/v4')
const { sendNotification } = require('./sendNotification')

module.exports.handler = async (event) => {

  let { body: { event: { data } } } = parseEvent(event);
  const newData = data.new

  let { userId, status, index } = newData || {}

  try {
    const query = `
      query { Devices(where: { userId: { _eq: "${userId}"}}){ id platform token uniqueId} }
    `;

    const { Devices } = await getRequestAct("GQL", { query })

    if (Devices && Devices.length) {
      const { token } = Devices[0]

      const length = index.toString().length > 7 ? index.toString().length : 7
      const id = index.toString().padStart(length, '0')
      let data = {}
      let notification = {}
      switch (status) {
        case 'accepted':
          notification = {
            title: `Order ${status}`,
            body: `Your order id: ${id} has been ${status}.\nOur staff is preparing and will be deliver as soon as possible.`,
          }
          break;

        default:
          notification = {
            title: `Order ${status}`,
            body: `Your order id: ${id} has been ${status}`,
          }
          break;
      }
      data = { key: status }
      await sendNotification({ tokens: [token], data, notification })
    }

    return success()
  } catch (error) {
    return fail(error)
  }
}