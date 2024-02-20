
<template>
    <button class="members-btn">
        <GradientClose></GradientClose>
        </button>
    </template>
<script>
import GradientClose from './svgs/GradientClose.vue';
export default {
    components: {GradientClose}
}
</script>

<style lang="scss" scoped>
    button {
        border-radius: 40px;
        background-color: #191918;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        padding: 0px 2rem;
        cursor: pointer;
        height: 100%;
    }
</style>