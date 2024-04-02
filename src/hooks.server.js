import {handleUpgrade} from "vite-sveltekit-cf-ws";

handleUpgrade((req, createWebsocketServer) => {
    const pathname = new URL(req.url || '', 'ws://base.url').pathname
    if (pathname === '/hello') {
        const server = createWebsocketServer()
        server.accept()
        server.addEventListener('message', ({data}) => {
            server.send(`[ws server] received message: "${data}"`)
        })
    }
})
