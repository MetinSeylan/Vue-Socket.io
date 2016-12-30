# Vue-Socket.io

[![NPM version](https://img.shields.io/npm/v/vue-socket.io.svg)](https://www.npmjs.com/package/vue-socket.io)
![VueJS v2 compatible](https://img.shields.io/badge/Vuejs%202-compatible-green.svg)
<a href="https://www.npmjs.com/package/vue-socket.io"><img src="https://img.shields.io/npm/dt/vue-socket.io.svg" alt="Downloads"></a>
<img id="dependency_badge" src="https://www.versioneye.com/javascript/metinseylan:vue-socket.io/2.0.1/badge.svg" alt="Dependency Badge" rel="nofollow">
<a href="https://www.npmjs.com/package/vue-socket.io"><img src="https://img.shields.io/npm/l/vue-socket.io.svg" alt="License"></a>

socket.io implemantation for Vuejs 2 and Vuex

## Install

``` bash
npm install vue-socket.io --save
```

## Usage
#### Configration
Automaticly socket connect from url string
``` js
Vue.use(VueSocketio, 'http://socketserver.com:1923');
```

Bind custom socket.io-client instance
``` js
Vue.use(VueSocketio, socketio('http://socketserver.com:1923'));
```

Enable Vuex integration
``` js
import store from './yourstore'
Vue.use(VueSocketio, socketio('http://socketserver.com:1923'), store);
```

#### On Vuejs instance usage
``` js
var vm = new Vue({
  sockets:{
    connect: function(){
      console.log('socket connected')
    },
    customEmit: function(val){
      console.log('this method fired by socket server. eg: io.emit("customEmit", data)')
    }
  },
  methods: {
    clickButton: function(val){
        // $socket is socket.io-client instance
        this.$socket.emit('emit_method', val);
    }
  }
})
```

#### Dynamic socket event listenlers
Create new listenler
``` js
this.$options.sockets.event_name = (data) => {
    console.log(data)
}
```
Remove exist listenler
``` js
delete this.$options.sockets.event_name;
```

#### Vuex Store integration
Example store, socket mutations always have "SOCKET_" prefix
``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        connect: false,
        message: null
    },
    mutations:{
        SOCKET_CONNECT: (state,  status ) => {
            state.connect = true;
        },
        SOCKET_USER_MESSAGE: (state,  message) => {
            state.message = message;
        }
    },
    actions: {
        otherAction: ({ commit, dispatch, state }, type) => {
            return true;
        }
    }
})
```

## Example
[Realtime Car Tracker System](http://metinseylan.com/)

[Simple Chat App](http://metinseylan.com/vuesocketio/)
