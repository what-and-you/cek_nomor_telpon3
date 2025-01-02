// Menyimpan username di localStorage jika belum ada
window.onload = function() {
    if (localStorage.getItem('username')) {
        document.getElementById('username-form').style.display = 'none';
        document.getElementById('chat-area').style.display = 'block';
    } else {
        document.getElementById('username-form').style.display = 'block';
    }
};

// Mengatur username dan menyimpannya di localStorage
function setUsername() {
    let username = document.getElementById('username-input').value;
    if (username) {
        localStorage.setItem('username', username);
        document.getElementById('username-form').style.display = 'none';
        document.getElementById('chat-area').style.display = 'block';
        startChat();
    } else {
        alert('Masukkan username!');
    }
}

// Inisialisasi WebSocket
let socket;
function startChat() {
    const username = localStorage.getItem('username');
    socket = new WebSocket('ws://localhost:8080'); // Sesuaikan dengan URL WebSocket server

    socket.onopen = function() {
        console.log('Terhubung ke server WebSocket');
    };

    socket.onmessage = function(event) {
        const messageData = JSON.parse(event.data);
        displayMessage(messageData);
    };

    socket.onclose = function() {
        console.log('Terputus dari server WebSocket');
    };

    socket.onerror = function(error) {
        console.error('WebSocket Error: ' + error);
    };
}

// Mengirim pesan
function sendMessage() {
    const message = document.getElementById('message-input').value;
    const username = localStorage.getItem('username');
    
    if (message) {
        const messageData = {
            username: username,
            message: message
        };
        socket.send(JSON.stringify(messageData)); // Kirim pesan ke server
        document.getElementById('message-input').value = ''; // Kosongkan input setelah kirim
    }
}

// Menampilkan pesan di layar
function displayMessage(data) {
    const messageContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<strong>${data.username}</strong>: ${data.message}`;
    messageContainer.appendChild(messageElement);
}
