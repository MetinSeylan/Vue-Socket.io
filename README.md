# Vue-Socket.io
socket.io implemantation for vuejs

## Install

  ``` bash
  npm install vue-socket.io --save
  ```
  or

  ``` bash
  bower install vue-socket.io
  ```
  
## Usage

``` js
import VueSocketio from 'vue-socket.io'; // for ES6

// var VueSocketio = require('vue-socket.io') // for commonjs

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
    customEmit: function(){
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
[Vue-Socket.io Example](http://metinseylan.com/vuesocketio/)

## License
[WTFPL](http://www.wtfpl.net/)
