<template>
  <div class="css-1ob8ues css-1a49fo60">
    <div class="css-151x0d2 css-1a49fo61">
      <div class="wHeight">
        <el-tabs v-model="activeName" @tab-click="tabClickFn">
          <el-tab-pane name="All">
            <span slot="label">所有客户（{{ customerGlobal.All.length }}）</span>
          </el-tab-pane>
          <el-tab-pane name="ChattingFilterMonitor">
            <span slot="label">对话中（{{ customerGlobal.ChattingFilterMonitor.length }}）</span>
          </el-tab-pane>
          <el-tab-pane name="Monitor">
            <span slot="label">监控中（{{ customerGlobal.Monitor.length }}）</span>
          </el-tab-pane>
          <el-tab-pane name="Queued">
            <span slot="label">排队中（{{ customerGlobal.Queued.length }}）</span>
          </el-tab-pane>
          <el-tab-pane name="WaitingReply">
            <span slot="label">等待回复（{{ customerGlobal.WaitingReply.length }}）</span>
          </el-tab-pane>
          <el-tab-pane name="Browsing">
            <span slot="label">浏览中（{{ customerGlobal.Browsing.length }}）</span>
          </el-tab-pane>
          <el-tab-pane name="LeftWebSite">
            <span slot="label">已离开（{{ customerGlobal.LeftWebSite.length }}）</span>
          </el-tab-pane>
        </el-tabs>

        <div class="searchRow">
          <el-tooltip content="编辑列" placement="top">
            <div v-if="permissionAll[$route.path] && permissionAll[$route.path].viewField" class="edit-column" @click="showDrawer">
              <svg-icon icon-class="column2" />
            </div>
          </el-tooltip>
        </div>

        <u-table
          id="elementTale"
          ref="plTable"
          v-loading="tableLoading"
          :data="tableData"
          border
          :max-height="tableHeight"
          highlight-current-row
          use-virtual
          :data-changes-scroll-top="false"
          @selection-change="selectTable"
          @row-click="rowClick"
        >
          <!-- <u-table-column type="selection" width="40" fixed></u-table-column> -->
          <u-table-column :label="$t('commonFields.operation')" width="130" fixed>
            <template slot-scope="{row}">
              <!-- 排队中和浏览中 -->
              <el-button v-if="(row.status==2||row.status==5)&&(permissionAll[$route.path] && permissionAll[$route.path].startChat)" type="primary" size="small" @click="startChat(row)">开始对话
              </el-button>
              <!-- 对话中 -->
              <router-link v-if="row.agentUserId==member.id&&row.status==0&&(permissionAll[$route.path] && permissionAll[$route.path].chatList)" :to="'/customers/chats?id='+row.id">
                <el-button class="go-chat" type="success" size="small">去聊天</el-button>
              </router-link>
              <!-- 加入监控 -->
              <el-button v-if="row.agentUserId!==member.id&&row.status==0&&(permissionAll[$route.path] && permissionAll[$route.path].monitorChat)&&!isMonitor(row)" :loading="row.addMonitorChatLoading" type="primary" size="small" @click="addMonitorChat(row)">加入监控</el-button>
              <el-dropdown v-if="row.agentUserId!==member.id&&row.status==0&&isMonitor(row)" type="primary" split-button size="small">
                更多菜单
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <router-link :to="'/customers/chats?id='+row.id">查看聊天</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item><div @click="cancelMonitorChat(row)">取消监控</div></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </u-table-column>
          <u-table-column
            v-for="item in tableColumnSet"
            :key="item.id"
            :label="$t(tableField[item.name].label)"
            :min-width="tableField[item.name].minWidth"
            :prop="tableField[item.name].prop"
            :sortable="tableField[item.name].sortable"
            :show-overflow-tooltip="tableField[item.name].tooltip"
          >
            <template slot-scope="{row}">
              <div v-if="tableField[item.name].prop === 'status'">
                <span v-if="row.status!=null">{{ $t('enum.customerstatus.'+row.status) }}<span v-if="row.status==2&&row.waitCount">({{ row.waitCount|countFormat }})</span></span>
              </div>
              <div v-else-if="tableField[item.name].prop === 'email'">
                <span>{{ row.email | decryptEntity }}</span>
              </div>
              <div v-else-if="tableField[item.name].prop === 'lastActiveOn'">
                <span>{{ row.lastActiveOn | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
              </div>
              <div v-else>
                {{ row[tableField[item.name].prop] }}
              </div>
            </template>
          </u-table-column>
          <!-- <u-table-column :label="'客户邮箱'" min-width="108" prop="email" sortable :show-overflow-tooltip="true">
            <template slot-scope="{row}">
              <span>{{ row.email | decryptEntity }}</span>
            </template>
          </u-table-column>
          <u-table-column :label="'客户姓名'" min-width="108" prop="name" sortable :show-overflow-tooltip="true" />
          <u-table-column :label="'客服名称'" min-width="108" prop="agentUserName" sortable :show-overflow-tooltip="true" />
          <u-table-column :label="'状态'" min-width="106" prop="status" sortable :show-overflow-tooltip="true">
            <template slot-scope="{row}">
              <span v-if="row.status!=null">{{ $t('enum.customerstatus.'+row.status) }}<span v-if="row.status==2&&row.waitCount">({{ row.waitCount|countFormat }})</span></span>
            </template>
          </u-table-column>
          <u-table-column
            :label="'上次会话时间'"
            min-width="125"
            prop="lastActiveOn"
            sortable
            :show-overflow-tooltip="true"
          >
            <template slot-scope="{row}">
              <span>{{ row.lastActiveOn | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </u-table-column>
          <u-table-column :label="'最近浏览页面'" prop="lastBrowsePage" min-width="125" :show-overflow-tooltip="true" />
          <u-table-column :label="'客户IP'" prop="ip" min-width="155" /> -->
        </u-table>

        <!-- <pagination
          :total="paging.total"
          :pager-count="5"
          :page.sync="paging.currentPage"
          :limit.sync="paging.pageSize"
          @pagination="getList"
        /> -->
      </div>
    </div>
    <right-page v-if="rightPageBool" ref="RightPage" :dialog-form-data="currentRow" @save="rightPageSave" />

    <el-drawer class="el-drawer-wrapper" :visible.sync="drawer.show" :with-header="false" :before-close="closeDrawer">
      <drawer :columns="drawer.columns" :page-name="drawer.pageName" :field-translate="drawer.fieldTranslate" @close="closeDrawer" />
    </el-drawer>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex';
  import {
    elementSize, countFormat
  } from '@/utils/common';
  import enumFun from '@/utils/enum';
  import {
    getCustomersGruopList,
    monitorChatAdd,
    monitorChatEdit
  } from '@/api/customers';
  import {
    customerPickChat
  } from '@/api/chats';
  import { getCustomColumns } from '@/api/common';
  import RightPage from './index.rightpage';
  import Drawer from '@/components/EditColumn';
  let timer;
  export default {
    name: 'CustomersList',
    components: {
      RightPage,
      Drawer
    },
    filters: {
      countFormat
    },
    data() {
      return {
        paging: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        initParam: {
          Skip: 0,
          Take: 10,
          orderByDesc: 'lastActiveOn',
          StatusNotEqualTo: 'LeftWebSite'
        },
        activeName: 'All',
        tableData: [],
        selectionData: [],
        dialogData: {},
        dialogBool: false,
        tableLoading: false,
        tableIndexObj: {},
        startChatRecord: {},
        customerStatus: enumFun('customerStatus'),
        // 缓存客户的数据
        customerGlobal: {
          'All': [],
          'Chatting': [],
          'Monitor': [],
          'Queued': [],
          'WaitingReply': [],
          'Browsing': [],
          'Invited': [],
          'LeftWebSite': [],
          'ChattingFilterMonitor': []
        },
        currentRow: null,
        rightPageBool: false,
        drawer: {
          show: false,
          columns: {},
          pageName: 'Customer',
          fieldTranslate: {
            Name: 'commonFields.cusName',
            Email: 'commonFields.cusEmail',
            AgentUserName: 'commonFields.cusAgentUserName',
            AgentNickName: 'commonFields.receptionAgent',
            Status: 'commonFields.cusStatus',
            LastActiveOn: 'commonFields.cusLastActiveOn',
            LastBrowsePage: 'commonFields.cusLastBrowsePage',
            IP: 'commonFields.cusIp',
            OS: 'commonFields.cusOs',
            UserAgent: 'commonFields.cusUserAgent',
            '01ae78b7-d532-11ea-b952-0c9d928123b6': 'columns.basicFields',
            '09d21981-d532-11ea-b952-0c9d928123b6': 'columns.otherFields'
          }
        },
        tableColumnSet: [],
        tableField: {
          Email: {
            label: 'commonFields.cusEmail',
            minWidth: 108,
            prop: 'email',
            sortable: true,
            tooltip: true
          },
          Name: {
            label: 'commonFields.cusName',
            minWidth: 108,
            prop: 'name',
            sortable: true,
            tooltip: true
          },
          AgentUserName: {
            label: 'commonFields.cusAgentUserName',
            minWidth: 108,
            prop: 'agentUserName',
            sortable: true,
            tooltip: true
          },
          AgentNickName: {
            label: 'commonFields.receptionAgent',
            minWidth: 108,
            prop: 'agentNickName',
            sortable: true,
            tooltip: true
          },
          Status: {
            label: 'commonFields.cusStatus',
            minWidth: 80,
            prop: 'status',
            sortable: true,
            tooltip: true
          },
          LastActiveOn: {
            label: 'commonFields.cusLastActiveOn',
            minWidth: 155,
            prop: 'lastActiveOn',
            sortable: true,
            tooltip: true
          },
          LastBrowsePage: {
            label: 'commonFields.cusLastBrowsePage',
            minWidth: 155,
            prop: 'lastBrowsePage',
            sortable: true,
            tooltip: true
          },
          IP: {
            label: 'commonFields.cusIp',
            minWidth: 108,
            prop: 'ip',
            sortable: true,
            tooltip: true
          },
          OS: {
            label: 'commonFields.cusOs',
            minWidth: 108,
            prop: 'os',
            sortable: true,
            tooltip: true
          },
          UserAgent: {
            label: 'commonFields.cusUserAgent',
            minWidth: 155,
            prop: 'userAgent',
            sortable: true,
            tooltip: true
          }
        }
      };
    },
    computed: {
      ...mapGetters([
        'tableHeight',
        'permissionAll',
        'member',
        'isServiceOpen'
      ])
    },
    created() {
      this.init();
      // this.getCustomersGruopList();

      // 接收 mian.js  的推送
      this.$root.eventHub.$on('ReceiveCustomerStatus', (data) => {
        if (data && data.id) {
          !data.lastActiveOn && (data.lastActiveOn = ''); // 处理表格时间排序问题
          const cusid = data.id;
          const preStatus = data.preStatus;
          const status = data.status;
          var allCustomerData = this.customerGlobal['All'] || [];
          // 只处理状态变更的情况
          // if (preStatus !== status) {
            // 前状态
            if (preStatus !== null) {
              this.deleteCustomerGlobalStatueItem(preStatus, cusid);
              // 如果不是离开 所有的客户的列 要删除操作
              if (preStatus === 6) {
                for (var k = 0; k < allCustomerData.length; k++) {
                  // 如果preStatusc 存在，删除数据
                  if (allCustomerData[k].id === cusid) {
                    this.customerGlobal['All'].splice(k, 1);
                  }
                }
              }

              // 如果以前的状态是0,将对话中、监控中的数据删除
              if (preStatus === 0 && status !== 0) {
                this.deleteCustomerGlobalStatueItem(1, cusid);
                this.deleteCustomerGlobalStatueItem(7, cusid);
              }
            }
            // 现状态
            if (status !== null) {
              // z状态的数组直接加数据
              this.customerGlobal[this.customerStatus[status]].unshift(data);

              // 所有的客户的列 要更新操作
              var exitBoolAll = false;
              for (var l = 0; l < allCustomerData.length; l++) {
                if (allCustomerData[l].id === cusid) {
                  exitBoolAll = true; // true说明存在
                  if (status === 6) {
                    // 如果status 存在，删除
                    this.customerGlobal['All'].splice(l, 1);
                  } else {
                    // 如果status 存在，更新数据
                    this.$set(this.customerGlobal['All'], l, data);
                    // this.customerGlobal["All"][l].status = status
                    // this.customerGlobal["All"][l].email = data.email
                    // this.customerGlobal["All"][l].userName = data.userName
                    // this.customerGlobal["All"][l].name = data.name
                  }
                }
              }
              if (!exitBoolAll && status !== 6) {
                // 不存在 新增
                this.customerGlobal['All'].unshift(data);
              }
              if (status === 0 && (data.monitors === null || data.monitors.length === 0)) {
                // 对话中&&monitors为空数组为取消监控
                this.deleteCustomerGlobalStatueItem(1, cusid);
                if (data.agentUserId === this.member.id) {
                  for (var n = 0; n < this.customerGlobal['ChattingFilterMonitor'].length; n++) {
                    if (this.customerGlobal['ChattingFilterMonitor'][n].id === cusid) {
                      this.$set(this.customerGlobal['ChattingFilterMonitor'], n, data);
                      break;
                    }
                  }
                } else {
                  this.customerGlobal['ChattingFilterMonitor'].unshift(data);
                }
              }
              if (status === 0 && data.monitors && data.monitors.length > 0) {
                // 推送监控中的消息时，处理对话中和监控中的数组
                const exist = data.monitors.some(item => item.monitorAgentUserId === this.member.id);
                const existMonitor = this.customerGlobal['Monitor'].some(item => item.id === cusid);
                if (exist && !existMonitor) {
                  this.deleteCustomerGlobalStatueItem(7, cusid);
                  this.customerGlobal['Monitor'].unshift(data);
                }
                if (!exist && existMonitor) {
                  this.deleteCustomerGlobalStatueItem(1, cusid);
                  this.customerGlobal['ChattingFilterMonitor'].unshift(data);
                }
              }
              this.tableData = this.customerGlobal[this.activeName];
              this.currentRow && data.id === this.currentRow.id && (this.currentRow = data);

              this.$forceUpdate();
              this.doneInterval();

              if (status === 0 && preStatus === 5 && this.startChatRecord[cusid] && data.agentUserId === this.member.id) {
                // 点击开始对话，分配到客服后，如果分配到自己，跳转到对话列表
                this.$router.push({
                  path: '/customers/chats',
                  query: { id: cusid }
                });
              }
            }
          // }
        }
      });
      // 接收 mian.js  的推送
      // this.$root.eventHub.$on('updateCustomers', (data) => {
      //   if (this.activeName === 'All') {
      //     this.tableData = this.$root.customerGlobal['All']
      //   }
      // })
    },
    mounted() {
      this.$nextTick(() => {
        elementSize();
      });
      // if (this.activeName === 'All') {
      //   this.tableData = this.$root.customerGlobal['All']
      // }
    },
    beforeDestroy() {
      this.closeInterval();
      this.$root.eventHub.$off('ReceiveCustomerStatus');
    },
    methods: {
      // 获取客户的全部数据 存全局
      getCustomersGruopList() {
        var customerParams = {
          orderByDesc: 'updatedOn',
          v: Math.random()
        };
        this.tableLoading = true;
        getCustomersGruopList(customerParams).then(data => {
          this.tableLoading = false;
          var dataRespon = data;
          if (dataRespon && dataRespon.length !== 0) {
            dataRespon.forEach((item) => {
              if (item.key && item.value) {
                item.value.forEach(i => {
                  // lastActiveOn为null转为'',处理表格时间排序问题
                  !i.lastActiveOn && (i.lastActiveOn = '');
                  if (item.key === 'Chatting') {
                    if (i.monitors && i.monitors.length && i.monitors.some(item => item.monitorAgentUserId === this.member.id)) {
                      this.customerGlobal['Monitor'].push(i);
                    } else {
                      this.customerGlobal['ChattingFilterMonitor'].push(i);
                    }
                  }
                });
                this.customerGlobal[item.key] = item.value;
              }
            });
            // this.$root.eventHub.$emit("updateCustomers", {})
            this.tableData = this.customerGlobal[this.activeName];
            this.customerGlobal.Queued.length && this.openInterval();
          }
        }).catch(respon => {
          this.tableLoading = false;
        });
      },
      tabClickFn(obj) {
        if (this.customerGlobal[obj.name]) {
          this.tableData = this.customerGlobal[obj.name];
          this.currentRow = this.tableData[0];
          this.closeInterval();
          this.doneInterval();
        }
      },
      startChat(row) {
        const tipsStorege = localStorage.getItem('ServiceSwitchTips' + this.member.id);
        if (!this.isServiceOpen && tipsStorege) {
          // 暂停服务&&不再提示
          this.pickChat(row);
        } else {
          const html = '<p><input type="checkbox" id="serviceSwitchTips" value="checked"> <label for="serviceSwitchTips" class="service-switch-tips-label">勾选后不再提示此弹窗</label></p>';
          this.$msgbox({
            title: '当前账号为‘暂停服务’状态，是否需要开启服务？',
            message: html,
            dangerouslyUseHTMLString: true,
            customClass: 'service-switch-msgbox',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                const checked = document.getElementById('serviceSwitchTips').checked;
                this.$root.eventHub.$emit('OpenServiceSwitch', checked);
                this.pickChat(row);
              }
              done();
            }
          }).catch(e => e);
        }
        if (this.isServiceOpen) {
          this.pickChat(row);
        }
      },
      pickChat(row) {
        var startParams = {
          customerId: row.id,
          v: Math.random()
        };
        customerPickChat(startParams).then(resp => { // 修改
          if (resp.isOK) {
            this.startChatRecord[row.id] = true;
          } else {
            if (resp.responseStatus && resp.responseStatus.errorCode === 'Received') {
              this.$message.error({
                message: '该客户已被分配到其他客服',
                duration: 2000
              });
            } else {
              this.$message.error({
                message: '开始对话失败',
                duration: 2000
              });
            }
          }
        }).catch((error) => { console.error(error) });
      },
      // sortChange(val) {
      //   // console.log(val);
      //   if (val.order === 'ascending') {
      //     this.initParam.orderBy = val.prop
      //     delete this.initParam.orderByDesc
      //   } else if (val.order === 'descending') {
      //     this.initParam.orderByDesc = val.prop
      //     delete this.initParam.orderBy
      //   } else {
      //     this.initParam.orderByDesc = 'lastActiveOn'
      //     delete this.initParam.orderBy
      //   }
      //   this.getList()
      // },
      selectTable(val) {
        this.selectionData = val;
      },
      rowClick(val) {
        this.currentRow = val;
        this.rightPageBool = true;
      },
      // getList() {
      //   this.tableLoading = true;
      //   this.initParam.Take = this.paging.pageSize;
      //   this.initParam.Skip = (this.paging.currentPage - 1) * this.initParam.Take;
      //   // console.log(this.initParam)
      //   getCustomersList(this.initParam).then(data => {
      //     this.tableData = data.results || [];

      //     //遍历，，保存id 为key  的index  优化推送消息频繁for循环列表数据
      //     this.refreshIndex()

      //     this.paging.total = data.total;

      //     setTimeout(() => {
      //       this.tableLoading = false;
      //     }, 500)
      //   }).catch(respon => {
      //     this.tableLoading = false;
      //   });
      // },
      refreshIndex() {
        this.tableIndexObj = {};
        for (const i in this.tableData) {
          // 遍历，，保存id 为key  的index  优化推送消息频繁for循环列表数据
          this.tableIndexObj[this.tableData[i].id] = i;
        }
      },
      rightPageSave(val) {
        this.rightPageBool = false;
      },
      openInterval() {
        const countInterval = () => {
          // this.tableData=this.tableData.map((item)=>{
          //   if(item.status==2){
          //     !item.waitCount&&(item.waitCount=parseInt((new Date().getTime()-new Date(item.updatedOn||'').getTime())/1000));
          //     item.waitCount++;
          //   }
          //   return item;
          // })
          this.tableData.forEach((item, i) => {
            if (item.status === 2) {
              !item.waitCount && (item.waitCount = parseInt((new Date().getTime() - new Date(item.updatedOn || '').getTime()) / 1000));
              item.waitCount++;
              this.tableData.splice(i, 1, item);
            }
          });
        };
        countInterval();
        timer = setInterval(countInterval, 1000);
      },
      closeInterval() {
        timer && (clearInterval(timer), timer = null);
      },
      doneInterval() {
        if (timer) { // 如果定时器开启，当前tab不在All和排队中则关掉定时器
          !this.customerGlobal.Queued.length || (this.activeName !== 'Queued' && this.activeName !== 'All') && this.closeInterval();
        } else { // 如果定时器未开启，当前tab在All或排队中且有排队数据则开启定时器
          this.customerGlobal.Queued.length && (this.activeName === 'Queued' || this.activeName === 'All') && this.openInterval();
        }
      },
      init() {
        // 查列表排序
        getCustomColumns({ PageName: 'Customer', v: Math.random() }).then(res => {
          if (res) {
            this.drawer.columns = res;
            // 先清空再$nextTick赋值，处理数据改变但无渲染的问题
            if (this.tableColumnSet.length) {
              this.$set(this, 'tableColumnSet', []);
            }
            this.$nextTick(() => {
              this.$set(this, 'tableColumnSet', res.columnSet);
            });
          }
        });
        this.getCustomersGruopList();
      },
      showDrawer() {
        this.drawer.show = true;
      },
      closeDrawer(val) {
        this.drawer.show = false;
        if (val === 'init') {
          this.init();
        }
      },
      deleteCustomerGlobalStatueItem(statue, cusid) {
        const typeCustomerData = this.customerGlobal[this.customerStatus[statue]] || [];
        for (var i = 0; i < typeCustomerData.length; i++) {
          // 如果preStatusc 存在，删除数据
          if (typeCustomerData[i].id === cusid) {
            this.customerGlobal[this.customerStatus[statue]].splice(i, 1);
            break;
          }
        }
      },
      addMonitorChat(row) {
        this.$set(row, 'addMonitorChatLoading', true);
        const otherActiveName = this.activeName === 'All' ? 'ChattingFilterMonitor' : 'All';
        for (var i = 0; i < this.customerGlobal[otherActiveName].length; i++) {
          if (row.id === this.customerGlobal[otherActiveName][i].id) {
            this.$set(this.customerGlobal[otherActiveName][i], 'addMonitorChatLoading', true);
            break;
          }
        }
        monitorChatAdd({ CustomerId: row.id }).then((data) => {});
      },
      cancelMonitorChat(row) {
        monitorChatEdit({ CustomerId: row.id }).then((data) => {
          // console.log(data);
        });
      },
      isMonitor(row) {
        if (!row.monitors || row.monitors.length === 0) {
          return false;
        }
        return row.monitors.some(item => item.monitorAgentUserId === this.member.id);
      }
    }
  };

</script>
<style lang='scss' scoped>
  .el-tabs>>>.el-tabs__header {
    margin: 0;
  }

  .el-tabs>>>.el-tabs__nav-wrap {
    padding-left: 20px;
  }

  .el-tabs>>>.el-tabs__item {
    height: 52px;
    line-height: 52px;
  }
  .el-table>>>.el-table__fixed-body-wrapper .el-dropdown {
    background-color: chocolate !important;
  }
  .wHeight>>>.el-table .el-table__fixed-body-wrapper button.go-chat {
    padding-left: 21px;
    padding-right: 21px;
  }
  .wHeight>>>.el-table__fixed-body-wrapper .el-dropdown .el-dropdown__caret-button {
    height: 32px;
  }
  .searchRow {
    right: 44px;
    .edit-column {
      width: 36px;
      height: 36px;
      line-height: 38px;
      border-radius: 2px;
      border: 1px solid #e5e5e5;
      text-align: center;
      position: absolute;
      right: -40px;
      top: 0;
      cursor: pointer;
      svg {
        font-size: 24px;
        color: #999;
      }
    }
  }

</style>
<style>
  .el-message-box__wrapper .service-switch-msgbox .el-message-box__title {
    font-size: 16px;
  }
  .el-message-box__wrapper .service-switch-msgbox #serviceSwitchTips {
    width: 14px;
    height: 16px;
    vertical-align: text-bottom;
  }
  .el-message-box__wrapper .service-switch-msgbox .service-switch-tips-label {
    font-weight: 500;
  }
</style>
