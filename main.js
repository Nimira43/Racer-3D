document.addEventListener("DOMContentLoaded", function () {
  let isTurningLeft = false
  let isTurningRight = false
  let isMovingForward = false
  let playerDirection = 0
  let cosDirection = Math.cos(playerDirection)
  let sinDirection = Math.sin(playerDirection)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setAnimationLoop(drawFrame)
  document.body.appendChild(renderer.domElement)

  document.body.addEventListener('keydown', onKeyDown)
  document.body.addEventListener('keyup', onKeyUp)

  const scene = new THREE.Scene()
  const aspectRatio = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(80, aspectRatio)
  
  const groundPlane = new THREE.Mesh(
    new THREE.BoxGeometry(1000, 0.1, 1000),
    new THREE.MeshPhongMaterial({
      color: '#ff4500',
      shininess: 5
    })
  )

  groundPlane.position.set(0, -0.4, 0)
  scene.add(groundPlane)

  const goalSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshPhongMaterial({
      color: '#ffd700',
      shininess: 100,
      emissive: '#ffa500'
    })
  )

  goalSphere.position.set(2 * labyrinthWidth - 3, 1.5, 2 * labyrinthHeight)
  scene.add(goalSphere)

  generateLabyrinth()

  const blockGeometry = new THREE.BoxGeometry(1, 1, 1)
  const labyrinthGroup = new THREE.Group()
  const labyrinthMaterial = new THREE.MeshPhongMaterial({
    color: '#ff4500',
    shininess: 10
  })

  const borderGroup = new THREE.Group()
  const borderMaterial = new THREE.MeshPhongMaterial({
    color: '#8b0000'
  })

  for (let x = 0; x < 2 * labyrinthWidth + 1; x++) {
    for (let y = 0; y < 2 * labyrinthHeight + 2; y++) {
      if (isWall(x, y)) {
        let wallMesh = new THREE.Mesh(blockGeometry, labyrinthMaterial)
        const wallHeight = 0.4 + 1.2 * Math.random()
        wallMesh.scale.set(1, wallHeight, 1)
        wallMesh.position.set(x, wallHeight / 2 - 0.5, y)
        labyrinthGroup.add(wallMesh)

        if (wallHeight < 0.7) {
          wallMesh = wallMesh.clone()
          wallMesh.scale.set(2, 0.2, 1)
          wallMesh.position.set(x, 0.5, y)
          labyrinthGroup.add(wallMesh)
        }
        const borderMesh = new THREE.Mesh(blockGeometry, borderMaterial)
        borderMesh.scale.set(1.05, 1, 1.05)
        borderMesh.position.set(x, -0.8, y)
        borderGroup.add(borderMesh)
      }
    }
  }
  scene.add(labyrinthGroup, borderGroup);

  let playerX = 1
  let playerZ = 2
  
  const light1 = new THREE.PointLight('#f8d1b0', 0.5)
  light1.position.set(-labyrinthWidth, 10, -labyrinthHeight)
  scene.add(light1)

  const light2 = new THREE.PointLight('#f8d1b0', 0.5)
  light2.position.set(labyrinthWidth, 10, -labyrinthHeight)
  scene.add(light2)

  const light3 = new THREE.PointLight('#f8d1b0', 0.5)
  light3.position.set(labyrinthWidth, 10, labyrinthHeight)
  scene.add(light3)

  const light4 = new THREE.PointLight('#f8d1b0', 0.5)
  light4.position.set(-labyrinthWidth, 10, labyrinthHeight)
  scene.add(light4)

  const spotlight = new THREE.SpotLight('#ffffff', 1.5, 0.9, 1)
  spotlight.target = new THREE.Object3D()
  scene.add(spotlight)
  scene.add(spotlight.target)

  function onKeyDown(event) {
    if (event.code === 'Space' || event.keyCode === 32) {
      jumpTime = time
    }
    if (event.code === 'ArrowLeft' || event.keyCode === 37) {
      isTurningLeft = true
      isTurningRight = false
    }
    if (event.code === 'ArrowRight' || event.keyCode === 39) {
      isTurningLeft = false
      isTurningRight = true
    }
    if (event.code === 'ArrowUp' || event.keyCode === 38) {
        isMovingForward = true
    }
  }

  function onKeyUp(event) {
    if (event.code === 'ArrowLeft' || event.keyCode === 37) {
      isTurningLeft = false
    }
    if (event.code === 'ArrowRight' || event.keyCode === 39) {
      isTurningRight = false
    }
    if (event.code === 'ArrowUp' || event.keyCode === 38) {
      isMovingForward = false
    }
  }

  function canMoveTo(x, y) {
    for (let i = -5; i <= 5; i++) {
      const newX = Math.round(
        x + 0.3 * Math.cos(playerDirection + i / 5)
      )
      const newY = Math.round(
        y + 0.3 * Math.sin(playerDirection + i / 5)
      )

      if (isWall(newX, newY)) return false
      return true
    }
  }

  let time = 0
  let jumpTime = -1000

  function drawFrame() {
    if (isTurningLeft) playerDirection -= 0.01
    if (isTurningRight) playerDirection += 0.01
    cosDirection = Math.cos(playerDirection)
    sinDirection = Math.sin(playerDirection)

    if (isMovingForward) {
      if (canMoveTo(
        playerX + 0.1 * cosDirection, playerZ + 0.1 * sinDirection
      )) {
        playerX += 0.015 * cosDirection
        playerZ += 0.015 * sinDirection
      } else if (canMoveTo(
        playerX - 0.1 * cosDirection, playerZ + 0.05 * sinDirection
      )) {
        playerZ += 0.015 * sinDirection
      } else if (canMoveTo(
        playerX + 0.05 * cosDirection, playerZ - 0.1 * sinDirection
      )) {
        playerX += 0.015 * cosDirection
      }
    }

    time++
    
    spotlight.position.set(playerX, 0, playerZ);
    spotlight.target.position.set(
      playerX + cosDirection,
      -0.1,
      playerZ + sinDirection
    )

    let playerHeight = 0
    
    if (time - jumpTime < 450) {
      playerHeight = 2 + 2 * Math.cos(
        (time - jumpTime) / 450 * 2 * Math.PI - Math.PI
      )
    }
    
    camera.position.set(
      playerX - 0.1 * cosDirection,
      playerHeight,
      playerZ - 0.1 * sinDirection
    )
    
    camera.lookAt(new THREE.Vector3(
      playerX + 10.4 * cosDirection,
      0.95 * playerHeight,
      playerZ + 10.4 * sinDirection
    ))

    renderer.render(scene, camera)
  }
})
