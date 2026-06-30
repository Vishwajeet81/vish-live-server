// injected by vish-live-server

const socket = new WebSocket("ws://localhost:5000");

socket.onmessage = (event) => {
  if (event.data === "reload") {
    location.reload();
  }
};
