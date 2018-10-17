<template>
  <div class="sxxmb bqteam-main-wrap-inner">

    <div class="xmb">
      <el-button type="text" size="medium" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>

      <!-- 细目表内容 -->
      <div class="xmb border-solid">

        <!-- 组卷名 -->
        <div class="xmb-name">
          <el-input class="input" v-if="editMode" v-model="xmb.featureTitle"></el-input>
          <span v-else>{{xmb.featureTitle}}</span>
        </div>

        <!-- 组卷类型 -->
        <div class="xmb-type">
          <span>类型：</span>
          <el-select v-if="editMode" v-model="xmb.featureType">
            <el-option v-for="item in radioPaperTypes" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <span v-else>{{getValue(radioPaperTypes, xmb.featureType)}}</span>
        </div>

        <!-- 大题列表 -->
        <div class="dt" v-for="(dt, i) in xmb.dt" :key="i">
          <div class="dt-title">
            <h3>{{getValue(radioExerciseTypes, dt.type)}}</h3>
            <div v-if="editMode">
              <li class="el-icon-delete operate-btn" @click="remove(xmb.dt, i)"></li>
              <li class="el-icon-arrow-up operate-btn" @click="swap(xmb.dt, i, i - 1)"></li>
              <li class="el-icon-arrow-down operate-btn" @click="swap(xmb.dt, i, i + 1)"></li>
            </div>
          </div>

          <!-- 小题table -->
          <table class="table">
            <tr>
              <td style="width:50px;">题序</td>
              <td>包含知识点</td>
              <td style="width:90px;">难度</td>
              <td style="width:100px;">分数</td>
              <td style="width:100px;">题目数</td>
              <td style="width:120px;" v-if="editMode">操作</td>
            </tr>
            <tr v-for="(xt, j) in dt.xt" :key="j">
              <!-- 题序 -->
              <td>{{xt.index}}</td>

              <!-- 包含知识点 -->
              <td style="text-align: left;">
                <div class="kp-div">
                  <span class="kp" v-for="(kp,index) in xt.knowledgePoints" :key="index">{{kp.knowledgeName}}
                    <li v-if="editMode" class="el-icon-remove" @click="removeKnowledgePointAt(i, j, index)"></li>
                  </span>
                  <span class="add-kp-button" v-if="editMode" @click="addKnowledgePointAt(i, j)">添加知识点</span>
                </div>
              </td>

              <!-- 难度 -->
              <td>
                <el-select v-if="editMode" v-model="xt.difficulty" @change="selectDifficulty(i, j)">
                  <el-option v-for="item in global.difficulties" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
                <span v-else>{{getValue(global.difficulties, xt.difficulty)}}</span>
              </td>

              <!-- 分数 -->
              <td>
                <el-input-number v-if="editMode" v-model="xt.score" controls-position="right" :min="1" :max="20" @change="edited = true"></el-input-number>
                <span v-else>{{xt.score}}分</span>
              </td>

              <!-- 该选题条件下题目数目 -->
              <td>
                <span v-if="xt.exerciseCount > 0">{{xt.exerciseCount}}道题目</span>
                <span v-else style="color: red">{{xt.exerciseCount}}道题目</span>
              </td>

              <!-- 操作 -->
              <td v-if="editMode">
                <li class="el-icon-delete operate-btn" @click="remove(dt.xt, j)"></li>
                <li class="el-icon-arrow-up operate-btn" @click="swap(dt.xt, j, j - 1)"></li>
                <li class="el-icon-arrow-down operate-btn" @click="swap(dt.xt, j, j + 1)"></li>
              </td>
            </tr>

            <!-- 添加小题 -->
            <tr v-if="editMode">
              <td style="text-align: right;padding: 10px" colspan="6">
                <span class="add-kp-button" @click="addXtIn(dt.xt, dt.type)">添加小题</span>
              </td>
            </tr>
          </table>
        </div>

        <!-- 添加大题 -->
        <div class="add-dt-button" v-if="editMode" @click="addExerciseType">添加大题</div>
      </div>

    </div>

    <div style="display: block">

      <!-- 修改细目表 -->
      <div class="edit" v-if="xmbOrigin.isShare === 0">
        <el-button size="medium" icon="el-icon-edit" v-if="!editMode" @click="editMode = true">编辑</el-button>
        <el-button size="medium" icon="el-icon-upload2" v-if="editMode" :disabled="!edited" @click="saveEdit">保存</el-button>
        <el-button size="medium" icon="el-icon-refresh" v-if="editMode" @click="quitEdit">放弃编辑</el-button>
        <el-button size="medium" icon="el-icon-tickets" v-if="!editMode" @click="generatePaper">生成试卷</el-button>
      </div>

      <!-- 使用公共细目表 -->
      <div class="edit" v-else>
        <el-button size="medium" icon="el-icon-edit" @click="useCommonXmb">拷贝细目表</el-button>
        <el-button size="medium" icon="el-icon-tickets" @click="generatePaper">生成试卷</el-button>
      </div>

      <!-- 细目表分析 -->
      <div class="fx border-solid">
        <xmb-analyze ref="xmbAnalyze" :xmb="xmb"></xmb-analyze>
      </div>

    </div>

    <el-dialog title="选择大题类型" :visible.sync="dialogExerciseTypeShow">
      <div>
        <el-radio-group v-model="exerciseTypeNew" @change="newExerciseType">
          <el-radio v-for="item in radioExerciseTypes" :key="item.id" :label="item.id">{{item.name}}</el-radio>
        </el-radio-group>
      </div>
    </el-dialog>

    <el-dialog title="选择知识点" :visible.sync="dialogKnowledgeShow">
      <div>
        <el-cascader expand-trigger="hover" :options="knowledgeTree" @change="selectKnowledge"></el-cascader>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import xmbAnalyze from './components/xmb-analyze'
