const Storage = {

    saveUser(user){
        localStorage.setItem("currentUser", JSON.stringify(user));
    },

    getUser(){
        return JSON.parse(localStorage.getItem("currentUser"));
    },

    saveUsers(users){
        localStorage.setItem("users", JSON.stringify(users));
    },

    getUsers(){
        return JSON.parse(localStorage.getItem("users")) || [];
    },

    saveMessages(messages){
        localStorage.setItem("messages", JSON.stringify(messages));
    },

    getMessages(){
        return JSON.parse(localStorage.getItem("messages")) || [];
    }

};
