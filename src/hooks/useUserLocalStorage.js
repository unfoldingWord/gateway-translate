import { useEffect, useState } from 'react'
import * as isEqual from 'deep-equal'

/**
 * use hook for accessing local storage for user
 * @param {string} username
 * @param {string} key
 * @param {any} initialValue
 * @return {any[]}
 */
export function useUserLocalStorage(username, key, initialValue) {
  const [currentValue, setCurrentValue_] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const key_ = getUserKey(username, key)
        const savedValue = localStorage.getItem(key_)

        if (savedValue) {
          // Parse saved json data
          return JSON.parse(savedValue)
        }
      }
      return initialValue // default to initial value
    } catch (error) {
      // If error also return initialValue
      console.log(`useUserLocalStorage(${key}) - init error:'`, error)
      return initialValue
    }
  })
  const setCurrentValue = (newValue) => setUserItem(key, currentValue, setCurrentValue_, newValue, username)
  const readSavedValue = () => readUserItem(key, currentValue, setCurrentValue_, initialValue, username)

  useEffect(() => {
    if (username) {
      readSavedValue() // update once we have username or it has changed
    } else { // if no username, set back to default
      setCurrentValue_(initialValue)
    }
  }, [username])

  return [currentValue, setCurrentValue, readSavedValue]
}

/**
 * will combine username and baseKey into unique settings key
 * @param {string} username
 * @param {string} baseKey
 * @return {string} key for user settings
 */
export function getUserKey(username, baseKey) {
  const key_ = username ? `${username}_${baseKey}` : baseKey // get user key
  return key_
}

/**
 * set new value for user setting in both useState and localStorage if changed
 * @param {string} key - base key that will be prepended with username
 * @param {any} currentValue - current value for setting
 * @param {function} setState - callback function - called to update useState
 * @param {any} newValue
 * @param {string} username
 */
export function setUserItem(key, currentValue, setState, newValue, username) {
  const key_ = getUserKey(username, key)
  // Allow value to be a function so we have same API as useState
  const valueToStore =
    newValue instanceof Function ? newValue(currentValue) : newValue
  setLocalStorageValue(key_, valueToStore)
  setState && setState(valueToStore)
}

/**
 * refresh saved value for user setting from localStorage if found, otherwise set to initialValue
 * @param {string} key - base key that will be prepended with username
 * @param {any} currentValue - current value for setting
 * @param {function} setState - callback function - called to update useState
 * @param {any} initialValue - initial value to use if no setting found
 * @param {string} username - user to save settings for
 * @return {any} returns current value
 */
export function readUserItem(key, currentValue, setState, initialValue, username) {
  const key_ = getUserKey(username, key)
  let savedValue = getLocalStorageItem(key_)

  if (savedValue === null) {
    savedValue = initialValue

    if (initialValue !== null) {
      setUserItem(key, currentValue, setState, savedValue, username)
    }
  }

  if (!isEqual(currentValue, savedValue)) {
    setState && setState(savedValue)
  }
  return savedValue
}

/**
 * reads item from local storage
 * @param {string} key - key for item
 * @return {any}
 */
export function getLocalStorageItem(key) {
  if (typeof window !== 'undefined') {
    let savedValue = localStorage.getItem(key)

    if (savedValue !== null) {
      try {
        savedValue = JSON.parse(savedValue)
      } catch {
        savedValue = null // if not parsable
      }
    }
    return savedValue
  }
  return null
}

/**
 * saves item to local storage
 * @param {string} key - key for item
 * @param {any} value - value to save
 */
export function setLocalStorageValue(key, value) {
  if (typeof window !== 'undefined') {
    const valueToStoreStr = JSON.stringify(value)
    localStorage.setItem(key, valueToStoreStr)
  }
}

export default useUserLocalStorage
