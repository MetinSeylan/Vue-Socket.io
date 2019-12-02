/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.darkMode = false;
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    info(text, data = '') {

        if(this.debug) {
            if (this.darkMode) {
                window.console.info(this.prefix+`%c${text}`, 'color: #A9D341; font-weight: 600', 'color: #F7AC15', data);
            } else {
                window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', data);
            }
        }

    }

    error() {

        if(this.debug) window.console.error(this.prefix, ...arguments);

    }

    warn() {

        if(this.debug) window.console.warn(this.prefix, ...arguments);

    }

    event(text, data = ''){

        if(this.debug) {
            if (this.darkMode) {
                window.console.info(this.prefix+`%c${text}`, 'color: #A9D341; font-weight: 600', 'color: #F7AC15', data);
            } else {
                window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', data);
            }
        }

    }

}