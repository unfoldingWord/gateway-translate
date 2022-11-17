import { UserApi } from 'dcs-js'

const deletePreviousTokens = async ({ username, config, userClient }) => {
  const previousTokens = await userClient
    .userGetTokens({ username })
    .then(({ data }) => data)

  if (!previousTokens?.length) return false

  previousTokens.forEach(token => {
    if (token.name === config.tokenid)
      userClient.userDeleteAccessToken({ username, token: token.id })
  })

  return true
}

const getToken = async ({ username, password, config, userClient }) => {
  await deletePreviousTokens({ username, password, config, userClient })
  return await userClient
    .userCreateToken({
      username,
      userCreateToken: { name: config.tokenid },
    })
    .then(({ data }) => data)
}

const getUser = async ({ userClient }) => {
  return await userClient.userGetCurrent().then(({ data }) => data)
}

export const getUserAuth = async ({ username, password, config }) => {
  console.log(config)
  const basePath = config.server + '/api/v1'
  const userClient = new UserApi({ basePath, username, password })
  const token = getToken({ username, password, config, userClient })
  const user = getUser({ userClient })
  return {
    token: await token,
    user: await user,
  }
}
