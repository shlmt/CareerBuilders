const ws = new WebSocket('ws://localhost:3000')


send=()=>{
    let name = document.getElementById('name').value
    if (name && name!="" && ws.OPEN)
        ws.send(JSON.stringify({ name }))
}

ws.onmessage = (event) => {
    const li = document.createElement('li');
    li.textContent = event.data;
    document.getElementById('friends').appendChild(li);
}
