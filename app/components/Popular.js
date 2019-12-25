import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { fetchPopRepos } from '../utils/api'
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle } from 'react-icons/fa'
import Card from './Card'
import Loading from './Loading'
import Tooltip from './Tooltip'

function LanguagesNav ({ selected, onUpdateLanguage }) {
  const languages = ['All', 'JavaScript', 'CSS', 'TypeScript', 'Dart', 'Swift', 'Ruby', 'Java', 'Kotlin', 'Python', 'Go', 'C', 'Rust', 'PHP', 'Liquid', 'Apex', 'BrightScript', 'Haskell', 'Reason']
  return (
    <ul className="flex-center">
      {languages.map(language => (
        <li key={language}>
          <button
            className="btn-clear nav-link font-effect-anaglyph"
            style={language === selected ? { color: '#FF0000' } : null}
            onClick={() => onUpdateLanguage(language)}
          >
            {language}
          </button>
        </li>
      ))}
    </ul>
  )
}

LanguagesNav.propTypes = {
  selected: PropTypes.string.isRequired,
  onUpdateLanguage: PropTypes.func.isRequired
}

function RepoGrid ({ repos }) {
  return (
    <ul className='grid space-around'>
      {repos.map((repo, index) => {
        const { name, owner, html_url, stargazers_count, forks, open_issues } = repo
        const { login, avatar_url } = owner
        return (
          <li key={html_url}>
            <Card
              header={`#${index + 1}`}
              avatar={avatar_url}
              href={html_url}
              name={login}
            >
              <ul className="card-list">
                <li>
                  <Tooltip text="GitHub Username">
                    <FaUser color="#7FFFD4" size={22} />
                    <a href={`https://github.com/${login}`}>{login}</a>
                  </Tooltip>
                </li>
                <li>
                  <FaStar color="#F0E68C" size={22} />
                  {stargazers_count.toLocaleString()} stars
                </li>
                <li>
                  <FaCodeBranch color="#FF69B4" size={22} />
                  {forks.toLocaleString()} forks
                </li>
                <li>
                  <FaExclamationTriangle color="#00BFFF" size={22} />
                  {open_issues.toLocaleString()} open issues
                </li>
              </ul>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
}

function popularReducer (state, action) {
  if (action.type === 'success') {
    return {
      ...state,
      [action.selectedLanguage]: action.repos,
      error: null
    }
  } else if (action.type === 'error') {
      return {
        ...state,
        error: action.error.message
      }
  } else {
    throw new Error(`That action type isn't supported.`)
  }
}

export default function Popular () {
  const [selectedLanguage, setSelectedLanguage] = React.useState('All')
  const [state, dispatch] = React.useReducer(
    popularReducer,
    { error: null }
  )

  const fetchedLanguages = React.useRef([])

  React.useEffect(() => {
    if (fetchedLanguages.current.includes(selectedLanguage) === false) {
      fetchedLanguages.current.push(selectedLanguage)

      fetchPopRepos(selectedLanguage)
        .then((repos) => dispatch({ type: 'success', selectedLanguage, repos }))
        .catch((error) => dispatch({ type: 'error', error }))
    }
  }, [fetchedLanguages, selectedLanguage])

  const isLoading = () => !state[selectedLanguage] && state.error === null

  return (
    <React.Fragment>
      <LanguagesNav
        selected={selectedLanguage}
        onUpdateLanguage={setSelectedLanguage}
      />
      {isLoading() && <Loading text="Fetching Dem Po's" />}
      {state.error && <p className="center-text error">{state.error}</p>}
      {state[selectedLanguage] && <RepoGrid repos={state[selectedLanguage]} />}
    </React.Fragment>
  )
}