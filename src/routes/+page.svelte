<script>
    import {onMount} from "svelte";

    let value = ''
    let sys = ''
    /**@type {HTMLPreElement} */
    let pre;
    let message = ''
    let status = 'disconnect'

    /**@type {WebSocket}*/
    let socket
    /**@param e {KeyboardEvent}*/
    let send = e => {
    }
    const connect = () => {
        status = 'connecting...'
        socket = new WebSocket(`ws${location.origin.slice(4)}/hello`)
        socket.onclose = () => setTimeout(connect, 200)
        socket.onopen = () => status = 'connected'
        socket.onmessage = ({data}) => {
            console.log(data)
            const ch = data[0]
            const msg = data.slice(1)
            if (ch==='0') {
                sys = msg
            }else {
                message += `[${new Date().toLocaleTimeString()}] ${msg}\n`
                setTimeout(() => {
                    pre.scrollTo({
                        top: pre.scrollHeight,
                        behavior: 'smooth'
                    })
                }, 30)
            }
        }
        send = function (e) {
            if (!value || status !== 'connected' || e.type === 'keydown' && e.key !== 'Enter') return
            socket.send(value)
            value = ''
        }
        return () => socket.close()
    }
    onMount(connect)
    const op = () => {
        window.open('/', '',
            `toolbar=no,
            location=no,
            status=no,
            menubar=no,
            scrollbars=no,
            resizable=yes,
            width=400,
            height=400`)
    }
</script>
<div class="box">
    <div class="h">
        <h1>Sveltekit(adapter-cloudflare) Websocket Demo</h1>
        <p>{sys} status:{status} </p>
    </div>
    <div class="msg">
        <pre bind:this={pre}>{`${message}`}</pre>
    </div>
    <div class="ipt">
        <button on:click={op}>OPEN NEW CHAT</button>
        <input bind:value={value} placeholder="Press Enter to send" on:keydown={send}>
    </div>
</div>

<style>
    * {
        min-height: 30px;
        padding: 10px;
        margin: 0;
        font-size: 13px;
        box-sizing: border-box;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }

    .h {
        padding: 0 10px
    }

    .h * {
        padding: 0 0 10px;
    }

    h1 {
        font-size: 14px;
        color: #fff;
    }

    div {
        display: flex;
    }

    p {
        flex: 1;
        text-align: right;
    }

    .ipt {
        padding: 10px 0;
    }

    input {
        color: greenyellow;
        flex: 1;
        margin-left: 5px;
        padding: 15px 20px;
        font-size: 16px;
    }

    input::placeholder {
        color: rgba(123, 255, 0, 0.51);
    }

    button {
        cursor: pointer;
        font-size: 12px;
        background: greenyellow;
        font-weight: 800;
    }

    input, .msg {
        background: rgba(255, 255, 255, 0.01);
        border: 1px solid rgba(124, 255, 2, 0.38);
    }

    .msg {
        flex: 1;
        padding: 0;
    }

    .box {
        position: absolute;
        flex-direction: column;
        align-content: center;
        justify-content: center;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #000000;
        color: greenyellow;
    }

    pre {
        max-height: 100%;
        overflow: auto;
        line-height: 2;
        width: 100%;
        padding: 20px;
        white-space: pre-wrap;
        align-self: flex-end;
        scrollbar-color: rgba(128, 128, 128, 0.32) rgba(169, 169, 169, 0.27);
        scrollbar-width: thin;
    }
</style>
