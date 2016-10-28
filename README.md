# Vue-Socket.io
socket.io implemantation for Vuejs 2.0 and 1.0

## Install

  ``` bash
  npm install vue-socket.io --save
  ```
  for Vue 1.0

  ``` bash
  npm install vue-socket.io@1.0.2 --save
  ```
  
## Usage

``` js
import VueSocketio from 'vue-socket.io';

Vue.use(VueSocketio, 'http://socketserver.com:1923'); // Automaticly socket connect from url string

/*
  import socketio from 'socket.io-client';
  
  var ioInstance = socketio('http://socketserver.com:1923');
  
  Vue.use(VueSocketio, ioInstance); // bind custom socketio instance
*/

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

## Example
[Realtime Car Tracker System](http://metinseylan.com/)

[Simple Chat App](http://metinseylan.com/vuesocketio/)

## License
[WTFPL](http://www.wtfpl.net/)
