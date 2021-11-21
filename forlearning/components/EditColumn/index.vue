<template>
  <div class="drawer-wrapper">
    <div class="drawer-header">
      <span class="drawer-title">
        {{ $t('columns.chooseColumns') }}
        <span class="label">{{ currentData.visibleList.length }}/{{ currentData.all.length }}</span>
      </span>
      <a class="close-drawer" @click="closeDrawer"><i class="el-icon el-icon-close" /></a>
    </div>
    <div class="drawer-body">
      <div class="drawer-body-scroll">
        <div class="search-wrapper">
          <el-input v-model="inputName" :placeholder="$t('columns.searchFields')" class="input-with-select" size="medium" @input="handSearch" />
        </div>
        <div class="column-wrapper visible">
          <div class="column-title">{{ $t('columns.visibleColumns') }}</div>
          <div class="column-list">
            <draggable v-model="currentData.visibleList" :options="options" @update="datadragEnd">
              <div v-for="(item,$index) in currentData.visibleList " :key="$index" class="drag-item" :class="{'required': item.required,'hide': item.hide}">
                <label @click="toWaiting(item,$index)"><span><i class="el-icon el-icon-check" /></span>{{ $t(fieldTranslate[item.name]) }}</label>
              </div>
            </draggable>
          </div>
        </div>
        <div v-for="(val,key) in groupData" :key="key" class="column-wrapper waiting">
          <div class="column-title">{{ $t(fieldTranslate[key]) }}</div>
          <div class="column-list">
            <div v-for="(item,$index) in val" :key="$index" class="drag-item" :class="{'hide': item.hide}">
              <label @click="toVisibel(item,$index)"><span />{{ $t(fieldTranslate[item.name]) }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="drawer-footer">
      <el-button size="small" @click="closeDrawer">{{ $t('btns.cancel') }}</el-button>
      <el-button
        v-if="permissionAll[$route.path] && permissionAll[$route.path].editField"
        type="success"
        size="small"
        :loading="dialogBtnLoading"
        @click="save"
      >{{ $t('btns.save') }}</el-button>
    </div>
  </div>
</template>

  <script>
  import { copy } from '@/utils/common';
  import draggable from 'vuedraggable';
  import { getAllColumns, setCustomColumns } from '@/api/common';
  import { mapGetters } from 'vuex';

  export default {
    name: 'CustomersDrawer',
    components: { draggable },
    props: {
      columns: {
        type: Object,
        required: true
      },
      pageName: {
        type: String,
        required: true
      },
      fieldTranslate: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        currentData: {
          visibleList: [],
          waitingList: [],
          all: []
        },
        groupData: {},
        dialogBtnLoading: false,
        inputName: null,
        options: {
          animation: 200,
          filter: '.undraggable',
          disabled: false
        }
      };
    },
    computed: {
      ...mapGetters([
        'permissionAll'
      ])
    },
    created() {
      this.initColumns();
    },
    mounted() {

    },
    methods: {
      datadragEnd(evt) {
        evt.preventDefault();
        // 遍历数组,将索引值赋值到对应的sort_order上面,完成排序
        // let arr = this.currentData.visibleList;
        // console.log(arr);
      },
      toWaiting(val, $index) {
        if (val.required) return;
        const item = this.currentData.visibleList.splice($index, 1);
        this.groupData[val.columnGroupId].splice(0, 0, item[0]);
      },
      toVisibel(val, $index) {
        if (val.required) return;
        const item = this.groupData[val.columnGroupId].splice($index, 1);
        this.currentData.visibleList.splice(this.currentData.visibleList.length, 0, item[0]);
      },
      closeDrawer(val) {
        const data = val || false;
        this.$emit('close', data);
      },
      getAllColumns() {
        return new Promise((resolve, reject) => {
          getAllColumns({ PageName: this.pageName, orderBy: 'position' }).then(res => {
            // console.log(res);
            resolve(res.results);
          });
          // resolve(this.currentData.all)
        });
      },
      initColumns() {
        Promise.all([this.getAllColumns()]).then((result) => {
          this.currentData.all = result[0];
          this.currentData.visibleList = copy(this.columns.columnSet);
          const ids = this.currentData.visibleList.map(item => item.id);

          // 对未显示的字段进行分组
          this.currentData.all.forEach(item => {
            if (!this.groupData[item.columnGroupId]) {
              this.$set(this.groupData, item.columnGroupId, []);
            }
            if (ids.indexOf(item.id) === -1) {
              this.groupData[item.columnGroupId].push(item);
            }
          });
        }, () => {

        }).catch((error) => {
          console.error(error);
        });
      },
      handSearch() {
        if (this.inputName) {
          this.options.disabled = true;
          this.currentData.visibleList.forEach((item, $index) => {
            if (this.$t(this.fieldTranslate[item.name]).toLowerCase().indexOf(this.inputName.toLowerCase()) === -1) {
              item.hide = true;
            } else {
              item.hide = false;
            }
          });
          for (const key in this.groupData) {
            this.groupData[key].forEach((item, $index) => {
              if (this.$t(this.fieldTranslate[item.name]).toLowerCase().indexOf(this.inputName.toLowerCase()) === -1) {
                item.hide = true;
              } else {
                item.hide = false;
              }
            });
          }
        } else {
          this.options.disabled = false;
          this.currentData.visibleList.forEach((item, $index) => {
            item.hide = false;
          });
          for (const key in this.groupData) {
            this.groupData[key].forEach((item, $index) => {
              item.hide = false;
            });
          }
        }
      },
      save() {
        const arr = this.currentData.visibleList;
        arr.forEach((item, i) => {
          item.position = i + 1;
        });
        // console.log(arr);
        const postData = copy(this.columns);
        postData.columnSet = JSON.stringify(arr);
        this.dialogBtnLoading = true;
        setCustomColumns(postData).then(res => {
          this.dialogBtnLoading = false;
          if (res.results) {
            this.$message({ type: 'success', message: this.$t('noticeMsg.saveSuccess') });
            this.closeDrawer('init');
          } else {
            this.$message({ type: 'error', message: this.$t('noticeMsg.saveFail') });
          }
        }).catch(error => { console.error(error) });
      }
    }
  };
  </script>

  <style scoped lang="scss">
  .drawer-wrapper {
    position: relative;
    height: 100%;
    background-color: #fdfdfd;
    color: #333;
    .drawer-header {
      padding: 5px 20px;
      color: #333;
      position: relative;
      border-bottom: 1px solid #cfd7df;
      .drawer-title {
        display: block;
        height: 40px;
        line-height: 40px;
        margin-right: 20px;
        span {
          display: inline;
          padding: 3px 6px;
          text-align: center;
          vertical-align: baseline;
          border-radius: 4px;
          background-color: #e5e5e5;
          font-size: 12px;
          position: relative;
          top: -2px;
        }
      }
      .close-drawer {
        display: block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        position: absolute;
        right: 10px;
        top: 15px;
        z-index: 1;
        i {
          font-size: 20px;
          color: #333;
          font-weight: 700;
        }
      }
    }
    .drawer-body {
      width: 100%;
      position: absolute;
      top: 51px;
      bottom: 53px;
      overflow: hidden;
      font-size: 14px;
      .drawer-body-scroll {
        width: 100%;
        height: 100%;
        padding: 0 20px;
        overflow-y: auto;
        .search-wrapper {
          padding: 20px;
          margin: 0 -20px;
          background-color: #fff;
          box-shadow: 0 1px 6px rgba(51,51,51,.05);
        }
        .column-wrapper {
          padding-bottom: 15px;
          margin-bottom: 15px;
          border-bottom: 1px solid #eee;
          .column-title {
            padding: 10px 0;
          }
          .column-list {
            .drag-item {
              margin: 0 -20px;
              padding: 7px 20px;
              cursor: grab;
              label {
                display: inline-block;
                height: 18px;
                line-height: 18px;
                cursor: pointer;
                color: #333;
                font-weight: 500;
                span {
                  display: inline-block;
                  width: 18px;
                  height: 18px;
                  line-height: 18px;
                  margin-right: 8px;
                  text-align: center;
                  background-color: #12344d;
                  vertical-align: middle;
                  border-radius: 4px;
                  i {
                    color: #fff;
                    font-weight: 700;
                  }
                }
              }
            }
            .drag-item:hover {
              background-color: #ebeff3;
            }
            .drag-item.required {
              label {
                cursor: default;
                color: #ccc;
                span {
                  background-color: #ccc;
                }
              }
            }
            .drag-item.hide {
              display: none;
            }
          }
        }
        .column-wrapper.waiting {
          .column-list {
            .drag-item {
              label {
                span {
                  border: 1px solid #e5e5e5;
                  background-color: #fff;
                }
              }
            }
          }
        }
      }
    }
    .drawer-footer {
      padding: 10px;
      text-align: right;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      border-top: 1px solid #cfd7df;
    }
  }
  </style>

