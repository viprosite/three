<template>
  <div class="box"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'three/examples/jsm/libs/lil-gui.module.min.js'
import gsap from 'gsap'
// console.log(dat);
export default {
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      control: null,
      cube: null,
      clock: new THREE.Clock(),
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let container = document.querySelector('.box')
      const WIDTH = container.clientWidth
      const HEIGHT = container.clientHeight

      let scene = this.scene = new THREE.Scene()
      let camera = this.camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 100)
      camera.position.set(0, 0, 10)
      scene.add(camera)


      let renderer = this.renderer = new THREE.WebGLRenderer({

      })
      renderer.setSize(WIDTH, HEIGHT)
      renderer.setPixelRatio = window.devicePixelRatio
      container.append(renderer.domElement)

      this.control = new OrbitControls(camera, renderer.domElement)
      this.createCube()
      this.animation()

    },
    createCube() {
      let geometry = new THREE.BoxGeometry(3, 3, 3)
      let material = new THREE.MeshBasicMaterial({
        color: '#ff0'
      })
      let cube = this.cube = new THREE.Mesh(geometry, material)
      this.scene.add(cube)
      // gsap.to(cube.position, { duration: 1, delay: 0, x: 3 })
      // gsap.to(cube.position, { duration: 1, delay: 0, x: 0 })

    },

    animation() {
      // let elapsedTime = this.clock.getElapsedTime() // 流逝的时间
      // console.log(elapsedTime);
      // this.cube.rotation.y = Math.sin(elapsedTime)


      this.renderer.render(this.scene, this.camera)
      this.control.update()
      requestAnimationFrame(this.animation)
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
}
</style>