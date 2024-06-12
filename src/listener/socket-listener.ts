import { io } from 'socket.io-client';

export class SocketListener {
    static async getResult(taskId: string, callback: (data: string) => void, error: (e: string) => void): Promise<void> {
        const socket = io(`${import.meta.env.VITE_SERVER_SOCKET}`, {
            timeout: 5000
        });

        socket.on('connect_error', () => {
            error("Connection with socket failed");
            socket.close();
        });

        socket.on(taskId, (data) => {
            callback(data);
            socket.close();
            return data
        });
    }
}