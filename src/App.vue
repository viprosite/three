<template>
    <div class="app">
        <!-- <Header /> -->
        <!-- <OL /> -->
        <!-- <Point /> -->
        <!-- <Three /> -->
        <Basic />
        <!-- <MixHtml /> -->
        <article>
            <!-- content.. -->
        </article>
    </div>
</template>

<script>
// import Header from './components/Header'
import OL from './components/ol'
import Point from './components/point'
import Three from './components/three.vue'
import Basic from './components/1basic.vue'
import MixHtml from './components/2mixHtml.vue'
export default {
    components: {
        // Header,
        OL,
        Point,
        Three,
        Basic,
        MixHtml
    }
}
</script>

<style lang="scss">
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

body {
    position: relative;
    width: 100vw;
    height: 100vh;
}

.app {
    width: 100%;
    height: 100%;
}
</style>