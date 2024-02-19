<template>
    <div class="btn-container" @click.prevent="" :style="{left: X, top: Y}">
      <button v-if="!isMemberAdmin && !isOwner">Member</button>
      <button v-if="isMemberAdmin && !isOwner">Admin</button>
      <button v-if="isOwner">Owner</button>
    </div>
  </template>
  
  <script>
  export default {
      props: {
          Xprops: Number,
          Yprops: Number,
          checkRigthProps: Boolean,
          checkTopProps: Boolean,
          isMemberAdminProps: Boolean,
          isOwnerProps: Boolean,
      },
      beforeMount(){
        let windowWidth = window.innerWidth, windowHeight = window.innerHeight
        console.log(this.Y, this.mousePositionY, windowHeight, (this.mousePositionY + 400))

        if((this.mousePositionX + 200) >= windowWidth) this.X = (this.X - 200) + 'px'
        if((this.mousePositionY + 400) >= windowHeight) this.Y = (this.Y - 400) + 'px'


    },
      watch: {
          Xprops(value){
              let windowWidth = window.innerWidth
              if((value + 200) >= windowWidth) return this.X = (value - 200) + 'px'
              this.X = value + 'px'
              console.log(this.X)
          },
          Yprops(value){
              console.log(value, 'vou coisar')
              this.Y = value + 'px'
          }
      },
      data(){
          return {
              X: `${this.Xprops}px`,
              Y: `${this.Yprops}px`,
              checkRigth: this.checkRigthProps,
              checkTop: this.checkTopProps,
              isMemberAdmin: this.isMemberAdminProps,
              isOwner: this.isOwnerProps,
          }
      },
  }
  </script>
  
  <style scoped lang="scss">
  @import '../../assets/scss/variables.scss';
      .btn-container {
          border-radius: 20px;
          border: 1px solid #7E5936;
          background: #0E0E0D; 
          max-width: 250px;
          width: 20%;
          min-width: 200px;
          position: absolute;
          z-index: 2;
          button {
              margin: 22px 0px;
              border: none;
              background: none;
              color: $text-color;
              font-size: 1rem;
              font-family: $main-font;
              padding-left: 10px;
              transition: 0.3s;
              display: block;
              &:hover{
                  color: $gold;
              }
              cursor: pointer;
          }   
      }
  
  </style>