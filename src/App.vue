<template>
  <div>
    <!-- 登录 -->
    <div class="inlineBlock" v-if="!isLogin">
      <el-input v-model="password" class="inlineBlock setWidth" placeholder="请输入密码"></el-input>
      <el-button @click="login" class="inlineBlock">登录</el-button>
    </div>

    <div v-if="isLogin">
      <el-button @click="refresh">刷新数据</el-button>
      <span class="blank"></span>
      执行命令：
      <el-button type="success" @click="changezt('1')">运行</el-button>
      <el-button @click="changezt('0')" type="danger">停止</el-button>
      <el-button @click="changezt('2')" type="warning">更新脚本</el-button>
      <span class="blank"></span>

      <el-upload
        action="/"
        class="inlineBlock"
        accept=".txt"
        :before-upload="beforeUpload"
        :default-file-list="this.fileList"
      >
        <el-button type="primary" :disabled="this.fileList.length !== 0">上传QQ采集号</el-button>
      </el-upload>
      <!-- TODO封装 -->
      <el-upload
        action="/"
        class="inlineBlock"
        accept=".txt"
        :before-upload="beforeUpload1"
        :default-file-list="this.fileList1"
      >
        <el-button type="primary" :disabled="this.fileList1.length !== 0">上传QQ小号</el-button>
      </el-upload>

      <!-- QQ大号修改 -->
      <div class="inlineBlock">
        <el-input v-model="bigQQ" class="inlineBlock setWidth" placeholder="请输入要修改的大号"></el-input>
        <el-button @click="changeBigQQ" class="inlineBlock">修改大号</el-button>
      </div>

      <!-- 新增分组 -->
      <div class="inlineBlock">
        选中后新增分组：
        <el-input v-model="newGroupValue" class="inlineBlock setWidth" placeholder="请输入要新增的分组"></el-input>
        <el-button @click="addGroup" class="inlineBlock">新增分组</el-button>
      </div>
      <hr />
      <el-button type="success" @click="selectRowsBystatus('1')">批量选中运行状态</el-button>
      <el-button type="danger" @click="selectRowsBystatus('0')">批量选中停止状态</el-button>
      <el-button
        type="warning"
        style="margin-right:20px"
        @click="selectRowsBystatus('2')"
      >批量选中更新脚本状态</el-button>
      <!-- 修改分组 -->
      <div class="inlineBlock">
        选中加入分组：
        <el-select v-model="groupValue" class="inlineBlock setWidth" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button @click="selectChangeGroup" class="inlineBlock">选中后修改分组</el-button>
      </div>

      <!-- 搜索分组 -->
      <div class="inlineBlock">
        <el-input v-model="searchValue" class="inlineBlock setWidth" placeholder="请输入要搜索的字段"></el-input>
      </div>

      <div class="inlineBlock">
        <el-input v-model="wxh" class="inlineBlock setWidth" placeholder="请输入要修改的客户号"></el-input>
        <el-button @click="changeWXH" class="inlineBlock">修改客户号</el-button>
      </div>
      <hr />
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="0"></el-tab-pane>
        <el-tab-pane
          :key="item.value"
          v-for="item in options"
          :label="item.label"
          :name="item.value"
        ></el-tab-pane>
      </el-tabs>

      <!-- <el-input placeholder="" v-model="input2"> </el-input> -->
      <!-- <el-button>搜索</el-button> -->
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="getFilterRenderData"
        tooltip-effect="dark"
        style="width: 100%"
        max-height="600"
        @selection-change="handleSelectionChange"
        :default-sort="{ prop: 'sb' }"
      >
        <el-table-column fixed type="selection" width="55"></el-table-column>
        <!-- <el-table-column prop="objectId" label="objectId" ></el-table-column> -->
        <el-table-column sortable prop="sb" label="设备号"></el-table-column>
        <el-table-column sortable prop="wxh" label="客户号"></el-table-column>
        <el-table-column sortable prop="zt" label="运行状态">
          <template slot-scope="scope">
            <span v-show="scope.row.zt === '0'">
              <el-badge type="danger" class="item" is-dot></el-badge>停止
            </span>
            <span v-show="scope.row.zt === '1'">
              <el-badge type="success" class="item" is-dot></el-badge>运行
            </span>
            <span v-show="scope.row.zt === '2'">
              <el-badge type="warning" class="item" is-dot></el-badge>更新脚本
            </span>
          </template>
        </el-table-column>
        <el-table-column sortable prop="sx" label="私信"></el-table-column>
        <el-table-column sortable prop="kqsx" label="开启私信"></el-table-column>
        <el-table-column sortable prop="yzs" label="验证数"></el-table-column>
        <el-table-column sortable prop="yzs_real" label="真实验证数"></el-table-column>

        <el-table-column sortable prop="fz" label="分组"></el-table-column>
        <el-table-column sortable prop="hsxz" label="话术选择"></el-table-column>
        <el-table-column sortable prop="dh" label="大号"></el-table-column>
        <el-table-column sortable prop="dhms" label="登号模式"></el-table-column>
        <el-table-column prop="fs" label="小号记录" show-overflow-tooltip></el-table-column>
        <el-table-column sortable prop="wl" label="网络"></el-table-column>
        <el-table-column sortable prop="kssj" label="开始时间"></el-table-column>
        <!-- <el-table-column prop="updatedAt" label="上传时间"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间"></el-table-column>-->
      </el-table>
    </div>
    <Total :totalYZS="getTotalYSX" :totalSX="getTotalSX" :totalYZSReal="getTotalYZSReal" />
    <WarningWindow v-if="isLogin" :tableData="tableData" />
  </div>
