
//axios
import axios from 'axios'

//服务器地址
axios.defaults.baseURL = 'http://127.0.0.1:5000/'

//-------------------------------------------------    账号    ---------------------------------------------------------------------------------------//
//登录  account账号  password密码
export const checkLogin = ( account , password ) => axios.post('/users/checkLogin',{account , password})

//验证token是否过期   token令牌
export const checktoken = token => axios.get('/users/checktoken',{params :{token}})

//添加账号   account账户   password密码   userGroup用户组
export const usersadd = ( account , password , userGroup ) => axios.post('/users/add',{ account , password , userGroup })

//检查旧密码是否正确   oldPwd旧密码   id
export const checkoldpwd = ( oldPwd , id ) => axios.get('/users/checkoldpwd',{params:{oldPwd,id}})

//修改账号      newPwd新密码   id
export const editpwd = ( newPwd , id ) => axios.post('/users/editpwd',{ newPwd , id })

//获取账号列表   currentPage当前页码   pageSize每页条数
export const userlist = ( currentPage , pageSize ) => axios.get('/users/list',{ params : { currentPage , pageSize } })

//删除账号
export const userdel = id => axios.get('/users/del',{ params : { id } })

//批量删除账号   ids:要删除数据的id组成的数组（字符串格式的数组，如: ‘[1, 2, 3]’,需要转为字符串格式）
export const batchdel = ids => axios.get( '/users/batchdel' , { params : { ids } } )

//修改账号   id要修改账号的id   account账号   userGroup用户组
export const edit = ( id , account , userGroup ) => axios.post('/users/edit',{ id , account , userGroup })

//获取账号（个人中心）信息   id
export const accountinfo = id => axios.get('/users/accountinfo',{ params :{ id } })


//-------------------------------------------------    商品    ---------------------------------------------------------------------------------------//
//获取分类     currentPage当前页    pageSize每页条数
export const catelist = ( currentPage , pageSize ) => axios.get( '/goods/catelist' , {params:{ currentPage , pageSize }} )

//添加分类    cateName分类名称    state是否启用（类型：Boolean）
export const addcate = ( cateName , state ) => axios.post( '/goods/addcate' , { cateName , state } )

//删除分类    id分类id
export const delcate = id => axios( '/goods/delcate' , {params : { id }} )

//修改分类    id分类id    cateName分类名称    state分类状态
export const editcate = ( id ,  cateName , state ) => axios.post( '/goods/editcate' , { id ,  cateName , state } )

//获取商品列表  currentPage当前页码    pageSize每页条数
export const goodslist = ( currentPage , pageSize ) => axios.get( '/goods/list', { params : { currentPage , pageSize } } )

//修改商品    name商品名称  category商品分类    price商品价格   imgUrl商品图片地址  goodsDesc商品描述   id商品ID
export const goodsedit = ( name , category , price , imgUrl , goodsDesc , id ) => axios.post( '/goods/edit' , { name , category , price , imgUrl , goodsDesc , id } )

//查询所有分类名称
export const categories = () => axios.get( '/goods/categories' )

//删除商品  id 商品id
export const goodsdel = id => axios.get( '/goods/del' , { params : { id } } )

//添加商品    name 商品名称     category 商品分类    price 商品价格    imgUrl 商品图片地址    goodsDesc 商品描述
export const goodsadd = ( name , category , price , imgUrl , goodsDesc ) => axios.post( '/goods/add' , { name , category , price , imgUrl , goodsDesc } )


//-------------------------------------------------    订单    ---------------------------------------------------------------------------------------//
//获取订单列表(带查询功能)
export const orderlist = (params) => axios.get( '/order/list' , { params } )

//查询    
export const ordersearch = (params) => axios.get( '/order/search' , { params } )

//获取订单详情
export const orderdetail = id => axios.get( '/order/detail' , { params : { id } } )

//修改订单
export const  orderedit = params => axios.post( '/order/edit' ,  params  )

//-------------------------------------------------    店铺    ---------------------------------------------------------------------------------------//
//获取店铺详情
export const shopinfo = () => axios.get( '/shop/info' )

//店铺内容修改  
export const shopedit = params => axios.post( '/shop/edit' , params )

//-------------------------------------------------    报表    ---------------------------------------------------------------------------------------//
//首页报表接口
export const totaldata = () => axios.get( '/order/totaldata')

//订单报表接口
export const ordertotal = date => axios.get( '/order/ordertotal' , { params : { date } })