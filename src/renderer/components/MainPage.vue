<template>
  <right-menu @action="rightMenuAction" :count="fileChooseCount">
    <el-row>
      <el-col>
        <div v-if="fileGroup.length < 1" style="">请选择工作空间</div>
        <div v-else v-for="(item, index) in fileGroup" :key="index">
          <img-group
            :id="`group_${index}`"
            :pics="item.pics"
            :groupName="item.name"
            @click="choose($event, index)"
          >
            <cc-input
              :value="item.name"
              @change="changeName($event, index)"
            ></cc-input>
          </img-group>
        </div>
      </el-col>
    </el-row>
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :title="directionTitle"
    >
      <div class="groupList">
        <div
          @click="doDirectionMethod(index)"
          v-for="(item, index) in fileGroup"
          :key="index"
        >
          <el-card class="box-card">
            <el-row>
              <el-col :span="7">
                <el-avatar
                  shape="square"
                  :size="50"
                  :fit="fit"
                  :src="item.pics[0] ? 'file://' + item.pics[0].path : ''"
                ></el-avatar>
              </el-col>
              <el-col :span="17">
                <el-row>{{ item.name }}</el-row>
                <el-row>{{ "目前" + item.pics.length + "张" }}</el-row>
                <el-row>-</el-row>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </div>
    </el-drawer>
  </right-menu>
</template>

<script>
import RightMenu from "./RightMenu";
import ImgGroup from "./ImgGroup";
import CcInput from "./CcInput";
export default {
  components: {
    RightMenu,
    ImgGroup,
    CcInput,
  },
  data: function () {
    return {
      drawer: false,
      direction: "ltr",
      directionMethod: "",
      directionTitle: "",
      fit: "cover",
      nowKey: "",
    };
  },
  computed: {
    fileGroup: function () {
      return this.$store.getters.fileGroup;
    },
    fileList: function () {
      return this.$store.getters.fileList;
    },
    fileChooseCount: function () {
      return this.$store.getters.fileChooseCount;
    },
  },
  mounted: function () {
    document.onkeydown = (e) => {
      this.nowKey = e.key.toLowerCase();
    };
    document.onkeyup = (e) => {
      this.nowKey = "";
    };
  },
  methods: {
    choose(index, group) {
      switch (this.nowKey) {
        case "shift":
          this.$store.dispatch("chooseto", `${group}-${index}`);
          break;
        default:
          this.$store.dispatch("choose", `${group}-${index}`);
          break;
      }
    },
    rightMenuAction(action) {
      switch (action) {
        case "createGroup":
          this.$store.dispatch("createGroup");
          break;
        case "moveToGroup":
          this.drawer = true;
          this.directionMethod = "moveTo";
          this.directionTitle = "移动至";
          break;
        case "jump":
          this.drawer = true;
          this.directionTitle = "定位至";
          this.directionMethod = "";
          break;
        case "delete":
          this.drawer = true;
          this.directionMethod = "deleteGroup";
          this.directionTitle = "删除";
          break;
        case "deleteEmpty":
          this.$store.dispatch("deleteEmptyGroup");
          break;
        case "revoke":
          this.$store.dispatch("revokeChoose");
          break;
        case "reversalGroup":
          this.drawer = true;
          this.directionMethod = "reversalChoose";
          this.directionTitle = "反选";
          break;
      }
    },
    doDirectionMethod(index) {
      console.log(index);
      if (this.directionMethod && this.directionMethod != "")
        this.$store.dispatch(this.directionMethod, index);
      else {
        console.log(index);
        location.hash = `group_${index}`;
        history.replaceState(
          null,
          document.title,
          location.pathname + location.search
        );
        console.log(location);
      }
      this.drawer = false;
    },
    changeName(name, index) {
      this.$store.dispatch("changeGroupName", { index, name });
    },
    cleanGroup() {
      this.$store.dispatch("cleanGroup");
    },
    handleClose() {},
  },
};
</script>
<style lang="scss">
.groupList {
  height: 90vh;
  overflow-y: auto;
  .box-card {
    margin: 1rem;
    .el-avatar > img {
      height: 8vw;
    }
  }
}
</style>