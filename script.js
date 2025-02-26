document.addEventListener('DOMContentLoaded', () => {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setAnimationLoop(drawFrame)
  document.body.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const aspect = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(30, aspect)
  camera.position.set(30, 15, 30)
  camera.lookAt(scene.position)

  generateLabyrinth()

  const block = new THREE.BoxGeometry(1, 0.2, 1)
  const labyrinth = new THREE.Group()
  const material = new THREE.MeshPhongMaterial({ color: '#ff4500', shininess: 10 })

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


