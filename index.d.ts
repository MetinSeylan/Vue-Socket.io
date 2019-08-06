import SocketIOClient from "socket.io-client";
import {
    DefaultComputed,
    DefaultData,
    DefaultMethods,
    DefaultProps,
    PropsDefinition,
} from "vue/types/options";
import { Vue } from "vue/types/vue";

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
