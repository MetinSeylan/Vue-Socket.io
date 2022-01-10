#### 安装  
```bash
npm install vue-socket.io --save
```
main.js 代码 
```javascript
import Vue from 'vue'
import store from './store'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io'

const options = { path: '/my-app/' }; //Options object to pass into SocketIO

Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://metinseylan.com:1992',
    options: {
        path: options.path
    }
  })
);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
```
#### 局部使用 
组件的话就在基础属性里加上`sockets` 对象， 里面写上自己要监听的事件名
```javascript
new Vue({
    sockets: {
        connect: function () {
            console.log('socket connected')
        },
        customEmit: function (data) {
            console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
        }
    },
    methods: {
        clickButton: function (data) {
            // $socket is socket.io-client instance
            this.$socket.emit('emit_method', data)
        }
    }
})
```
#### 动态使用 
如果你需要在运行时动态消费事件，你可以在Vue组件中使用' subscribe '和' unsubscribe '方法 
```javascript

mounted() {
    this.sockets.subscribe('EVENT_NAME', (data) => {
        this.msg = data.message;
    });
},
beforeDestroy() {
    this.sockets.unsubscribe('EVENT_NAME');
}
```
#### vuex 模式 
当你在安装中设置存储参数时，' Vue-Socket。io '将开始发送事件到Vuex商店。如果你为vuex设置了两个前缀，
你可以同时使用' actions '和' mutations '。但是，最好的使用方法就是" actions "
main.js 代码
```javascript
import Vue from 'vue'
import store from './store'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io'

const options = { path: '/my-app/' }; //Options object to pass into SocketIO

Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://metinseylan.com:1992', 
    vuex: {
      store,
      actionPrefix: "socket_", // 默认值是大写的 SOCKET_
      mutationPrefix: ""
    },
    options: {
        path: options.path
    }
  })
);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
```
store 代码
```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import { SOCKET_ERROE } from "./types"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {
        // 不建议在这里触发事件
        [SOCKET_ERROE]() {
            // do something
        }
    },
    actions: {
        socket_connect() {
            // do something
        }
    }
})
```

#### 原始事件
event 事件
注意： `socket_` 是vuex模式下的一个前缀， 插件内部默认值是大写，需要保持vuex里的事件命名风格请自己传一个前缀名 
##### `socket_connect` 
参数： 无
在连接到命名空间时触发（包括成功的重新连接）

##### `socket_error` 
参数： `error` (Object)错误对象
在发生连接错误时触发

##### `socket_disconnect` 
参数： `reason` (String) 错误提示
断开连接时触发

##### `socket_reconnect`
参数：`attempt` (Number) 重新连接尝试次数
重新连接成功后触发

##### `socket_reconnect_attempt` 
参数： `attempt` (Number) 重新连接尝试次数

##### `socket_reconnecting` 
参数： `attempt` (Number) 尝试链接次数
尝试重新连接时触发

##### `socket_reconnect_error` 
参数： `error` (Object) 错误对象
重新连接尝试错误时触发

##### `socket_reconnect_failed` 
参数：无
无法在内部重新连接时触发`reconnectionAttempts`

##### `socket_connect_error` 
参数：`connect_error` (Object) 错误对象
当发生名称空间中间件错误时触发

##### `socket_connect_timeout` 
参数： `timeout` (String) 时间
在连接超时时触发
##### `socket_connecting` 
参数： 
##### `socket_ping` 
参数： 无
当从服务器接收到ping数据包时触发

##### `socket_pong` 
参数： `ms` (Number) 自ping数据包以来经过的毫秒数 即等待时间
当从服务器接收到一个Pong时触发


注意： 此插件基于socket.io-client封装，在使用的时候一定要注意前后端的socket.io-client版本
      如果自行升级了socket.io-client版本请注意查阅一下官方文档，3.x以上的版本有个别事件已删除