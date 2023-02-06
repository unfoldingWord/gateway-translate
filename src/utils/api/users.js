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
  try {
    await deletePreviousTokens({ username, password, config, userClient })
    const { data: token } = await userClient
      .userCreateToken({
        username,
        userCreateToken: { name: config.tokenid },
      })  
    return token
  } catch (e) {
    return null
  }

}

const getUser = async ({ userClient }) => {
    return userClient.userGetCurrent().then(({ data }) => data).catch(console.error)
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
