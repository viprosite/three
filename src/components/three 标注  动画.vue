<template>
    <div class="content">
        <div id="tag" style="display: none;backface-visibility: hidden;">
            <span>标签内容</span>
            <div class="line"></div>
        </div>
        <div class="pos" style="z-index: 99;">
            <div id="A" class="bu">圆锥</div>
            <div id="B" class="bu" style="margin-left: 10px;">红</div>
            <div id="car" class="bu" style="margin-left: 10px;">绿</div>
            <div id="all" class="bu" style="margin-left: 10px;">整体</div>
        </div>

        <!-- header 123 {{ a }} -->
        <!-- <div id="box"></div> -->
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
            container: null
        }
    },
    created() {

    },
    mounted() {
        // this.init()
        this.container = document.querySelector('.content')
        this.renderBox()
    },
    methods: {
        renderBox() {
            var scene = new THREE.Scene();
            // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
            var axisHelper = new THREE.AxesHelper(100);
            // scene.add(axisHelper);
            var width = this.container.clientWidth; //窗口宽度
            var height = this.container.clientHeight; //窗口高度
            var k = width / height; //窗口宽高比
            var s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
            //创建相机对象
            var camera = new THREE.PerspectiveCamera(35, k, 0.1, 1000);
            camera.position.set(100, 100, 100); //设置相机位置
            camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
            /**
             * 创建渲染器对象
             */
            var renderer = new THREE.WebGLRenderer();
            renderer.setSize(width, height); //设置渲染区域尺寸
            renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
            this.container.appendChild(renderer.domElement); //body元素中插入canvas对象
            let material = new THREE.MeshBasicMaterial({
                color: 0xffff00,
                // transparent: true,
                opacity: 0
            })
            const geometry = new THREE.ConeGeometry(35, 40);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.name = 'mesh'
            mesh.position.set(30, -20, 20)
            scene.add(mesh)
            let box = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), material)
            box.name = 'box'
            box.material = mesh.material.clone()
            box.position.set(50, 20, 20)
            box.material.color.set('red')
            // scene.add(box)
            let box1 = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), material)
            box1.name = 'box1'
            box1.position.set(-20, -20, -20)
            box1.material = mesh.material.clone()
            box1.material.color.set('green')
            // scene.add(box1)
            // console.log(scene);

            const div = document.getElementById('tag');
            div.style.top = '-40px'

            // HTML元素转化为threejs的CSS2模型对象
            const tag = new CSS2DObject(div);
            // tag.position.set(0, 0, 0);
            // scene.add(tag);
            // const group = new THREE.Group();
            // group.add(tag);
            // scene.add(group)
            mesh.add(tag);
            //y轴正方向，平移高度一半
            // geometry.translate(0, 40, 0);
            //圆锥mesh局部坐标系原点在自己底部时候，标签需要向上偏移圆锥自身高度
            tag.position.y += 20;
            // const pos = boxGeo.attributes.position;
            // 获取几何体顶点1的xyz坐标，设置标签局部坐标.position属性
            // tag.position.set(pos.getX(0), pos.getY(0), pos.getZ(0));
            // 创建一个CSS2渲染器CSS2DRenderer
            const css2Renderer = new CSS2DRenderer();
            // 用法和webgl渲染器渲染方法类似
            css2Renderer.render(scene, camera);
            // renderer.render(scene, camera);
            // width, height：canvas画布宽高度
            css2Renderer.setSize(width, height);
            this.container.appendChild(css2Renderer.domElement);
            //创建一段mesh平移的动画
            // const tween = new TWEEN.Tween(mesh.position);
            // //经过2000毫秒，pos对象的x和y属性分别从零变化为100、50
            // tween.to({ x: 50, y: 50 }, 2000);
            // //tween动画开始执行
            // tween.start();
            // new TWEEN.Tween(mesh.scale).to({
            //     x: 100,
            //     y: 50
            // }, 2000).start();
            // const R = 100; //相机圆周运动的半径
            // new TWEEN.Tween({ angle: 0 })
            //     .to({ angle: Math.PI * 2 }, 16000)
            //     .onUpdate(function (obj) {
            //         camera.position.x = R * Math.cos(obj.angle);
            //         camera.position.z = R * Math.sin(obj.angle);
            //         camera.lookAt(0, 0, 0);
            //     })
            //     .start()


            function render() {
                // camera.position.z -= 0.3;//相机直线运动动画
                css2Renderer.render(scene, camera); //执行渲染操作
                renderer.render(scene, camera)
                // mesh.rotateY(0.01);//每次绕y轴旋转0.01弧度
                requestAnimationFrame(render); //请求再次执行渲染函数render
                // TWEEN.update();
            }
            render();
            var controls = new OrbitControls(camera, css2Renderer.domElement); //创建控件对象
            new OrbitControls(camera, renderer.domElement); //创建控件对象

            // renderer.domElement.style.zIndex = -1;
            // css2Renderer.domElement.style.zIndex = 1;
            // mesh.position.set(50, 0, 50);
            // // mesh设置一个父对象meshGroup
            // const meshGroup = new THREE.Group();
            // meshGroup.add(mesh);
            // // mesh位置受到父对象局部坐标.positionn影响
            // meshGroup.position.x = -100;
            // scene.add(meshGroup)
            // const worldPosition = new THREE.Vector3();
            // // 获取mesh的世界坐标(meshGroup.position和mesh.position累加结果)
            // mesh.getWorldPosition(worldPosition);
            // // mesh世界坐标复制给tag
            // tag.position.copy(worldPosition);
            // group.add(meshGroup, tag);


            // 相机动画函数，从A点飞行到B点，A点表示相机当前所处状态
            // pos: 三维向量Vector3，表示动画结束相机位置
            // target: 三维向量Vector3，表示相机动画结束lookAt指向的目标观察点
            function createCameraTween(endPos, endTarget) {
                new TWEEN.Tween({
                    // 不管相机此刻处于什么状态，直接读取当前的位置和目标观察点
                    x: camera.position.x,
                    y: camera.position.y,
                    z: camera.position.z,
                    tx: controls.target.x,
                    ty: controls.target.y,
                    tz: controls.target.z,
                })
                    .to({
                        // 动画结束相机位置坐标
                        x: endPos.x,
                        y: endPos.y,
                        z: endPos.z,
                        // 动画结束相机指向的目标观察点
                        tx: endTarget.x,
                        ty: endTarget.y,
                        tz: endTarget.z,
                    }, 2000)
                    .onUpdate(function (obj) {
                        // 动态改变相机位置
                        camera.position.set(obj.x, obj.y, obj.z);
                        // 动态计算相机视线
                        // camera.lookAt(obj.tx, obj.ty, obj.tz);
                        controls.target.set(obj.tx, obj.ty, obj.tz);
                        controls.update();//内部会执行.lookAt()
                    })
                    .start();
            }

            // 切换到设备A预览状态
            document.getElementById('A').addEventListener('click', function () {
                const A = scene.getObjectByName('mesh');
                const pos = new THREE.Vector3();
                A.getWorldPosition(pos); //获取三维场景中某个对象世界坐标
                // 相机飞行到的位置和观察目标拉开一定的距离
                const pos2 = pos.clone().addScalar(30);
                createCameraTween(pos2, controls.target)
                new TWEEN.Tween({ opacity: mesh.material.opacity })
                    .to({ opacity: 1 }, 2000)
                    .onUpdate(function (obj) {
                        mesh.material.opacity = obj.opacity
                    })
                    .start()
            })
            // 切换到设备B的预览状态
            document.getElementById('B').addEventListener('click', function () {
                const B = scene.getObjectByName('box');
                const pos = new THREE.Vector3();
                B.getWorldPosition(pos); //获取三维场景中某个对象世界坐标
                // 相机飞行到的位置和观察目标拉开一定的距离
                const pos2 = pos.clone().addScalar(30);
                // 相机从当前位置camera.position飞行三维场景中某个世界坐标附近
                createCameraTween(pos2, controls.target)
                new TWEEN.Tween({ opacity: box.material.opacity })
                    .to({ opacity: 1 }, 2000)
                    .onUpdate(function (obj) {
                        box.material.opacity = obj.opacity
                    })
                    .start()
            })

            // 切换到设备停车场的预览状态
            document.getElementById('car').addEventListener('click', function () {
                const car = scene.getObjectByName('box1');
                const pos = new THREE.Vector3();
                car.getWorldPosition(pos); //获取三维场景中某个对象世界坐标
                // 相机飞行到的位置和观察目标拉开一定的距离
                const pos2 = pos.clone().addScalar(30);
                // 相机从当前位置camera.position飞行三维场景中某个世界坐标附近
                createCameraTween(pos2, pos)
            })

            // 相机整体预览对应的位置和观察目标
            const cameraPos0 = new THREE.Vector3(202, 123, 125)
            const target0 = new THREE.Vector3(0, 0, 0);
            // 切换整体预览状态
            document.getElementById('all').addEventListener('click', function () {
                // 相机从当前位置camera.position回到整体预览状态
                createCameraTween(cameraPos0, target0)
            })





        },
        init() {
            /**
     * 创建场景对象Scene
     */
            var scene = new THREE.Scene();

            var loader = new STLLoader();

            loader.load("1.STL", function (geometry) {
                var material = new THREE.MeshLambertMaterial({
                    // color: 0x0000ff,
                }); //材质对象Material
                var mesh = new THREE.Mesh(geometry, material);
                mesh.scale.set(0.4, 0.4, 0.4);
                scene.add(mesh);
            });
            //点光源
            var point = new THREE.DirectionalLight(0xffffff);
            point.position.set(1000, 50, 1000);
            scene.add(point);
            scene.add(new THREE.AmbientLight(0x444444));
            /**
             * 光源设置
             */
            //点光源
            // var point = new THREE.PointLight(0xffffff);
            // point.position.set(400, 200, 300); //点光源位置
            // scene.add(point); //点光源添加到场景中
            // point.castShadow = true;
            //环境光
            // var ambient = new THREE.AmbientLight(0x444444);
            // scene.add(ambient);

            // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
            var axisHelper = new THREE.AxesHelper(250);
            scene.add(axisHelper);
            // console.log(scene)
            // console.log(scene.children)
            /**
             * 相机设置
             */
            var width = window.innerWidth; //窗口宽度
            var height = window.innerHeight; //窗口高度
            var k = width / height; //窗口宽高比
            var s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
            //创建相机对象
            var camera = new THREE.PerspectiveCamera(35, k, 0.1, 1000);
            camera.position.set(200, 300, 200); //设置相机位置
            camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
            /**
             * 创建渲染器对象
             */
            var renderer = new THREE.WebGLRenderer();
            renderer.setSize(width, height); //设置渲染区域尺寸
            renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
            document.body.appendChild(renderer.domElement); //body元素中插入canvas对象
            renderer.shadowMap.enabled = true;
            //执行渲染操作   指定场景、相机作为参数
            // renderer.render(scene, camera);
            function render() {
                renderer.render(scene, camera); //执行渲染操作
                // mesh.rotateY(0.01);//每次绕y轴旋转0.01弧度
                requestAnimationFrame(render); //请求再次执行渲染函数render
            }
            render();
            var controls = new OrbitControls(camera, renderer.domElement); //创建控件对象
        }
    }
}
</script>

<style lang="scss" scoped>
.content {
    color: gray;
    position: absolute;
    top: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    ::v-deep canvas,
    ::v-deep>div {
        position: absolute;
    }

    #box {
        width: 500px;
        height: 500px;
    }

    #tag {
        height: 40px;
        border: 1px solid #ffff00;
        background-color: rgba(180, 200, 210, 0.6);
        // display: none;

        .line {
            height: 20px;
            width: 1px;
            background: red;
            position: absolute;
            top: 40px;
            left: 50%;
        }
    }
}
</style>