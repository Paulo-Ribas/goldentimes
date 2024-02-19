
<template>
    <button class="members-btn">
        <MembersIcon></MembersIcon>
        </button>
    </template>
<script>
import MembersIcon from './svgs/MembersIcon.vue';
export default {
    components: {MembersIcon}
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