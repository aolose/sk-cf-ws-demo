<script>
    import {onMount} from "svelte";

    let value = ''
    let message = ''
    let status = 'disconnect'
    let times = 0

    let send = () => {
    }
    const d = (fn)=>{
        let i
        return ()=>{
            clearTimeout(i)
            i =setTimeout(fn,300)
        }
    }

    let ws
    const connect = d(() => {
        times++
        status = 'connecting...'
        ws = new WebSocket(`ws${location.origin.slice(4)}/hello`)
        ws.onclose = connect
        ws.onerror = connect
        ws.onopen = () => status = 'connected'
        ws.onmessage = ({data}) => {
            message = `${new Date().toLocaleTimeString()} ${data}\n` + message
        }
        send = function (e) {
            if (e.type === 'keydown' && e.key !== 'Enter') return
            if (value && ws.OPEN) ws.send(value)
            value = ''
            e.target.nextElementSibling.focus()
        }
        return () => ws.close()
    })

    onMount(connect)
</script>
<h1>Sveltekit Cloudflare Websocket Test</h1>
<div>
    <button on:click={send}>Press Enter to send</button>
    <input bind:value={value} on:keydown={send}>
</div>
<div class="msg">
    <pre>{`Client Status: ${times}${[,,'st','nd','rd'][times]||'th'} connection. [${status}]\n${message}`}</pre>
</div>

<style>
    * {
        min-height: 30px;
        padding: 10px 20px;
        margin: 0;
        box-sizing: border-box;
    }

    div {
        display: flex;
    }
    input {
        flex: 1;
        margin-left: 10px
    }

    pre {
        max-height: 500px;
        line-height: 2;
        width: 100%;
        background: #f0f0f0;
        border: 1px solid rgba(0, 0, 0, .2);
        white-space: pre;
    }
</style>
