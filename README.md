<p align="center">
    <a href="https://github.com/MetinSeylan/Vue-Socket.io" target="_blank">
    <img width="250" src="https://raw.githubusercontent.com/MetinSeylan/Vue-Socket.io/master/docs/logo.png">
    </a>
</p> 

<p align="center">
  <a href="https://www.npmjs.com/package/vue-socket.io"><img src="https://img.shields.io/npm/v/vue-socket.io.svg"/> <img src="https://img.shields.io/npm/dt/vue-socket.io.svg"/></a>
  <a href="https://github.com/vuejs/awesome-vue"><img src="https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg"/></a>
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/vue-2.x-brightgreen.svg"/></a>
  <a href="http://packagequality.com/#?package=vue-socket.io"><img src="http://npm.packagequality.com/shield/vue-socket.io.svg"/></a>
  <a href="https://github.com/MetinSeylan/Vue-Socket.io/"><img src="https://img.shields.io/npm/l/vue-socket.io.svg"/></a>
  <a href="https://github.com/MetinSeylan/Vue-Socket.io/"><img src="https://img.shields.io/github/stars/MetinSeylan/Vue-Socket.io.svg"/></a>
</p>

<p>Vue-Socket.io is a socket.io integration for Vuejs, easy to use, supporting Vuex and component level socket consumer managements<p>

###### Demo
- <a href="http://metinseylan.com/vuesocketio/" target="_blank">Chat Application</a>
- <a href="http://metinseylan.com" target="_blank">Car Tracking Application</a>

<p>
are you looking for old documentation? <a href="https://github.com/MetinSeylan/Vue-Socket.io/blob/master/docs/OLD_README.md">it's here</a>
</p>

#### 🚀 Installation
``` bash
npm install vue-socket.io --save
```
##### Using Connection String
``` javascript
import Vue from 'vue'
import store from './store'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://metinseylan.com:1992',
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },
    options: { path: "/my-app/" } //Optional options
}))

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
```

##### Using socket.io-client Instance
``` javascript
import Vue from 'vue'
import store from './store'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io'

const options = { path: '/my-app/' }; //Options object to pass into SocketIO

Vue.use(new VueSocketIO({
    debug: true,
    connection: SocketIO('http://metinseylan.com:1992', options), //options object is Optional
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
  })
);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
```

**Parameters**|**Type's**|**Default**|**Required**|**Description**
-----|-----|-----|-----|-----
debug|Boolean|`false`|Optional|Enable logging for debug
connection|String/Socket.io-client|`null`|Required|Websocket server url or socket.io-client instance
vuex.store|Vuex|`null`|Optional|Vuex store instance
vuex.actionPrefix|String|`null`|Optional|Prefix for emitting server side vuex actions
vuex.mutationPrefix|String |`null`|Optional|Prefix for emitting server side vuex mutations

#### 🌈 Component Level Usage

<p>If you want to listen socket events from component side, you need to add `sockets` object in Vue component, and every function will start to listen events, depends on object key</p>

``` javascript
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

##### Dynamic Listeners

<p>If you need consuming events dynamically in runtime, you can use `subscribe` and `unsubscribe` methods in Vue component</p>

``` javascript
this.sockets.subscribe('EVENT_NAME', (data) => {
    this.msg = data.message;
});

this.sockets.unsubscribe('EVENT_NAME');
```

#### 🏆 Vuex Integration
<p>When you set store parameter in installation, `Vue-Socket.io` will start sending events to Vuex store. If you set both prefix for vuex, you can use `actions` and `mutations` at the same time. But, best way to use is just `actions`</p>

``` javascript
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {
        "<MUTATION_PREFIX><EVENT_NAME>"() {
            // do something
        }
    },
    actions: {
        "<ACTION_PREFIX><EVENT_NAME>"() {
            // do something
        }
    }
})
```

## Stargazers over time

[![Stargazers over time](https://starcharts.herokuapp.com/MetinSeylan/Vue-Socket.io.svg)](https://starcharts.herokuapp.com/MetinSeylan/Vue-Socket.io)
   

<p align="center">
    <a href="https://github.com/MetinSeylan/Vue-Socket.io" target="_blank">
    <img src="https://media.giphy.com/media/11jlnltQgUi2mQ/giphy.gif">
    </a>
</p> 
