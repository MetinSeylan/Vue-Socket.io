import Mixin from "./mixin";
import Logger from "./logger";
import Listener from "./listener";
import Emitter from "./emitter";
import SocketIO from "socket.io-client";

export default class VueSocketIO {

    /**
     * lets take all resource
     * @param io
     * @param vuex
     * @param debug
     * @param options
     */
    constructor({connection, vuex, debug, options}){

        Logger.debug = debug;
        this.io = this.connect(connection, options);
        this.useConnectionNamespace = (options && options.useConnectionNamespace);
        this.namespaceName = (options && options.namespaceName);
        this.emitter = new Emitter(vuex);
        this.listener = new Listener(this.io, this.emitter);

    }

    /**
     * Vue.js entry point
     * @param Vue
     */
    install(Vue){

        const namespace = this.namespaceName || this.io.nsp.replace("/", "");

        if (this.useConnectionNamespace) {
          if (typeof Vue.prototype.$socket === "object") {
            Vue.prototype.$socket = {
              ...Vue.prototype.$socket,
              [namespace]: this.io
            };

            Vue.prototype.$vueSocketIo = {...Vue.prototype.$vueSocketIo, [namespace]: this};
          } else {
            Vue.prototype.$socket = {
              [namespace]: this.io
            };
            Vue.prototype.$vueSocketIo = { [namespace]: this};
          }
        } else {
          Vue.prototype.$socket = this.io;
          Vue.prototype.$vueSocketIo = this;
        }
      
        Vue.mixin(Mixin);

        Logger.info('Vue-Socket.io plugin enabled');

    }

  /**
   * registering SocketIO instance
   * @param connection
   * @param options
   */
  connect(connection, options) {
    if (connection && typeof connection === "object") {
      Logger.info(`Received socket.io-client instance`);
      return connection;
    } else if (typeof connection === "string") {
      const io = SocketIO(connection, options);
      Logger.info(`Received connection string`);
      return (this.io = io);
    } else {
      throw new Error("Unsupported connection type");
    }
  }
}
