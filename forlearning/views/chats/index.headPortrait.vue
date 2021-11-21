<template>
  <div>
    <span v-if="nickNameObjInfo[chatItem.From] && nickNameObjInfo[chatItem.From].headUrl" class="user-symbol-content">
      <img class="css-6jrdpz" :src="imagePath+chatItem.From">
    </span>
    <span v-if="nickNameObjInfo[chatItem.From] && !nickNameObjInfo[chatItem.From].headUrl" class="user-symbol-content textIcon">{{ nickNameObjInfo[chatItem.From].nickName ? nickNameObjInfo[chatItem.From].nickName.substr(0,1) : nickNameObjInfo[chatItem.From].name ? nickNameObjInfo[chatItem.From].name.substr(0,1):'客' }}</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'HeadPortrait',
  props: {
    chatItem: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      noFind: false
    };
  },
  computed: {
    ...mapGetters([
      'member',
      'imagePath'
    ]),
    nickNameObjInfo() {
      return this.$store.getters.nickNameInfo;
    }
  },
  created() {
    // var img = new Image();
    // img.src = this.imagePath + this.chatItem.From
    // try {
    // } catch {
    //   console.log('catch');
    // }
    // img.onload = () => {
    //   console.log('onload');
    // }
    // img.onerror = () => {
    //   console.log(this.chatItem.From);
    //   console.log('error');
    // }
  },
  mounted() {

  },
  methods: {
    showDefaultImage() {
      var img = event.srcElement;
      if (this.chatItem.From === this.member.id) {
        img.src = require('@/assets/images/header_img.jpg');
      } else {
        this.noFind = true;
      }
      img.onerror = null;
      this.$forceUpdate();
    }
  }
};
</script>

<style scoped lang="scss">

</style>
