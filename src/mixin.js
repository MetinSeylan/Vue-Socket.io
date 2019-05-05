export default {

    /**
     *  Assign runtime callbacks
     */
    beforeCreate(){

        if(!this.sockets) this.sockets = {};

        if (typeof this.$vueSocketIo === 'object') {
            for (const namespace of Object.keys(this.$vueSocketIo)) {
                this.sockets[namespace] = {
                    subscribe: (event, callback) => {
                        this.$vueSocketIo[namespace].emitter.addListener(event, callback, this);
                    },
                    unsubscribe: (event) => {
                        this.$vueSocketIo[namespace].emitter.removeListener(event, this);
                    }
                }
            }
        } else {
            this.$vueSocketIo.emitter.addListener(event, callback, this);
            this.$vueSocketIo.emitter.removeListener(event, this);
        }
    },

    /**
     * Register all socket events
     */
    mounted(){

        if(this.$options.sockets){

            if (typeof this.$vueSocketIo === 'object') {
                for (const namespace of Object.keys(this.$vueSocketIo)) {
                    if (this.$options.sockets[namespace]) {
                        Object.keys(this.$options.sockets[namespace]).forEach(event => {

                            if(event !== 'subscribe' && event !== 'unsubscribe') {
                                this.$vueSocketIo[namespace].emitter.addListener(event, this.$options.sockets[namespace][event], this);
                            }
            
                        });
                    }
                }
            } else {
                Object.keys(this.$options.sockets).forEach(event => {

                    if(event !== 'subscribe' && event !== 'unsubscribe') {
                        this.$vueSocketIo.emitter.addListener(event, this.$options.sockets[event], this);
                    }
    
                });
            }
        }

    },

    /**
     * unsubscribe when component unmounting
     */
    beforeDestroy(){

        if(this.$options.sockets){

            if (typeof this.$vueSocketIo === 'object') {
                for (const namespace of Object.keys(this.$vueSocketIo)) {
                    if (this.$options.sockets[namespace]) {
                        Object.keys(this.$options.sockets[namespace]).forEach(event => {

                            this.$vueSocketIo[namespace].emitter.removeListener(event, this);
            
                        });
                    }
                }
            } else {
                Object.keys(this.$options.sockets).forEach(event => {

                    this.$vueSocketIo.emitter.removeListener(event, this);
    
                });
            }

        }

    }

}