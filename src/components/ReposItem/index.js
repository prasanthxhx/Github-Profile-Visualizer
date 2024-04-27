import {Link} from 'react-router-dom'
import {FaStar, FaRegStar} from 'react-icons/fa'
import {RiGitBranchLine} from 'react-icons/ri'
import './index.css'

const langColors = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5']

const getColorClassName = () => {
  const randNum = Math.floor(Math.random() * 5)
  return langColors[randNum]
}

const ReposItem = props => {
  const {reposDetails} = props
  const {
    id,
    name,
    description,
    languages,
    stargazersCount,
    branches,
  } = reposDetails

  const branchesCount = branches.length
  return (
    <Link to={`/repositories/${name}`} className="route-link repos-item-link">
      <li className="repos-item-cont">
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
      </li>
    </Link>
  )
}

export default ReposItem
