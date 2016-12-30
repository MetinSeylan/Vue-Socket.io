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
        this.Socket.onevent = (packet) => {
            Emitter.emit(packet.data[0], packet.data[1]);

            if(this.store) this.commitStore('SOCKET_'+packet.data[0], packet.data[1])

        };

        let _this = this;

        ["connect", "error", "disconnect", "reconnect", "reconnect_attempt", "reconnecting", "reconnect_error", "reconnect_failed", "connect_error", "connect_timeout", "connecting", "ping", "pong"]
            .forEach((value) => {
                _this.Socket.on(value, (data) => {
                    Emitter.emit(value, data);
                    if(_this.store) _this.commitStore('SOCKET_'+value.toUpperCase(), data)
                })
            })
    }


    commitStore(type, payload){

        if(type.split('_')[0].toUpperCase() === 'SOCKET'){

            if(this.store._mutations[type])
                this.store.commit(type, payload)

        }

    }

}
