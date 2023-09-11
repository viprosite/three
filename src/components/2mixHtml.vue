<template>
    <div style="height: 100%;width: 100%;overflow: hidden;">
        <div class="box"></div>
        <div class="loading-bar"></div>
        <div class="point point-0 visible">
            <div class="label">1</div>
            <div class="text">在上一章中，我们使用一些内置的three.js几何图形创建了一个简单的玩具火车模型，很快就清楚地发现，仅使用这些几何图形很难构建任何复杂或现实的东西。要创建漂亮的3D模型，需要复杂的
                建模程序。您可以使用three.js构建任何类型的3D应用程序，但是</div>
        </div>
        <div class="point point-1 visible">
            <div class="label">2</div>
            <div class="text">在上一章中，我们使用一些内置的three.js几何图形创建了一个简单的玩具火车模型，很快就清楚地发现，仅使用这些几何图形很难构建任何复杂或现实的东西。要创建漂亮的3D模型，需要复杂的
                建模程序。您可以使用three.js构建任何类型的3D应用程序，但是</div>
        </div>

    </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'three/examples/jsm/libs/lil-gui.module.min.js'
import gsap from 'gsap'
// console.log(dat);
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default {
    data() {
        return {
            container: null,
            scene: null,
            camera: null,
            renderer: null,
            control: null,
            cube: null,
            clock: new THREE.Clock(),
            points: [],
            raycaster: null
        }
    },
    mounted() {
        this.container = document.querySelector('.box')
        this.points.push({
            position: new THREE.Vector3(2.34, 0, 0),
            // {
            //     "x": 1.9188640383761595,
            //     "y": 0.5076492576017174,
            //     "z": -0.28554487556068414
            // }
            element: document.querySelector('.point-0')
        },
            {
                position: new THREE.Vector3(0, -0.4, 2),
                element: document.querySelector('.point-1')
            })
        this.raycaster = new THREE.Raycaster();

        this.init()
        window.addEventListener('pointermove', onPointerMove);
        let pointer = {}
        let mouse = new THREE.Vector2()
        let raycaster = new THREE.Raycaster()
        let _this = this
        function onPointerMove(event) {
            // console.log(event);
            // calculate pointer position in normalized device coordinates
            // (-1 to +1) for both components
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1
            mouse.y = (event.clientY / window.innerHeight) * 2 - 1
            raycaster.setFromCamera(mouse, _this.camera)
            let intersects = raycaster.intersectObject(_this.scene)
            console.log(intersects);

            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
            // console.log(pointer);
        }
        window.addEventListener('resize', () => {
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
            // this.renderer.setPixelRatio(window.devicePixelRatio);
        })
    },
    methods: {
        init() {
            let container = this.container
            const WIDTH = container.clientWidth
            const HEIGHT = container.clientHeight

            let scene = this.scene = new THREE.Scene()
            let camera = this.camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 100)
            camera.position.set(0, 0, 5)
            scene.add(camera)
            let axesHelper = new THREE.AxesHelper(5)
            // scene.add(axesHelper)


            let renderer = this.renderer = new THREE.WebGLRenderer({

            })
            renderer.setSize(WIDTH, HEIGHT)
            renderer.setPixelRatio = window.devicePixelRatio
            renderer.setClearColor('skyblue')
            container.append(renderer.domElement)

            this.control = new OrbitControls(camera, renderer.domElement)
            // this.createCube()
            this.loaderModel()
            this.addLight()
            this.animation()

        },
        addLight() {
            const light = new THREE.AmbientLight(0x404040); // soft white light
            this.scene.add(light)
            const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
            this.scene.add(directionalLight)
        },
        loaderModel() {
            let gltfLoader = new GLTFLoader()
            gltfLoader.loadAsync('../models/Stork.glb').then(res => {
                // console.log(res);
                this.scene.add(res.scene)
                // res.scene.position.x = 3
                res.scene.rotateX(Math.PI / 6)
            })
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
            for (let point of this.points) {
                let screenPosition = point.position.clone()
                screenPosition.project(this.camera)
                // this.raycaster.setFromCamera(screenPosition, this.camera)

                // let intersects = this.raycaster.intersectObjects(this.scene.children, true)
                // // console.log(intersects);
                // console.log(screenPosition.x * this.container.clientWidth);
                let translateX = screenPosition.x * this.container.clientWidth * 0.5
                let translateY = -screenPosition.y * this.container.clientHeight * 0.5

                point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
            }

            this.renderer.render(this.scene, this.camera)
            this.control.update()
            requestAnimationFrame(this.animation)
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
    overflow: hidden;
    width: 100%;
    height: 100%;


}

.point {
    position: absolute;
    top: 50%;
    left: 50%;

    .label {
        position: absolute;
        left: -20px;
        top: -20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #00000077;
        color: #fff;
        text-align: center;
        line-height: 40px;
        font-weight: 600;
        font-size: 14px;
        cursor: help;
        transform: scale(0, 0);
        transition: transform .3s;
    }

    .text {
        position: absolute;
        top: 30px;
        left: -100px;
        width: 200px;
        padding: 20px;
        border-radius: 4px;
        background: #00000077;
        color: #fff;
        line-height: 1.3em;
        font-weight: 100;
        opacity: 0;
        transition: opacity .3s;
        pointer-events: none;
    }

    &:hover {
        .text {
            opacity: 1;
        }
    }

    &.visible {
        .label {
            transform: scale(1, 1);
        }
    }
}
</style>