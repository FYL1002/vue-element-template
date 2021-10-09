<template>
    <div>
        <div class="table-title">成绩表</div>
        <el-table
            :data="tableData"
            stripe
            style="width:100%"
        >
            <el-table-column label="学号" prop="id" min-width="150">
            </el-table-column>
            <el-table-column label="姓名" prop="name" min-width="150">
            </el-table-column>
            <el-table-column label="数学" prop="math" min-width="120">
            </el-table-column>
            <el-table-column label="语文" prop="chinese" min-width="120">
            </el-table-column>
            <el-table-column label="英语" prop="english" min-width="120">
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
import { getMyTableList } from '@/api/mydata'
export default {
    name: "MyTable",
    data() {
        return {
            tableData: []
        }
    },
    created (){
        getMyTableList().then(
            res => {
                this.tableData = res.data.data;
            },
            error => {
                console.log(error);
            }
        )
    },
    mounted (){

    }
}
</script>

<style scoped>
.table-title {
    text-align: center;
    padding: 30px 0;
    font-size: 24px;
    color: #999;
    border-bottom: 2px solid #eee;
}
</style>