import { useState, useEffect, useRef } from 'react'

const PRESETS = [
  { label: 'Beginner', rows: 9, cols: 9, mines: 10 },
  { label: 'Intermediate', rows: 16, cols: 16, mines: 40 },
  { label: 'Expert', rows: 16, cols: 30, mines: 99 },
]

function createBoard(rows, cols, mines, firstClick) {
  const cells = Array(rows * cols).fill(null).map((_, i) => ({
    index: i, isMine: false, revealed: false, flagged: false, adjacentMines: 0,
  }))
  const safe = new Set()
  safe.add(firstClick)
  getNeighbors(firstClick, rows, cols).forEach(n => safe.add(n))
  let placed = 0
  while (placed < mines) {
    const i = Math.floor(Math.random() * rows * cols)
    if (!cells[i].isMine && !safe.has(i)) { cells[i].isMine = true; placed++ }
  }
  for (let i = 0; i < rows * cols; i++) {
    if (cells[i].isMine) continue
    cells[i].adjacentMines = getNeighbors(i, rows, cols).filter(n => cells[n].isMine).length
  }
  return cells
}

function getNeighbors(index, rows, cols) {
  const row = Math.floor(index / cols), col = index % cols
  const neighbors = []
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const r = row + dr, c = col + dc
      if (r >= 0 && r < rows && c >= 0 && c < cols) neighbors.push(r * cols + c)
    }
  return neighbors
}

function floodReveal(board, index, rows, cols) {
  const b = board.map(c => ({ ...c }))
  const stack = [index]
  while (stack.length) {
    const i = stack.pop()
    if (b[i].revealed || b[i].flagged) continue
    b[i].revealed = true
    if (b[i].adjacentMines === 0 && !b[i].isMine)
      getNeighbors(i, rows, cols).forEach(n => { if (!b[n].revealed) stack.push(n) })
  }
  return b
}

function PixelFace({ state }) {
  const pixel = (x, y, color) => <rect key={`${x}-${y}-${color}`} x={x * 4} y={y * 4} width={4} height={4} fill={color} />
  const c = '#f5c542', dark = '#222', red = '#e24b4a'
  const face = []
  for (let x = 0; x <= 7; x++)
    for (let y = 0; y <= 7; y++)
      face.push(pixel(x, y, c))
  const border = [[0,2],[0,3],[0,4],[0,5],[1,1],[1,6],[2,0],[2,7],[3,0],[3,7],[4,0],[4,7],[5,0],[5,7],[6,1],[6,6],[7,2],[7,3],[7,4],[7,5]]
  border.forEach(([x, y]) => face.push(pixel(x, y, 'transparent')))
  if (state === 'lost') {
    face.push(pixel(2,2,red),pixel(3,3,red),pixel(3,2,red),pixel(2,3,red))
    face.push(pixel(5,2,red),pixel(6,3,red),pixel(6,2,red),pixel(5,3,red))
    face.push(pixel(2,6,dark),pixel(3,5,dark),pixel(4,5,dark),pixel(5,5,dark),pixel(6,6,dark))
  } else if (state === 'won') {
    face.push(pixel(2,2,dark),pixel(3,2,dark),pixel(2,3,dark),pixel(3,3,dark))
    face.push(pixel(5,2,dark),pixel(6,2,dark),pixel(5,3,dark),pixel(6,3,dark),pixel(4,2,dark))
    face.push(pixel(2,5,dark),pixel(3,6,dark),pixel(4,6,dark),pixel(5,6,dark),pixel(6,5,dark))
  } else {
    face.push(pixel(2,2,dark),pixel(3,2,dark),pixel(5,2,dark),pixel(6,2,dark))
    face.push(pixel(2,5,dark),pixel(3,6,dark),pixel(4,6,dark),pixel(5,6,dark),pixel(6,5,dark))
  }
  return (
    <svg width={32} height={32} viewBox="0 0 32 32" style={{ imageRendering: 'pixelated', display: 'block' }}>
      {face}
    </svg>
  )
}

const COLORS = ['', '#378ADD', '#639922', '#E24B4A', '#534AB7', '#993C1D', '#0F6E56', '#2C2C2A', '#888780']
const CELL_SIZE = 32

