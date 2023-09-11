<template>
    <div>
        <!-- <Header /> -->
        <!-- <OL /> -->
        <Point />
        <!-- <Three /> -->
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
export default {
    components: {
        // Header,
        OL,
        Point,
        Three
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
}
</style>