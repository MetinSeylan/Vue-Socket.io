import Emitter from './Emitter'
import Socket from 'socket.io-client'

export default class{

    constructor(connection, store) {
      this.Sockets = null

      if(typeof connection == 'string'){
          this.Socket = Socket(connection);
      } else if(typeof connection == 'object') {
        this.Sockets = []
        Object.keys(connection).forEach(key => {
          this.Sockets[key] = Socket(connection[key]);
        });
      } else{
          this.Socket = connection
      }

      if(store) this.store = store;

      (this.Sockets) ? this.onEvents() : this.onEvent()
    }


    onEvents(){
      for(let socket in this.Sockets){
        this.onEventWithKey(this.Sockets[socket], socket)
      }
    }

    onEventWithKey(socket, key){
      var super_onevent = socket.onevent;
      console.log('super event', super_onevent)
      socket.onevent = (packet) => {
        super_onevent.call(socket, packet);

        Emitter.emit(packet.data[0], packet.data[1]);

        if(this.store) this.passToStoreWithKey(key.toUpperCase()+'_SOCKET_'+packet.data[0],  [ ...packet.data.slice(1)], key)
      };

      let _this = this;

      ["connect", "error", "disconnect", "reconnect", "reconnect_attempt", "reconnecting", "reconnect_error", "reconnect_failed", "connect_error", "connect_timeout", "connecting", "ping", "pong"]
        .forEach((value) => {
          socket.on(value, (data) => {
            Emitter.emit(value, data);
            if(_this.store) _this.passToStoreWithKey(key.toUpperCase()+'_SOCKET_'+value, data, key)
          })
        })
    }

    passToStoreWithKey(event, payload, key){
      if(!event.startsWith(key.toUpperCase()+'_SOCKET_')) return
      for(let namespaced in this.store._mutations) {
        let mutation = namespaced.split('/').pop()
        if(mutation === event.toUpperCase()) this.store.commit(namespaced, payload)
      }

      for(let namespaced in this.store._actions) {
        let action = namespaced.split('/').pop()
        if(!action.startsWith(key+'_socket_')) continue

        let camelcased = key+'_socket_'+event
            .replace(key.toUpperCase()+'_SOCKET_', '')
            .replace(/^([A-Z])|[\W\s_]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase())

        if(action === camelcased) this.store.dispatch(namespaced, payload)
      }
    }

    onEvent(){
        var super_onevent = this.Socket.onevent;
        this.Socket.onevent = (packet) => {
            super_onevent.call(this.Socket, packet);

            Emitter.emit(packet.data[0], packet.data[1]);

            if(this.store) this.passToStore('SOCKET_'+packet.data[0],  [ ...packet.data.slice(1)])
        };

        let _this = this;

        ["connect", "error", "disconnect", "reconnect", "reconnect_attempt", "reconnecting", "reconnect_error", "reconnect_failed", "connect_error", "connect_timeout", "connecting", "ping", "pong"]
            .forEach((value) => {
                _this.Socket.on(value, (data) => {
                    Emitter.emit(value, data);
                    if(_this.store) _this.passToStore('SOCKET_'+value, data)
                })
            })
    }


    passToStore(event, payload){
        if(!event.startsWith('SOCKET_')) return

        for(let namespaced in this.store._mutations) {
            let mutation = namespaced.split('/').pop()
            if(mutation === event.toUpperCase()) this.store.commit(namespaced, payload)
        }

        for(let namespaced in this.store._actions) {
            let action = namespaced.split('/').pop()

            if(!action.startsWith('socket_')) continue

            let camelcased = 'socket_'+event
                    .replace('SOCKET_', '')
                    .replace(/^([A-Z])|[\W\s_]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase())

            if(action === camelcased) this.store.dispatch(namespaced, payload)
        }
    }
}
