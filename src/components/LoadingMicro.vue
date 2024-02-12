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
        position: relative;
        animation-name: rotation3d ;
        animation-duration: 1.3s;
        animation-fill-mode:both;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        img {
            width: 90px;
            height: 120px;
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