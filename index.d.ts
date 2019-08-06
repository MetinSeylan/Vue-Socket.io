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

interface socketHandler<T> {
    (this: T, ...args: any[]): SocketIOClient.Socket
}

declare module 'vue/types/vue' {
    interface Vue {
        $socket: SocketIOClient.Socket
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
        sockets: {[key: string]: socketHandler<V>}
    }
}

export interface VueSocketOptions {
    debug?: boolean;
    connection: string,
    vuex?: {
        store?: any,
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
