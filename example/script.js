Vue.use(VueSocketio, 'http://metinseylan.com:1923');

new Vue({
    el: '.container',
    data: {
        join: false,
        name: null,
        users: null,
        message: null,
        messages: {}
    },
    methods: {
        joinChat: function (name) {
            if (name) {
                this.$socket.emit('join', name);
            }
        },
        send: function (message) {
            if (message) {
                this.$socket.emit('send', message);
                this.$set('message', null);
            }
        }
    },
    watch: {
        messages: function () {
            setTimeout(function () {
                $('.messages ul').scrollTop(999999999);
            }, 100)
        }
    },
    sockets: {
        users: function (users) {
            this.$set('users', users);
        },
        joined: function () {
            this.$set('join', true)
        },
        messages: function (data) {
            this.$set('messages', data);
        },
        onmessage: function (data) {
            this.messages.push(data);
        },
        adduser: function (user) {
            this.users.push(user);
        }
    }
});