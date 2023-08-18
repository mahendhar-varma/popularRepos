import './index.css'

const LanguageFilterItem = props => {
  const {tab, isActive, onchangeTabID} = props
  const {id, language} = tab

  const activeClassName = isActive ? 'active-tab' : null

  const changeTab = () => {
    onchangeTabID(id)
  }

  return (
    <li className="tab-item">
      <button className="button" type="button" onClick={changeTab}>
        <p className={`${activeClassName} tab`}>{language}</p>
      </button>
    </li>
  )
}

export default LanguageFilterItem
