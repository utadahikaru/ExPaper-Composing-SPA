<template>
  <div>
    <!-- 删选条件 -->
    <div class="search-box">
      <cus-radio v-model="type" :values="global.paperTypes" title="类型：" />
      <cus-radio v-model="state" :values="global.states" title="状态：" />
      <!-- <cus-radio v-model="scope" :values="paperRadio" title="选择组卷：" /> -->

      <!-- 搜索 -->
      <el-button size="small" icon="el-icon-search" round @click="getPaperList">搜索</el-button>
      <el-button size="small" icon="el-icon-refresh" round @click="resetCondition">重置</el-button>
    </div>

    <el-button style="margin:10px 0px;" @click="dialogVisible=true">添加组卷</el-button>

    <!-- 组卷列表 -->
    <el-table :data="paperDataList" style="width: 100%" v-loading="loading" empty-text="没有符合条件的组卷" border>

      <el-table-column label="组卷名称" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="toPaperPreview(scope.row.id)">{{scope.row.title}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="grade" label="年级" width="100" align="center">
      </el-table-column>
      <el-table-column prop="subject" label="科目" width="100" align="center">
      </el-table-column>
      <el-table-column prop="type" label="类型" width="100" align="center">
      </el-table-column>
      <el-table-column prop="count" label="题数" width="100" align="center">
      </el-table-column>
      <el-table-column label="是否公开" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="clickPublicBtn(scope.$index)">{{scope.row.isPublic}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="上次修改时间" width="220" align="center">
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="toPaperEdit(scope.$index)">编辑</el-button>
          <el-button type="text" @click="removePaper(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="mt">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" layout="total, prev, pager, next, jumper" :total="paperTotal">
      </el-pagination>
    </div>

    <!-- 新建试卷 -->
    <el-dialog title="新建组卷" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="paper" label-width="80px">

        <el-form-item label="年级">
          <el-select v-model="paper.grade" placeholder="请选择年级">
            <el-option v-for="item in global.grades" :key="item.c" :label="item.v" :value="item.c">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科目">
          <el-select v-model="paper.subject" placeholder="请选择科目">
            <el-option v-for="item in global.subjects" :key="item.c" :label="item.v" :value="item.c">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="paper.type">
            <el-radio v-for="(item, index) in global.paperTypes" :key="index" :label="item.c">{{item.v}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="试卷名称">
          <el-input v-model="paperTitle"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="newPaper">提 交 </el-button>
      </div>
    </el-dialog>

    <!-- 公开/私有化细目表 -->
    <el-dialog :title="publicDialogTitle" :visible.sync="publicDialogVisible" width="50%">
      <span>{{publicDialogMsg}}</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePublicStatus">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "paper-new",
  data () {
    return {
      paper: {
        title: "",
        type: 0,
        grade: 7,
        subject: 2
      },
      dialogVisible: false,
      grade: 0,
      subject: 0,
      state: 0,
      type: 0,
      scope: 0,

      paperList: [],
      paperDataList: [],

      pageNum: 1,
      paperTotal: 10,

      paperRadio: [
        {
          c: 0,
          v: "全部组卷"
        },
        {
          c: 1,
          v: "我的组卷"
        }
      ],

      loading: false,

      publicDialogVisible: false,
      // 切换公开状态的细目表索引
      publicIndex: -1,
      // 切换公开状态的对话框标题
      publicDialogTitle: '',
      publicDialogMsg: ''
    };
  },
  mounted () {
    this.getPaperList();
  },
  computed: {
    createBtnDisabled () {
      return this.paper.title === "";
    },

    paperTitle: {
      get: function () {
        let gradeString = this.getValue(this.global.grades, this.paper.grade)
        let subjectString = this.getValue(this.global.subjects, this.paper.subject)
        let typeString = this.paper.type === 0 ? '' : this.getValue(this.global.paperTypes, this.paper.type)
        this.paper.title = gradeString + subjectString + typeString
        return this.paper.title
      },
      // 如果要对计算属性赋值，需要实现setter方法
      set: function (newValue) {
        return newValue
      }
    }
  },
  methods: {
    // 新建试卷
    newPaper () {
      let obj = {
        paperHead: {
          headlineText: "试卷标题",
          subheadText: "副标题",
          paperInfoText: "考试范围：xxx；考试时间：100分钟；命题人：xxx",
          studentInfoText:
            "学校：___________ 姓名：___________ 班级：___________ 考号：___________",
          announcementsText:
            "注意事项：1、答题前填写好自己的姓名、班级、考号等信息 2、请将答案正确填写在答题卡上"
        },
        exerciseInfoList: [],
        exerciseListClassified: []
      }
      let params = {
        paperTitle: this.paper.title,
        paperStatus: 2, //未发布
        paperGrade: this.paper.grade,
        paperSubject: this.paper.subject,
        paperType: this.paper.type,
        paperJson: JSON.stringify(obj)
      };
      this.postRequest(this.httpUrl.paper, params).then(response => {
        this.dialogVisible = true;
      })
    },

    toEditPaper () {
      this.dialogVisible = false;
      this.$router.push("paperEdit");
    },
    // 获取我的试卷
    getPaperList () {
      this.loading = true;
      let params = { pageNum: this.pageNum, pageSize: 10 };
      if (this.grade !== 0) {
        params.paperGrade = this.grade;
      }
      if (this.subject !== 0) {
        params.paperSubject = this.subject;
      }
      if (this.state !== 0) {
        params.paperStatus = this.state;
      }
      if (this.type !== 0) {
        params.paperType = this.type;
      }
      this.getRequest(this.httpUrl.paper, params).then(response => {
        this.loading = false;

        this.paperList = response.data.list
        this.paperTotal = response.data.total;

        this.paperDataList.length = 0
        response.data.list.forEach(paper => {
          let jsonObj = JSON.parse(paper.paperJson);
          let count = jsonObj.exerciseInfoList.length
          let obj = {
            id: paper.paperId,
            title: paper.paperTitle,
            grade: this.getValue(this.global.grades, paper.paperGrade),
            subject: this.getValue(this.global.subjects, paper.paperSubject),
            type: this.getValue(this.global.paperTypes, paper.paperType),
            count: count,
            publicStatus: paper.paperStatus,
            isPublic: paper.paperStatus === 0 ? '未公开' : '已公开',
            date: this.readStandardDate(paper.updateTime, 'minute')
          }
          this.paperDataList.push(obj)
        })
      }).catch(error => {
        this.loading = false;
      })
    },

    // 分页查询
    handleCurrentChange (page) {
      this.pageNum = page;
      this.getPaperList();
    },

    // 删除某次组卷
    removePaper (id) {
      this.loading = true;
      let params = { paperId: id }
      this.deleteRequest(this.httpUrl.paper, params).then(response => {
        this.loading = false;
        this.pm("删除成功", "success");
        this.getPaperList();
      });
    },

    resetCondition () {
      this.grade = 0;
      this.subject = 0;
      this.type = 0;
      this.state = 0;
    },

    toPaperEdit (index) {
      this.$store.commit("setPaper", this.paperList[index]);
      this.$router.push("paperEdit");
    },

    toPaperPreview (id) {
      this.$router.push({ path: `/zjk/paperCheck/${id}` })
    },

    clickPublicBtn (index) {
      this.publicDialogVisible = true
      this.publicIndex = index
      this.publicDialogTitle = this.paperDataList[index].publicStatus === 0 ? '公开此组卷？' : '私有化此组卷？'
      this.publicDialogMsg = this.paperDataList[index].publicStatus === 0 ? '公开后您的组卷将可以被其他教师看到和使用' : '私有化后的组卷只有您自己能看到'
    },

    updatePublicStatus () {
      this.publicDialogVisible = false
      let curStatus = 1 - this.paperDataList[this.publicIndex].publicStatus
      let params = { paperId: this.paperDataList[this.publicIndex].id, paperStatus: curStatus }
      this.putRequest(this.httpUrl.paper, params).then(response => {
        this.paperDataList[this.publicIndex].publicStatus = curStatus
        this.paperDataList[this.publicIndex].isPublic = curStatus === 0 ? '未公开' : '已公开'
        console.log(curStatus)
        
      }).catch(error => {

      })
    }
  }
};
</script>

<style lang="scss" scoped>
.new-form {
  width: 600px;
}
</style>
