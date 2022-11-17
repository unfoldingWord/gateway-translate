export const ERROR_SERVER_UNREACHABLE = 'ERR_SERVER_UNREACHABLE'
export const ERROR_SERVER_DISCONNECT_ERROR = 'ERROR_SERVER_DISCONNECT_ERROR'
export const ERROR_NETWORK_DISCONNECTED = 'ERR_NETWORK_DISCONNECTED'
export const ERROR_NETWORK_ERROR = 'Network Error'

export const defaultErrorMessages = {
  actionText: 'Login',
  genericError: 'Something went wrong, please try again.',
  usernameError: 'Username does not exist.',
  passwordError: 'Password is invalid.',
  networkError:
    'There is an issue with your network connection. Please try again.',
  serverError: 'There is an issue with the server please try again.',
}

export const parseError = ({ error, messages = defaultErrorMessages }) => {
  const errorMessage = error && error.message ? error.message : ''
  let friendlyError = {}

  if (errorMessage.match(ERROR_SERVER_UNREACHABLE)) {
    friendlyError = {
      errorMessage: messages.serverError,
      isRecoverable: false,
    }
  } else if (
    errorMessage.match(ERROR_NETWORK_DISCONNECTED) ||
    errorMessage.match(ERROR_NETWORK_ERROR)
  ) {
    friendlyError = {
      errorMessage: messages.networkError,
      isRecoverable: false,
    }
  } else {
    friendlyError = {
      errorMessage: messages.genericError,
      isRecoverable: true,
    }
  }

  return friendlyError
}
