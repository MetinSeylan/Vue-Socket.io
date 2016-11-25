import Emitter from './Emitter'
import Socket from 'socket.io-client'

export default class{

    constructor(connection) {
        if (connection.length == 1) {
            this.Socket = Socket(connection[0]);
        } else {
            this.Socket = Socket(connection[0], connection[1]);
        }

        this.onEvent()

    }

    onEvent(){
        this.Socket.onevent = (packet) => {
            Emitter.emit(packet.data[0], packet.data[1])
        }

        let _this = this;

        ["connect", "error", "disconnect", "reconnect", "reconnect_attempt", "reconnecting", "reconnect_error", "reconnect_failed", "connect_error", "connect_timeout", "connecting", "ping", "pong"]
            .forEach((value) => {
                _this.Socket.on(value, (data) => {
                    Emitter.emit(value, data)
                })
            })
    }

}
