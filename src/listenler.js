
export default class VueSocketIOListenler {

    /**
     * socket.io-client reserved event keywords
     * @type {string[]}
     */
    static staticEvents = [
            'connect',
            'error',
            'disconnect',
            'reconnect',
            'reconnect_attempt',
            'reconnecting',
            'reconnect_error',
            'reconnect_failed',
            'connect_error',
            'connect_timeout',
            'connecting',
            'ping',
            'pong'
    ];

    constructor(io, emitter){
        this.io = io;
        this.register();
        this.emitter = emitter;
    }

    /**
     * Listening all socket.io events
     */
    register(){
        this.io.onevent = (packet) => this.onEvent(packet.data[0], packet.data[1]);
        VueSocketIOListenler.staticEvents.forEach(event => this.io.on(event, () => this.onEvent(event)))
    }

    /**
     * Broadcast all events to vuejs environment
     */
    onEvent(event, data = {}){
        this.emitter.emit(event, data);
    }

}
