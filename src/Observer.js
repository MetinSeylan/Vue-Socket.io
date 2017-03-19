import Emitter from './Emitter'
import Socket from 'socket.io-client'

export default class{

    constructor(connection, store, useActions) {

        if(typeof connection == 'string'){
            this.Socket = Socket(connection);
        }else{
            this.Socket = connection
        }

        if(store) {
            this.store = store;
            this.useActions = useActions;
        }

        this.onEvent()

    }

    onEvent(){
        this.Socket.onevent = (packet) => {
            Emitter.emit(packet.data[0], packet.data[1]);

            if(this.store)
                this.useActions
                    ? this.dispatchStore('SOCKET_'+packet.data[0], packet.data[1])
                    : this.commitStore('SOCKET_'+packet.data[0], packet.data[1])

        };

        let _this = this;
        ["connect", "error", "disconnect", "reconnect", "reconnect_attempt", "reconnecting", "reconnect_error", "reconnect_failed", "connect_error", "connect_timeout", "connecting", "ping", "pong"]
            .forEach((value) => {
                _this.Socket.on(value, (data) => {
                    Emitter.emit(value, data);
                    if(_this.store) {
                        const toCamelCase = (str) => str.split('_')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join('')

                        _this.useActions
                            ? _this.dispatchStore('socket' + toCamelCase(value), data)
                            : _this.commitStore('SOCKET_' + value.toUpperCase(), data)
                    }
                })
            })
    }


    commitStore(type, payload){

        if(type.split('_')[0].toUpperCase() === 'SOCKET'){

            for (let namespaced in this.store._mutations) {
                let mutation = namespaced.split('/').pop()

                if (mutation === type)
                    this.store.commit(namespaced, payload)
            }

        }

    }

    dispatchStore(type, payload){

        if(type.search(/socket/) === 0){

            if(this.store._actions[type])
                this.store.dispatch(type, payload)

        }

    }

}
