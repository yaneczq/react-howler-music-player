// utils.js

export const handleMouseDown = (
  e,
  setIsDragging,
  setInitialMouseY,
  setInitialAngle,
  angle,
) => {
  setIsDragging(true)
  setInitialMouseY(e.clientY)
  setInitialAngle(angle)
}

export const handleMouseMove = (
  e,
  isDragging,
  setAngle,
  initialMouseY,
  initialAngle,
  maxAngle,
) => {
  if (isDragging) {
    const deltaY = e.clientY - initialMouseY
    const newAngle = Math.max(0, Math.min(maxAngle, initialAngle - deltaY * 16)) // Adjust sensitivity as needed
    setAngle(newAngle)
  }
}

export const handleMouseUp = (setIsDragging) => {
  setIsDragging(false)
}
