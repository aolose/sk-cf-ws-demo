import {handleUpgrade} from "vite-sveltekit-cf-ws";

const pools = new Set()
const msg = (c, s) => pools.forEach(a => a.send(c+s))
// 0-sys
// 1-user
const online = ()=> msg( 0,`online users:${pools.size}`);
handleUpgrade((req, createWebsocketServer) => {
    const pathname = new URL(req.url || '', 'ws://base.url').pathname
    if (pathname === '/hello') {
        const ws = createWebsocketServer()
        const user = `👽${Math.random().toString(36).slice(8)}`
        pools.add(ws)
        ws.accept()
        online()
        msg(1,`${user} has joined the channel.`);
        ws.addEventListener('close',()=>{
            pools.delete(ws)
            online()
            msg(1,`${user} has left the channel.`)
        })
        ws.addEventListener('message', ({data}) => {
            msg(1,`${user}: ${data}`)
        })
    }
})
