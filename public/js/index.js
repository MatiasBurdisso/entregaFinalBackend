const socket = io();

let username;

Swal.fire({
    title: 'Identificate',
    input : "text",
    text: "Ingresa tu nombre",
    inputValidator: (value) =>{
        return !value && "Es obligatorio introducir tu nombre de usuario";
    },
    allowOutsideClick: false,
}).then((result) => {
    console.log(result);

    username = result.value;
    
});

const chatInput = document.getElementById("chat-input");
chatInput.addEventListener("keyup", (ev) =>{
    if (ev.key === "Enter") {
        const inputMessage = chatInput.value;

        if (inputMessage.trim().length > 0) {
            socket.emit("chat-message", { username, message: inputMessage });

            chatInput.value = "";
            
        }
    }
});

const messagesPanel = document.getElementById("messages-panel");
socket.on("messages", (data) => {
    
    let messages = "";

    data.forEach((m) => {
        messages += `<b>${m.username}: </b> ${m.message}</br>`;
    });

    messagesPanel.innerHTML = messages;
});

const containerProducts = document.getElementById("containerProducts")

socket.on("new-product", (data)=>{
    containerProducts.innerHTML += `
                                    <li>
                                        <p><b>${data.title}</b></p>
                                        <p>Precio: $ ${data.price}</p>
                                        <p>Descripción: ${data.description}</p>
                                        <p>Stock: ${data.stock}</p>
                                        <p>Categoría: ${data.category}</p>
                                    </li>
                                    `
})

socket.on("delete-product", (products)=>{
    containerProducts.innerHTML = ""
    products.forEach( prod => {
        containerProducts.innerHTML += `
                                        <li>
                                            <p><b>${prod.title}</b></p>
                                            <p>Precio: $ ${prod.price}</p>
                                            <p>Descripción: ${prod.description}</p>
                                            <p>Stock: ${prod.stock}</p>
                                            <p>Categoría: ${prod.category}</p>
                                        </li>
                                        `
    }) 
})

socket.on("update-product", (products)=>{
    containerProducts.innerHTML = ""
    products.forEach( prod => {
        containerProducts.innerHTML += `
                                        <li>
                                            <p><b>${prod.title}</b></p>
                                            <p>Precio: $ ${prod.price}</p>
                                            <p>Descripción: ${prod.description}</p>
                                            <p>Stock: ${prod.stock}</p>
                                            <p>Categoría: ${prod.category}</p>
                                        </li>
                                        `
    }) 
})
socket.emit("messege", "Saludos departe de Somos Pacifica");

socket.on("messege", (data) =>{
    console.log(data);
})