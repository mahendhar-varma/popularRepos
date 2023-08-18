import {Component} from 'react'
import Loader from 'react-loader-spinner'
import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'

import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class GithubPopularRepos extends Component {
  state = {
    activeTabId: languageFiltersData[0].id,
    languagesList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getRepositories()
  }

  getRepositories = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const {activeTabId} = this.state
    console.log(activeTabId)
    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activeTabId}`

    const response = await fetch(apiUrl)

    if (response.ok === true) {
      const data = await response.json()

      const updatedData = data.popular_repos.map(item => ({
        id: item.id,
        name: item.name,
        issuesCount: item.issues_count,
        forksCount: item.forks_count,
        starsCount: item.stars_count,
        avatarUrl: item.avatar_url,
      }))
      this.setState({
        languagesList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status !== 200) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onchangeTabID = id => {
    this.setState({activeTabId: id}, this.getRepositories)
  }

  renderSuccessUi = () => {
    const {languagesList} = this.state
    return (
      <ul className="languages-container">
        {languagesList.map(eachLanguage => (
          <RepositoryItem key={eachLanguage.id} repoDetails={eachLanguage} />
        ))}
      </ul>
    )
  }

  renderFailureUi = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="failure-text">Something Went Wrong</p>
    </div>
  )

  renderLoadingUi = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  render() {
    const {apiStatus, activeTabId} = this.state
    let requiredUi
    switch (apiStatus) {
      case apiStatusConstants.success:
        requiredUi = this.renderSuccessUi()
        break
      case apiStatusConstants.failure:
        requiredUi = this.renderFailureUi()
        break
      case apiStatusConstants.loading:
        requiredUi = this.renderLoadingUi()
        break
      default:
        requiredUi = null
        break
    }

    return (
      <div className="container">
        <h1 className="title">Popular</h1>
        <ul className="tab-container">
          {languageFiltersData.map(eachTab => (
            <LanguageFilterItem
              key={eachTab.id}
              tab={eachTab}
              isActive={activeTabId === eachTab.id}
              onchangeTabID={this.onchangeTabID}
            />
          ))}
        </ul>
        {requiredUi}
      </div>
    )
  }
}

export default GithubPopularRepos
