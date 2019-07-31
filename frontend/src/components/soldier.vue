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
