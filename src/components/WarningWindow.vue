<template>
  <div class="warningWindow">
    <div class="box">
      <ul>
        <li
          v-for="(item,index) in statusArray"
          :key="item"
          :class="{ error: item && (item.includes('设备异常状态，请检查设备') || updateObject[index] >= 30) }"
        >
          {{ item }}
          最后更新时间：
          <span class="danger">{{updateObject[index]}}分钟前</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { sortBy } from "lodash";

export default {
  name: "WarningWindow",
  mounted() {
    this.getTable();
  },
  props: {
    tableData: Array
  },
  data() {
    return {
      statusObject: {},
      errorSb: [],
      currentZt: {}
    };
  },
  methods: {
    // 获取表数据
    getTable() {
      axios
        .post("/cxall_post", {
          tablename: "qqhjl"
        })
        .then(res => {
          if (res?.data?.results) {
            const newArray = sortBy(res?.data?.results, ["sb", "updatedAt"]);

            let statusObject = {};

            newArray.forEach(item => {
              if (!statusObject[item.sb]) {
                statusObject[item.sb] = [];
              }
              statusObject[item.sb].push(item.qqzt);
              // 当前状态异常
              // if(item.qqzt === "密码错误" || item.qqzt === "冻结" || item.qqzt === "被用户冻结"|| item.qqzt === "设备锁"){
              if (statusObject[item.sb].length > 3) {
                statusObject[item.sb].shift();
              }
              this.statusObject = statusObject;
            });

            let lastUpdateObject = {};
            newArray.forEach(item => {
              lastUpdateObject[item.sb] = parseInt(
                (new Date() - new Date(item.updatedAt)) / (1000 * 60 * 60)
              );
              // lastUpdateObject[item.sb + "Update"] = item.updatedAt;
            });

            let currentZt = {};
            this.$nextTick(() => {
              this.tableData?.forEach(item => {
                currentZt[item.sb] = item.zt;
              });
              this.currentZt = currentZt;
            });
            // console.log(lastUpdateObject);
            this.lastUpdateObject = lastUpdateObject;
            this.timer = null;
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              this.getTable();
            }, 1000 * 60);
          }
        });
    }
  },
  computed: {
    updateObject: function() {
      return Object.entries(this.lastUpdateObject).map(([item, values]) => {
        if (values >= 30) {
          this.$nextTick(() => {
            if (this.currentZt[item] != "0") {
              window.speechSynthesis.speak(
                new window.SpeechSynthesisUtterance(
                  `${item}设备超过30分钟未更新，请检查设备`
                )
              );
            }
          });
        }
        return values;
      });
    },
    statusArray: function() {
      const errorObj = ["密码错误", "冻结", "被用户冻结", "设备锁"];
      return Object.entries(this.statusObject)
        .map(([item, values]) => {
          const isError = values.every(value => {
            return errorObj.includes(value);
          });
          if (isError) {
            this.$nextTick(() => {
              if (this.currentZt[item] != "0") {
                window.speechSynthesis.speak(
                  new window.SpeechSynthesisUtterance(
                    `${item}设备异常状态，请检查设备`
                  )
                );
              }
            });
          }
          // 不是停止状态，才报异常
          if (this.currentZt[item] && this.currentZt[item] != "0") {
            return `${item}：${[...values.reverse()].join(",")} ${
              isError ? "设备异常状态，请检查设备" : ""
            }`;
          }
        })
        .filter(item => item);
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
}
.warningWindow {
  position: fixed;
  right: 0;
  bottom: 0;
  font-size: 14px;
  color: black;
}
.box {
  width: 600px;
  height: 200px;
  overflow: auto;
  border: 1px solid;
  opacity: 0.5;
}
</style>
