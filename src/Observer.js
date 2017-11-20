import Emitter from './Emitter'
import Socket from 'socket.io-client'

export default class{

    constructor(connection, store) {

        if(typeof connection == 'string'){
            this.Socket = Socket(connection);
        }else{
            this.Socket = connection
        }

        if(store) this.store = store;

        this.onEvent()

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

            let camelcased = 'socket_'+event.toLowerCase()
                    .replace('SOCKET_', '')
                    .replace(/[\W\s_]+(\w)/g, (match, p1) => p1.toUpperCase())

            if(action === camelcased) this.store.dispatch(namespaced, payload)
        }
    }
}
