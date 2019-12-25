import React, { Component, Fragment } from 'react'
import { battle } from '../utils/api'
import { GiMadScientist, GiCompass, GiThorHammer, GiShadowFollower } from "react-icons/gi"
import { FaUsers } from "react-icons/fa"
import Card from './Card'
import PropTypes from 'prop-types'
import Loading from './Loading'
import Tooltip from './Tooltip'
import queryString from 'query-string'
import { Link } from 'react-router-dom'

function ProfileList ({ profile }) {
  return (
    <ul className="card-list">
      <li>
        <GiMadScientist color="#8A2BE2" size={22} />
        {profile.name}
      </li>
      {profile.location && (
        <li>
          <Tooltip text="User's Location">
            <GiCompass color="#00BFFF" size={22} />
            {profile.location}
          </Tooltip>
        </li>
      )}
      {profile.company && (
        <li>
          <Tooltip text="User's Company">
            <GiThorHammer color="#40E0D0" size={22} />
            {profile.company}
          </Tooltip>
        </li>
      )}
      <li>
        <FaUsers color="#FF00FF" size={22} />
        {profile.followers.toLocaleString()} followers
      </li>
      <li>
        <GiShadowFollower color="#00FF00" size={22} />
        {profile.following.toLocaleString()} following
      </li>
    </ul>
  );
}


ProfileList.propTypes = {
  profile: PropTypes.object.isRequired
}

function battleReducer (state, action) {
  if (action.type === 'success') {
    return {
      winner: action.winner,
      loser: action.loser,
      error: null,
      loading: false
    }
  } else if (action.type === 'error') {
    return {
      ...state,
      error: action.message,
      loading: false
    }
  } else {
    throw new Error(`That action type isn't supported.`)
  }
}

export default function Results ({ location }) {
  const { playerOne, playerTwo } = queryString.parse(location.search)
  const [state, dispatch] = React.useReducer(
    battleReducer,
    { winner: null, loser: null, error: null, loading: true }
  )

  React.useEffect(() => {
    battle([ playerOne, playerTwo ])
      .then((players) => dispatch({ type: 'success', winner: players[0], loser: players[1] }))
      .catch(({ message }) => dispatch({ type: 'error', message }))
  }, [playerOne, playerTwo])

  const { winner, loser, error, loading } = state

  if (loading === true) {
    return <Loading text='In the midst of Battling!' />
  }

  if (error) {
    return (
      <p className="center-text error">{error}</p>
    )
  }

  return (
    <Fragment>
      <div className="grid space-around container-sm">
        <Card
          header={winner.score === loser.score ? "Draw" : "Hero"}
          subheader={`Score: ${winner.score.toLocaleString()}`}
          avatar={winner.profile.avatar_url}
          href={winner.profile.html_url}
          name={winner.profile.login}
        >
          <ProfileList profile={winner.profile} />
        </Card>
        <Card
          header={winner.score === loser.score ? "Draw" : "Zero"}
          subheader={`Score: ${loser.score.toLocaleString()}`}
          avatar={loser.profile.avatar_url}
          name={loser.profile.login}
          href={loser.profile.html_url}
        >
          <ProfileList profile={loser.profile} />
        </Card>
      </div>
      <Link
        to="/battle"
        className="btn dark-btn btn-space"
      >
        Reset
        </Link>
    </Fragment>
  )
}