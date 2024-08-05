/* eslint-disable react/prop-types */

import { useState, useEffect, useRef } from 'react'
import { handleMouseDown, handleMouseMove, handleMouseUp } from './utils'
import './styles.scss'
import backgroundImage from '../../../public/images/knob-bg.svg' // Adjust the path accordingly

const Knob = ({ onChange, maxAngle, startAngle }) => {
  const [angle, setAngle] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 })
  const [initialMouseY, setInitialMouseY] = useState(0)
  const [initialAngle, setInitialAngle] = useState(0)

  const canvasRef = useRef(null)
  const centerRef = useRef({ x: 0, y: 0 })
  const indicatorRef = useRef({ x: 0, y: 0 })

  const canvasSize = 40 // Reduced size
  const radius = 15 // Half of the canvas size for outer circle
  const indicatorRadius = 8.5 // Adjusted proportionally

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const img = new Image()
    img.src = backgroundImage

    img.onload = () => {
      const width = canvas.width
      const height = canvas.height
      const centerX = width / 2
      const centerY = height / 2
      const indicatorColor = '#4791FF'
      const arcColor = '#4791FF'
      const arcStartAngle = startAngle
      const arcEndAngle = Math.min(angle + startAngle, startAngle + maxAngle)

      centerRef.current = { x: centerX, y: centerY }
      indicatorRef.current = {
        x:
          centerX +
          indicatorRadius * Math.cos(((angle + startAngle) * Math.PI) / 180),
        y:
          centerY +
          indicatorRadius * Math.sin(((angle + startAngle) * Math.PI) / 180),
      }

      ctx.clearRect(0, 0, width, height)

      // Draw the background image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const endAngleRad = (arcEndAngle * Math.PI) / 180
      const startAngleRad = (arcStartAngle * Math.PI) / 180

      // Draw the knob's outer circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngleRad, 0.85) // Adjusted outer circle
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 2 // Adjusted line width
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngleRad, endAngleRad)
      ctx.strokeStyle = arcColor
      ctx.lineWidth = 2 // Adjusted line width
      ctx.stroke()

      const angleRad = ((angle + startAngle) * Math.PI) / 180
      const endX = centerX + indicatorRadius * Math.cos(angleRad)
      const endY = centerY + indicatorRadius * Math.sin(angleRad)

      ctx.beginPath()
      ctx.arc(endX, endY, 1.75, 0, 2 * Math.PI) // Adjusted indicator size
      ctx.fillStyle = indicatorColor
      ctx.fill()
    }

    if (onChange) {
      onChange(angle)
    }
  }, [angle, startAngle, maxAngle, onChange])

  const handleContextMenu = (e) => {
    e.preventDefault()
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    })
  }

  const handleReset = () => {
    setAngle(150)
    setContextMenu({ ...contextMenu, visible: false })
  }

  const handleClick = (e) => {
    if (contextMenu.visible && !e.target.closest('.context-menu')) {
      setContextMenu({ ...contextMenu, visible: false })
    }
  }

  useEffect(() => {
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  })

  return (
    <div className="knob">
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        onMouseDown={(e) =>
          handleMouseDown(
            e,
            setIsDragging,
            setInitialMouseY,
            setInitialAngle,
            angle,
          )
        }
        onMouseMove={(e) =>
          handleMouseMove(
            e,
            isDragging,
            setAngle,
            initialMouseY,
            initialAngle,
            maxAngle,
          )
        }
        onMouseUp={() => handleMouseUp(setIsDragging)}
        onMouseLeave={() => setIsDragging(false)}
        onContextMenu={handleContextMenu}
      />
      {/* <span>Volume: {Math.round(angle / 2.85)}%</span> */}
      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{
            left: contextMenu.x - 50,
            top: contextMenu.y - 460,
          }}
        >
          <button onClick={handleReset}>Reset</button>
        </div>
      )}
    </div>
  )
}

export default Knob
