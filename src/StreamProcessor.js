
/**
 * FINITE LOGIC: Stream Weaver (Exactly-Once Processor)
 *
 * Implements a stateful stream processor to ensure exactly-once semantics
 * for message consumption, preventing duplicate processing.
 * This is crucial for financial transactions and audit logging.
 */

class StreamWeaverProcessor {
    constructor() {
        // Simple in-memory storage for message IDs that have been processed.
        this.processedMessages = new Set();
        console.log("[StreamWeaver] Exactly-Once Processor Initialized.");
    }

    /**
     * Processes a single message, ensuring it is only handled once.
     * @param {object} message - The message object containing an 'id' and 'data'.
     * @returns {{id: string, durationMs: number, processed: boolean, isNew: boolean}} - Processing status.
     */
    processMessage(message) {
        const startTime = Date.now();
        const messageId = message.id;

        // Check if the message ID has already been recorded
        const isNew = !this.processedMessages.has(messageId);
        
        if (isNew) {
            // 1. Mark as processed immediately to prevent race conditions
            this.processedMessages.add(messageId);

            // 2. Simulate complex business logic execution
            // In a real system, this is where database writes,
            // API calls, or state changes would occur.
            this.executeBusinessLogic(message);
        }

        const durationMs = Date.now() - startTime;

        return {
            id: messageId,
            durationMs: durationMs,
            processed: isNew, // Only 'processed' if it was new
            isNew: isNew
        };
    }

    /**
     * Placeholder for the core processing logic.
     * @param {object} message 
     */
    executeBusinessLogic(message) {
        // Simulate a small, variable processing delay
        const delay = Math.random() * 50; 
        // console.log(`  -> Processing message ${message.id} with a delay of ${delay.toFixed(2)}ms...`);
    }

    /**
     * Returns the total count of unique messages processed.
     */
    getUniqueCount() {
        return this.processedMessages.size;
    }
}

// --- DEMO USAGE ---

const processor = new StreamWeaverProcessor();

// Simulate a stream of messages, including duplicates
const messageStream = [
    { id: "A1", data: "Order placed" },
    { id: "B2", data: "Inventory check" },
    { id: "A1", data: "Order placed (Duplicate)" }, // Duplicate of A1
    { id: "C3", data: "Payment confirmed" },
    { id: "B2", data: "Inventory check (Duplicate)" }, // Duplicate of B2
    { id: "D4", data: "Shipping label printed" }
];

console.log("\n--- StreamWeaver: Exactly-Once Demo ---");

messageStream.forEach((msg, index) => {
    const result = processor.processMessage(msg);
    
    // The key is to correctly define 'isNew' inside processMessage,
    // and then use the returned value (result.isNew) for the printout.
    const status = result.isNew ? "NEW (Processed)" : "DUPLICATE (Skipped)";

    console.log(
        `[Msg ${index + 1}/${msg.id}] Status: ${status} | Duration: ${result.durationMs.toFixed(2)}ms`
    );
});

console.log(`\n--- Summary ---`);
console.log(`Total messages sent: ${messageStream.length}`);
console.log(`Total unique messages processed: ${processor.getUniqueCount()}`);
console.log("------------------\n");

// Export the class for use in other modules (NPM package entry)
module.exports = StreamWeaverProcessor;
