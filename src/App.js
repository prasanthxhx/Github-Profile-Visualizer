import {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Home from './components/Home'
import Repositories from './components/Repositories'
import RepositoryItemDetails from './components/RepositoryItemDetails'
import CommonContext from './ReactContext/CommonContext'
import './App.css'

class App extends Component {
  state = {isHamburgerActive: false}

  onClickHamburger = () => {
    this.setState(prevState => ({
      isHamburgerActive: !prevState.isHamburgerActive,
    }))
  }

  render() {
    const {isHamburgerActive, username} = this.state

    return (
      <CommonContext.Provider
        value={{
          isHamburgerActive,
          onClickHamburger: this.onClickHamburger,
        }}
      >
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/repositories" component={Repositories} />
          <Route
            exact
            path="/repositories/:repoName"
            component={RepositoryItemDetails}
          />
        </Switch>
      </CommonContext.Provider>
    )
  }
}

export default App
