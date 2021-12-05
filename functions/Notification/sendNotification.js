const { parseEvent } = require('../utils/helpers')
const { success, fail, getRequestAct } = require('hasu')
const { BOT_TOKEN, REGISTER_CHAT_ID, DEPOSIT_CHAT_ID, WITHDRAW_CHAT_ID  } = require('../../config')

module.exports.handler = async event => {
  try {
    const { body: { event: { data: { new: newData } }, table: { name }} } = parseEvent(event)
    let url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?`
    let text = ''
    let chatId = ''
    switch (name) {
      case 'Users':
        text = "*អតិថិជនចុះឈ្មោះ*\n\n" + "ឈ្មោះ: " + newData.name + "\n\n" + "លេខទូរស័ព្ទ: 0" + newData.phoneNumber + "\n\n" + "-----------------------------------------------------"
        chatId = REGISTER_CHAT_ID
        break;
      default:
        const { user } = await getUserInfo(newData.userId)
        let type = ''
        if(newData.type === "cashOut"){
          chatId = WITHDRAW_CHAT_ID
          type = "ដកប្រាក់"
        }else{
          chatId = DEPOSIT_CHAT_ID
          type = "ដាក់ប្រាក់"
        }
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
        
    // url += `chat_id=-${chatId}&text=${encodeURI(text)}&parse_mode=Markdown`
    url += `chat_id=-${chatId}`

    const newResult =  await getRequestAct("POST", {url, body: { text }}).then(res => res).catch(error => {throw error})
    // const newResult =  await getRequestAct("GET", {url}).then(res => res).catch(error => {throw error})

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