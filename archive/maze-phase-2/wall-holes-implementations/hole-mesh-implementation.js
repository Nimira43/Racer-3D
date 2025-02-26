for (let x = 0; x < 2 * labyrinthWidth + 1; x++) {
  for (let y = 0; y < 2 * labyrinthHeight + 2; y++) {
    if (isWall(x, y)) {
      const wall = new THREE.Mesh(block, labyrinthMaterial)
      let wallHeight = 0.4 + 1.2 * Math.random()
      wall.scale.set(1, wallHeight, 1)
      wall.position.set(x, wallHeight / 2 - 0.5, y)
      labyrinth.add(wall)

      if (wallHeight < 0.7) {
        const hole = new THREE.Mesh(block, labyrinthMaterial);
        hole.scale.set(1, 0.2, 1);
        hole.position.set(x, 0.5, y);
        labyrinth.add(hole);
      }
    }
  }
}
scene.add(labyrinth)