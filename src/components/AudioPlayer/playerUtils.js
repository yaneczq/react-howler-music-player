// utils.js
import raf from 'raf' // requestAnimationFrame polyfill
import { playlist1, playlist2 } from './tracklist' // Adjust the path as necessary

export const handleToggle = (component) => {
  component.setState((prevState) => ({
    playing: !prevState.playing,
  }))
}

export const handleNextTrack = (component) => {
  component.setState((prevState) => {
    const nextIndex =
      (prevState.currentTrackIndex + 1) % prevState.playlist.length
    return { currentTrackIndex: nextIndex, loaded: false }
  })
}

export const handlePreviousTrack = (component) => {
  component.setState((prevState) => {
    const prevIndex =
      (prevState.currentTrackIndex - 1 + prevState.playlist.length) %
      prevState.playlist.length
    return { currentTrackIndex: prevIndex, loaded: false }
  })
}

export const handleOnLoad = (component) => {
  const currentTrack =
    component.state.playlist[component.state.currentTrackIndex]
  component.setState({
    loaded: true,
    duration: component.player.duration(),
    trackName: currentTrack.title,
    artist: currentTrack.artist,
  })
}

export const handleOnPlay = (component) => {
  component.setState({
    playing: true,
  })
  renderSeekPos(component)
}

export const handleOnEnd = (component) => {
  component.setState({
    playing: false,
  })
  clearRAF(component)
}

export const handleStop = (component) => {
  component.player.stop()
  component.setState({
    playing: false, // Need to update our local state so we don't immediately invoke autoplay
  })
  renderSeekPos(component)
}

export const handleLoopToggle = (component) => {
  component.setState((prevState) => ({
    loop: !prevState.loop,
  }))
}

export const handleMuteToggle = (component) => {
  component.setState((prevState) => ({
    mute: !prevState.mute,
  }))
}

export const handleMouseDownSeek = (component) => {
  component.setState({
    isSeeking: true,
  })
}

export const handleMouseUpSeek = (component, e) => {
  component.setState({
    isSeeking: false,
  })

  component.player.seek(e.target.value)
}

export const handleSeekingChange = (component, e) => {
  component.setState({
    seek: parseFloat(e.target.value),
  })
}

export const handleRate = (component, e) => {
  const rate = parseFloat(e.target.value)
  component.player.rate(rate)
  component.setState({ rate })
}

export const handleSelectTrack = (component, index) => {
  component.setState({
    currentTrackIndex: index,
    loaded: false,
    playing: true,
  })
}

export const handleSortChange = (component, e) => {
  const sortCriteria = e.target.value
  component.setState((prevState) => {
    const sortedPlaylist = [...prevState.playlist].sort((a, b) => {
      if (a[sortCriteria] < b[sortCriteria]) return -1
      if (a[sortCriteria] > b[sortCriteria]) return 1
      return 0
    })
    return { playlist: sortedPlaylist, sortCriteria }
  })
}

export const handleVolumeChange = (component, value) => {
  const normalizedValue = Math.min(1, Math.max(0, value / 100))
  component.setState({ volume: normalizedValue })
}

export const handlePlaylistChange = (component, e) => {
  const selectedPlaylist =
    e.target.value === 'playlist1' ? playlist1 : playlist2
  component.setState({
    playlist: selectedPlaylist,
    currentTrackIndex: 0,
    loaded: false,
    playing: false,
    activePlaylist: e.target.value,
  })
}

export const renderSeekPos = (component) => {
  if (!component.state.isSeeking) {
    component.setState({
      seek: component.player.seek(),
    })
  }
  if (component.state.playing) {
    component._raf = raf(() => renderSeekPos(component))
  }
}

export const clearRAF = (component) => {
  raf.cancel(component._raf)
}
