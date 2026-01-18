import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
export const getSocket = () => {
  try {

    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER);

      return socket;
    }
	return socket;
  } catch (err) {
    console.log("Erro occured while getting the socket..");
  }
};
