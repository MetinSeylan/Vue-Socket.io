export default class VueSocketIOListener {
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
        'pong',
    ];

    constructor(io, emitter) {
        this.io = io;
        this.register();
        this.emitter = emitter;
    }

    /**
     * Listening all socket.io events
     */
    register() {
        if (this.io.constructor.name === 'Object') {
            Object.keys(this.io).forEach(namespace => {
                this.registerEvents(this.io[namespace], namespace);
            });
        } else {
            this.registerEvents(this.io);
        }
    }

    registerEvents(io, namespace) {
        io.onevent = packet => {
            let [event, ...args] = packet.data;

            if (args.length === 1) args = args[0];

            this.onEvent(this.getEventName(event, namespace), args);
        };

        VueSocketIOListener.staticEvents.forEach(event =>
            io.on(event, args => this.onEvent(this.getEventName(event, namespace), args)),
        );
    }

    getEventName(event, namespace) {
        return namespace ? namespace + '_' + event : event;
    }

    /**
     * Broadcast all events to vuejs environment
     */
    onEvent(event, args) {
        this.emitter.emit(event, args);
    }
}
