export default {
  /**
   *  Assign runtime callbacks
   */
  beforeCreate() {
    if (!this.sockets) this.sockets = {};

    this.sockets.subscribe = (event, callback) => {
      this.$vueSocketIo.emitter.addListener(event, callback, this);
    };

    this.sockets.unsubscribe = event => {
      this.$vueSocketIo.emitter.removeListener(event, this);
    };
  },

  /**
   * Register all socket events
   */
  mounted() {
    const { sockets } = this.$options;
    const { emitter } = this.$vueSocketIo;

    if (sockets) {
      Object.keys(sockets).forEach(eventOrNamespace => {
        const functionOrObject = sockets[eventOrNamespace];
        if (
          typeof functionOrObject === 'function' &&
          eventOrNamespace !== 'subscribe' &&
          eventOrNamespace !== 'unsubscribe'
        ) {
          emitter.addListener(eventOrNamespace, functionOrObject, this);
        } else {
          Object.keys(functionOrObject).forEach(event => {
            if (event !== 'subscribe' && event !== 'unsubscribe') {
              emitter.addListener(`${eventOrNamespace}_${event}`, functionOrObject[event], this);
            }
          });
        }
      });
    }
  },

  /**
   * unsubscribe when component unmounting
   */
  beforeDestroy() {
    const { sockets } = this.$options;
    const { emitter } = this.$vueSocketIo;

    if (sockets) {
      Object.keys(sockets).forEach(eventOrNamespace => {
        const functionOrObject = sockets[eventOrNamespace];
        if (typeof functionOrObject === 'function') {
          emitter.removeListener(eventOrNamespace, functionOrObject, this);
        } else {
          Object.keys(functionOrObject).forEach(event => {
            emitter.removeListener(event, functionOrObject[event], this);
          });
        }
      });
    }
  },
};
