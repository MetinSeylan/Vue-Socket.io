;(function () {
    var Socketio = typeof require === "function"
        ? require("socket.io-client")
        : window.io;

    if (!Socketio) {
        throw new Error("[Vue-Socket.io] cannot locate Socket.io")
    }

    var VueSocketio = {
        install: function (Vue, connection) {

            if (!connection) {
                throw new Error("[Vue-Socket.io] cannot locate connection")
            }

            var socket = Socketio(connection);

            /*
             * Wildcard support
             * http://stackoverflow.com/questions/10405070/socket-io-client-respond-to-all-events-with-one-handler
             */
            var onevent = socket.onevent;
            socket.onevent = function (packet) {
                var args = packet.data || [];
                onevent.call(this, packet);
                packet.data = ["*"].concat(args);
                onevent.call(this, packet);
            };

            var methods = [
                "connect",
                "error",
                "disconnect",
                "reconnect",
                "reconnect_attempt",
                "reconnecting",
                "reconnect_error",
                "reconnect_failed"
            ];

            Vue.mixin({
                created: function () {
                    var me = this;
                    if (this.$options.hasOwnProperty("sockets")) {
                        socket.on("*", function (emit, data) {
                            if (me.$options.sockets.hasOwnProperty(emit)) {
                                me.$options.sockets[emit](data);
                            }
                        });

                        methods.forEach(function (m) {
                            socket.on(m, function (data) {
                                if (me.$options.sockets.hasOwnProperty(m)) {
                                    me.$options.sockets[m](data);
                                }
                            });
                        });
                    }

                    // Global socketio instance
                    this.$socket = socket;
                }
            });


        }
    };

    if (typeof exports == "object") {
        module.exports = VueSocketio
    } else if (typeof define == "function" && define.amd) {
        define([], function () {
            return VueSocketio
        })
    } else if (window.Vue) {
        window.VueSocketio = VueSocketio;
    }


})();