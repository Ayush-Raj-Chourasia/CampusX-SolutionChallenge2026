import { io } from "socket.io-client";
import { getBackendBaseUrl } from "@/lib/api";

const SOCKET_URL = getBackendBaseUrl();

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
});
