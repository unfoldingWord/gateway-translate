import sgMail from '@sendgrid/mail'
import { APP_VERSION } from '../common/constants'

export default async function sendFeedback({
  name, email, message, category, extraData,
}) {
  let fullMessage = `${message}\n\nApp Version: ${APP_VERSION}`

  if (name) {
    fullMessage += `\n\nName: ${name}`
  }

  if (email) {
    fullMessage += `\n\nEmail: ${email}`
  }

  if (extraData) {
    fullMessage += `\n\nExtraData: ${extraData}`
  }

  const msg = {
    to: process.env.HELP_DESK_EMAIL,
    from: email,
    subject: `Next.js Template App: ${category}`,
    text: fullMessage,
    html: fullMessage.replace(/\n/g, '<br>'),
  }
  sgMail.setTimeout(4500)

  sgMail.setApiKey(process.env.HELP_DESK_TOKEN)

  return sgMail.send(msg)
}
