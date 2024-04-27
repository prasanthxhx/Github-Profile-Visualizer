import {createContext} from 'react'

const CommonContext = createContext({
  isHamburgerActive: false,
  onClickHamburger: () => {},
})

export default CommonContext
