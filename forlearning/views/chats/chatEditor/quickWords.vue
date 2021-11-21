<template>
  <transition>
    <div v-if="isShowPopover" class="el-popover quickWordPopover">
      <div class="quickWordContainer">
        <overlay-scrollbars v-if="!isSearchMode" ref="listScroll" class="content-scroll content-left" :options="osComponentOptions">
          <ul v-loading="groupDataLoading" class="wordsGroupList popover-list">
            <li
              v-for="(item,index) in groupList"
              :ref="'groupItem'+index"
              :key="item.id"
              class="popover-list__item"
              :class="[selectedId===item.id?'in-acitve':'',selectedIndex===index&&selectedMode==='groupList'?'selected-active':'']"
              @click="openChildList(item,$event)"
              @mouseover="overFn(index,'groupList')"
            ><span>{{ item.name }}</span><i class="el-icon-arrow-right" /></li>
          </ul>
        </overlay-scrollbars>
        <overlay-scrollbars v-if="isSearchMode || showChildContent" ref="wordslistScroll" class="content-scroll content-right" :options="osComponentOptions">
          <ul v-if="wordsDataLoading ||(!wordsDataLoading &&quickWordslist.length>0)" ref="queryListofWords" v-loading="wordsDataLoading" class="wordsList  popover-list">
            <li
              v-for="(item,index) in quickWordslist"
              :ref="'wordsItem'+index"
              :key="item.id"
              class="popover-list__item"
              :class="[selectedIndex===index&&selectedMode==='quickWordslist'?'selected-active':'']"
              @click="enterContent(item.content)"
              @mouseover="overFn(index,'quickWordslist')"
            ><span v-html="item.contentHtml" /></li>
          </ul>
          <div v-if="!wordsDataLoading && quickWordslist.length===0" class="noDataText">暂无数据</div>
        </overlay-scrollbars>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import {
  getFastWordGroup,
  getFastWord
} from '@/api/setting';
export default {
  components: {},
  props: {
    wordContains: {
      default: '',
      type: String
    },
    isShow: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      groupList: [],
      quickWordslist: [],
      showChildContent: false,
      selectedId: '',
      groupDataLoading: true,
      wordsDataLoading: true,
      isShowPopover: false,
      isSearchMode: false,
      osComponentOptions: {
        scrollbars: {
          autoHide: 'leave',
          dragScrolling: true,
          clickScrolling: true
        },
        paddingAbsolute: true,
        callbacks: {
          onContentSizeChanged(eventArgs) {},
          onScroll: (eventArgs) => {
          }
        }
      },
      queryTimer: null,
      optionalNodes: [],
      selectedIndex: 0,
      selectedMode: 'groupList',
      isFirstEnter: true,
      osInstance: null
    };
  },
  computed: {
    ...mapGetters([
      'member'
    ]),
    quickWordGroupStore() {
      return this.$store.getters.quickWordGroups;
    },
    quickWordStore() {
      return this.$store.getters.quickWordStorage;
    }
  },
  watch: {
    'wordContains': function(newVal, oldVal) {
      this.initPopover();
    }
  },
  created() {
    // this.getQuickWordsGroupFn();
  },
  mounted() {
  },
  methods: {
    getQuickWordsGroupFn: function() {
      if (this.quickWordGroupStore.length > 0) {
        this.groupList = this.quickWordGroupStore;
        this.groupDataLoading = false;
        return;
      }
      getFastWordGroup({
        orderBy: 'sort'
      }).then(resp => {
        if (resp.results && resp.results.length !== 0) {
          this.groupDataLoading = false;
          const havesort = resp.results.filter(item => item.sort);
          const havenosort = resp.results.filter(item => !item.sort).sort((item1, item2) => +new Date(item1.createdOn) > +new Date(item2.createdOn) ? 1 : -1);
          this.groupList = havesort.concat(havenosort);
        } else {
          this.groupList = [];
        }
         this.groupList;
        this.$store.dispatch('app/setQwGroup', this.groupList);
      });
    },
    getQuickWordsList: function(queryWord, groupId) {
      let queryParam = {};
      if (queryWord) {
        queryParam.ContentContains = queryWord;
        delete queryParam.groupId;
      }
      if (groupId) {
        queryParam.groupId = groupId;
        delete queryParam.ContentContains;
      }
      var searchCode = queryParam.ContentContains || queryParam.groupId;
      if (searchCode === '') searchCode = 'all';
      if (this.quickWordStore[searchCode]) { // 该搜索词查过
        this.wordsDataLoading = false;
        this.quickWordslist = this.quickWordStore[searchCode];

        return;
      }
      queryParam = {
        ...queryParam,
        orderByDesc: 'createdOn'
      };
      getFastWord(queryParam).then(resp => {
        this.wordsDataLoading = false;
        if (resp.results && resp.results !== 0) {
          this.quickWordslist = resp.results;
          this.quickWordslist = this.quickWordslist.map(item => {
            item.contentHtml = item.content.replace(this.wordContains, `<span style="font-weight:bold;">${this.wordContains}</span>`).replace('{userName}', this.member.nickName);
            item.content = item.content.replace('{userName}', this.member.nickName);
            return item;
          });
        } else {
          this.quickWordslist = [];
        }
        var qwReasult = {
          searchCode: searchCode,
          results: this.quickWordslist
        };
        this.$store.dispatch('app/setQwStorage', qwReasult);
      });
    },
    openChildList: function(groupItem, ev) {
      this.selectedId = groupItem.id;
      this.wordsDataLoading = true;
      this.getQuickWordsList(null, groupItem.id);
      this.showChildContent = true;
      this.$emit('editorFocus');
    },
    openPopover: function() {
      this.isShowPopover = true;
      this.initPopover();
      this.getQuickWordsGroupFn();
    },
    closePopover: function() {
      this.isShowPopover = false;
    },
    initPopover: function() {
      this.selectedIndex = 0;
      this.selectedMode = this.isSearchMode ? 'quickWordslist' : 'groupList';
      this.selectedId = null;
      this.quickWordslist = [];
      this.wordsDataLoading = true;
      this.showChildContent = false;
      if (this.wordContains) {
        this.isSearchMode = true;
        if (this.queryTimer) clearTimeout(this.queryTimer);
        this.queryTimer = setTimeout(() => {
          // console.log('执行搜索');
          this.getQuickWordsList(this.wordContains);
        }, 600);
      } else {
        this.isSearchMode = false;
      }
    },
    handleItemKey: function(direction) {
      if (direction === 'up') {
        this.selectedIndex = this.selectedIndex || this.selectedIndex === 0 ? this.selectedIndex : 0;
        let nextIndex = this.selectedIndex - 1;
        if (nextIndex < 0) {
          nextIndex = nextIndex + this[this.selectedMode].length;
        }
        this.scrollFn(direction, nextIndex);
        this.selectedIndex = nextIndex;
      } else if (direction === 'down') {
        this.selectedIndex = this.selectedIndex || this.selectedIndex === 0 ? this.selectedIndex : this[this.selectedMode].length - 1;
        let nextIndex = this.selectedIndex + 1;
        if (nextIndex >= this[this.selectedMode].length) {
          nextIndex = 0;
        }
        this.scrollFn(direction, nextIndex);
        this.selectedIndex = nextIndex;
      } else {
        if (this.isSearchMode || !this.showChildContent || this.quickWordslist.length === 0) { // 不移动
          return true;
        }
        this.selectedIndex = 0;
        this.selectedMode = this.selectedMode === 'groupList' ? 'quickWordslist' : 'groupList';
        this.scrollFn(direction);
      }
    },
    overFn: function(index, mode) {
      this.selectedIndex = index;
      this.selectedMode = mode;
    },
    scrollFn: function(direction, nextIndex) {
      const scrollInstance = this.selectedMode === 'groupList' ? this.$refs.listScroll.osInstance() : this.$refs.wordslistScroll.osInstance();
      if (direction === 'left' || direction === 'right') {
         scrollInstance.scrollStop().scroll({
            y: 0 + 'px'
          });
        return;
      }
      const nextEle = this.selectedMode === 'groupList' ? this.$refs['groupItem' + nextIndex] : this.$refs['wordsItem' + nextIndex];
      const scrollDirection = direction === 'down' ? 'end' : 'begin';
      scrollInstance.scrollStop().scroll({ el: nextEle[0], block: { y: scrollDirection, x: 'nearest' }});
    },
    enterContent(text) {
      this.$emit('enterContent', text);
    },
    handleItemEnter() {
      if (this.selectedMode === 'groupList') {
        this.openChildList(this.groupList[this.selectedIndex]);
      } else {
        this.$emit('enterContent', this.quickWordslist[this.selectedIndex].content);
      }
    }

  }
};
</script>

