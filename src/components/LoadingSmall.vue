<template>
    <div class="container-loanding">
        <img src="../assets/imgs/ampulheta.png" alt="loading">
    </div>
</template>
<script>
</script>
<style lang="scss" scoped>
    .container-loanding{
        width: fit-content;
        height: fit-content;
        animation-name: rotation3d ;
        animation-duration: 1.3s;
        animation-fill-mode:both;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        position: absolute;
        z-index: 3;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        img {
            width: 150px;
            height: 180px;
        }
    }
    @keyframes rotation3d {
            from{
                transform: translate(-50%, -50%) rotate3d(0, 1, 0, 0deg);
            }
            to{
                transform: translate(-50%, -50%) rotate3d(0, 1, 0, 360deg);
            }
        }
</style>