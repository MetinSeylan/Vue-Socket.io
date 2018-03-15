import Observer from './Observer'
import Emitter from './Emitter'

export default {

    install(Vue, connection, store){

        if(!connection) throw new Error("[Vue-Socket.io] cannot locate connection")

        let observer = new Observer(connection, store)

        Vue.prototype.$socket = observer.Socket;

        Vue.mixin({
            created(){
                let sockets = this.$options['sockets']

                // define on and off as non-enumerable properties
                Object.defineProperty(this.$options.sockets, 'on', {
                    value: (label, callback) => {
                        Emitter.addListener(label, callback, this);
                        this.$options.sockets[label] = callback;
                    }
                });

                Object.defineProperty(this.$options.sockets, 'off', {
                    value: (label, callback) => {
                        Emitter.removeListener(label, callback, this);
                        delete this.$options.sockets[label];
                    }
                });

                if(sockets){
                    Object.keys(sockets).forEach((key) => {
                        Emitter.addListener(key, sockets[key], this);
                    });
                }
            },
            beforeDestroy(){
                let sockets = this.$options['sockets']

                if(sockets){
                    Object.keys(sockets).forEach((key) => {
                        Emitter.removeListener(key, sockets[key], this);
                        delete this.$options.sockets[key];
                    });
                }
            }
        })

    }

}


