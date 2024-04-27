import {Link, withRouter} from 'react-router-dom'
import {GiHamburgerMenu} from 'react-icons/gi'
import CommonContext from '../../ReactContext/CommonContext'
import './index.css'

const navLinks = [
  {id: 'HOME', displayText: 'Home', path: '/'},
  {id: 'REPOSITORIES', displayText: 'Repositories', path: '/repositories'},
  {id: 'ANALYSIS', displayText: 'Analysis', path: '/analysis'},
]

const Header = props => (
  <CommonContext.Consumer>
    {value => {
      const {isHamburgerActive, onClickHamburger} = value

      const hamStatusClassName = isHamburgerActive ? '' : 'ham-status'

      const getActiveTab = () => {
        const {match} = props
        const {path} = match

        const activePath = () => {
          switch (path) {
            case '/':
              return 'HOME'
            case '/repositories':
              return 'REPOSITORIES'
            case `/repositories/:repoName`:
              return 'REPOSITORIES'
            case '/analysis':
              return 'ANALYSIS'
            default:
              return null
          }
        }

        return activePath()
      }

      return (
        <nav className="navbar">
          <div className="ham-cont">
            <h1 className="nav-h1">Github Profile Visualizer</h1>
            <button
              className="hamburger-btn"
              type="button"
              onClick={onClickHamburger}
            >
              <GiHamburgerMenu />
            </button>
          </div>
          <ul className={`nav-link-cont ${hamStatusClassName}`}>
            {navLinks.map(eachItem => (
              <li key={eachItem.id}>
                <Link
                  to={eachItem.path}
                  className={`route-link ${
                    getActiveTab() === eachItem.id ? 'active-nav-link' : ''
                  }`}
                >
                  {eachItem.displayText}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )
    }}
  </CommonContext.Consumer>
)

export default withRouter(Header)