<style lang="scss">
.quickWordPopover {
  padding: 0;
  border: 0;
  bottom: 50px;
  width: 100%;
  box-shadow: none;
  background: transparent;

  .quickWordContainer {
    height: auto;
    // min-height: 80px;
    max-height: 182px;
    display: flex;

    .content-scroll {
      height: 100%;
      max-height: 182px;
      -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      background-color:#fff;

    }

    .content-left {
      width: 160px;
    }

    .content-right {
      // flex-grow: 1;
      max-width: 80%;
      /*写给不支持calc()的浏览器*/
      max-width: -moz-calc(100% - 162px);
      max-width: -webkit-calc(100% - 162px);
      max-width: calc(100% - 162px);
      -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      border: 1px solid #EBEEF5;
      border-radius: 5px;
    }

    .noDataText {
      text-align: center;
      padding: 10px;
      width: 150px;
    }

    .wordsGroupList,
    .wordsList {
      padding: 6px;
      width: 160px;
      border-radius: 5px;
      min-height: 47px;
      background-color: #fff;

      &>li {
        position: relative;
        display: flex;
        align-items: center;
        // padding: 0 30px 0 20px;
        // height: 34px;
        line-height: 34px;
        outline: none;
        cursor: pointer;
        border-bottom: 1px solid #EBEEF5;

        // &:hover {
        //   background: #f5f7fa;
        // }

        &:last-child {
          border-bottom: 0px;
        }

        &.in-acitve {
          color: #409eff;
          font-weight: 700;
        }

        &.selected-active {
          color: #409eff;
          background: #f5f7fa;
        }

        &>span {
          flex: 1;
          padding: 0 10px;
          line-height: 20px;
          padding: 7px;
          // white-space: nowrap;
          // overflow: hidden;
          // text-overflow: ellipsis;
        }

        &>i {
          position: absolute;
          right: 10px;
        }
      }
    }

    .wordsGroupList {
      min-height: 80px;

      >li {
        padding-right: 20px;
      }
    }

    .wordsList {

      // margin-left: 1px;
      width: 100%;
      min-width: 160px;
    }

  }
}

.slide-enter-active {
  animation: slide-in .6s;
}

.slide-leave-active {
  animation: slide-in .1s reverse;
}

@keyframes slide-in {
  0% {
    transform: translate(0, -80%);
  }

  100% {
    transform: translate(0, 0);
  }
}
</style>
