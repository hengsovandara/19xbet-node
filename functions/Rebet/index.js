const { loginResult, success, fail, getRequestAct } = require("hasu");
const { globalQuery } = require('../utils/queries');
const { parseEvent }  = require('../utils/helpers');

module.exports.handler = async (event, context) => {

  const { headers, body, authorization } = parseEvent(event);

  try {
    const { username, password, domain = "lotto8888" } = headers
    const sid = await requestSingin({username, password, authorization, domain})

    const reports = await requestReport(sid, body)
    return success(reports)
  } catch (e) {
    return fail(e)
  }
};

const requestSingin = async ({username, password, authorization, domain}) => {
  domain = domain && domain || "lotto8888.com"
  const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': authorization,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ 
        username,
        password,
        'domain': 'ag.' + domain 
      })
  };

  try {
    var result = await fetch('http://api.sbc369pro.com/api/user-auth/login/', requestOptions)
    result = await result.json()
    return result.sessionid
  } catch (error) {
    console.log(error)
  }
}

const requestReport = async (sessionId, body = { }) => {

  if(!sessionId)
    return

  const { agent, fdate: startDate, tdate: endDate } = body

  var url = `http://api.sbc369pro.com/api/user-auth/win_report/?fdate=${startDate}&tdate=${endDate}&currency=KHR&username=${agent}`
  
  const response = await fetch(url, {
    headers: {
      'Authorization': "sid " + sessionId,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  });

  try {
    const data = await response.json();
    return data
  } catch (error) {
    console.log(error)
    return {}
  }
}