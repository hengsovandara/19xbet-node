const { getRequestAct }   = require('hasu')
const { globalQuery }     = require('./queries')
const isEmpty = require("lodash/isEmpty");

const {
  MAILGUN_APIKEY,
  MAILGUN_DOMAIN,
  EMAIL_FROM,
  GOTIFO_API_ENDPOINT
}                         = require('../../config')

module.exports.parseEvent   = parseEvent
module.exports.sendEmail    = sendEmail
module.exports.verifyCode   = verifyCode
module.exports.parseProfile = parseProfile
module.exports.validatePresence = validatePresence;

function parseEvent(event){
  const body = JSON.parse(event.body)

  let { token }                         = body || {}
  const bodyHeaders                     = body && body.headers || ''
  const { headers }                     = event

  let { authorization, Authorization }  = ((headers.authorization || headers.Authorization) && headers || bodyHeaders) || {}

  authorization = authorization || Authorization

  token = token && token || (authorization && authorization.replace(/bearer(\s{1,})?/i, '') || '')

  return { authorization, token, body, headers }
}

async function sendEmail(email, code, id, config = {}) {
  const apiKey   = config && config.apiKey   || MAILGUN_APIKEY
  const domain   = config && config.domain   || MAILGUN_DOMAIN
  const from     = config && config.from     || EMAIL_FROM
  const to       = config && config.to       || email
  const endpoint = config && config.endpoint || GOTIFO_API_ENDPOINT
  const subject  = config && config.subject  || 'GOTIFO Email Verification'
  const link     = `${endpoint}/auth/verify?id=${id}&code=${code}`
  const html     = config && config.html     || emailTemplate(link)
  const mailgun  = require('mailgun-js')({ apiKey, domain })

  const data = { from, to, subject, html }

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  })
}

const emailTemplate = (link) => {
  const template = `
    <div>
      <p>Please confirm your account by clicking this link:</p>
      <p>
        <a href="${link}">Click here</a>

        to activate your account
      </p>
    </div>
  `
  return template
}

function verifyCode({code, id, condition, fields}) {
  condition = condition && condition || `where: {_and: [{ verificationCode: { _eq: "${code}"}},{id: { _eq: "${id}"}}, { verified: { _eq: false }}]}`

  fields = fields && fields || 'id'

  const query = globalQuery('Verifications', condition, fields)

  return getRequestAct('GQL', {query}).then(res => res)
}

function parseProfile(accounts) {
  Object.keys(accounts).forEach(key => {
    if (typeof accounts[key] === 'object' && accounts[key] !== null && Array.isArray(accounts[key])){
      let values = accounts[key]
      values = values.map( value => {
        if (value[Object.keys(value)[0]] !== null)
          return value[Object.keys(value)[0]]
        return null
      })

      accounts[key] = values.filter( value => value!= null )
    }
  })

  return accounts
}

function validatePresence(params){
  const errors = {};

  Object.keys(params).map(key => {
    if (isEmpty(params[key])) {
      errors[key] = { code: key, message: "required" };
    }
  });

  console.log(errors);
  return { isValid: isEmpty(errors), errors };
};