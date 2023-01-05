import sendFeedback from '../../src/common/sendFeedback'

const Feedback = async (req, res) => {
  let errorMessage
  console.log("api/feedback.js")
  if (req.method === 'POST') {
    const {
      name, email, message, category, extraData,
    } = req.body

    try {
      const response = await sendFeedback({
        name,
        email,
        message,
        category,
        extraData,
      })

      console.log(`sendFeedback() response: ${JSON.stringify(response)}`)

      if (!errorMessage) {
        return res.status(200).json({ ...response })
      }
    } catch (e) {
      errorMessage = e.toString()
      console.warn(`sendFeedback() errorMessage: ${errorMessage}`)
    }
  }

  // see if we can parse http code from message
  let httpCode
  const found = errorMessage.match(/\((\d+)\)/)

  if (found?.length > 1) {
    httpCode = parseInt(found[1], 10)
  }

  return res.status(404).json({
    error: {
      code: httpCode || 'not_found',
      message: errorMessage ||
        'The requested endpoint was not found or doesn\'t support this method.',
    },
  })
}

export default Feedback;
