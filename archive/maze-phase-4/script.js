document.addEventListener('DOMContentLoaded', () => {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setAnimationLoop(drawFrame)
  document.body.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const aspect = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(80, aspect, 0.1, 1000);
  camera.position.set(0, 0.1, 0)

  const plane = new THREE.Mesh(
    new THREE.BoxGeometry(1000, 0.1, 1000),
    new THREE.MeshPhongMaterial({
      color: '#ff4500',
      shininess: 5
    })
  )
  plane.position.set(0, -0.4, 0)
  scene.add(plane)

  const goal = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshPhongMaterial({
      color: '#ffd700',
      shininess: 100,
      emissive: '#ffa500'
    })
  )
  goal.position.set(2 * labyrinthWidth - 3, 1.5, 2 * labyrinthHeight);
  scene.add(goal)

  generateLabyrinth()

  const block = new THREE.BoxGeometry(1, 1, 1)
  const labyrinth = new THREE.Group()
  const labyrinthMaterial = new THREE.MeshPhongMaterial({
    color: '#ff4500',
    shininess: 10
  })

  for (let x = 0; x < 2 * labyrinthWidth + 1; x++) {
    for (let y = 0; y < 2 * labyrinthHeight + 2; y++) {
      if (isWall(x, y)) {
        const wall = new THREE.Mesh(block, labyrinthMaterial)
        let wallHeight = 0.4 + 1.2 * Math.random()
        wall.scale.set(1, wallHeight, 1)
        wall.position.set(x, wallHeight / 2 - 0.5, y)
        labyrinth.add(wall)

        if (wallHeight < 0.7) {
          const hole = new THREE.Mesh(block, labyrinthMaterial)
          hole.scale.set(1, 0.2, 1)
          hole.position.set(x, 0.5, y)
          labyrinth.add(hole)
        }
      }
    }
  }

  scene.add(labyrinth)

  const lights = [
    { x: -labyrinthWidth, y: 10, z: -labyrinthHeight },
    { x: labyrinthWidth, y: 10, z: -labyrinthHeight },
    { x: labyrinthWidth, y: 10, z: labyrinthHeight },
    { x: -labyrinthWidth, y: 10, z: labyrinthHeight }
  ]
  lights.forEach(({ x, y, z }) => {
    const light = new THREE.PointLight('#ff4500', 0.5);
    light.position.set(x, y, z);
    scene.add(light);
  })

  labyrinth.position.set(-labyrinthWidth + 1, 0, -labyrinthHeight - 1)

  let moveForward = false;
  let moveBackward = false;
  let moveLeft = false;
  let moveRight = false;
  let lookUp = false;
  let lookDown = false;
  let jump = false;
  let onGround = true;

  const onKeyDown = (event) => {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = true
        break
      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true
        break
      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true
        break
      case 'ArrowRight':
      case 'KeyD':
        moveRight = true
        break
      case 'Space':
        if (onGround) jump = true
        break
      case 'KeyQ':
        lookUp = true
        break
      case 'KeyE':
        lookDown = true
        break
    }
  }

  const onKeyUp = (event) => {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = false
        break
      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false
        break
      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false
        break
      case 'ArrowRight':
      case 'KeyD':
        moveRight = false
        break
      case 'Space':
        jump = false
        break
      case 'KeyQ':
        lookUp = false
        break
      case 'KeyE':
        lookDown = false
        break
    }
  }

  document.addEventListener('keydown', onKeyDown, false)
  document.addEventListener('keyup', onKeyUp, false)

  const speed = 0.1

  function updateMovement() {
    const nextPosition = new THREE.Vector3()
    camera.getWorldDirection(nextPosition)
    nextPosition.multiplyScalar(speed)
    nextPosition.add(camera.position)

    if (moveForward && !isWall(
      Math.floor(nextPosition.x + 0.5),
      Math.floor(nextPosition.z + 0.5)
    )) {
      camera.translateZ(-speed)
    }

    if (moveBackward && !isWall(
      Math.floor(nextPosition.x - 0.5),
      Math.floor(nextPosition.z - 0.5)
    )) {
      camera.translateZ(speed)
    }

    if (moveLeft && !isWall(
      Math.floor(nextPosition.x - 0.5),
      Math.floor(nextPosition.z - 0.5)
    )) {
      camera.translateX(-speed)
    }

    if (moveRight && !isWall(
      Math.floor(nextPosition.x + 0.5),
      Math.floor(nextPosition.z + 0.5)
    )) {
      camera.translateX(speed)
    }

    if (lookUp) {
      camera.rotation.x -= 0.01
    }

    if (lookDown) {
      camera.rotation.x += 0.01
    }

    if (jump && onGround) {
      camera.position.y += 0.2
      onGround = false
    }

    if (camera.position.y > 0.1) {
      camera.position.y -= 0.02
    } else {
      camera.position.y = 0.1
      onGround = true
    }
  }

  function drawFrame() {
    updateMovement()
    renderer.render(scene, camera)
  }
})
