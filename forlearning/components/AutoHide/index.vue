<template>
  <div v-if="elementVisible" class="hideElementContainer">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    ifHide: {
      type: Boolean,
      default: false
    },
    hideDuration: {
      type: Number,
      default: 60000
    },
    update: {
      type: Number,
      default: 0
    },
    param: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      elementVisible: false,
      timer: null
    };
  },
  watch: {
    update: function(newVal, oldVal) {
      if (this.ifHide) {
        this.haddleclose();
      }
    }
  },
  created() {
    if (this.ifHide) {
      this.haddleclose();
    }
  },
  methods: {
    haddleclose() {
      const hideTime = this.hideDuration - (new Date().getTime() - this.update);
      clearTimeout(this.timer);
      this.timer = null;
      this.timer = setTimeout(() => {
        // that.elementVisible = false
        this.$emit('delete-msg');
      }, hideTime);
    }
  }
};
</script>
