import { Component } from 'react';
import ReactHowler from 'react-howler';
import raf from 'raf'; // requestAnimationFrame polyfill
import { playlist1, playlist2 } from './tracklist'; // Adjust the path as necessary
// import Playlist from './Playlist';
import Knob from '../Knob/Knob';

import { IoVolumeMute, IoVolumeMedium, IoRepeat  } from "react-icons/io5";
import {
  CgPlayForwards,
  CgPlayBackwards,
  CgPlayPause,
  CgPlayStop,
  CgPlayButton,
} from 'react-icons/cg';

class FullControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      loaded: false,
      loop: false,
      mute: false,
      volume: 1.0, // Initialize with a volume of 1.0 (max)
      seek: 0.0,
      rate: 1,
      isSeeking: false,
      currentTrackIndex: 0, // Index of the current track in the playlist
      playlist: playlist1,
      sortCriteria: 'tempo', // Default sort criteria
      activePlaylist: 'playlist1',
    };

    this.handleToggle = this.handleToggle.bind(this);
    this.handleOnLoad = this.handleOnLoad.bind(this);
    this.handleOnEnd = this.handleOnEnd.bind(this);
    this.handleOnPlay = this.handleOnPlay.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.renderSeekPos = this.renderSeekPos.bind(this);
    this.handleLoopToggle = this.handleLoopToggle.bind(this);
    this.handleMuteToggle = this.handleMuteToggle.bind(this);
    this.handleMouseDownSeek = this.handleMouseDownSeek.bind(this);
    this.handleMouseUpSeek = this.handleMouseUpSeek.bind(this);
    this.handleSeekingChange = this.handleSeekingChange.bind(this);
    this.handleRate = this.handleRate.bind(this);
    this.handleSelectTrack = this.handleSelectTrack.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handlePlaylistChange = this.handlePlaylistChange.bind(this);
  }

  componentWillUnmount() {
    this.clearRAF();
  }

  handleToggle() {
    this.setState((prevState) => ({
      playing: !prevState.playing,
    }));
  }

  handleNextTrack() {
    this.setState((prevState) => {
      const nextIndex =
        (prevState.currentTrackIndex + 1) % prevState.playlist.length;
      return { currentTrackIndex: nextIndex, loaded: false };
    });
  }

  handlePreviousTrack() {
    this.setState((prevState) => {
      const prevIndex =
        (prevState.currentTrackIndex - 1 + prevState.playlist.length) %
        prevState.playlist.length;
      return { currentTrackIndex: prevIndex, loaded: false };
    });
  }

  handleOnLoad() {
    const currentTrack = this.state.playlist[this.state.currentTrackIndex];
    this.setState({
      loaded: true,
      duration: this.player.duration(),
      trackName: currentTrack.title,
      artist: currentTrack.artist,
    });
  }

  handleOnPlay() {
    this.setState({
      playing: true,
    });
    this.renderSeekPos();
  }

  handleOnEnd() {
    this.setState({
      playing: false,
    });
    this.clearRAF();
  }

  handleStop() {
    this.player.stop();
    this.setState({
      playing: false, // Need to update our local state so we don't immediately invoke autoplay
    });
    this.renderSeekPos();
  }

  handleLoopToggle() {
    this.setState((prevState) => ({
      loop: !prevState.loop,
    }));
  }

  handleMuteToggle() {
    this.setState((prevState) => ({
      mute: !prevState.mute,
    }));
  }

  handleMouseDownSeek() {
    this.setState({
      isSeeking: true,
    });
  }

  handleMouseUpSeek(e) {
    this.setState({
      isSeeking: false,
    });

    this.player.seek(e.target.value);
  }

  handleSeekingChange(e) {
    this.setState({
      seek: parseFloat(e.target.value),
    });
  }

  handleRate(e) {
    const rate = parseFloat(e.target.value);
    this.player.rate(rate);
    this.setState({ rate });
  }

  handleSelectTrack(index) {
    this.setState({
      currentTrackIndex: index,
      loaded: false,
      playing: true,
    });
  }

  handleSortChange(e) {
    const sortCriteria = e.target.value;
    this.setState((prevState) => {
      const sortedPlaylist = [...prevState.playlist].sort((a, b) => {
        if (a[sortCriteria] < b[sortCriteria]) return -1;
        if (a[sortCriteria] > b[sortCriteria]) return 1;
        return 0;
      });
      return { playlist: sortedPlaylist, sortCriteria };
    });
  }

  handleVolumeChange(value) {
    const normalizedValue = Math.min(1, Math.max(0, value / 100));
    this.setState({ volume: normalizedValue });
  }

  handlePlaylistChange(e) {
    const selectedPlaylist = e.target.value === 'playlist1' ? playlist1 : playlist2;
    this.setState({
      playlist: selectedPlaylist,
      currentTrackIndex: 0,
      loaded: false,
      playing: false,
      activePlaylist: e.target.value,
    });
  }

  renderSeekPos() {
    if (!this.state.isSeeking) {
      this.setState({
        seek: this.player.seek(),
      });
    }
    if (this.state.playing) {
      this._raf = raf(this.renderSeekPos);
    }
  }

  clearRAF() {
    raf.cancel(this._raf);
  }

  render() {
    const currentTrack = this.state.playlist[this.state.currentTrackIndex];

    return (
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

        {/* DISPLAY */}
        <div className="display">
          <div className="progress">{this.state.seek.toFixed(2)}</div>

          <div className="text-display">
            <p className="status">
              {this.state.loaded ? 'NOW PLAYING' : 'Loading'}
            </p>
            {this.state.loaded && (
              <div className="track-info">
                <p>
                  <strong>{this.state.trackName}</strong>
                </p>
                <p className="artist">{this.state.artist}</p>
              </div>
            )}
          </div>
        </div>

        <div className="seek">
          <label>
            Seek:
            <span className="slider-container">
              <input
                type="range"
                min="0"
                max={this.state.duration ? this.state.duration.toFixed(2) : 0}
                step=".01"
                value={this.state.seek}
                onChange={this.handleSeekingChange}
                onMouseDown={this.handleMouseDownSeek}
                onMouseUp={this.handleMouseUpSeek}
              />
            </span>
          </label>
        </div>

        {/* Sorting Controls */}
        <div className="filter-section">
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
        </div>

        <div className='line'>&nbsp;</div>

        <div className="tools">
          <div className="section-I">
            <div className='rate'>
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
            </div>
            <div className="controls">
              <button onClick={this.handleToggle}>
                {this.state.playing ? <CgPlayPause /> : <CgPlayButton />}
              </button>
              <button onClick={this.handleStop}>
                <CgPlayStop />
              </button>
              <button onClick={() => this.handlePreviousTrack()}>
                <CgPlayBackwards />
              </button>
              <button onClick={() => this.handleNextTrack()}>
                <CgPlayForwards />
              </button>
            </div>
          </div>
          <div className="volume">
            <Knob 
            onChange={this.handleVolumeChange}
            startAngle={125}
            maxAngle={285}
            />
          </div>
        </div>

        <div className='line'>&nbsp;</div>

        <div className="toggles">
          <button onClick={this.handleLoopToggle}>
            {this.state.loop ? <IoRepeat /> : <IoRepeat color='#1F80F1' />}
          </button>
          <button onClick={this.handleMuteToggle}>
            {this.state.mute ? <IoVolumeMute  /> : <IoVolumeMedium />}
          </button>
        </div>

        {/* <Playlist 
          playlist={this.state.playlist}
          onSelectTrack={this.handleSelectTrack}
        /> */}
      </div>
    );
  }
}

export default FullControl;
