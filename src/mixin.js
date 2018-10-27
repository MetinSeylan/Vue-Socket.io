export default {

    /**
     * lets collect all socket callback functions then register
     */
    created(){

        if(this.$options.sockets){

            Object.keys(this.$options.sockets).forEach(event => {

                if(event !== 'subscribe' && event !== 'unsubscribe') {
                    this.$vueSocketIo.emitter.addListener(event, this.$options.sockets[event], this);
                }

            });

            this.sockets = {
                subscribe: (event, callback) => {

                    this.$vueSocketIo.emitter.addListener(event, callback, this);

                },
                unsubscribe: (event) => {

                    this.$vueSocketIo.emitter.removeListener(event, this);

                }
            };

        }

    },

    /**
     * unsubscribe when component unmounting
     */
    beforeDestroy(){

        if(this.$options.sockets){

            Object.keys(this.$options.sockets).forEach(event => {

                this.$vueSocketIo.emitter.removeListener(event, this);

            });

        }

    }

}