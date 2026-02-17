let currentChatUser = null;

window.onload = function(){
    const user = Storage.getUser();
    if(user){
        document.getElementById("auth").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
        renderUsers();
        renderMessages();
    }
};

function register(){
    const phone = document.getElementById("phone").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    if(!phone || !name || !password){
        alert("Заполни всё");
        return;
    }

    const users = Storage.getUsers();

    const user = { phone, name, password };
    users.push(user);

    Storage.saveUsers(users);
    Storage.saveUser(user);

    document.getElementById("auth").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    renderUsers();
}

function selectUser(phone){
    currentChatUser = phone;
    renderMessages();
}

function sendMessage(){
    const text = document.getElementById("messageInput").value;
    const user = Storage.getUser();
    if(!text) return;

    const messages = Storage.getMessages();

    messages.push({
        sender: user.name,
        text
    });

    Storage.saveMessages(messages);
    document.getElementById("messageInput").value = "";
    renderMessages();
}
