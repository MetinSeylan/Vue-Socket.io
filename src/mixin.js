export default {

    /**
     *  Assign runtime callbacks
     */
    beforeCreate(){

        if(!this.sockets) this.sockets = {};

        this.sockets.subscribe = (event, callback) => {
            this.$vueSocketIo.emitter.addListener(event, callback, this);
        };

        this.sockets.unsubscribe = (event) => {
            this.$vueSocketIo.emitter.removeListener(event, this);
        };

    },

    /**
     * Register all socket events
     */
    mounted(){

        if(this.$options.sockets){

            Object.keys(this.$options.sockets).forEach(event => {

                if(event !== 'subscribe' && event !== 'unsubscribe') {
                    this.$vueSocketIo.emitter.addListener(event, this.$options.sockets[event], this);
                }

            });

        }

    },

    /**
     * unsubscribe when component unmounting
     */
    beforeUnmount(){

        if(this.$options.sockets){

            Object.keys(this.$options.sockets).forEach(event => {

                this.$vueSocketIo.emitter.removeListener(event, this);

            });

        }

    }

}