function renderUsers(){
    const users = Storage.getUsers();
    const container = document.getElementById("userList");
    container.innerHTML = "";

    users.forEach(user=>{
        const div = document.createElement("div");
        div.className = "user-item";
        div.innerText = user.name;
        div.onclick = ()=> selectUser(user.phone);
        container.appendChild(div);
    });
}

function renderMessages(){
    const messages = Storage.getMessages();
    const container = document.getElementById("messages");
    container.innerHTML = "";

    messages.forEach(msg=>{
        const div = document.createElement("div");
        div.innerHTML = `<b>${msg.sender}</b>: ${msg.text}`;
        container.appendChild(div);
    });
}
