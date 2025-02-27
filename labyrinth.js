const labyrinthHeight = 15
const labyrinthWidth = 28
const labyrinth = []
const left = []
const right = []

let currentX
let currentY

function plotVerticalStart() {
  labyrinth[currentX][currentY] = true
  labyrinth[currentX][currentY + 1] = true
  currentX++
}

function plotVertical() {
  labyrinth[currentX + 1][currentY] = true
  labyrinth[currentX + 1][currentY + 1] = true
}

function plotHorizontal() {
  labyrinth[currentX][currentY + 1] = true
  labyrinth[currentX + 1][currentY + 1] = true
}

function plotNewRow() {
  currentX = 0
  currentY += 2
}

function generateLabyrinth() {
  for (let x = 0; x < 2 * labyrinthWidth; x++) {
    labyrinth[x] = []
    for (let y = 0; y < 2 * labyrinthHeight; y++) {
      labyrinth[x][y] = false
    }
  }

  currentX = 0
  currentY = 0
  left[0] = 1
  let remainingWidth = labyrinthWidth

  while (remainingWidth) {
    left[remainingWidth] = remainingWidth
    right[remainingWidth] = remainingWidth
    remainingWidth--
    if (remainingWidth) {
        plotHorizontal()
    }
    currentX += 2
  }

  labyrinth[currentX - 2][currentY + 1] = true
  plotNewRow()
  plotVerticalStart()

  let remainingHeight = labyrinthHeight
  while (remainingHeight > 1) {
    remainingHeight--
    let columnIndex = labyrinthWidth
    while (columnIndex > 1) {
      columnIndex--
      let endIndex = left[columnIndex - 1]
      if (columnIndex !== endIndex && Math.random() > 0.5) {
        right[endIndex] = right[columnIndex]
        left[right[columnIndex]] = endIndex
        right[columnIndex] = columnIndex - 1
        left[columnIndex - 1] = columnIndex
      } else {
        plotVertical()
      }

      endIndex = left[columnIndex]
      if (columnIndex !== endIndex && Math.random() > 0.5) {
        right[endIndex] = right[columnIndex]
        left[right[columnIndex]] = endIndex
        left[columnIndex] = columnIndex
        right[columnIndex] = columnIndex
        plotHorizontal()
      }

      labyrinth[currentX + 1][currentY + 1] = true
      currentX += 2
    }

    plotNewRow()
    plotVerticalStart()
  }

  let columnIndex = labyrinthWidth
  while (columnIndex > 1) {
    columnIndex--
    let endIndex = left[columnIndex - 1]
    if (columnIndex !== endIndex &&
      (columnIndex === right[columnIndex] || Math.random() > 0.5)
    ) {
      right[endIndex] = right[columnIndex]
      left[right[columnIndex]] = endIndex
      right[columnIndex] = columnIndex - 1
      left[columnIndex - 1] = columnIndex
    } else {
      plotVertical()
    }

    endIndex = left[columnIndex]
    right[endIndex] = right[columnIndex]
    left[right[columnIndex]] = endIndex
    left[columnIndex] = columnIndex
    right[columnIndex] = columnIndex
    plotHorizontal()
    currentX += 2
  }
}

function isFree(x, y) {
  return !isWall(x, y)
}

function isWall(x, y) {
  return labyrinth[x] && labyrinth[x][y]
}
