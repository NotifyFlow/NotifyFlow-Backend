import { deliveryQueue } from "./queues/delivery.qeue";

async function test() {
    await deliveryQueue.add("process-delivery", {
        deliveryId: "123",
    });

    console.log("Job added");
    process.exit(0);
}

test();