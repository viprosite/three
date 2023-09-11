<template>
    <div class="point-box">
        <div class="model"></div>
    </div>
</template>

<script>
import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


export default {
    data() {
        return {
            points: null,
            scene: null,
        }
    },
    mounted() {
        this.initThree()

    },
    methods: {
        initThree() {
            let container = document.querySelector('.model')
            const WIDTH = container.clientWidth
            const HEIGHT = container.clientHeight
            let scene = this.scene = new Three.Scene()
            let camera = new Three.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 3000)
            camera.position.set(800, 800, 800)
            camera.lookAt(scene.position)
            let renderer = new Three.WebGLRenderer()
            renderer.setSize(WIDTH, HEIGHT)
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement)
            // let geometry = new Three.BoxGeometry(10, 10, 10)
            // let material = new Three.MeshBasicMaterial({
            //     color: 0xffff00
            // })
            // let cube = new Three.Mesh(geometry, material)
            // scene.add(cube)
            function render() {
                renderer.render(scene, camera);
                requestAnimationFrame(render);
            }
            render();
            var controls = new OrbitControls(camera, renderer.domElement); //创建控件对象

            let modelUrl = 'http://localhost:8080/pointCloud/demo1.asd'
            this.getArrayBufferFromUrl(modelUrl).then(arrayBuffer => {
                this.formatPointDatas(arrayBuffer)
            }).cache(e => alert(e))
        },
        /**
         * @description 读取远程的点云模型文件
         * @param {string} modelUrl  模型文件路径  http://a.b.com/xxx.asd
         * @return Promise{resolve(arrayBuffer)}
         */
        getArrayBufferFromUrl(modelUrl) {
            return new JSZip.external.Promise(function (resolve, reject) {
                JSZipUtils.getBinaryContent(modelUrl, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            })
        },
        /**
         * @description 处理读取到的点云模型arrayBuffer数据
         * @param {arrayBuffer} arrayBuffer 
         */
        async formatPointDatas(arrayBuffer) {
            JSZip.loadAsync(arrayBuffer).then(res => {
                for (let key in res.files) {
                    res.file(res.files[key].name).async('arraybuffer')
                        .then(content => {
                            // console.log(typeof content);
                            let version = new Float32Array(content, 0, 4)[0] // 版本 根据版本确定用哪种方式解析点云数据
                            let supportVersions = [1, 2, 3]
                            if (!supportVersions.includes(version)) {
                                alert('点云版本未支持')
                                return;
                            }
                            switch (version) {
                                case 1:
                                    this.formatAreaPage(content);  // 小区域显示点云 (受电弓)
                                    break;
                                case 2:
                                    this.formatFullPage(content);  // 全页面显示点云
                                    break;
                                case 3:
                                    this.formatRobot(content);  // 机器人点云
                                    break;
                            }
                        })
                }
            })
        },

        /**
         * 小区域显示点云数据处理
         * @param {arrayBuffer} content 读取到的点云模型文件arrayBuffer数据
         */
        formatAreaPage(content) {

        },
        /**
         * 全页面显示点云数据处理
         * @param {arrayBuffer} content 读取到的点云模型文件arrayBuffer数据
         */
        formatFullPage(content) {

        },
        /**
         * 机器人点云数据处理
         * @param {arrayBuffer} content 读取到的点云模型文件arrayBuffer数据
         */
        formatRobot(content) {
            let pointDataLen = new Float32Array(content, 8, 4)[0]  // 点云数据字节长度
            let positions = new Float32Array(content, 12, pointDataLen / 4)
            let colorStartByteIndex = 12 + pointDataLen
            let colorDatas = new Uint8Array(content, colorStartByteIndex)
            let colorDatasLen = colorDatas.length
            // 每个元素除以 255，将值转化为0到1之间
            let colors = new Float32Array(colorDatasLen);
            for (var i = 0; i < colorDatasLen; i++) {
                colors[i] = colorDatas[i] / 255;
            }
            // 模型调整函数
            let adjustFn = (geometry, model) => {
                console.log('adjustFn', geometry, model);
            }
            this.renderPointCloud(positions, colors, 1, adjustFn)
        },
        /**
         * @description 通过点云位置集和颜色集用threejs生成点云模型
         * @param {TypedArray} positions 点云位置集
         * @param {TypedArray} colors 点云颜色数据集
         * @param {number} pointSize 每个点的大小
         * @param {function} adjustFn 模型调整函数
         */
        renderPointCloud(positions, colors, pointSize = 1, adjustFn) {
            let geometry = new Three.BufferGeometry();
            geometry.setAttribute('position', new Three.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new Three.BufferAttribute(colors, 3))
            geometry.computeBoundingSphere();
            let material = new Three.PointsMaterial({
                // color: 0xff0000,//模型颜色
                vertexColors: true,
                size: pointSize
            });
            let pointModel = new Three.Points(geometry, material);
            if (adjustFn && typeof adjustFn == 'function') adjustFn(geometry, pointModel)
            this.scene.add(pointModel);
        },


    }
}
</script>

<style lang="scss" scoped>
.point-box {
    .model {
        width: 100vw;
        height: 100vh;
    }
}
</style>