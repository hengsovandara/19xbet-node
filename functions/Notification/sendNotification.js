const admin = require('firebase-admin')
const serviceAccount = require('../psardermkor-kh-firebase-adminsdk')
module.exports.sendNotification = sendNotification

async function sendNotification({ tokens = ['asdsa'], data, notification}) {

  try {
    if (!admin.apps.length) {
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
    }

    var message = {
      notification,
      data,
      tokens
    };

    admin.messaging().sendMulticast(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
        throw error
      });
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}