import { useEffect, useState } from 'react'

/**
 * make sure we have all the account settings for current user, otherwise go to account setup
 * @param {Object} authentication
 * @param {boolean} showAccountSetup
 * @param {string} languageId
 * @param {string} owner
 * @param {function} setShowAccountSetup
 */
export default function useValidateAccountSettings(authentication, showAccountSetup, languageId, owner, setShowAccountSetup) {
  const [timer, setTimer] = useState(null)
  const missingAccountSettings = (authentication && !showAccountSetup && (!languageId || !owner))

  useEffect(() => {
    // TRICKY - in the case we switched users, make sure we have account settings
    if (missingAccountSettings) {
      if (!timer) {
        const timer_ = setTimeout(() => { // wait for account settings to update
          // timer timed out and still missing account settings
          console.log(`useValidateAccountSettings - still missing account settings going to setup page`)
          setShowAccountSetup(true)
        }, 1000)
        setTimer(timer_)
      }
    } else if (timer) {
      // no longer missing account settings - clear timer
      clearTimeout(timer)
      setTimer(null)
    }
  }, [ missingAccountSettings, timer, setTimer, setShowAccountSetup ])
}
