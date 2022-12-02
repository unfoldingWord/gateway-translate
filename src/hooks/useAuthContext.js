import { AuthContext } from '@context/AuthContext'
import { useContext } from 'react'

const useAuthContext = () => {
  const authContext = useContext(AuthContext)
  return authContext
}

export default useAuthContext
