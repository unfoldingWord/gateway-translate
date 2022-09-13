import { useEffect } from 'react'
import useLocalStorage from '@hooks/useLocalStorage'

/**
 * manage state for feedbackCard
 * @param {boolean} open - true when card is displayed
 * @return {{state: {setEmailError: (value: unknown) => void, submitting: boolean, showError: boolean, emailError: unknown, showEmailError: boolean, name: string, category: string, message: string, networkError: unknown, showSuccess: boolean, email: string}, actions: {setName: (value: (((prevState: string) => string) | string)) => void, setSubmitting: (value: (((prevState: boolean) => boolean) | boolean)) => void, doUpdateBounds: doUpdateBounds, setEmail: (value: (((prevState: string) => string) | string)) => void, setCategory: (value: (((prevState: string) => string) | string)) => void, setShowError: (value: (((prevState: boolean) => boolean) | boolean)) => void, setShowSuccess: (value: (((prevState: boolean) => boolean) | boolean)) => void, setShowEmailError: (value: (((prevState: boolean) => boolean) | boolean)) => void, setMessage: (value: (((prevState: string) => string) | string)) => void, setNetworkError: (value: unknown) => void}}}
 */
export default function useFeedbackData(open) {
  const [submitting, setSubmitting] = useLocalStorage('submitting', false)
  const [showSuccess, setShowSuccess] = useLocalStorage('showSuccess', false)
  const [showError, setShowError] = useLocalStorage('showError', false)
  const [category, setCategory] = useLocalStorage('category', '')
  const [name, setName] = useLocalStorage('name', '')
  const [email, setEmail] = useLocalStorage('email', '')
  const [emailError, setEmailError] = useLocalStorage('emailError', null)
  const [showEmailError, setShowEmailError] = useLocalStorage('showEmailError', false)
  const [message, setMessage] = useLocalStorage('message', '')
  const [networkError, setNetworkError] = useLocalStorage('networkError', null)

  function clearState() {
    setCategory('')
    setEmail('')
    setEmailError(false)
    setMessage('')
    setName('')
    setNetworkError(null)
    setShowSuccess(false)
    setShowError(false)
    setShowEmailError(false)
    setSubmitting(false)
  }

  useEffect(() => {
    if (!open) {
      clearState()
    }
  }, [open])

  return {
    state: {
      category,
      email,
      emailError,
      message,
      name,
      networkError,
      showEmailError,
      showError,
      showSuccess,
      submitting,
    },
    actions: {
      clearState,
      setCategory,
      setEmail,
      setEmailError,
      setMessage,
      setName,
      setNetworkError,
      setShowSuccess,
      setShowError,
      setShowEmailError,
      setSubmitting,
    },
  }
}
