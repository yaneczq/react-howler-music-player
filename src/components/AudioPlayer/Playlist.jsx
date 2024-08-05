// src/components/AudioPlayer/Playlist.jsx
import PropTypes from 'prop-types'

const Playlist = ({ playlist, onSelectTrack }) => {
  return (
    <div className="playlist">
      {playlist.map((track, index) => (
        <div
          key={track.id}
          className="playlist-item"
          onClick={() => onSelectTrack(index)}
        >
          <p>
            <strong>{track.title}</strong>
          </p>
          <p>{track.artist}</p>
          <p>Tempo: {track.tempo}</p>
          <p>Key: {track.key}</p>
          <p>Scale: {track.scale}</p>
        </div>
      ))}
    </div>
  )
}

Playlist.propTypes = {
  playlist: PropTypes.array.isRequired,
  onSelectTrack: PropTypes.func.isRequired,
}

export default Playlist
