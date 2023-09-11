<template>
    <div class="map" id="map"></div>
</template>

<script>
import { Map, View, Feature } from 'ol'
import { Tile, Vector as VectorLayer } from 'ol/layer'
import { XYZ, Vector as VectorSource, OSM } from 'ol/source'
import { Style, Stroke } from 'ol/style'
import { Polygon } from 'ol/geom'
import { transform } from 'ol/proj'
import ExtTransform from 'ol-ext/interaction/Transform'
export default {
    data() {
        return {
            map: null,
        }
    },
    computed: {},
    watch: {},
    beforeCreate() { },
    created() { },
    beforeMount() { },
    mounted() {
        this.createMap()
        this.createPolygon()
        this.onEdit()
    },
    activated() { },
    deactivated() { },
    beforeUpdate() { },
    updated() { },
    beforeDestroy() { },
    methods: {
        createMap() {
            const tileLayer = new Tile({
                source: new XYZ({
                    url: "http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20141103&scaler=1",
                    crossOrigin: "anonymous",
                }),
            })
            const map = new Map({
                view: new View({
                    center: transform([121.507291, 31.235963], 'EPSG:4326', 'EPSG:3857'),
                    zoom: 15,
                    maxZoom: 18,
                    minZoom: 11,
                }),
                layers: [
                    new Tile({
                        source: new OSM(),
                    }),
                ],
                target: 'map'
            })
            this.map = map
        },
        createPolygon() {
            const polygon = new Feature({
                geometry: new Polygon([
                    [
                        transform([121.501842, 31.239204], 'EPSG:4326', 'EPSG:3857'),
                        transform([121.506337, 31.238305], 'EPSG:4326', 'EPSG:3857'),
                        transform([121.506606, 31.235846], 'EPSG:4326', 'EPSG:3857'),
                        transform([121.500243, 31.236103], 'EPSG:4326', 'EPSG:3857'),
                    ]
                ]),
            })
            polygon.setStyle(new Style({
                stroke: new Stroke({
                    width: 4,
                    color: [255, 0, 0, 1],
                }),
            }))
            this.map.addLayer(new VectorLayer({
                source: new VectorSource({
                    features: [polygon],
                }),
            }))
        },
        onEdit() {
            const transform = new ExtTransform({
                enableRotatedTransform: false,
                hitTolerance: 2,
                translate: true, // 拖拽
                stretch: false, // 拉伸
                scale: true, // 缩放
                rotate: true, // 旋转
                translateFeature: false,
                noFlip: true,
                // layers: [],
            })
            this.map.addInteraction(transform)
            //开始事件
            transform.on(['rotatestart', 'translatestart'], function (e) {
                // Rotation
                let startangle = e.feature.get('angle') || 0;
                // Translation
                console.log(1111);
                console.log(startangle);
            });
            //旋转
            transform.on('rotating', function (e) {
                console.log(2222);
                console.log("rotate: " + ((e.angle * 180 / Math.PI - 180) % 360 + 180).toFixed(2));
                console.log(e);
            });
            //移动
            transform.on('translating', function (e) {
                console.log(3333);
                console.log(e.delta);
                console.log(e);

            });
            //拖拽事件
            transform.on('scaling', function (e) {
                console.log(4444);
                console.log(e.scale);
                console.log(e);
            });
            //事件结束
            transform.on(['rotateend', 'translateend', 'scaleend'], function (e) {
                console.log(5555);
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.map {
    width: 100%;
    height: 100vh;
}
</style>
