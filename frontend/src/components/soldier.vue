<template>
  <section>
    <div :class="soldierClass"></div>
  </section>
</template>

<script>
export default {
  props: {
    soldier: Object,
    color: String,
    loggedInUserColor: String,
    const: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    soldierClass() {
      if (this.soldier) {
        return {
          soldier: true,
          white: this.soldier.color === "white",
          black: this.soldier.color === "black",
          selected: this.soldier.selected,
          "animated zoomOut fast":
            this.soldier.isMoving && this.soldier.color !== this.loggedInUserColor,
          "animated zoomIn fast":
            this.soldier.hasMoved && this.soldier.color !== this.loggedInUserColor
        };
      } else {
        return {
          "soldier-const": true,
          white: this.color === "white",
          black: this.color === "black"
        };
      }
    }
  }
};
</script>

<style scoped lang="scss">
.soldier {
  z-index: 1;
  align-self: center;
  height: 5.9vh;
  width: 5.9vh;
  @media (min-width: 850px) {
    height: 4.9vh;
    width: 4.9vh;
  }
  border-radius: 50%;
  &.black {
    background-color: black;
    border: 2px solid white;
    &.selected {
      border: 2px solid yellow;
    }
  }
  &.white {
    background-color: #fff;
    border: 2px solid black;
    &.selected {
      border: 2px solid blue;
    }
  }
}
.soldier-const {
  z-index: 1;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  &.black {
    background-color: black;
    border: 2px solid white;
  }
  &.white {
    background-color: #fff;
    border: 2px solid black;
  }
}
</style>




