import {handleUpgrade} from "vite-sveltekit-cf-ws";

let once = 0
function init(){
    if (once) return
    once = 1
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
}



export const handle = ({event, resolve}) => {
    init()
    return resolve(event)
}
