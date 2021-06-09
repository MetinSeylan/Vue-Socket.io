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

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $socket: SocketIOClient.Socket,
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
    },
        // type declarations for optional options
    options?: ConnectOpts
}

export default class VueSocketIO<T> implements PluginObject<T> {
    constructor (options: VueSocketOptions);
    install: PluginFunction<T>
}

/**
     * Options we can pass to the socket when connecting
     */
 interface ConnectOpts {

    /**
     * Should we force a new Manager for this connection?
     * @default false
     */
    forceNew?: boolean;

    /**
     * Should we multiplex our connection (reuse existing Manager) ?
     * @default true
     */
    multiplex?: boolean;

    /**
     * The path to get our client file from, in the case of the server
     * serving it
     * @default '/socket.io'
     */
    path?: string;

    /**
     * Should we allow reconnections?
     * @default true
     */
    reconnection?: boolean;

    /**
     * How many reconnection attempts should we try?
     * @default Infinity
     */
    reconnectionAttempts?: number;

    /**
     * The time delay in milliseconds between reconnection attempts
     * @default 1000
     */
    reconnectionDelay?: number;

    /**
     * The max time delay in milliseconds between reconnection attempts
     * @default 5000
     */
    reconnectionDelayMax?: number;

    /**
     * Used in the exponential backoff jitter when reconnecting
     * @default 0.5
     */
    randomizationFactor?: number;

    /**
     * The timeout in milliseconds for our connection attempt
     * @default 20000
     */
    timeout?: number;

    /**
     * Should we automically connect?
     * @default true
     */
    autoConnect?: boolean;

    /**
     * The host that we're connecting to. Set from the URI passed when connecting
     */
    host?: string;

    /**
     * The hostname for our connection. Set from the URI passed when connecting
     */
    hostname?: string;

    /**
     * If this is a secure connection. Set from the URI passed when connecting
     */
    secure?: boolean;

    /**
     * The port for our connection. Set from the URI passed when connecting
     */
    port?: string;

    /**
     * Any query parameters in our uri. Set from the URI passed when connecting
     */
    query?: Object;

    /**
     * `http.Agent` to use, defaults to `false` (NodeJS only)
     */
    agent?: string|boolean;

    /**
     * Whether the client should try to upgrade the transport from
     * long-polling to something better.
     * @default true
     */
    upgrade?: boolean;

    /**
     * Forces JSONP for polling transport.
     */
    forceJSONP?: boolean;

    /**
     * Determines whether to use JSONP when necessary for polling. If
     * disabled (by settings to false) an error will be emitted (saying
     * "No transports available") if no other transports are available.
     * If another transport is available for opening a connection (e.g.
     * WebSocket) that transport will be used instead.
     * @default true
     */
    jsonp?: boolean;

    /**
     * Forces base 64 encoding for polling transport even when XHR2
     * responseType is available and WebSocket even if the used standard
     * supports binary.
     */
    forceBase64?: boolean;

    /**
     * Enables XDomainRequest for IE8 to avoid loading bar flashing with
     * click sound. default to `false` because XDomainRequest has a flaw
     * of not sending cookie.
     * @default false
     */
    enablesXDR?: boolean;

    /**
     * The param name to use as our timestamp key
     * @default 't'
     */
    timestampParam?: string;

    /**
     * Whether to add the timestamp with each transport request. Note: this
     * is ignored if the browser is IE or Android, in which case requests
     * are always stamped
     * @default false
     */
    timestampRequests?: boolean;

    /**
     * A list of transports to try (in order). Engine.io always attempts to
     * connect directly with the first one, provided the feature detection test
     * for it passes.
     * @default ['polling','websocket']
     */
    transports?: string[];

    /**
     * The port the policy server listens on
     * @default 843
     */
    policyPort?: number;

    /**
     * If true and if the previous websocket connection to the server succeeded,
     * the connection attempt will bypass the normal upgrade process and will
     * initially try websocket. A connection attempt following a transport error
     * will use the normal upgrade process. It is recommended you turn this on
     * only when using SSL/TLS connections, or if you know that your network does
     * not block websockets.
     * @default false
     */
    rememberUpgrade?: boolean;

    /**
     * Are we only interested in transports that support binary?
     */
    onlyBinaryUpgrades?: boolean;

    /**
     * Transport options for Node.js client (headers etc)
     */
    transportOptions?: Object;

    /**
     * (SSL) Certificate, Private key and CA certificates to use for SSL.
     * Can be used in Node.js client environment to manually specify
     * certificate information.
     */
    pfx?: string;

    /**
     * (SSL) Private key to use for SSL. Can be used in Node.js client
     * environment to manually specify certificate information.
     */
    key?: string;

    /**
     * (SSL) A string or passphrase for the private key or pfx. Can be
     * used in Node.js client environment to manually specify certificate
     * information.
     */
    passphrase?: string

    /**
     * (SSL) Public x509 certificate to use. Can be used in Node.js client
     * environment to manually specify certificate information.
     */
    cert?: string;

    /**
     * (SSL) An authority certificate or array of authority certificates to
     * check the remote host against.. Can be used in Node.js client
     * environment to manually specify certificate information.
     */
    ca?: string|string[];

    /**
     * (SSL) A string describing the ciphers to use or exclude. Consult the
     * [cipher format list]
     * (http://www.openssl.org/docs/apps/ciphers.html#CIPHER_LIST_FORMAT) for
     * details on the format.. Can be used in Node.js client environment to
     * manually specify certificate information.
     */
    ciphers?: string;

    /**
     * (SSL) If true, the server certificate is verified against the list of
     * supplied CAs. An 'error' event is emitted if verification fails.
     * Verification happens at the connection level, before the HTTP request
     * is sent. Can be used in Node.js client environment to manually specify
     * certificate information.
     */
    rejectUnauthorized?: boolean;

    /**
     * Credentials that are sent when accessing a namespace
     */
    auth?: Object;
}