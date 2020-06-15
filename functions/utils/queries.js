const fields = {
  "Accounts": `id name email profileImgId flag file{ type url }`,
  "Credentials": `id userName password email accountId`,
  "Verifications": `id verificationCode verified credentialId`,
  "Files": `id type url thumbnailUrl accountId`,
  "Matches": `id homeId extra coordination coordinates awayId isportsLocation isportsMatchId leagueId status timestamp`,
  "Notifications": `id`
}

module.exports = {
  getProfile: token => `
    query {
      Accounts(where: { credential: { sessions: { token: { _eq: "${token}"}}}}){
        id name email role flag
        file{ type url }
        interests{ interestId }
        languages{ languageId }
        teams{ teamId }
      }
    }
  `,

  globalQuery: (
    table,
    condition = "where: { id: { _is_null: false }}",
    returnFields = "id"
  ) => `
    query{
      ${table}(${condition}){
        ${fields[returnFields] && fields[returnFields] || returnFields}
      }
    }
  `,

  credetial: token => `
    query {
      Credentials(where: { sessions: { token: { _eq: "${token}"}}}){
        id
      }
    }
  `,

  create: table => `
    mutation($values: ${table}_insert_input!) {
      insert_${table}(objects: [$values]){
        returning{ ${fields[table]} }
      }
    }
  `,

  update: (table, condition = `id: { _eq: $id }`) => `
    mutation($values: ${table}_set_input, $id: uuid) {
      update_${table}( _set: $values, where: {${condition}}){
        returning { ${fields[table]} }
      }
    }
  `,

  upsert: (table, columns) => `
    mutation($values: [${table}_insert_input!]!){
      insert_${table}(
        objects: $values,
        on_conflict: {
          constraint: ${table}_pkey,
          update_columns: [${columns}]
        }) {
        returning{
          ${columns.join(" ")}
        }
      }
    }
  `,

  createVerification: (verificationCode, email, password, username) => `
    mutation {
      insert_Verifications(objects: {
        verificationCode: "${verificationCode}"
        credentials: {
          data: {
            email: "${email}"
            password: "${password}"
            userName: "${username}"
          }
        }
      }) {
        returning { id }
      }
    }
  `,

  upsertWithVariables: (table, returning) => `
    mutation($values: [${table}_insert_input!]! $contrain: ${table}_on_conflict){
      insert_${table}(objects: $values, on_conflict: $contrain){
        ${returning ? returning : `affected_rows`}
      }
    }
  `
};
