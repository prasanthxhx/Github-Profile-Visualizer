import {Component} from 'react'
import {PieChart, Pie, Legend, Cell, ResponsiveContainer} from 'recharts'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaStar, FaRegStar} from 'react-icons/fa'
import {RiGitBranchLine} from 'react-icons/ri'
import Header from '../Header'
import Members from '../Members'
import CommonContext from '../../ReactContext/CommonContext'
import './index.css'

const langColors = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5']

const getColorClassName = () => {
  const randNum = Math.floor(Math.random() * 5)
  return langColors[randNum]
}

// Function to generate random colors
const generateRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class RepositoryItemDetails extends Component {
  state = {reposDetails: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getRepositoryDetails()
  }

  onSuccessFulResponse = reposDetails => {
    this.setState({reposDetails, apiStatus: apiStatusConstants.success})
  }

  onFailureResponse = () => {
    this.setState({apiStatus: apiStatusConstants.failure})
  }

  getRepositoryDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const {match} = this.props
    const {params} = match
    const {repoName} = params

    const username = Cookies.get('username')

    const apiKey = ''

    const url = `https://apis2.ccbp.in/gpv/specific-repo/${username}/${repoName}?api_key=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (response.ok === true) {
      const branchUrl = `https://api.github.com/repos/${username}/${repoName}/branches`
      const commitsUrl = `https://api.github.com/repos/${username}/${repoName}/commits`

      const options = {
        method: 'GET',
        headers: {
          Authorization: `token ${apiKey}`,
        },
      }

      const branchResponse = await fetch(branchUrl, options)
      const branches = await branchResponse.json()
      const commitsResponse = await fetch(commitsUrl, options)
      const commits = await commitsResponse.json()

      if (branchResponse.ok === true && commitsResponse.ok === true) {
        const contributors = data.contributors.map(eachItem => ({
          id: eachItem.id,
          avatarUrl: eachItem.avatar_url,
          contributions: eachItem.contributions,
        }))

        const formatedReposDetails = {
          id: data.id,
          name: data.name,
          description: data.description,
          languages: data.lanuages,
          stargazersCount: data.stargazers_count,
          forksCount: data.forks_count,
          branches,
          commits,
          contributors,
          issuesCount: data.open_issues_count,
        }

        this.onSuccessFulResponse(formatedReposDetails)
      } else {
        this.onFailureResponse()
      }
    } else {
      this.onFailureResponse()
    }
  }

  renderSuccessView = () => {
    const {reposDetails} = this.state
    const {
      id,
      name,
      description,
      languages,
      stargazersCount,
      forksCount,
      branches,
      commits,
      contributors,
      issuesCount,
    } = reposDetails

    const commitsCount = commits.length
    const branchesCount = branches.length

    const CustomLegend = ({payload}) => {
      let uniqueKey = 0
      return (
        <ul className="legend-ul-cont">
          {payload.map((entry, index) => {
            uniqueKey += 1
            return (
              <li
                className="legend-li-cont"
                key={uniqueKey}
                style={{color: '#cbd5e1'}}
              >
                <span
                  className="legend-icon"
                  style={{
                    backgroundColor: entry.color,
                    width: '16px',
                    height: '16px',
                    display: 'inline-block',
                    marginRight: '15px',
                  }}
                />
                {entry.value}
              </li>
            )
          })}
        </ul>
      )
    }

    const colors = languages.map(() => generateRandomColor())
    let uniqueKey = 0

    return (
      <div className="repos-item-cont repos-details-card">
        <h1 className="repos-item-h1">{name}</h1>
        <p className="repos-item-p">{description}</p>
        <div className="languages-cont">
          {languages.map(eachItem => (
            <p
              className={`languages ${getColorClassName()}`}
              key={eachItem.value}
            >
              {eachItem.name}
            </p>
          ))}
        </div>
        <div className="repos-item-icon-cont">
          <div className="repos-icon-cont">
            <FaRegStar className="star-icon" />
            <p className="repos-icon-p">{stargazersCount}</p>
          </div>
          <div className="repos-icon-cont">
            <RiGitBranchLine className="git-icon" />
            <p className="repos-icon-p">{branchesCount}</p>
          </div>
        </div>
        <div className="commit-total-cont">
          <div className="commit-cont">
            <p className="commit-p">Commits Count</p>
            <p className="commit-value">
              {commitsCount < 10 ? `0${commitsCount}` : commitsCount}
            </p>
          </div>
          <div className="commit-cont">
            <p className="commit-p">Issues Count</p>
            <p className="commit-value">
              {issuesCount < 10 ? `0${issuesCount}` : issuesCount}
            </p>
          </div>
        </div>
        <h1 className="repos-details-h1">Contributors :</h1>
        <p className="repos-details-p">{contributors.length} Members</p>
        <ul className="members-ul-cont">
          <Members contributors={contributors} />
        </ul>
        <h1 className="repos-details-h1">Languages :</h1>

        <ResponsiveContainer
          className="responsive-cont"
          width="100%"
          height={300}
        >
          <PieChart className="piechart">
            <Pie
              cx="40%"
              cy="40%"
              data={languages}
              startAngle={0}
              endAngle={360}
              innerRadius="50%"
              outerRadius="80%"
              stroke="#ffffff"
              strokeWidth={1}
              dataKey="value"
            >
              {languages.map((entry, index) => {
                uniqueKey += 1
                return (
                  <Cell
                    key={uniqueKey}
                    name={entry.name}
                    fill={colors[index % colors.length]}
                  />
                )
              })}
            </Pie>

            <Legend
              iconType="square"
              layout="vertical"
              verticalAlign="middle"
              align="right"
              content={<CustomLegend />}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#3B82F6" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        className="home-img"
        src="https://res.cloudinary.com/dkk6a7svu/image/upload/v1713380049/ik5oau3ijw25xzrqttuo.png"
        alt="failure view"
      />
      <h1 className="home-h1 failure-para">
        Something went wrong. Please try again
      </h1>
      <button
        className="retry-btn"
        type="button"
        onClick={this.getRepositoryDetails}
      >
        Try again
      </button>
    </div>
  )

  render() {
    const {apiStatus} = this.state

    const getActiveView = () => {
      switch (apiStatus) {
        case apiStatusConstants.loading:
          return this.renderLoadingView()
        case apiStatusConstants.success:
          return this.renderSuccessView()
        case apiStatusConstants.failure:
          return this.renderFailureView()
        default:
          return null
      }
    }

    const repoClassName =
      apiStatus !== apiStatusConstants.success ? 'repo-except' : ''

    return (
      <CommonContext.Consumer>
        {value => {
          const {isHamburgerActive} = value

          return (
            <div className="repos-details-bg-cont">
              {apiStatus !== apiStatusConstants.loading && (
                <div className="repos-details-header">
                  <Header />
                </div>
              )}

              {isHamburgerActive === false && (
                <div className={`repos-details-cont ${repoClassName}`}>
                  {getActiveView()}
                </div>
              )}
            </div>
          )
        }}
      </CommonContext.Consumer>
    )
  }
}

export default RepositoryItemDetails