</template>

<style>
body {
  min-width: 1600px;
}
.item {
  margin-top: 10px;
}
.blank {
  margin: 0 15px;
}
.inlineBlock {
  display: inline-block;
  margin-right: 10px;
}
.setWidth {
  width: 200px;
}
</style>
<script>
import axios from "axios";
import WarningWindow from "./components/WarningWindow";
import Total from "./components/Total";

export default {
  components: {
    WarningWindow,
    Total,
  },
  data() {
    return {
      tableData: [], // 基础数据
      renderData: [], // 展示数据
      multipleSelection: [], // 当前选中
      activeName: "0", // 当前选中的tab
      fileList: [], // 采集号
      fileList1: [], // QQ小号
      bigQQ: "", // 修改大号QQ
      options: [], // 分组选项
      groupValue: "", //
      searchValue: "", // 搜索字段
      newGroupValue: "", // 新增分组
      timer: null, // 轮询
      password: "",
      isLogin: false,
      wxh: "",
      loading: false,
    };
  },

  beforeCreate() {
    // 读取文件
    FileReader.prototype.reading = function (pms) {
      const { encode } = pms;
      let bytes = new Uint8Array(this.result); //无符号整型数组
      let text = new TextDecoder(encode || "UTF-8").decode(bytes);
      return text;
    };
    /* 重写readAsBinaryString函数 */
    FileReader.prototype.readAsBinaryString = function (f) {
      if (!this.onload)
        //如果this未重写onload函数，则创建一个公共处理方式
        this.onload = () => {
          //在this.onload函数中，完成公共处理
          let rs = this.reading();
          console.log(rs);
        };
      this.readAsArrayBuffer(f); //内部会回调this.onload方法
    };
  },

  mounted() {
    if (localStorage.getItem("login") === "xiao") {
      this.isLogin = true;
      this.getTable();
    }
    // 上传采集号
  },

  computed: {
    getFilterRenderData: function () {
      if (this.searchValue === "" || typeof this.searchValue === undefined) {
        return this.renderData;
      }
      return this.renderData.filter((item) => {
        return Object.values(item).some((item) => {
          return item.toString().includes(this.searchValue);
        });
      });
    },

    getTotalSX: function () {
      return this.tableData.reduce((prev, item) => {
        if (item.sx) {
          return Number(prev) + Number(item.sx);
        }
        return prev;
      }, 0);
    },

    getTotalYZSReal: function () {
      return this.tableData.reduce((prev, item) => {
        if (item.yzs_real) {
          return Number(prev) + Number(item.yzs_real);
        }
        return prev;
      }, 0);
    },

    getTotalYSX: function () {
      return this.tableData.reduce((prev, item) => {
        if (item.yzs) {
          return Number(prev) + Number(item.yzs);
        }
        return prev;
      }, 0);
    },
  },

  methods: {
    selectChangeGroup() {
      console.log(this.groupValue);
      if (this.groupValue !== "" && typeof groupValue !== undefined) {
        const obj = JSON.stringify({ fz: this.groupValue });
        this.updateServer("qqyz", obj);
      }
    },

    addGroup() {
      if (Number(this.newGroupValue) > 0) {
        const obj = JSON.stringify({ fz: this.newGroupValue });
        this.updateServer("qqyz", obj);
      }
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClick() {
      this.changeTabs();
    },

    updateServer(tablename, obj) {
      function requestUpdate(tablename, objectId, obj) {
        return axios
          .post("/xgsj", {
            tablename: tablename,
            objectId: objectId,
            data: obj,
          })
          .then((res) => {
            console.log(res);
          });
      }
      if (this.multipleSelection.length > 0) {
        const changeArr = this.multipleSelection.map((item) => {
          return requestUpdate(tablename, item.objectId, obj);
        });
        Promise.all(changeArr).then(() => {
          this.refresh();
        });
      } else {
        this.$message("未选中任何数据");
      }
    },

    changeBigQQ() {
       this.reCall()
      // 大号只能同时修改一个
      if (!this.bigQQ.includes("---")) {
        this.$message("大号格式有误");
        return;
      }
      if (this.multipleSelection.length === 0) {
        this.$message("未选中任何设备");
        return;
      }
      if (this.bigQQ !== "" && this.multipleSelection.length === 1) {
        const obj = JSON.stringify({ dh: this.bigQQ });
        this.updateServer("qqyz", obj);
      }
      if (this.multipleSelection.length > 1) {
        this.$message("大号仅支持单个修改");
      }
    },

    changeWXH() {
       this.reCall()
      if (this.wxh !== "") {
        const obj = JSON.stringify({ wxh: this.wxh });
        this.updateServer("qqyz", obj);
      }
    },

    // 修改状态
    changezt(zt) {
       this.reCall()
      const obj = JSON.stringify({ zt });
      this.updateServer("qqyz", obj);
    },

    // 刷新数据
    refresh() {
      clearTimeout(this.timer);
      this.timer = null;
      this.getTable(() => {
        this.changeTabs();
      });
    },

    // 登录
    login() {
      if (this.password === "xiao") {
        localStorage.setItem("login", "xiao");
        this.isLogin = true;
        this.getTable();
      }
    },

    selectRowsBystatus(zt) {
      this.reCall()
      const rows = this.getFilterRenderData.filter((item) => {
        return item.zt === zt;
      });
      this.$refs.multipleTable.clearSelection();
      this.$nextTick(() => {
        rows.forEach((item) => {
          this.$refs.multipleTable.toggleRowSelection(item);
        });
      });
    },

    selectRows() {
      this.reCall()
      const rows = this.getFilterRenderData.filter((item) => {
        return this.multipleSelection.some((it) => {
          return item.objectId == it.objectId;
        });
      });
      this.$nextTick(() => {
        rows.forEach((item) => {
          this.$refs.multipleTable.toggleRowSelection(item);
        });
      });
    },

    // 获取表数据
    getTable(callback) {
      // this.loading = true;
      axios
        .post("/cxall_post", {
          tablename: "qqyz",
        })
        .then((res) => {
          this.tableData = res?.data?.results;
          console.log(this.activeName)
          // 0是全部
          if (this.activeName != "0") {
            this.renderData = this.tableData.filter((item) => {
              if (this.activeName === "未分组") {
                return item.fz == "";
              }
              return item.fz == this.activeName;
            });
            console.log(this.renderData)
          } else {
            // console.log(res?.data?.results);
            this.renderData = res?.data?.results;
          }
          console.log(this.renderData);
          this.options = [
            ...Array.from(
              new Set(
                this.tableData.map((item) => {
                  return item.fz;
                })
              )
            ),
          ].filter(it=>it)
            .map((item) => {
              return {
                label: `${item === "" ? "未分" : item}组`,
                value: `${item === "" ? "未分组" : item}`,
              };
            })
            .sort((a, b) => {
              return a < b ? 1 : -1;
            });

          
          clearTimeout(this.timer);
          this.timer = null;
          this.timer = setTimeout(() => {
            this.getTable();
          }, 1000 * 60);

          if (callback) {
            callback();
          }
          this.selectRows();
        })
        .finally(() => {
          // this.loading = false;
        });
    },

    reCall(){
      clearTimeout(this.timer);
      this.timer = null;
      this.timer = setTimeout(() => {
        this.getTable();
      }, 1000 * 60);
    },

    changeTabs() {
      this.reCall()
      if (this.activeName == 0) {
        this.renderData = this.tableData;
        return;
      }
      this.renderData = this.tableData.filter((item) => {
        if (this.activeName === "未分组") {
          return item.fz == "";
        }
        return item.fz == this.activeName;
      });
    },

    beforeUpload(file) {
      this.reCall()
      this.fileList = [file];
      console.log("选择了文件beforeUpload");
      // 读取数据
      this.read(file, "qqsj");
      return false;
    },

    beforeUpload1(file) {
      this.reCall()
      this.fileList1 = [file];
      console.log("选择了文件beforeUpload");
      // 读取数据
      this.read(file, "qqh");
      return false;
    },

    // 上传qq采集 TODO: 上传成功和失败的收集
    uploadRequest(data, uploadServerFunctionName, uploadKEY) {
      this.reCall()
      console.log(data, uploadServerFunctionName, uploadKEY);
      axios
        .post(uploadServerFunctionName, {
          [uploadKEY]: data,
        })
        .then((res) => {
          console.log(res);
          this.$message({ type: "success", message: "上传成功" });
        })
        .catch(() => {
          this.$message({ type: "error", message: "上传失败" });
        });
    },

    read(f, from) {
      let rd = new FileReader();
      rd.onload = () => {
        //this.readAsArrayBuffer函数内，会回调this.onload函数。在这里处理结果
        let cont = rd.reading({ encode: "utf-8" });
        let formerData = this.textData;
        this.textData = formerData + "\n" + cont;
        let uploadServerFunctionName; // 表名
        let uploadKEY; // 字段名
        if (from === "qqh") {
          // 小号
          this.fileList1 = [];
          (uploadServerFunctionName = "/addqqh"), (uploadKEY = "qq");
        } else {
          // 采集
          uploadServerFunctionName = "/add";
          this.fileList = [];
          uploadKEY = "uin";
        }

        this.$message({
          type: "success",
          message: "文件读取成功，开始上传数据",
        });

        try {
          cont.split("\n").forEach((item) => {
            this.uploadRequest(item, uploadServerFunctionName, uploadKEY);
          });
        } catch (err) {
          console.log(err);
        }
      };
      rd.readAsBinaryString(f);
    },
  },
};
</script>
