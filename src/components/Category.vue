<template>
  <form class="category-box" @submit.prevent="editCategory" @click="pushToRoute(category.ID)">
    <div class="category-name-container" @click.stop="">
        <RouterLink v-if="!editing" :to="`/group/${groupID}/category/${category.ID}`">{{ category.Name }}</RouterLink>

        <input type="text" v-if="editing" v-model="name" :placeholder="category.Name">

        <PencilSvg v-if="!editing" @click="editing = true" />

        <XMark v-if="editing" @click.stop="editing = false"></XMark>
    </div>
        <RecycleBin @click.stop="deleteCategory(category.ID)"></RecycleBin>
    </form>
</template>

<script>
import PencilSvg from '@/components/svgs/PencilSvg.vue';
import RecycleBin from '@/components/svgs/RecycleBin.vue';
import XMark from './svgs/XMark.vue';
export default { 
    name: 'Category-',
    props: {
        categoryProps: Object,
        groupIDProps: String,
    },
    components: {PencilSvg, RecycleBin, XMark},
    data(){
        return {
            editing: false,
            category: this.categoryProps,
            name: '',
            groupID: this.groupIDProps
        }
    },
    watch: {
      categoryProps(value) {
        this.category = value
      }
    },
    methods: {
        pushToRoute($event){
            this.$emit('pushToRoute', $event)
        },
        deleteCategory($event){
          console.log('vou emitir lol', $event)
            this.$emit('deleteCategory', $event)
        },
        editCategory(){
            this.$emit('editCategory', {name: this.name, categoryID: this.category.ID})
            this.editing = false
        }
    }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/variables.scss';
    .category-box {
        padding: 20px 15px;
        border-radius: 20px;
        border: 1px solid #F5CB86;
        background: #0E0E0D;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        transition: 0.2s;
        &:hover {
          transform: translateY(-5px);
        }
        .category-name-container {
          display: flex;
          width: 28%;
          justify-content: space-between;
          align-items: center;
          a {
            color: $text-color;
            font-family: $main-font;
            font-size: 1.6rem;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            text-decoration: none;
            transition: 0.1s;
            flex: 1.7;
            overflow: hidden;
            text-overflow: ellipsis;
            &:hover {
              color: $gold;
            }
          }
          input{
            color: $gold;
            font-family: $main-font;
            font-size: 1.6rem;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            background: none;
            border: none;
            flex: 1.7;
            width: 100%;
            outline: none;
            &::placeholder {
                color: $text-color;
                font-family: $main-font;
            }
          }
          svg {
            cursor: pointer;
            flex: 0.3;
          }
        }
        svg {
          cursor: pointer;
        }
      }
</style>