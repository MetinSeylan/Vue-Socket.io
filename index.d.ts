import SocketIOClient from "socket.io-client";
import {
    DefaultComputed,
    DefaultData,
    DefaultMethods,
    DefaultProps,
    PropsDefinition,
} from "vue/types/options";
import { Vue } from "vue/types/vue";
import { PluginFunction, PluginObject } from "vue";
import { Store } from "vuex";

interface socketHandler<T> {
    (this: T, ...args: any[]): void
}

interface Sockets<V> {
    [key: string]: socketHandler<V>
}

declare module 'vue/types/vue' {
    interface Vue {
        $socket: SocketIOClient.Socket,
        sockets: {
            subscribe(eventName: string, handler: socketHandler<Vue>): void,
            unsubscribe(eventName: string): void,
        }
    }
}

declare module 'vue/types/options' {
    interface ComponentOptions<
        V extends Vue,
        Data=DefaultData<V>,
        Methods=DefaultMethods<V>,
        Computed=DefaultComputed,
        PropsDef=PropsDefinition<DefaultProps>,
        Props=DefaultProps> {
        sockets?: Sockets<V>
    }
}

export interface VueSocketOptions {
    debug?: boolean;
    connection: string | SocketIOClient.Socket,
    vuex?: {
        store?: Store<any>,
        actionPrefix?: string,
        mutationPrefix?: string,
        options?: {
            useConnectionNamespace?: boolean
        }
    }
}

export default class VueSocketIO<T> implements PluginObject<T> {
    constructor (options: VueSocketOptions);
    install: PluginFunction<T>
}
