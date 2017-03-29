# Vue-Socket.io

[![NPM version](https://img.shields.io/npm/v/vue-socket.io.svg)](https://www.npmjs.com/package/vue-socket.io)
![VueJS v2 compatible](https://img.shields.io/badge/Vuejs%202-compatible-green.svg)
<a href="https://www.npmjs.com/package/vue-socket.io"><img src="https://img.shields.io/npm/dt/vue-socket.io.svg" alt="Downloads"></a>
<img id="dependency_badge" src="https://www.versioneye.com/javascript/metinseylan:vue-socket.io/2.0.1/badge.svg" alt="Dependency Badge" rel="nofollow">
<a href="https://www.npmjs.com/package/vue-socket.io"><img src="https://img.shields.io/npm/l/vue-socket.io.svg" alt="License"></a>

socket.io implementation for Vuejs 2 and Vuex

## Install

``` bash
npm install vue-socket.io --save
```

## Usage
#### Configuration
Automatic socket connection from an URL string
``` js
import VueSocketio from 'vue-socket.io';
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
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
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

#### Dynamic socket event listeners
Create a new listener
``` js
this.$options.sockets.event_name = (data) => {
    console.log(data)
}
```
Remove existing listener
``` js
delete this.$options.sockets.event_name;
```

#### Vuex Store integration

Socket **mutations** always have `SOCKET_` prefix.

Socket **actions** always have `socket_` prefix and the socket event name is `camelCased` (ex. `SOCKET_USER_MESSAGE` => `socket_userMessage`) 

You can use either one or another or both in your store. Namespaced modules are supported.

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
        otherAction: (context, type) => {
            return true;
        },
        socket_userMessage: (context, message) => {
            context.dispatch('newMessage', message);
            context.commit('NEW_MESSAGE_RECEIVED', message);
            if (message.is_important) {
                context.dispatch('alertImportantMessage', message);
            }
            ...
        }
    }
})
```

## Example
[Realtime Car Tracker System](http://metinseylan.com/)

[Simple Chat App](http://metinseylan.com/vuesocketio/)