import qs from 'qs'

export default {
  components: {
    xmbAnalyze
  },
  data () {
    return {
      // 切换编辑模式/非编辑模式，查看细目表默认非编辑模式，新建细目表默认编辑模式
      editMode: false,
      // 标志当前细目表有没有被编辑
      edited: false,
      // xmbOrigin保存原始细目表，在xmb中做修改，保存后再同步到xmbOrigin
      xmbOrigin: {},
      xmb: {},
      exerciseTypeNew: '',

      // 添加知识点时，标记题目的索引
      knowledgeIndex: [],

      //对话框可见性
      dialogExerciseTypeShow: false,
      dialogKnowledgeShow: false
    }
  },
  computed: {
    //知识点树型组件数据
    knowledgeTree () {
      return this.$store.getters.knowledgeTree(this.xmbOrigin.featureGrade)
    },

    radioExerciseTypes () {
      let exerciseTypes = this.$store.state.exerciseType.exerciseTypes
      if (exerciseTypes === null) {
        this.$store.dispatch('getExerciseTypes')
        return []
      }
      return exerciseTypes
    },

    radioPaperTypes () {
      let paperTypes = this.$store.state.paperType.paperTypes
      if (paperTypes === null) {
        this.$store.dispatch('getPaperTypes')
        return []
      }
      return paperTypes
    }
  },
  mounted () {
    this.getKnowledgeList()
    this.getXmb()
  },
  methods: {
    getKnowledgeList () {
      this.$store.dispatch("getKnowledge");
    },

    getXmb () {
      let xmbId = this.$route.params.xmbId
      let params = { featureId: xmbId }

      this.getRequest(this.httpUrl.feature, params).then(response => {

        this.xmbOrigin = response.data.list[0]
        this.xmbOrigin.dt = JSON.parse(this.xmbOrigin.featureJson)
        // 这里要用深拷贝
        this.xmb = JSON.parse(JSON.stringify(this.xmbOrigin))

        this.setupExerciseCount()
      }).catch(error => {
      })
    },

    // 点击‘添加新的大题’，弹出大题类型选择弹框
    addExerciseType () {
      this.dialogExerciseTypeShow = true
      this.exerciseTypeNew = ''
    },

    // 选定新添加的大题类型
    newExerciseType (type) {
      this.dialogExerciseTypeShow = false

      let dt = {
        index: this.xmb.dt.length,
        type: type,
        xt: []
      }
      this.xmb.dt.push(dt)
      this.edited = true
    },

    // 给小题添加知识点
    // i:大题索引
    // index:小题索引
    addKnowledgePointAt (i, index) {
      this.dialogKnowledgeShow = true
      this.knowledgeIndex = [i, index]
    },

    // 选定知识点
    selectKnowledge (knowledge) {
      this.dialogKnowledgeShow = false

      let knowledgeNumber = knowledge[knowledge.length - 1]
      let knowledgeName = this.$store.getters.knowledgeName(knowledgeNumber)
      let k = { knowledgeNumber: knowledgeNumber, knowledgeName: knowledgeName }

      this.xmb.dt[this.knowledgeIndex[0]].xt[this.knowledgeIndex[1]].knowledgePoints.push(k)
      this.edited = true

      // 选好知识点后查询符合条件的题目数
      this.queryConut(this.xmb.dt[this.knowledgeIndex[0]].xt[this.knowledgeIndex[1]])
    },

    removeKnowledgePointAt (i, j, index) {
      this.edited = true

      this.xmb.dt[i].xt[j].knowledgePoints.splice(index, 1)
      // 删除知识点后查询符合条件的题目数
      this.queryConut(this.xmb.dt[i].xt[j])
    },

    selectDifficulty (i, index) {
      this.edited = true

      // 选好难度等级后查询符合条件的题目数
      this.queryConut(this.xmb.dt[i].xt[index])
    },

    // 添加小题
    addXtIn (xt, type) {
      var xtObject = {
        index: 0,
        type: type,
        knowledgePoints: [],
        difficulty: 0,
        score: 10,
        exerciseCount: 0
      }
      xt.push(xtObject)
      this.setXtIndex()
      this.edited = true

      this.queryConut(xtObject)
    },

    // 数组删除元素
    remove (array, index) {
      array.splice(index, 1)
      this.setXtIndex()
      this.edited = true
    },

    //给小题设置序号
    setXtIndex () {
      var index = 0
      this.xmb.dt.forEach(dt => {
        dt.xt.forEach(xt => {
          index++
          xt.index = index
        })
      })
    },

    // 数组元素交换位置
    swap (array, index1, index2) {
      if (index1 > index2) {
        if (index1 > 0) {
          this.arraySwap(array, index1, index2)
        }
      } else {
        if (index1 < array.length - 1) {
          this.arraySwap(array, index1, index2)
        }
      }
      this.setXtIndex()
      this.edited = true
    },

    // 保存更改
    saveEdit () {
      if (!this.saveEnable()) {
        return
      }
      this.editMode = false
      this.edited = false
      this.xmb.featureJson = JSON.stringify(this.xmb.dt)
      this.xmbOrigin = JSON.parse(JSON.stringify(this.xmb))

      this.$store.dispatch('loading', true)
      // 修改细目表
      this.putRequest(this.httpUrl.feature, this.xmbOrigin).then(response => {
        this.$store.dispatch('loading', false)
      }).catch(error => {
        this.$store.dispatch('loading', false)
      })
    },

    saveEnable () {
      for (let i = 0; i < this.xmb.dt.length; i++) {
        const dt = this.xmb.dt[i]
        for (let j = 0; j < dt.xt.length; j++) {
          const xt = dt.xt[j]
          if (xt.exerciseCount === 0) {
            let index = xt.index
            this.$alert('请修改第' + xt.index + '题题目属性，或前往题库添加题目', '该细目表不可用', {
              confirmButtonText: '确定'
            })
            return false
          }
        }
      }
      return true
    },

    // 查询每道题的筛选条件下，题库中包含的题目数
    setupExerciseCount () {
      this.xmb.dt.forEach(dt => {
        dt.xt.forEach(xt => {
          this.queryConut(xt)
        })
      })
    },

    // 查询某道题的筛选条件下，题库中包含的题目数
    queryConut (xt) {
      let params = {
        exerciseGrade: this.xmb.featureGrade,
        exerciseSubject: this.xmb.featureSubject,
        exerciseType: xt.type,
        pageSize: 1
      }
      if (xt.difficulty !== 0) {
        params.exerciseDifficulty = xt.difficulty
      }
      if (xt.knowledgePoints.length > 0) {
        let knowledges = []
        xt.knowledgePoints.forEach(kp => {
          knowledges.push(kp.knowledgeNumber)
        })
        params.exerciseKnowledge = knowledges
      }

      params = qs.stringify(params, { arrayFormat: 'repeat' })
      this.getRequest(this.httpUrl.exerciseCollect + '?' + params, {})
        .then(response => {
          xt.exerciseCount = response.data.total
        })
        .catch(error => {
        })
    },

    // 放弃修改细目表，细目表此时状态为上一次保存的状态
    quitEdit () {
      this.editMode = false
      this.edited = false
      this.xmb = JSON.parse(JSON.stringify(this.xmbOrigin))
      this.setXtIndex()
    },

    // 使用公用细目表
    useCommonXmb () {
      this.$store.dispatch('loading', true);

      let xmbObject = JSON.parse(JSON.stringify(this.xmbOrigin))
      xmbObject.featureStatus = 0
      // 创建细目表
      this.postRequest(this.httpUrl.feature, xmbObject).then(response => {
        this.$store.dispatch('loading', false);
        console.log('create xmb succeed!')
        this.$store.commit('setXmbPageTab', '2')
        this.$alert('已经将该细目表加入到您的细目表中，请点击“我的细目表”进行查看和编辑', '操作成功', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.back(-1)
          }
        })

      }).catch(error => {
        this.$store.dispatch('loading', false);
      })
    },

    // 从细目表生成组卷
    generatePaper () {
      this.$store.dispatch('loading', true);
      let params = { featureJson: this.xmbOrigin.featureJson }

      this.getRequest(this.httpUrl.featureExercise, params).then(response => {
        this.$store.dispatch('loading', false);

        this.createPaper(response.data)
      }).catch(error => {
        this.$store.dispatch('loading', false);
      })
    },

    // 拿到题目列表，新建组卷
    createPaper (exerciseList) {
      let exerciseInfoList = this.setupExerciseInfoList(exerciseList)
      let exerciseListClassified = this.setupExerciseListClassified(exerciseList)

      let obj = {
        paperHead: {
          headlineText: '试卷标题',
          subheadText: '副标题',
          paperInfoText: '考试范围：xxx；考试时间：100分钟；命题人：xxx',
          studentInfoText: '学校：__________ 姓名：__________ 班级：__________ 考号：__________',
          announcementsText: '注意事项：1、答题前填写好自己的姓名、班级、考号等信息 2、请将答案正确填写在答题卡上'
        },
        exerciseInfoList: exerciseInfoList,
        exerciseListClassified: exerciseListClassified
      }

      let params = {
        paperTitle: this.xmbOrigin.featureTitle,
        paperStatus: 0,
        paperGrade: this.xmbOrigin.featureGrade,
        paperSubject: this.xmbOrigin.featureSubject,
        paperType: this.xmbOrigin.featureType,
        isShare: 0, //未公开
        paperJson: JSON.stringify(obj)
      }
      this.postRequest(this.httpUrl.paper, params).then(response => {
        this.$store.commit('setPaperPageTab', '2')
        this.$alert('已经生成新的组卷，请点击“我的细目表”进行查看和编辑', '操作成功', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.push({ name: 'paperManagement' })
          }
        })
      })
    },

    // 构造题目信息数组
    setupExerciseInfoList (exerciseList) {
      let exerciseInfoList = []
      exerciseList.forEach(exercise => {
        let exerciseInfo = {
          exerciseNumber: exercise.exerciseNumber,
          exerciseDifficulty: exercise.exerciseDifficulty,
          knowledgeName: exercise.knowledgeName
        }
        exerciseInfoList.push(exerciseInfo)
      })
      return exerciseInfoList
    },

    // 将题目分类
    setupExerciseListClassified (exerciseList) {
      let exerciseListClassified = []
      exerciseList.forEach(exercise => {
        let typeIndex = -1
        for (let i = 0; i < exerciseListClassified.length; i++) {
          let exerciseInType = exerciseListClassified[i]
          if (exerciseInType.type === exercise.exerciseType) {
            // 新加的题目指定其分数为大题分数
            exercise.score = exerciseInType.score
            // 有，直接将题目插入该类型题目列表
            exerciseInType.exerciseList.push(exercise)
            typeIndex = i
            break
          }
        }

        if (typeIndex === -1) {
          // 没有，那么创建该类型题目并将题目插入该类型题目列表
          let exerciseInType = {
            type: exercise.exerciseType,
            score: 10, // 新建时指定每题10分
            exerciseList: []
          }
          exercise.score = 10
          exerciseInType.exerciseList.push(exercise)
          // 将该类型题目插入组卷分类题目表
          exerciseListClassified.push(exerciseInType)
        }
      })
      return exerciseListClassified
    }
  }
}
</script>

