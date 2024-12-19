import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port:8080 });

interface User{
    socket: WebSocket;
    roomId: string;
}

let userCount = 0;
let allSockets: User[] = [];

wss.on("connection", (socket) => {
    userCount += 1;

    socket.on("message", (message) => {
        const parsedMesssage = JSON.parse(message as unknown as string);
        if( parsedMesssage.type === "join"){
            allSockets.push({
              socket,
              roomId: parsedMesssage.payload.roomId  
            })
        }

        if(parsedMesssage.type === "chat"){
            // const currentUserRoom = allSockets.find((x) => x.socket == socket)?.roomId
            let currentUserRoom = null;
            for(let i = 0; i < allSockets.length; i++){
                if(allSockets[i].socket === socket){
                    currentUserRoom = allSockets[i].roomId;
                }
            }

            for(let i = 0; i < allSockets.length; i++){
                if(allSockets[i].roomId === currentUserRoom){
                    allSockets[i].socket.send(parsedMesssage.payload.message);
                }
            }
        }
    })

})