import React, { Component, Fragment } from 'react'
import { GiGorilla, GiBattleMech, GiPodiumWinner, GiSkullCrossedBones } from 'react-icons/gi'
import PropTypes from 'prop-types'
import ThemeContext from '../contexts/theme'
import { Link } from 'react-router-dom'

function Instructions () {
  const theme = React.useContext(ThemeContext)
  return (
    <div className="instructions-container">
      <h1 className="center-text header-lg">Instructions</h1>
      <ol className="container-sm grid center-text battle-instructions">
        <li>
          <h3 className="header-sm">2 GitHub Users</h3>
          <GiGorilla className={`bg-${theme}`} color="#40E0D0" size={140} />
        </li>
        <li>
          <h3 className="header-sm">Battle</h3>
          <GiBattleMech className={`bg-${theme}`} color="#00BFFF" size={140} />
        </li>
        <li>
          <h3 className="header-sm">Winner!</h3>
          <GiPodiumWinner
            className={`bg-${theme}`}
            color="#FFD700"
            size={140}
          />
        </li>
      </ol>
    </div>
  );
}

function PlayerInput({ onSubmit, label }) {
  const [username, setUsername] = React.useState('')

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit(username)
  }

  const handleChange = event => setUsername(event.target.value)

  const theme = React.useContext(ThemeContext)

  return (
    <form className="column player" onSubmit={handleSubmit}>
      <label htmlFor="username" className="player-label">
        {label}
      </label>
      <div className="row player-inputs">
        <input
          type="text"
          id="username"
          className={`input-${theme}`}
          placeholder="github username"
          autoComplete="off"
          value={username}
          onChange={handleChange}
        />
        <button
          className={`btn ${theme === 'dark' ? 'light-btn' : 'dark-btn'}`}
          type="submit"
          disabled={!username}
        >
          Submit
          </button>
      </div>
    </form>
  );
}

PlayerInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
}

function PlayerPreview ({ username, onReset, label }) {
  const theme = React.useContext(ThemeContext)
  return (
    <div className="column player">
      <h3 className="player-label">{label}</h3>
      <div className={`row bg-${theme}`}>
        <div className="player-info">
          <img
            className="avatar-small"
            src={`https://github.com/${username}.png?size=200`}
            alt={`Avatar for ${username}`}
          />
          <a href={`https://github.com/${username}`} className="link">
            {username}
          </a>
        </div>
        <button className="btn-clear flex-center" onClick={onReset}>
          <GiSkullCrossedBones color="#FF0000" size={26} />
        </button>
      </div>
    </div>
  );
}

PlayerPreview.propTypes = {
  username: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
}

export default function Battle() {
  const [playerOne, setPlayerOne] = React.useState(null)
  const [playerTwo, setPlayerTwo] = React.useState(null)

  const handleSubmit = (id, player) => id === 'playerOne'
    ? setPlayerOne(player)
    : setPlayerTwo(player)

  const handleReset = (id) => id === 'playerOne'
    ? setPlayerOne(null)
    : setPlayerTwo(null)

  return (
    <Fragment>
      <Instructions />
      <div className="players-container">
        <h1 className="center-text header-lg">Players</h1>
        <div className="row space-around">
          {playerOne === null
            ? <PlayerInput
              label="Player One"
              onSubmit={(player) => handleSubmit('playerOne', player)}
            />
            : <PlayerPreview
              username={playerOne}
              label="Player One"
              onReset={() => handleReset('playerOne')}
            />
          }
          {playerTwo === null
            ? <PlayerInput
              label="Player Two"
              onSubmit={(player) => handleSubmit('playerTwo', player)}
            />
            : <PlayerPreview
              username={playerTwo}
              label="Player Two"
              onReset={() => handleReset('playerTwo')}
            />
          }
        </div>

        {playerOne && playerTwo && (
          <Link
            className="btn dark-btn btn-space"
            to={{
              pathname: "/battle/results",
              search: `?playerOne=${playerOne}&playerTwo=${playerTwo}`
            }}
          >
            Battle
            </Link>
        )}

      </div>
    </Fragment>
  )
}