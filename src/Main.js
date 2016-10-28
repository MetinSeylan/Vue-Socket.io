import Observer from './Observer'
import Emitter from './Emitter'

export default {

    install(Vue, connection){

        if(!connection) throw new Error("[Vue-Socket.io] cannot locate connection")

        let observer = new Observer(connection)

        Vue.prototype.$socket = observer.Socket;

        Vue.mixin({
            beforeCreate(){
                let _this = this;
                let sockets = this.$options['sockets']

                if(sockets){
                    Object.keys(sockets).forEach(function(key) {
                        Emitter.addListener(key, sockets[key], _this)
                    });
                }

            },
            beforeDestroy(){
                let _this = this;
                let sockets = this.$options['sockets']

                if(sockets){
                    Object.keys(sockets).forEach(function(key) {
                        Emitter.removeListener(key, sockets[key], _this)
                    });
                }
            }
        })

    }

}