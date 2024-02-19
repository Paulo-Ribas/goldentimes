<template>
  <router-view/>
</template>

<style lang="scss">
@import './assets/scss/variables.scss';
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: 10px;
    border-radius: 8px;
    background-color: #191918;
  }
  &::-webkit-scrollbar-thumb {
    background-image: $default-gradient;
    border-radius: 8px;
  }
}
#app {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  background-color: #111;
  background-image: url('./assets/imgs/background.png');
}
.container {
  width: 100%;
  height: 100vh;
  max-width: 1345px;
  margin: 0px auto;
}
.profile-error {
  color: $gold;
  font-family: $main-font;
  font-size: 0.8rem;
  padding-left: 5px;
}
.category-error {
  color: $gold;
  font-family: $main-font;
  font-size: 1rem;
  padding-left: 5px;
}
.error {
  text-align: center;
  color: $gold;
  font-family: $main-font;
  font-size: 1rem;
}
.locations-errs{
  text-align: center;
  color: $gold;
  font-family: $main-font;
  font-size: 1rem;
  margin-top: -12px;
  margin-bottom: 6px;
}
.login-sign-errs{
  text-align: center;
  color: $gold;
  font-family: $main-font;
  font-size: 1rem;
  margin-top: -12px;
  margin-bottom: 6px;
}
@media screen and (max-width: 860px) {
    html {
      font-size: 14px;
    }
    #app {
      overflow-y: auto;
    }
}


</style>
