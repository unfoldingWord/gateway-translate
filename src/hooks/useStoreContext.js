import { StoreContext } from '@context/StoreContext'
import { useContext } from 'react'

const useStoreContext = () => useContext(StoreContext)

export default useStoreContext
