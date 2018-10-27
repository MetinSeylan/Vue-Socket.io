import Logger from './logger';

export default class EventEmitter{

    constructor(vuex = {}){
        Logger.info(vuex ? `Vuex adapter active` : `Vuex adapter disabled`);
        this.store = vuex.store;
        this.prefix = vuex.prefix ? vuex.prefix : 'SOCKET_';
        this.listeners = new Map();
    }

    /**
     * register new event listener with vuejs component instance
     * @param event
     * @param callback
     * @param component
     */
    addListener(event, callback, component){

        if(typeof callback === 'function'){

            if (!this.listeners.has(event)) this.listeners.set(event, []);
            this.listeners.get(event).push({ callback, component });

            Logger.info(`#${event} subscribe, component: ${component.$options.name}`);

        } else {

            throw new Error(`callback must be a function`);

        }

    }

    /**
     * remove a listenler
     * @param event
     * @param component
     */
    removeListener(event, component){

        if(this.listeners.has(event)){

            const listeners = this.listeners.get(event).filter(listener => (
                listener.component !== component
            ));

            if (listeners.length > 0) {
                this.listeners.set(event, listeners);
            } else {
                this.listeners.delete(event);
            }

            Logger.info(`#${event} unsubscribe, component: ${component.$options.name}`);

        }

    }

    /**
     * broadcast incoming event to components
     * @param event
     * @param args
     */
    emit(event, ...args){

        if(this.listeners.has(event)){

            Logger.info(`Broadcasting: #${event}, Data:`, ...args);

            this.listeners.get(event).forEach((listener) => {
                listener.callback.call(listener.component, ...args)
            });

        }

        this.dispatchStore(event, ...args)

    }


    /**
     * dispatching vuex actions
     * @param event
     * @param args
     */
    dispatchStore(event, ...args){

        if(this.store && this.store._actions){

            for (let key in this.store._actions) {

                let action = key.split('/').pop();

                if(action === this.prefix+event) {

                    Logger.info(`Dispatching Action: ${action}, Data:`, ...args);

                    this.store.dispatch(action, ...args);

                }

            }

        }

    }

}