import "dotenv/config";
import { randomUUID } from "crypto";
import type { OutgoingMessage, SignupOutgoingMessage, ValidateOutgoingMessage } from "common";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";
import WebSocket from "ws";

const CALLBACKS: {[callbackId: string]: (data: SignupOutgoingMessage) => void} = {}

let validatorId: string | null = null;

const HUB_URL = "ws://localhost:8081";
const RECONNECT_INTERVAL = 5000; // 5 seconds

const keypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY!))
);

function connect() {
    console.log(`[Validator] Connecting to Hub at ${HUB_URL}...`);
    const ws = new WebSocket(HUB_URL);

    ws.on('open', async () => {
        console.log(`[Validator] Connected to Hub!`);
        const callbackId = randomUUID();
        CALLBACKS[callbackId] = (data: SignupOutgoingMessage) => {
            validatorId = data.validatorId;
            console.log(`[Validator] Registered with ID: ${validatorId}`);
        }
        const signedMessage = await signMessage(`Signed message for ${callbackId}, ${keypair.publicKey}`, keypair);

        ws.send(JSON.stringify({
            type: 'signup',
            data: {
                callbackId,
                ip: '127.0.0.1',
                publicKey: keypair.publicKey.toString(),
                signedMessage,
            },
        }));
    });

    ws.on('message', async (data) => {
        const messageStr = data.toString();
        const message: OutgoingMessage = JSON.parse(messageStr);
        if (message.type === 'signup') {
            CALLBACKS[message.data.callbackId]?.(message.data)
            delete CALLBACKS[message.data.callbackId];
        } else if (message.type === 'validate') {
            await validateHandler(ws, message.data, keypair);
        }
    });

    ws.on('close', () => {
        console.log(`[Validator] Disconnected from Hub. Reconnecting in ${RECONNECT_INTERVAL / 1000}s...`);
        setTimeout(connect, RECONNECT_INTERVAL);
    });

    ws.on('error', (err) => {
        console.error(`[Validator] WebSocket error:`, err.message);
        // 'close' event will fire after this, triggering reconnect
    });
}

async function validateHandler(ws: WebSocket, { url, callbackId, websiteId }: ValidateOutgoingMessage, keypair: Keypair) {
    console.log(`[Validator] Validating ${url}`);
    const startTime = Date.now();
    const signature = await signMessage(`Replying to ${callbackId}`, keypair);

    try {
        const response = await fetch(url);
        const endTime = Date.now();
        const latency = endTime - startTime;
        const status = response.status;

        console.log(`[Validator] ${url} → ${status} (${latency}ms)`);
        ws.send(JSON.stringify({
            type: 'validate',
            data: {
                callbackId,
                status: status === 200 ? 'Good' : 'Bad',
                latency,
                websiteId,
                validatorId,
                signedMessage: signature,
            },
        }));
    } catch (error) {
        console.error(`[Validator] Validation error for ${url}:`, (error as Error).message);
        ws.send(JSON.stringify({
            type: 'validate',
            data: {
                callbackId,
                status:'Bad',
                latency: 1000,
                websiteId,
                validatorId,
                signedMessage: signature,
            },
        }));
    }
}

async function signMessage(message: string, keypair: Keypair) {
    const messageBytes = nacl_util.decodeUTF8(message);
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey);

    return JSON.stringify(Array.from(signature));
}

// Start the validator with auto-reconnect
connect();