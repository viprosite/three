<template>
    <div class="content">
        <div class="model"></div>
    </div>
</template>

<script>
import {
    BoxGeometry,
    Color,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from 'three';
import * as THREE from 'three'
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 引入CSS2渲染器CSS2DRenderer和CSS2模型对象CSS2DObject
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import TWEEN from '@tweenjs/tween.js';

export default {
    data() {
        return {
            a: 1,
            scene: null,
            renderer: null,
            container: null
        }
    },
    created() {

    },
    mounted() {
        this.container = document.querySelector('.content')
        this.init()
        // this.renderBox()
    },
    methods: {
        renderBox() {
            let geometry = new THREE.BoxGeometry(3, 3, 3)
            let material = new THREE.MeshBasicMaterial({
                color: 0xffff00,
            })
            let box = window.box = new THREE.Mesh(geometry, material)
            // this.scene.add(box)
            let box1 = box.clone()
            box1.position.x = 10
            box1.material = material.clone()
            box1.material.color.set('red')
            box1.geometry = geometry.clone()
            // box1.geometry.scale(2, 3, 1)
            // box1.geometry.translate(10, 0, 0)
            // this.scene.add(box1)
            //可视化mesh的局部坐标系
            const meshAxesHelper = new THREE.AxesHelper(5);
            box1.add(meshAxesHelper);
            this.animation(() => {
                box1.rotateY(Math.PI / 200)
            })
        },
        renderEarth() {
            const textureLoader = new THREE.TextureLoader();
            const earthTexture = textureLoader.load(require('../img/earth.webp'));
            // 创建地球模型
            const geometry = new THREE.SphereGeometry(10, 32, 32);
            const material = new THREE.MeshBasicMaterial({ map: earthTexture });
            const earth = new THREE.Mesh(geometry, material);

            // 将地球添加到场景中
            this.scene.add(earth);
        },
        addLight() {
            // let 
        },
        init() {
            /**
     * 创建场景对象Scene
     */
            var scene = this.scene = new THREE.Scene();
            // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
            var axisHelper = new THREE.AxesHelper(25);
            scene.add(axisHelper);
            // console.log(scene)
            // console.log(scene.children)
            /**
             * 相机设置
             */
            var width = this.container.offsetWidth; //窗口宽度
            var height = this.container.offsetHeight; //窗口高度
            var k = width / height; //窗口宽高比
            var s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
            //创建相机对象
            var camera = this.camera = new THREE.PerspectiveCamera(35, k, 0.1, 1000);
            camera.position.set(20, 30, 20); //设置相机位置
            camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
            /**
             * 创建渲染器对象
             */
            var renderer = this.renderer = new THREE.WebGLRenderer();
            renderer.setSize(width, height); //设置渲染区域尺寸
            // renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
            this.container.appendChild(renderer.domElement); //body元素中插入canvas对象
            // renderer.shadowMap.enabled = true;
            //执行渲染操作   指定场景、相机作为参数
            // renderer.render(scene, camera);
            var controls = new OrbitControls(camera, renderer.domElement); //创建控件对象
            function render() {
                renderer.render(scene, camera); //执行渲染操作
                // mesh.rotateY(0.01);//每次绕y轴旋转0.01弧度
                requestAnimationFrame(render); //请求再次执行渲染函数render
            }
            render();
            // this.renderBox();
            this.renderEarth()
            this.addLight()

        },
        animation(callback) {
            let render = () => {
                callback()
                this.renderer.render(this.scene, this.camera); //执行渲染操作
                // mesh.rotateY(0.01);//每次绕y轴旋转0.01弧度
                requestAnimationFrame(render); //请求再次执行渲染函数render
            }
            render();
        }
    }
}
</script>

<style lang="scss" scoped>
.content {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .model {
        width: 800px;
        height: 800px;
    }
}
</style>