import { Graphics } from 'pixi.js'
import { extend } from '@pixi/react'

extend({ Graphics })

export function Star() {
  function drawStar(graphics: Graphics) {
    graphics.clear()
    graphics.star(64, 64, 5, 32).stroke({ width: 8, color: 0xff0000 })
  }
  return <pixiGraphics draw={drawStar} />
}
