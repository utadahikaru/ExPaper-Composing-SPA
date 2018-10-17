<template>
  <div class="bqteam-main-wrap-inner">
    <div class="sjyl">

      <div class="head">
        <el-button type="text" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
        <span class="ml">{{paperTitle}}</span>
      </div>

      <div class="paper-preview">
        <!-- 试题内容 -->
        <div class="paper-content">
          <paper-content></paper-content>
          <paper-content-styled ref="paperContentStyled" v-show="false"></paper-content-styled>
        </div>

        <!-- 右侧操作栏 -->
        <div class="operation">
          <el-button class="paper-download-btn" type="primary" icon="el-icon-download" @click="clickDownloadPaperBtn">组卷下载</el-button>
          <div class="paper-operate">
            <el-button class="operation-btn" size="small" @click="showScoreSetting = true" icon="el-icon-setting">分值设置</el-button>
            <!-- <el-button class="operation-btn" size="small" @click="showPaperAnswerCard = true" icon="el-icon-printer">下载答题卡</el-button> -->
          </div>

          <!-- 试卷结构设置 -->
          <papre-struct/>

          <!-- 试题统计 -->

          <paper-statistics :exerciseListClassified="exerciseListClassified" />

          <!-- 难度统计 -->

          <paper-difficulty :exerciseList="exerciseList" />

          <!-- 知识点统计 -->
          <paper-knowledgepoint :exerciseList="exerciseList" />

        </div>
      </div>

      <!-- 分值设置面板 -->
      <el-dialog title="分值设置" :visible.sync="showScoreSetting">
        <paper-score/>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showScoreSetting = false">取 消</el-button>
          <el-button type="primary" @click="showScoreSetting = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 下载试卷面板 -->
      <el-dialog title="下载时是否合并试卷与答案？" :visible.sync="showDownloadOption">
        <span>如果您只想打印一份答案，建议选择不合并</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="downloadPaper(true)">合 并</el-button>
          <el-button type="primary" @click="downloadPaper(false)">不合并</el-button>
        </span>
      </el-dialog>

      <!-- 答题卡面板 -->
      <el-dialog title="下载答题卡" :visible.sync="showPaperAnswerCard">
        <label class="radio"><input type="radio" value="0" v-model="paperAnswerCardStyle" />普通答题卡</label>
        <label class="radio"><input type="radio" value="1" v-model="paperAnswerCardStyle" />机读答题卡</label>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showPaperAnswerCard = false">取 消</el-button>
          <el-button type="primary" @click="showPaperAnswerCard = false">下 载</el-button>
        </span>
      </el-dialog>

      <!-- 完成组卷面板 -->
      <el-dialog title="完成组卷" :visible.sync="showPaperDown">
        <span>完成组卷之后，您将不能对该组卷做修改，确认完成？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showPaperDown = false">取 消</el-button>
          <el-button type="primary" @click="setPaperDown">完 成</el-button>
        </span>
      </el-dialog>

    </div>
  </div>

</template>

<script>
import papreStruct from "./components/paper-struct"
import paperStatistics from "./components/paper-statistics"
import paperKnowledgepoint from "./components/paper-knowledgepoint"
import paperDifficulty from "./components/paper-difficulty"
import paperScore from "./components/paper-score"
import paperContent from "./components/paper-content"
import paperContentStyled from "./components/paper-content-styled"
import {
  MOVE_TYPE,
  MOVE_EXERCISE,
  REMOVE_TYPE,
  REMOVE_EXERCISE
} from "@/store/mutation-types";

export default {
  components: {
    papreStruct,
    paperStatistics,
    paperKnowledgepoint,
    paperDifficulty,
    paperScore,
    paperContent,
    paperContentStyled
  },
  data () {
    return {
      //分值设置面板
      showScoreSetting: false,
      //下载试卷面板
      showDownloadOption: false,
      //下载答题卡面板
      showPaperAnswerCard: false,
      //下载答题卡面板
      showPaperDown: false,

      paperAnswerCardStyle: "0",
    };
  },
  computed: {
    paperTitle () {
      return this.$store.state.paper.paper.paperTitle;
    },

    paperAnswerStyle () {
      return this.$store.state.paperStruct.paperAnswerStyle;
    },

    exerciseList () {
      return this.$store.state.paper.exerciseInfoList;
    },

    exerciseListClassified () {
      return this.$store.state.paper.exerciseListClassified;
    }
  },
  mounted () {
    this.checkPaperExist();
  },
  methods: {
    // 检查试卷是否存在，如果不存在（用户刷新了页面）就返回到试卷列表页面
    checkPaperExist () {
      if (this.$store.state.paper.paper.paperTitle === undefined) {
        this.$router.go(-1);
      }
    },

    // 点击下载试卷按钮
    clickDownloadPaperBtn () {
      if (this.paperAnswerStyle === "end") {
        // 此时答案在试卷后面，需要询问答案与试题是否下载在同一个pdf文件里
        this.showDownloadOption = true;
      } else {
        // 此时答案在题目后面或者没有答案，直接下载试卷即可
        this.$refs.paperContentStyled.downloadPaperDirectly()
      }
    },

    // 此时答案单独成页在试题最后
    // combine=true：将答案与试卷下载到同一个pdf文件，试卷打印多少份答案也打印多少份
    // combine=false：将答案与试卷各自下载成两份pdf文件
    downloadPaper (combine) {
      this.showDownloadOption = false;
      this.$refs.paperContentStyled.downloadPaper(combine);
    },

    setPaperDown () {
      this.showPaperDown = false

      this.$store.commit('setPaperDown')

      // 更新组卷状态
      let params = this.$store.state.paper.paper
      this.putRequest(this.httpUrl.paper, params).then(response => {
        console.log("更新成功");
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.sjyl {
  position: relative;
  width: fit-content;
  margin: auto;
  width: 100%;
  height: 100%;
}

.head {
  border-bottom: $border-solid;
  margin-bottom: 12px;
}

.paper-preview {
  display: flex;
  justify-content: space-around;
  position: absolute;
  left: 0;
  right: 0;
  top: 72px;
  bottom: 0;
}

.paper-content {
  overflow-y: auto;
  height: 100%;
  width: 720px;
}

.operation {
  display: inline-block;
  overflow-y: auto;
  height: 100%;

  width: 260px;

  border: $border-solid;
  margin-left: 10px;

  &-btn {
    width: 100px;
  }
}

.paper-download-btn {
  width: 220px;
  margin: 10px 20px;

  font-size: 20px;
}

.paper-operate {
  display: flex;
  justify-content: space-around;

  margin: 10px 20px;
}
</style>
