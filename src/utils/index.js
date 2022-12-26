import { genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";
// import { connect } from "amqplib";

// import { APP_SECRET, EXCHANGE_NAME, CUSTOMER_SERVICE, MSG_QUEUE_URL } from "../config";

//Utility functions
export const generateSalt = async () => {
    return await genSalt();
}
export const generatePassword = async (password, salt) => {
    return await hash(password, salt);
}

export const validatePassword = async (
    enteredPassword,
    savedPassword,
    salt
) => {
    return (await this.generatePassword(enteredPassword, salt)) === savedPassword;
}

export const generateToken = async (payload) => {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
}
export const validateToken = async (req) => {
    const signature = req.get("Authorization");

    if (signature) {
        const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
        req.user = payload;
        return true;
    }

    return false;
}

export const formatData = (data) => {
    if (data) {
        return { data };
    } else {
        throw new Error("Data Not found!");
    }
}

//Message Broker
// export async function CreateChannel() {
//     try {
//         const connection = await connect(MSG_QUEUE_URL);
//         const channel = await connection.createChannel();
//         await channel.assertQueue(EXCHANGE_NAME, "direct", { durable: true });
//         return channel;
//     } catch (err) {
//         throw err;
//     }
// }

// export function PublishMessage(channel, service, msg) {
//     channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
//     console.log("Sent: ", msg);
// }

// export async function SubscribeMessage(channel, service) {
//     await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
//     const q = await channel.assertQueue("", { exclusive: true });
//     console.log(` Waiting for messages in queue: ${q.queue}`);

//     channel.bindQueue(q.queue, EXCHANGE_NAME, CUSTOMER_SERVICE);

//     channel.consume(
//         q.queue,
//         (msg) => {
//             if (msg.content) {
//                 console.log("the message is:", msg.content.toString());
//                 service.SubscribeEvents(msg.content.toString());
//             }
//             console.log("[X] received");
//         },
//         {
//             noAck: true,
//         }
//     );
// }