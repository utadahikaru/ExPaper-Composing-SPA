import Vue from 'vue'
import Router from 'vue-router'

/* 用户登录 */
import login from '@/views/auth/login.vue'
import resetPassword from '@/views/auth/reset-password.vue'

/* 首页 */
import home from '@/views/home/home.vue'

/** 教师端 **/
/* 试卷库 */
import paperManagement from '@/views/teacher/zjk/paper-management.vue'
import paperEdit from '@/views/teacher/zjk/paper-edit.vue'
import paperPreview from '@/views/teacher/zjk/paper-preview.vue'
import paperCheck from '@/views/teacher/zjk/paper-check.vue'

/* 习题库 */
import exerciseManagement from '@/views/teacher/xtk/exercise-management.vue'
import exerciseEdit from '@/views/teacher/xtk/components/exercise-edit.vue'

/* 细目表 */
import xmbManagement from '@/views/teacher/xmb/xmb-management.vue'
import xmbPreview from '@/views/teacher/xmb/xmb-preview.vue'

/* 个人中心 */
import personalCenter from '@/views/teacher/grzx/personal-center.vue'

/** 管理端 **/
/* 知识库 */
import zsk from '@/views/manager/zsk/zs-management.vue'

/* 教师管理 */
import teacherManagement from '@/views/manager/jsgl/teacher-management.vue'

/** admin **/
/* 学科管理 */
import subjectManagement from '@/views/admin/subject-management.vue'
import userManagement from '@/views/admin/user-management.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/auth/login',
      name: 'login',
      component: login,
      meta: {
        requireAuth: false,
        title: '用户登录'
      }
    },
    {
      path: '/auth/resetPassword',
      name: 'resetPassword',
      component: resetPassword,
      meta: {
        requireAuth: true,
        title: '修改密码'
      }
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      meta: {
        requireAuth: true,
        title: '首页'
      }
    },
    {
      path: '/zjk/paperManagement',
      name: 'paperManagement',
      component: paperManagement,
      meta: {
        requireAuth: true,
        title: '试卷列表'
      }
    },
    {
      path: '/zjk/paperEdit',
      name: 'paperEdit',
      component: paperEdit,
      meta: {
        requireAuth: true,
        title: '试卷明细'
      }
    },
    {
      path: '/zjk/paperPreview',
      name: 'paperPreview',
      component: paperPreview,
      meta: {
        requireAuth: true,
        title: '试卷预览'
      }
    },
    {
      path: '/zjk/paperCheck/:paperId',
      name: 'paperCheck',
      component: paperCheck,
      meta: {
        requireAuth: true,
        title: '公用试卷查看'
      }
    },
    {
      path: '/xtk/exerciseManagement',
      name: 'exerciseManagement',
      component: exerciseManagement,
      meta: {
        requireAuth: true,
        title: '习题库'
      }
    },
    {
      path: '/xtk/exerciseEdit',
      name: 'exerciseEdit',
      component: exerciseEdit,
      meta: {
        requireAuth: true,
        title: '习题库'
      }
    },
    {
      path: '/xmb/xmbManagement',
      name: 'xmbManagement',
      component: xmbManagement,
      meta: {
        requireAuth: true,
        title: '细目表'
      }
    },
    {
      path: '/xmb/xmbPreview/:xmbId',
      name: 'xmbPreview',
      component: xmbPreview,
      meta: {
        requireAuth: true,
        title: '细目表查看'
      }
    },
    {
      path: '/zsk',
      name: 'zsk',
      component: zsk,
      meta: {
        requireAuth: true,
        title: '知识库'
      }
    },
    {
      path: '/jsgl/teacherManagement',
      name: 'teacherManagement',
      component: teacherManagement,
      meta: {
        requireAuth: true,
        title: '教师管理'
      }
    },
    {
      path: '/admin/subjectManagement',
      name: 'subjectManagement',
      component: subjectManagement,
      meta: {
        requireAuth: true,
        title: '科目管理'
      }
    },
    {
      path: '/admin/userManagement',
      name: 'userManagement',
      component: userManagement,
      meta: {
        requireAuth: true,
        title: '用户管理'
      }
    },
    {
      path: '/grzx',
      name: 'personalCenter',
      component: personalCenter,
      meta: {
        requireAuth: true,
        title: '个人中心'
      }
    },
    {
      path: '/',
      redirect: '/auth/login'
    }
  ]
})
