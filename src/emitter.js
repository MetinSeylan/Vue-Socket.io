import Logger from './logger';

export default class EventEmitter{

    constructor(vuex = {}){
        Logger.info(vuex ? `Vuex adapter enabled` : `Vuex adapter disabled`);
        this.store = vuex.store;
        this.actionPrefix = vuex.actionPrefix;
        this.mutationPrefix = vuex.mutationPrefix;
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
    emit(event, args){

        if(this.listeners.has(event)){

            Logger.info(`Broadcasting: #${event}, Data:`, args);

            this.listeners.get(event).forEach((listener) => {
                listener.callback.call(listener.component, args);
            });

        }

        if(event !== 'ping' && event !== 'pong') {
            this.dispatchStore(event, args);
        }

    }


    /**
     * dispatching vuex actions
     * @param event
     * @param args
     */
    dispatchStore(event, args){

        if(this.store) {
            
            if(this.store._actions){

                let action_name = event;

                if (!!this.actionPrefix) {
                    let namespace_sep_pos = event.lastIndexOf('/');
                    action_name = (namespace_sep_pos !== -1) ? [event.slice(0, namespace_sep_pos+1), this.actionPrefix, event.slice(namespace_sep_pos+1)].join('') : this.actionPrefix + event;
                }

                
                for (let key in this.store._actions) {

                    if(key === action_name) {

                        Logger.info(`Dispatching Action: ${key}, Data:`, args);

                        this.store.dispatch(key, args);

                    }

                }

            }

            if(this.mutationPrefix) {

                let mutation_name = event;

                if (!!this.mutationPrefix) {
                    let namespace_sep_pos = event.lastIndexOf('/');
                    mutation_name = (namespace_sep_pos !== -1) ? [event.slice(0, namespace_sep_pos+1), this.mutationPrefix, event.slice(namespace_sep_pos+1)].join('') : this.mutationPrefix + event;
                }

                for (let key in this.store._mutations) {

                    if(key === mutation_name) {

                        Logger.info(`Committing Mutation: ${key}, Data:`, args);

                        this.store.commit(key, args);

                    }

                }

            }

        }

    }

}