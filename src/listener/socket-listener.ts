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

        socket.on(taskId, (input) => {
            const regex = /^(error|success):\s*(.*)$/s;
            const match = input.match(regex);
            console.log(match)

            if (match) {
                const [, status, message] = match;
                if (status === "success") {
                    callback(message);
                } else {
                    error(message);
                }
            } else {
                error(input);
            }
            socket.close();
        });
    }
}