<style lang="scss" scoped>
.sxxmb {
  display: flex;
}

.fx {
  width: 300px;
  height: fit-content;
  margin: 10px;
  padding: 10px;
}

.buttons {
  display: flex;
  justify-content: space-around;

  padding: 10px 0;

  border-bottom: $border-dashed;
}

.difficulty-chart {
  height: 200px;
}

.xmb {
  flex: 1;
  height: fit-content;

  margin: 10px;
  padding: 0 20px;

  &-name {
    margin: 10px;

    text-align: center;

    font-size: 24px;
  }

  &-type {
    margin-bottom: 10px;

    text-align: end;
  }
}

h2 {
  text-align: center;
}

h3 {
  margin: 0;
}

.dt-title {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px 12px;

  border: $border-solid;
  background: #f1f1f1;
}

.table {
  width: 100%;
  margin: 0 0 20px 0;

  border-spacing: 0;

  text-align: center;

  border-collapse: collapse;
  border-left: $border-solid;
}

td {
  margin: 0;
  padding: 6px;

  border-right: $border-solid;
  border-bottom: $border-solid;
}

.add-dt-button {
  margin-bottom: 20px;
  padding: 40px 0;

  text-align: center;

  color: $color-blue;
  border: dashed 2px $color-blue;

  font-size: 20px;

  &:hover {
    background: #dcdcf5;
  }
}

.add-kp-button {
  margin: 4px;
  padding: 3px;

  text-align: center;

  border: $border-dashed;
  border-radius: 5px;

  &:hover {
    background: #d4d4ff;
  }
}

.operate-btn {
  padding: 6px;

  border: $border-solid;
  border-radius: 15px;

  &:hover {
    background: #d4d4ff;
  }
}

.kp-div {
  display: flex;
  flex-wrap: wrap;
}

.kp {
  width: fit-content;
  margin: 4px;
  padding: 4px;

  border-radius: 5px;
  background: #f1f1f1;
}

.edit {
  width: 300px;
  margin: 10px;
}

.input {
  width: 300px;

  text-align: center;

  font-size: 22px;
}

.input-score {
  height: 40px;

  border: solid 1px #dddddd;
  border-radius: 4px;
  outline: none;

  font-size: 16px;
}

.el-input-number {
  width: 90px;
}
</style>
