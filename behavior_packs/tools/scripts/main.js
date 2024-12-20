let system = server.registerSystem(0, 0);

system.initialize = function() {
    // Listens for item usage event
    this.listenForEvent('minecraft:item_use', (eventData) => this.onItemUse(eventData));
};

// Handles item use event
system.onItemUse = function(eventData) {
    let player = eventData.data.source;
    let item = eventData.data.item;
    let position = eventData.data.blockPosition;

    // Check for specific tools and break blocks in different sizes
    if (item.__identifier__ === 'minecraft:redstick') {
        this.breakArea(player, position, 3, 3, 1); // Red Stick: 3x3x1 area
    } else if (item.__identifier__ === 'minecraft:bluestick') {
        this.breakArea(player, position, 6, 6, 2); // Blue Stick: 6x6x2 area
    } else if (item.__identifier__ === 'minecraft:yellowstick') {
        this.breakArea(player, position, 9, 9, 3); // Yellow Stick: 9x9x3 area
    }
};

// Function to break blocks in a specified area and drop items
system.breakArea = function(player, position, width, length, height) {
    let minX = position.x - Math.floor(width / 2);
    let minY = position.y;
    let minZ = position.z - Math.floor(length / 2);

    for (let x = minX; x < minX + width; x++) {
        for (let y = minY; y < minY + height; y++) {
            for (let z = minZ; z < minZ + length; z++) {
                this.breakBlockAt(x, y, z);
            }
        }
    }

    // Notify the player that the tool was used
    this.broadcastMessage(player, `Breaking blocks in a ${width}x${length}x${height} area.`);
};

// Function to break a single block at given coordinates and drop items
system.breakBlockAt = function(x, y, z) {
    let position = { x: x, y: y, z: z };
    let block = this.getBlock(x, y, z); // Get the block that was clicked on

    if (block && block.id !== 'minecraft:air') {
        // Drop the item (block) at the location
        this.dropItem(x, y, z, block.id); // Drop block item
        // Replace the block with air
        this.executeCommand(`/setblock ${position.x} ${position.y} ${position.z} minecraft:air`);
    }
};

// Function to drop an item at specific coordinates
system.dropItem = function(x, y, z, itemId) {
    // Summon the item at the given coordinates (just above the block)
    this.executeCommand(`/summon item ${x} ${y + 1} ${z} {Item:{id:"${itemId}",Count:1}}`);
};

// Function to get the block at the given coordinates
system.getBlock = function(x, y, z) {
    // This is a simplified example. You may need to fetch actual block data.
    return { id: 'minecraft:stone' }; // Replace with real block-fetching logic
};

// Helper function to send a message to the player
system.broadcastMessage = function(player, message) {
    this.broadcastEvent('minecraft:display_chat_event', message);
};
