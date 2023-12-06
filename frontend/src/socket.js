// src/socket.js
import io from "socket.io-client";

const ENDPOINT = process.env["REACT_APP_BACKEND_ENDPOINT"]; // Your server URL
const socket = io(ENDPOINT);

export default socket;
