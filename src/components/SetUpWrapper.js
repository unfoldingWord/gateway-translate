function SetUpWrapper({ children }) {
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-col w-full px-4 lg:w-132 lg:p-0'>
        {children}
      </div>
    </div>
  )
}

export default SetUpWrapper
