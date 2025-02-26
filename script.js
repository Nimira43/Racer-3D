document.addEventListener('DOMContentLoaded', () => {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setAnimationLoop(drawFrame)
  document.body.appendChild(renderer.domElement)

  // document.body.addEventListener('keydown', onKeyDown)
  // document.body.addEventListener('keyup', onKeyUp)

  const scene = new THREE.Scene()
  const aspect = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(80, aspect)

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
  goal.position.set(
    2 * labyrinthWidth - 3,
    1.5,
    2 * labyrinthHeight
  )
  scene.add(goal)

  generateLabyrinth()

  const block = new THREE.BoxGeometry(1, 1, 1)
  const labyrinth = new THREE.Group()
  const labyrinthMaterial = new THREE.MeshPhongMaterial({ color: '#ff4500', shininess: 10 })

  const border = new THREE.Group()
  const borderMaterial = new THREE.MeshPhongMaterial({
    color: '#8b0000'
  })

  for (let x = 0; x < 2 * labyrinthWidth + 1; x++) {
    for (let y = 0; y < 2 * labyrinthHeight + 2; y++) {
      if (isWall(x, y)) {
        const wall = new THREE.Mesh(block, material)
        wall.position.set(x, 0, y)
        labyrinth.add(wall)
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
    const light = new THREE.PointLight('#ff4500', 0.5)
    light.position.set(x, y, z)
    scene.add(light)
  })

  labyrinth.position.set(-labyrinthWidth + 1, 0, -labyrinthHeight - 1)

  function drawFrame() {
    scene.rotation.y += 0.002
    renderer.render(scene, camera)
  }
})


