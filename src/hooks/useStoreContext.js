import { useRouter } from 'next/router'
import { StoreContext } from '@context/StoreContext'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useContext } from 'react'

const useStoreContext = () => {
  const router = useRouter()
  const storeContext = useContext(StoreContext)
  useDeepCompareEffect(() => {
    const {
      state: { showAccountSetup },
    } = storeContext
    if (!!showAccountSetup) {
      router.push('/settings')
    }
  }, [storeContext])
  return storeContext
}

export default useStoreContext
