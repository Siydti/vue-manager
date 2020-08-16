import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../pages/login'
import common from '../components/common'

//验证接口
import { checktoken } from '@/api/apis'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'index',
      component: login,
    },
    {
      path: '/common',
      name: 'index',
      component: common,
      children: [
        {
          path: '/index',
          name: 'OrderManagement',
          component: () => import('../pages/index'),
          meta: {
            containerheader: ['后台首页']
          }
        },
        {
          path: '/index/OrderManagement',
          name: 'OrderManagement',
          component: () => import('../pages/OrderManagement'),
          meta: {
            containerheader: ['订单管理']
          }
        },
        {
          path: '/index/store',
          name: 'store',
          component: () => import('../pages/Store'),
          meta: {
            containerheader: ['店铺管理']
          }
        },
        {
          path: '/index/orderform',
          name: 'statistics',
          component: () => import('../pages/OrderForm'),
          meta: {
            containerheader: ['销售统计', '订单统计']
          }
        },
        {
          path: '/index/commodity',
          name: 'statistics',
          component: () => import('../pages/Commodity'),
          meta: {
            containerheader: ['销售统计', '商品统计']
          }
        },
        {
          path: '/index/adduser',
          name: 'statistics',
          component: () => import('../pages/Adduser'),
          meta: {
            containerheader: ['账号管理', '添加账号']
          }
        },
        {
          path: '/index/amendPwd',
          name: 'statistics',
          component: () => import('../pages/AmendPwd'),
          meta: {
            containerheader: ['账号管理', '修改密码']
          }
        },
        {
          path: '/index/userList',
          name: 'statistics',
          component: () => import('../pages/UserList'),
          meta: {
            containerheader: ['账号管理', '账号列表']
          }
        },
        {
          path: '/index/addCommodity',
          name: 'statistics',
          component: () => import('../pages/AddCommodity'),
          meta: {
            containerheader: ['商品管理', '商品添加']
          }
        },
        {
          path: '/index/commodityList',
          name: 'statistics',
          component: () => import('../pages/CommodityList'),
          meta: {
            containerheader: ['商品管理', '商品列表']
          }
        },
        {
          path: '/index/classify',
          name: 'statistics',
          component: () => import('../pages/Classify'),
          meta: {
            containerheader: ['商品管理', '商品分类']
          }
        },
        {
          path: '/index/personal',
          name: 'statistics',
          component: () => import('../pages/Personal'),
        }
      ]
    }
  ]
})


router.beforeEach((to, from, next) => {
  // console.log( from.path )
  if (to.path !== '/') {
    checktoken(localStorage.token).then(res => {
      if (res.data.code == 0) {
        next()
      } else {
        next('/')
      }
    })
  } else (
    next()
  )
})

//暴露
export default router