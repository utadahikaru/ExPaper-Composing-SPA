<template>
  <div>
    <div class="search-box">
      <!-- 删选条件 -->
      <cus-radio v-model="xmbCondition.featureGrade" :values="radioGrades" title="年级：" defaultRadio="全部" />
      <cus-radio v-model="xmbCondition.featureType" :values="radioTypes" title="类型：" defaultRadio="全部" />
    </div>

    <!-- 搜索及重置按钮 -->
    <el-button-group class="mb">
      <el-button icon="el-icon-search" size="medium" @click="getXmbList">搜索</el-button>
      <el-button icon="el-icon-refresh" size="medium" @click="resetCondition">重置</el-button>
      <el-button icon="el-icon-plus" size="medium" @click="dialogVisible=true">添加细目表</el-button>
    </el-button-group>

    <!-- 细目表列表 -->
    <el-table :data="xmbList" style="width: 100%" v-loading="loading" empty-text="没有符合条件的细目表" border>
      <el-table-column prop="title" label="细目表名称" align="center">
        <template slot-scope="scope">
          <button class="table-button" @click="toEditXmb(scope.row.featureId)">{{scope.row.featureTitle}}</button>
        </template>
      </el-table-column>
      <el-table-column prop="grade" label="年级" width="90" align="center">
      </el-table-column>
      <el-table-column prop="type" label="类型" width="90" align="center">
      </el-table-column>
      <el-table-column prop="count" label="题数" width="90" align="center">
      </el-table-column>
      <el-table-column prop="useTimes" label="使用次数" width="90" align="center">
      </el-table-column>
      <el-table-column prop="time" label="最近修改时间" width="220" align="center">
      </el-table-column>
      <el-table-column label="是否公开" width="90" align="center">
        <template slot-scope="scope">
          <button class="table-button" @click="clickShareBtn(scope.$index)">{{scope.row.isShareString}}</button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" align="center">
        <template slot-scope="scope">
          <button class="table-button" @click="removeXmb(scope.row.featureId)">删除</button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="mt">
      <el-pagination @current-change="pageChanged" :current-page="pageNum" layout="total, prev, pager, next, jumper" :total="xmbTotal">
      </el-pagination>
    </div>

    <!-- 新建试卷 -->
    <el-dialog title="新建细目表" :visible.sync="dialogVisible" width="50%">
      <el-form class="new-form" ref="form" label-width="90px">
        <el-form-item label="年级">
          <el-select v-model="xmbObject.featureGrade" placeholder="请选择年级">
            <el-option v-for="item in radioGrades" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="xmbObject.featureType">
            <el-radio v-for="item in radioTypes" :key="item.id" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="细目表名称">
          <el-input v-model="xmbObject.featureTitle"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createXmb" :disabled="createBtnDisabled">提 交</el-button>
      </div>
    </el-dialog>

    <!-- 公开/私有化细目表 -->
    <el-dialog :title="shareDialogTitle" :visible.sync="shareDialogVisible" width="50%">
      <span>{{shareDialogMsg}}</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shareDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateShareStatus">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'xmb-mine',
  data () {
    return {
      xmbCondition: {
        featureSubject: this.$store.getters.getSubject(),
        featureGrade: 0,
        featureType: 0,
        pageNum: 1,
        pageSize: 10
      },

      // 新创建细目表对象
      xmbObject: {
        featureTitle: '',
        featureStatus: 0,
        featureJson: '[]',
        featureGrade: '',
        featureSubject: this.$store.getters.getSubject(),
        featureType: 0,
        isShare: 0,
        dt: []
      },
      // 细目表列表
      xmbList: [],
      // 分页
      pageNum: 1,
      xmbTotal: 10,

      loading: false,
      // 对话框可见性
      dialogVisible: false,
      shareDialogVisible: false,
      // 切换公开状态的细目表索引
      shareIndex: -1,
      // 切换公开状态的对话框标题
      shareDialogTitle: '',
      shareDialogMsg: ''
    }
  },
  computed: {
    radioGrades () {
      return this.$store.getters.getGrades()
    },

    radioTypes () {
      let paperTypes = this.$store.state.paperType.paperTypes
      if (paperTypes === null) {
        this.$store.dispatch('getPaperTypes')
        return []
      }
      return paperTypes
    },

    createBtnDisabled () {
      return this.xmbObject.featureGrade === '' || this.xmbObject.featureType === 0
    },

    xmbTitle: {
      get: function () {
        let gradeString = this.getValue(this.global.grades, this.grade)
        let typeString = this.type === 0 ? '' : this.getValue(this.global.paperTypes, this.type)
        return gradeString + this.$store.getters.getSubjectName() + typeString
      },
      // 如果要对计算属性赋值，需要实现setter方法
      set: function (newValue) {
        return newValue
      }
    }
  },
  watch: {
    xmbObject: {
      handler (newVal, oldVal) {
        let gradeString = this.getValue(this.radioGrades, this.xmbObject.featureGrade)
        let typeString = this.getValue(this.radioTypes, this.xmbObject.featureType)
        this.xmbObject.featureTitle = gradeString + this.$store.getters.getSubjectName() + typeString
      },
      deep: true
    },

    xmbCondition: {
      handler (newVal, oldVal) {
        this.getXmbList()
      },
      deep: true
    }
  },
  mounted () {
    this.getXmbList()
  },
  methods: {
    getXmbList () {
      this.loading = true
      let params = this.deleteUselessAttribute(this.xmbCondition)
      this.getRequest(this.httpUrl.feature, params).then(response => {
        this.loading = false

        this.xmbTotal = response.data.total

        this.xmbList.length = 0
        this.xmbList = response.data.list
        this.xmbList.forEach(xmb => {
          let count = 0
          let dt = JSON.parse(xmb.featureJson)
          dt.forEach(dt => {
            dt.xt.forEach(xt => {
              count++
            })
          })
          xmb.count = count
          xmb.grade = this.getValue(this.global.grades, xmb.featureGrade)
          xmb.type = this.getValue(this.radioTypes, xmb.featureType)
          xmb.time = this.readStandardDate(xmb.updateTime, 'minute')
          xmb.isShareString = xmb.isShare === 0 ? '私有' : '公开'
        })
      }).catch(error => {
        this.loading = false
      })
    },

    pageChanged (page) {
      this.xmbCondition.pageNum = page
      this.getXmbList()
    },

    // 新建试卷
    createXmb () {
      this.dialogVisible = false

      this.commit('loading', true)
      // 创建细目表
      this.postRequest(this.httpUrl.feature, this.xmbObject).then(response => {
        this.commit('loading', false)

        this.xmbObject.featureId = response.data.featureId
        this.editNewXmb()
      }).catch(error => {
        this.commit('loading', false)
      })
    },

    toEditXmb (id) {
      this.$router.push({ path: `/xmb/xmbPreview/${id}` })
    },

    editNewXmb () {
      this.dialogVisible = false

      this.$router.push({ path: `/xmb/xmbPreview/${this.xmbObject.featureId}` })
    },

    removeXmb (id) {
      this.$confirm('删除该细目表？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.loading = true
        let params = { featureId: id }
        this.deleteRequest(this.httpUrl.feature, params).then(response => {
          this.loading = false
          this.getXmbList()
          this.pm("删除成功", "success");
        }).catch(error => {
          this.loading = false
        })
      })
    },

    clickShareBtn (index) {
      this.shareDialogVisible = true
      this.shareIndex = index
      this.shareDialogTitle = this.xmbList[index].isShare === 0 ? '公开此细目表？' : '私有化此细目表？'
      this.shareDialogMsg = this.xmbList[index].isShare === 0 ? '公开后您的细目表将可以被其他教师看到和使用' : '私有化后的细目表只有您自己能看到'
    },

    updateShareStatus () {
      this.shareDialogVisible = false
      let isShare = this.xmbList[this.shareIndex].isShare === 0 ? 1 : 0
      let params = { featureId: this.xmbList[this.shareIndex].featureId, isShare: isShare }
      this.loading = true
      this.putRequest(this.httpUrl.feature, params).then(response => {
        this.loading = false
        this.getXmbList()
      }).catch(error => {
        this.loading = false
      })
    },

    resetCondition () {
      this.xmbCondition.featureGrade = 0
      this.xmbCondition.featureType = 0
      this.xmbCondition.pageNum = 1
    }
  }
}
</script>

<style lang="scss" scoped>
.new-form {
  width: 600px;
}
</style>

