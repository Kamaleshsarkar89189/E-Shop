import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: "kafka-service",
    brokers: ["pkc-619z3.us-east1.gcp.confluent.cloud:9092"],
    ssl: true,
    sasl: {
        mechanism: "plain",
        username: "4PE545WUQCLHJQHT",
        password: "cfltnffAOdpIR1bzm7Z4p9yf4KpR0aWbEhR63IZz5jUyCUKGpYSicQ83Fh6mhbPw",
        // username: process.env.KAFKA_API_KEY!,
        // password: process.env.KAFKA_API_SECRET!,
    },
});

// export const producer = kafka.producer({
//     createPartitioner: Partitioners.LegacyPartitioner,
// });
