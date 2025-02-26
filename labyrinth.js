const labyrinthHeight = 15
const labyrinthWidth = 28

let labyrinthGrid = []
let leftConnections = []
let rightConnections = []
let currentX
let currentY

function plotVerticalStart() {
  labyrinthGrid[currentX][currentY] = true
  labyrinthGrid[currentX][currentY + 1] = true
  currentX++
}

function plotVertical() {
  labyrinthGrid[currentX + 1][currentY] = true
  labyrinthGrid[currentX + 1][currentY + 1] = true
}

function plotHorizontal() {
  labyrinthGrid[currentX][currentY + 1] = true
  labyrinthGrid[currentX + 1][currentY + 1] = true
}

function moveToNextRow() {
  currentX = 0
  currentY += 2
}

function generateLabyrinth() {
  for (let x = 0; x < 2 * labyrinthWidth; x++) {
    labyrinthGrid[x] = []
    for (let y = 0; y < 2 * labyrinthHeight; y++) {
      labyrinthGrid[x][y] = false
    }
  }

  currentX = 0
  currentY = 0
  leftConnections[0] = 1
  let colIndex = labyrinthWidth
  while (colIndex) {
    leftConnections[colIndex] = colIndex
    rightConnections[colIndex] = colIndex
    colIndex--
    if (colIndex) {
      plotHorizontal()
    }
    currentX += 2
  }
  labyrinthGrid[currentX - 2][currentY + 1] = true
  moveToNextRow()
  plotVerticalStart()

  let rowIndex = labyrinthHeight
  while (rowIndex > 1) {
    rowIndex--
    let columnIdx = labyrinthWidth
    while (columnIdx > 1) {
      columnIdx--
      let connection = leftConnections[columnIdx - 1]
      if (columnIdx !== connection && Math.random() > 0.5) {
        rightConnections[connection] = rightConnections[columnIdx]
        leftConnections[rightConnections[columnIdx]] = connection
        rightConnections[columnIdx] = columnIdx - 1
        leftConnections[columnIdx - 1] = columnIdx
      } else {
        plotVertical()
      }

      connection = leftConnections[columnIdx]
      if (columnIdx !== connection && Math.random() > 0.5) {
        rightConnections[connection] = rightConnections[columnIdx]
        leftConnections[rightConnections[columnIdx]] = connection
        leftConnections[columnIdx] = columnIdx
        rightConnections[columnIdx] = columnIdx
        plotHorizontal()
      }

      labyrinthGrid[currentX + 1][currentY + 1] = true
      currentX += 2
    }

    moveToNextRow()
    plotVerticalStart()
  }

  let columnIdx = labyrinthWidth
  while (columnIdx > 1) {
    columnIdx--
    let connection = leftConnections[columnIdx - 1]
    if (columnIdx !== connection && (columnIdx === rightConnections[columnIdx] || Math.random() > 0.5)) {
      rightConnections[connection] = rightConnections[columnIdx]
      leftConnections[rightConnections[columnIdx]] = connection
      rightConnections[columnIdx] = columnIdx - 1
      leftConnections[columnIdx - 1] = columnIdx
    } else {
      plotVertical()
    }

    connection = leftConnections[columnIdx]
    rightConnections[connection] = rightConnections[columnIdx]
    leftConnections[rightConnections[columnIdx]] = connection
    leftConnections[columnIdx] = columnIdx
    rightConnections[columnIdx] = columnIdx
    plotHorizontal()
    currentX += 2
  }
}

function isFree(x, y) {
  return !isWall(x, y)
}

function isWall(x, y) {
  return labyrinthGrid[x] && labyrinthGrid[x][y]
}

