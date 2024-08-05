// FullControl.js
import { Component } from 'react'
import ReactHowler from 'react-howler'
import Knob from '../Knob/Knob'
import Playlist from './Playlist' // Import the Playlist component

import { IoVolumeMute, IoVolumeMedium, IoRepeat } from 'react-icons/io5'
import {
  CgPlayForwards,
  CgPlayBackwards,
  CgPlayPause,
  CgPlayStop,
  CgPlayButton,
} from 'react-icons/cg'
import * as Utils from './playerUtils' // Import all utility functions
import { playlist1, playlist2 } from './tracklist'

class FullControl extends Component {
  constructor(props) {
    super(props)

    this.state = {
      playing: false,
      loaded: false,
      loop: false,
      mute: false,
      volume: 0.5, // Initialize with a volume of 0.5
      seek: 0.0,
      rate: 1,
      isSeeking: false,
      currentTrackIndex: 0, // Index of the current track in the playlist
      playlist: playlist1,
      playlist2, // Initialize with playlist1
      sortCriteria: 'tempo', // Default sort criteria
      activePlaylist: 'playlist1',
      showPlaylist: false, // State variable to manage playlist visibility
    }

    this.handleToggle = () => Utils.handleToggle(this)
    this.handleNextTrack = () => Utils.handleNextTrack(this)
    this.handlePreviousTrack = () => Utils.handlePreviousTrack(this)
    this.handleOnLoad = () => Utils.handleOnLoad(this)
    this.handleOnPlay = () => Utils.handleOnPlay(this)
    this.handleOnEnd = () => Utils.handleOnEnd(this)
    this.handleStop = () => Utils.handleStop(this)
    this.handleLoopToggle = () => Utils.handleLoopToggle(this)
    this.handleMuteToggle = () => Utils.handleMuteToggle(this)
    this.handleMouseDownSeek = () => Utils.handleMouseDownSeek(this)
    this.handleMouseUpSeek = (e) => Utils.handleMouseUpSeek(this, e)
    this.handleSeekingChange = (e) => Utils.handleSeekingChange(this, e)
    this.handleRate = (e) => Utils.handleRate(this, e)
    this.handleSelectTrack = (index) => Utils.handleSelectTrack(this, index)
    this.handleSortChange = (e) => Utils.handleSortChange(this, e)
    this.handleVolumeChange = (value) => Utils.handleVolumeChange(this, value)
    this.handlePlaylistChange = (e) => Utils.handlePlaylistChange(this, e)
    this.renderSeekPos = () => Utils.renderSeekPos(this)
    this.clearRAF = () => Utils.clearRAF(this)

    this.togglePlaylistVisibility = this.togglePlaylistVisibility.bind(this)
  }

  componentWillUnmount() {
    this.clearRAF()
  }

  togglePlaylistVisibility() {
    this.setState((prevState) => ({
      showPlaylist: !prevState.showPlaylist,
    }))
  }

  render() {
    const currentTrack = this.state.playlist[this.state.currentTrackIndex]

    return (
      <div className="wrapper">
        <div className="line">&nbsp;</div>

        <div className="full-control">
          <ReactHowler
            src={[currentTrack.src]}
            playing={this.state.playing}
            onLoad={this.handleOnLoad}
            onPlay={this.handleOnPlay}
            onEnd={this.handleOnEnd}
            loop={this.state.loop}
            mute={this.state.mute}
            volume={this.state.volume}
            ref={(ref) => (this.player = ref)}
          />

          <div className="player">
            
            <div className="playlist-container">
              {this.state.showPlaylist && (
                <div className="playlist-wrapper">
                  <Playlist
                    playlist={this.state.playlist}
                    onSelectTrack={this.handleSelectTrack}
                  />
                </div>
              )}
              <div className="display" onClick={this.togglePlaylistVisibility}>
                <p className="status">
                  {this.state.loaded ? '' : 'Loading'}
                </p>
                {this.state.loaded && (
                  <div className="track-info">
                    <p>
                      <strong>{currentTrack.artist} : &nbsp;</strong>
                    </p>
                    <p className="artist">{currentTrack.title}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="toggles">
              <button onClick={this.handleLoopToggle}>
                {this.state.loop ? <IoRepeat color="#1F80F1"/> : <IoRepeat />}
              </button>
              <button onClick={this.handleMuteToggle}>
                {this.state.mute ? <IoVolumeMute /> : <IoVolumeMedium />}
              </button>
            </div>

            <div className="seek">
              {/* <div className="status">{this.state.seek.toFixed(2)}</div> */}
              <div className="seek-container">
                <input
                  className="slider"
                  type="range"
                  min="0"
                  max={this.state.duration ? this.state.duration.toFixed(2) : 0}
                  step=".01"
                  value={this.state.seek}
                  onChange={this.handleSeekingChange}
                  onMouseDown={this.handleMouseDownSeek}
                  onMouseUp={this.handleMouseUpSeek}
                />
              </div>
            </div>

            {/* <div className="filter-section">
              <div className="sorting">
                <label>
                  <select
                    value={this.state.sortCriteria}
                    onChange={this.handleSortChange}
                  >
                    <option value="tempo">Tempo</option>
                    <option value="key">Key</option>
                    <option value="scale">Scale</option>
                  </select>
                </label>
              </div>
              <div className="sorting">
                <label>
                  <select
                    value={this.state.activePlaylist}
                    onChange={this.handlePlaylistChange}
                  >
                    <option value="playlist1">Jazhy Gen</option>
                    <option value="playlist2">23 Here</option>
                  </select>
                </label>
              </div>
            </div> */}


            {/* <div className="rate">
              <h3>Tempo</h3>
              <div className="rate-container">
                <input
                  className="slider"
                  type="range"
                  min="0.6"
                  max="1.4"
                  step="0.2"
                  value={this.state.rate}
                  onChange={this.handleRate}
                />
                <div className="vrange">
                  <p>&nbsp;</p>
                  <p> | </p>
                  <p> | </p>
                  <p> | </p>
                  <p>&nbsp;</p>
                </div>
              </div>
            </div> */}

            <div className="controls">
              <button onClick={this.handleToggle}>{this.state.playing ? <CgPlayPause /> : <CgPlayButton />}</button>
              <button onClick={this.handleStop}> <CgPlayStop /></button>
              <button onClick={this.handlePreviousTrack}> <CgPlayBackwards /></button>
              <button onClick={this.handleNextTrack}> <CgPlayForwards /></button>
            </div>

            <div className="volume">
              <Knob
                onChange={this.handleVolumeChange}
                startAngle={125}
                maxAngle={285}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default FullControl
