import WebSocket, { WebSocketServer } from "ws";
import { createServer } from "http";
import { randomUUID } from "crypto";
import type { IncomingMessage, SignupIncomingMessage } from "common";
import { prismaClient } from "db/client";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";

const availableValidators: { validatorId: string, socket: WebSocket, publicKey: string }[] = [];

const CALLBACKS : { [callbackId: string]: (data: IncomingMessage) => void } = {}
const COST_PER_VALIDATION = 100; // in lamports

const server = createServer();
const wss = new WebSocketServer({ server });

// Websocket connection handler
wss.on('connection', function connection(ws: WebSocket) {
  ws.on('error', console.error);

  ws.on('message', async function message(data) {
    const messageStr = data.toString();
    const dataObj: IncomingMessage = JSON.parse(messageStr);
    
    if (dataObj.type === 'signup') {

        const verified = await verifyMessage(
            `Signed message for ${dataObj.data.callbackId}, ${dataObj.data.publicKey}`,
            dataObj.data.publicKey,
            dataObj.data.signedMessage
        );
        if (verified) {
            await signupHandler(ws, dataObj.data);
        }
    } else if (dataObj.type === 'validate') {
        CALLBACKS[dataObj.data.callbackId](dataObj);
        delete CALLBACKS[dataObj.data.callbackId];
    }
  });

  ws.on('close', () => {
    availableValidators.splice(availableValidators.findIndex(v => v.socket === ws), 1);
  });
});

server.listen(8081, () => {
    console.log('Listening on port 8081');
});


// Signup handler
async function signupHandler(ws: WebSocket, { ip, publicKey, signedMessage, callbackId }: SignupIncomingMessage) {
    const validatorDb = await prismaClient.validator.findFirst({
        where: {
            publicKey,
        },
    });

    if (validatorDb) {
        ws.send(JSON.stringify({
            type: 'signup',
            data: {
                validatorId: validatorDb.id,
                callbackId,
            },
        }));

        availableValidators.push({
            validatorId: validatorDb.id,
            socket: ws,
            publicKey: validatorDb.publicKey,
        });
        return;
    }
    

    // If not signed up, create a new validator and push to available validators
    const validator = await prismaClient.validator.create({
        data: {
            ipAddress: ip,
            publicKey,
            location: 'unknown',
        },
    });

    ws.send(JSON.stringify({
        type: 'signup',
        data: {
            validatorId: validator.id,
            callbackId,
        },
    }));

    availableValidators.push({
        validatorId: validator.id,
        socket: ws,
        publicKey: validator.publicKey,
    });
}

// Verify the signature of the message
async function verifyMessage(message: string, publicKey: string, signature: string) {
    const messageBytes = nacl_util.decodeUTF8(message);
    const result = nacl.sign.detached.verify(
        messageBytes,
        new Uint8Array(JSON.parse(signature)),
        new PublicKey(publicKey).toBytes(),
    );

    return result;
}

// Validate the website
setInterval(async () => {
    const websitesToMonitor = await prismaClient.website.findMany({
        where: {
            disabled: false,
            paused: false,
        },
    });

    for (const website of websitesToMonitor) {
        availableValidators.forEach(validator => {
            const callbackId = randomUUID();
            console.log(`Sending validate to ${validator.validatorId} ${website.url}`);
            validator.socket.send(JSON.stringify({
                type: 'validate',
                data: {
                    url: website.url,
                    callbackId
                },
            }));

            CALLBACKS[callbackId] = async (data: IncomingMessage) => {
                if (data.type === 'validate') {
                    const { validatorId, status, latency, signedMessage } = data.data;
                    const verified = await verifyMessage(
                        `Replying to ${callbackId}`,
                        validator.publicKey,
                        signedMessage
                    );
                    if (!verified) {
                        return;
                    }


                    await prismaClient.$transaction(async (tx) => {
                        const tickCount = await tx.websiteTick.count({
                            where: { websiteId: website.id },
                        });

                        await tx.websiteTick.create({
                            data: {
                                websiteId: website.id,
                                validatorId,
                                status,
                                latency,
                                tick: tickCount,
                                createdAt: new Date(),
                            },
                        });

                        await tx.validator.update({
                            where: { id: validatorId },
                            data: {
                                pendingPayouts: { increment: COST_PER_VALIDATION },
                            },
                        });
                    });
                }
            };
        });
    }
}, 60 * 1000);