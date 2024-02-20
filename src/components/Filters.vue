<template>
  <div class="filters-container">
    <div v-for="(filter, index) in filters" :key="index" @click="addFilter(filter.name)">
        <span :class="{'filter-name': true, 'selected': filter.selected}">{{ filter.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
    name:'FilterS',
    props:{
        filtersProps: Array,
    },
    data(){
        return {
            filters: this.filtersProps
        }
    },
    watch: {
        filtersProps(value){
            this.filters = value
        }
    },
    methods: {
        addFilter(filterName){
            this.$emit('addFilter', filterName)
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '../assets/scss/variables.scss';
    .filters-container {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        position: absolute;
        top: 100%;
        left: 50%;
        flex-wrap: wrap;
        transform: translate(-50%, 150%);
        .filter-name {
            border-radius: 40px;
            background: #191918;
            padding: 10px 15px;
            font-size: 1rem;
            font-family: $main-font;
            color: $text-color;
            cursor: pointer;
            &:hover {
                color: $gold;
            }
        }
    }
    .selected {
        color: $gold !important;
    }
    @media screen and (max-width: 860px) {
        .filters-container {
            justify-content: center;
            gap: 23px;
            top: 50%;
            left: 50%;
            flex-wrap: wrap;
            transform: translate(-50%, 90%);
        }
    }
    
</style>

