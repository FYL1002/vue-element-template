<template>
  <div id="emoji-picker" class="emoji-picker-container emoji-picker">
    <!-- <div class="filter">
        <ul class="filter-list">
            <li class="filter-item border-secondary-background-color " ng-class="currentCate==item.name?'active':''" ng-repeat="item in categories">
                <a class="category-link color-info-font-color" ng-click="selectCategary(item)">${item.caption}</a>
            </li>
        </ul>
    </div>-->
    <el-tabs v-model="activeName" class="emojiListTabs">
      <el-tab-pane v-for="(emojiObj,label) in emojiArr" :key="label" :label="categories[label]" :name="label">
        <el-scrollbar class="emojis">
          <div class="loader">
            <div class="loader__animation">
              <i class="fa fa-spinner fa-spin" />
            </div>
          </div>
          <div class="emojis__group">
            <ul class="emoji-list">
              <li v-for="emoji in emojiObj" :key="emoji.text" class="emojis__list__item">
                <a :class="[emoji.class,label+'_face']" class="emojis__list__emoji" @click="pickEmoji(emoji)" />
              </li>
            </ul>
          </div>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
import EmojiArr from './emoji/emojiArr.json';
import './emoji/wxEmoji.css';
export default {
  name: 'EmojiPicker',
  props: {
    emojiData: {
      type: Object,
      default: () => {
        return {
          text: ''
        };
      }

    }

  },
  data() {
    return {
      emojiArr: [],
      activeName: '',
      categories: {
        normal: '常用表情',
        emoji: '符号表情'
      }
    };
  },
  created() {
    this.emojiArr = EmojiArr;
    this.activeName = 'normal';
  },
  methods: {
    handleClick() {
    },
    pickEmoji(emoji) {
      this.emojiData = emoji;
      this.$emit('pickEmoji', emoji);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