export default function Minesweeper() {
  const [presetIndex, setPresetIndex] = useState(0)
  const [board, setBoard] = useState(null)
  const [gameState, setGameState] = useState('idle')
  const [flagsLeft, setFlagsLeft] = useState(PRESETS[0].mines)
  const [time, setTime] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const preset = PRESETS[presetIndex]
  const boardWidth = CELL_SIZE * preset.cols
  const boardHeight = CELL_SIZE * preset.rows

  useEffect(() => {
    setBoard(null)
    setGameState('idle')
    setFlagsLeft(preset.mines)
    setTime(0)
  }, [presetIndex])

  useEffect(() => {
    let interval
    if (gameState === 'playing')
      interval = setInterval(() => setTime(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [gameState])

  const reset = () => {
    setBoard(null)
    setGameState('idle')
    setFlagsLeft(preset.mines)
    setTime(0)
  }

  const checkWin = (b) => { if (b.every(c => c.isMine || c.revealed)) setGameState('won') }

  const handleClick = (index) => {
    if (gameState === 'lost' || gameState === 'won') return
    if (board && board[index].flagged) return
    let current = board
    if (!current) {
      current = createBoard(preset.rows, preset.cols, preset.mines, index)
      setGameState('playing')
    }
    if (current[index].revealed) return
    if (current[index].isMine) {
      const nb = current.map(c => ({ ...c, revealed: c.isMine ? true : c.revealed }))
      setBoard(nb); setGameState('lost'); return
    }
    const nb = floodReveal(current, index, preset.rows, preset.cols)
    setBoard(nb); checkWin(nb)
  }

  const handleRightClick = (e, index) => {
    e.preventDefault()
    if (!board || gameState === 'lost' || gameState === 'won') return
    if (board[index].revealed) return
    const nb = board.map(c => ({ ...c }))
    const cell = nb[index]
    if (!cell.flagged && flagsLeft === 0) return
    cell.flagged = !cell.flagged
    setBoard(nb)
    setFlagsLeft(f => cell.flagged ? f - 1 : f + 1)
  }

  const handleMiddleClick = (e, index) => {
    e.preventDefault()
    if (!board || gameState === 'lost' || gameState === 'won') return
    const cell = board[index]
    if (!cell.revealed || cell.adjacentMines === 0) return
    const neighbors = getNeighbors(index, preset.rows, preset.cols)
    if (neighbors.filter(n => board[n].flagged).length !== cell.adjacentMines) return
    let nb = board.map(c => ({ ...c }))
    let hitMine = false
    neighbors.forEach(n => {
      if (!nb[n].flagged && !nb[n].revealed) {
        if (nb[n].isMine) { hitMine = true; nb[n].revealed = true }
        else nb = floodReveal(nb, n, preset.rows, preset.cols)
      }
    })
    if (hitMine) {
      nb = nb.map(c => ({ ...c, revealed: c.isMine ? true : c.revealed }))
      setBoard(nb); setGameState('lost')
    } else { setBoard(nb); checkWin(nb) }
  }

  const emptyBoard = Array(preset.rows * preset.cols).fill(null).map((_, i) => ({
    index: i, isMine: false, revealed: false, flagged: false, adjacentMines: 0,
  }))

  return (
    <main style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: PRESETS[2].cols * CELL_SIZE }}>
        <h1 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '0.15rem' }}>Minesweeper</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '1rem' }}>
          Left click to reveal · Right click to flag · Middle click to chord
        </p>

        <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--bg-border)', borderRadius: '8px', padding: '0.875rem 1.25rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {PRESETS.map((p, i) => (
              <button key={p.label} onClick={() => setPresetIndex(i)} style={{
                padding: '0.3rem 0.875rem', fontSize: '13px', borderRadius: '6px', cursor: 'pointer',
                background: presetIndex === i ? 'var(--accent)' : 'transparent',
                border: `0.5px solid ${presetIndex === i ? 'var(--accent)' : 'var(--bg-border)'}`,
                color: presetIndex === i ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', background: 'var(--bg-surface)', border: '0.5px solid var(--bg-border)', borderRadius: '8px', padding: '0.5rem 1.25rem' }}>
          <span style={{ fontSize: '14px', fontWeight: 500, minWidth: '60px' }}>🚩 {flagsLeft}</span>
          <button onClick={reset} style={{ background: 'var(--bg-border)', border: 'none', borderRadius: '6px', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PixelFace state={gameState} />
          </button>
          <span style={{ fontSize: '14px', fontWeight: 500, minWidth: '60px', textAlign: 'right' }}>⏱ {time}s</span>
        </div>
      </div>

      <div style={{ overflowX: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div
          onContextMenu={e => e.preventDefault()}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${preset.cols}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${preset.rows}, ${CELL_SIZE}px)`,
          }}
        >
          {(board || emptyBoard).map((cell, i) => {
            const isHovered = hoveredIndex === i
            const isRevealed = cell.revealed
            const showHover = isHovered && !cell.flagged

            return (
              <div
                key={i}
                onClick={() => handleClick(i)}
                onContextMenu={e => handleRightClick(e, i)}
                onMouseDown={e => { if (e.button === 1) { e.preventDefault(); handleMiddleClick(e, i) } }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: isRevealed ? 'default' : 'pointer',
                  userSelect: 'none',
                  boxSizing: 'border-box',
                  background: isRevealed
                    ? (cell.isMine ? '#E24B4A20' : showHover ? '#1e1e1e' : 'var(--bg-primary)')
                    : showHover ? '#2e2e2e' : 'var(--bg-surface)',
                  outline: `0.5px solid ${isRevealed
                    ? (cell.isMine ? '#E24B4A' : showHover ? '#444' : '#2a2a2a')
                    : showHover ? '#555' : '#333'}`,
                  color: isRevealed && !cell.isMine ? COLORS[cell.adjacentMines] : 'var(--text-primary)',
                  transition: 'background 0.08s',
                }}
              >
                {cell.flagged ? '🚩' : isRevealed ? (cell.isMine ? '💣' : cell.adjacentMines > 0 ? cell.adjacentMines : '') : ''}
              </div>
            )
          })}
        </div>
      </div>

      {gameState === 'lost' && (
        <div style={{ textAlign: 'center', padding: '0.6rem', marginTop: '0.75rem', borderRadius: '8px', width: PRESETS[2].cols * CELL_SIZE, background: '#E24B4A20', border: '0.5px solid #E24B4A', color: '#E24B4A', fontSize: '14px' }}>
          Game over! Click the face to try again.
        </div>
      )}
    </main>
  )
}