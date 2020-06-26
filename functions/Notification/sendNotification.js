const { parseEvent } = require('../utils/helpers')
const { success, fail, getRequestAct } = require('hasu')
const { BOT_TOKEN, CHAT_ID  } = require('../../config')

module.exports.handler = async event => {
  try {
    const { body: { event: { data: { new: newData } }, table: { name }} } = parseEvent(event)
    let url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}`
    let text = ''
    switch (name) {
      case 'Users':
        text = "*អតិថិជនចុះឈ្មោះ*\n\n" + "ឈ្មោះ: " + newData.name + "\n\n" + "លេខទូរស័ព្ទ: 0" + newData.phoneNumber + "\n\n" + "-----------------------------------------------------"
        break;
      default:
        const { user } = await getUserInfo(newData.userId)
        const type = newData.type === "cashOut" ? "ដកប្រាក់" : "ដាក់ប្រាក់"
        text = "-------------------------------------------------" + "\n\n" + 
        "អតិថិជន" + type + "\n\n" + 
        "លេខ: " + newData.index + "\n\n" + 
        "ឈ្មោះ: " + user.name + "\n\n" + 
        "លេខទូរស័ព្ទ: 0" + user.phoneNumber + "\n\n" + 
        "ចំនួនប្រាក់: " + newData.amount + "\n\n" + 
        "តាមវិធី: " + newData.method + "\n\n" + 
        "-------------------------------------------------"
        break;
    }
        
    url += `&text=${encodeURI(text)}&parse_mode=Markdown`

    const newResult =  await getRequestAct("GET", {url}).then(res => res).catch(error => {throw error})

    return success(newResult)
  } catch (error) {
    console.log(error)
    fail({ message: error })
  }
}

async function getUserInfo(userId){
  const query = `
    query{ user: Users_by_pk(id: "${userId}"){ name phoneNumber } }
  `

  return getRequestAct("GQL", {query})
}