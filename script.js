const readline = require('readline');

// Game State
const gameState = {
    connected: false,
    currentMarket: null,
    user: {
        wallet: "wallet1",
        balance: 120,
        reputation: 43,
        inventory: []
    },
    markets: [
        { 
            name: "onionMarket", 
            description: "Black market for exploits and tools",
            items: [
                { name: "exploit", price: 30, reputationReq: 30 },
                { name: "malware", price: 25, reputationReq: 25 },
                { name: "accounts", price: 15, reputationReq: 10 }
            ] 
        },
        { 
            name: "hackerForum", 
            description: "Community for data leaks and services",
            items: [
                { name: "data dump", price: 40, reputationReq: 40 },
                { name: "VPN", price: 20, reputationReq: 15 }
            ] 
        },
        { 
            name: "shadowExchange", 
            description: "Cryptocurrency trading and laundering",
            items: [
                { name: "bitcoin mixer", price: 50, reputationReq: 50 },
                { name: "crypto wallet", price: 10, reputationReq: 5 }
            ] 
        }
    ],
    traceActive: false,
    traceTimeout: null,
    activeMissions: [
        {
            id: 1,
            name: "Data Breach",
            description: "Buy a data dump and decrypt the contents",
            reward: "+25 Reputation, +50 BTC",
            completed: false
        },
        {
            id: 2,
            name: "First Purchase",
            description: "Buy any item from a dark web market",
            reward: "+10 Reputation",
            completed: false
        }
    ],
    completedMissions: []
};

// Terminal colors
const colors = {
    reset: "\x1b[0m",
    system: "\x1b[90m",
    success: "\x1b[32m",
    error: "\x1b[31m",
    warning: "\x1b[33m",
    command: "\x1b[36m",
    ascii: "\x1b[35m"
};

// Terminal output
function addToOutput(text, type = "system") {
    const color = colors[type] || colors.system;
    console.log(color + text + colors.reset);
}

// Initialize game
function initGame() {
    addToOutput("Initializing Dark Web Simulator...", "system");
    
    setTimeout(() => {
        addToOutput("Establishing TOR connection...", "system");
        
        setTimeout(() => {
            addToOutput("Connected to TOR network", "success");
            addToOutput("Type 'help' for available commands", "system");
            showAsciiArt();
        }, 1000);
    }, 500);
}

// ASCII art for intro
function showAsciiArt() {
    const ascii = `
  ____            _        __        __         _ 
 |  _ \\  __ _  | | ___   \\ \\      / /  _ __| |
 | | | |/ \` |/ _\` |/ _ \\   \\ \\ /\\ / / _ \\| '| |
 | || | (| | (| |  __/    \\ V  V / () | |  |_|
 |/ \\,|\\,|\\|     \\/\\/ \\/||  ()
    `;
    
    addToOutput(ascii, "ascii");
    addToOutput("Welcome to the Dark Web Simulator. Proceed with caution.", "system");
}

// Command processing
function processCommand(cmd) {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();
    const params = args.slice(1);

    addToOutput(`> ${cmd}`, "command");

    switch(command) {
        case 'connect':
            handleConnect(params);
            break;
        case 'buy':
            handleBuy(params);
            break;
        case 'decrypt':
            handleDecrypt(params);
            break;
        case 'transfer':
            handleTransfer(params);
            break;
        case 'scan':
            handleScan(params);
            break;
        case 'evade':
            handleEvade(params);
            break;
        case 'help':
            showHelp();
            break;
        case 'balance':
            showBalance();
            break;
        case 'reputation':
            showReputation();
            break;
        case 'inventory':
            showInventory();
            break;
        case 'missions':
            showMissions();
            break;
        case 'clear':
            console.clear();
            addToOutput("Terminal cleared", "system");
            break;
        case 'exit':
            handleExit();
            break;
        case 'markets':
            listMarkets();
            break;
        default:
            addToOutput(`Unknown command: ${command}`, "error");
            addToOutput("Type 'help' for available commands", "system");
    }
}

// Command handlers
function handleConnect(params) {
    if (params.length === 0) {
        addToOutput("Usage: connect [market_name]", "error");
        addToOutput("Available markets: onionMarket, hackerForum, shadowExchange", "system");
        return;
    }

    const marketName = params[0];
    const market = gameState.markets.find(m => m.name === marketName);

    if (market) {
        gameState.connected = true;
        gameState.currentMarket = market;
        addToOutput(`Connected to ${marketName}`, "success");
        addToOutput(market.description, "system");
        addToOutput("Available items:", "system");
        
        market.items.forEach(item => {
            addToOutput(`- ${item.name} (${item.price} BTC, Rep: ${item.reputationReq})`, "system");
        });
        
        if (Math.random() < 0.3) {
            startTrace();
        }
        
        checkMissionCompletion(2);
    } else {
        addToOutput(`Market not found: ${marketName}`, "error");
        addToOutput("Available markets: onionMarket, hackerForum, shadowExchange", "system");
    }
}

function handleBuy(params) {
    if (!gameState.connected) {
        addToOutput("Not connected to any market. Use 'connect [market]'", "error");
        return;
    }

    if (params.length === 0) {
        addToOutput("Usage: buy [item_name]", "error");
        addToOutput("Available items:", "system");
        gameState.currentMarket.items.forEach(item => {
            addToOutput(`- ${item.name}`, "system");
        });
        return;
    }

    const itemName = params.join(' ');
    const item = gameState.currentMarket.items.find(i => i.name === itemName);

    if (item) {
        if (gameState.user.reputation >= item.reputationReq) {
            if (gameState.user.balance >= item.price) {
                gameState.user.balance -= item.price;
                gameState.user.inventory.push(item.name);
                gameState.user.reputation += 5;
                addToOutput(`Purchased ${itemName} for ${item.price} BTC`, "success");
                showBalance();
                showReputation();
                
                if (itemName === "data dump") {
                    checkMissionCompletion(1);
                }
            } else {
                addToOutput("Insufficient funds", "error");
            }
        } else {
            addToOutput("Reputation too low for this purchase", "error");
        }
    } else {
        addToOutput(`Item not available: ${itemName}`, "error");
        addToOutput("Available items:", "system");
        gameState.currentMarket.items.forEach(item => {
            addToOutput(`- ${item.name}`, "system");
        });
    }
}

function handleDecrypt(params) {
    if (params.length < 1) {
        addToOutput("Usage: decrypt [ciphertext] [key?]", "error");
        addToOutput("Example: decrypt \"fdhvdu\" shift=3", "system");
        return;
    }

    const ciphertext = params[0].replace(/"/g, '');
    let shift = 3;
    
    if (params.length > 1 && params[1].includes('shift=')) {
        shift = parseInt(params[1].split('=')[1]);
    }

    if (isNaN(shift)) {
        addToOutput("Invalid shift value. Using default shift=3", "warning");
        shift = 3;
    }

    const decrypted = caesarDecrypt(ciphertext, shift);
    addToOutput(`Decrypted message: ${decrypted}`, "success");
    
    if (Math.random() < 0.2) {
        startTrace();
    }
}

function caesarDecrypt(ciphertext, shift) {
    return ciphertext.replace(/[a-z]/gi, c => {
        const base = c < 'a' ? 65 : 97;
        return String.fromCharCode(
            (c.charCodeAt(0) - base - shift + 26) % 26 + base
        );
    });
}

function handleTransfer(params) {
    if (params.length < 2) {
        addToOutput("Usage: transfer [amount]btc [destination_wallet]", "error");
        addToOutput("Example: transfer 50btc wallet3", "system");
        return;
    }

    const amountStr = params[0];
    const amount = parseInt(amountStr);
    const destination = params[1];

    if (isNaN(amount)) {
        addToOutput("Invalid amount", "error");
        return;
    }

    if (gameState.user.balance >= amount) {
        gameState.user.balance -= amount;
        addToOutput(`Transferred ${amount} BTC to ${destination}`, "success");
        showBalance();
    } else {
        addToOutput("Insufficient funds", "error");
    }
}

function handleScan(params) {
    if (params.length === 0 || params[0] !== 'net') {
        addToOutput("Usage: scan net", "error");
        return;
    }

    if (gameState.traceActive) {
        addToOutput("WARNING: Active trace detected! Type 'evade trace' immediately!", "warning");
    } else {
        addToOutput("No active traces detected", "success");
    }
}

function handleEvade(params) {
    if (params.length === 0 || params[0] !== 'trace') {
        addToOutput("Usage: evade trace", "error");
        return;
    }

    if (gameState.traceActive) {
        clearTimeout(gameState.traceTimeout);
        gameState.traceActive = false;
        gameState.user.reputation += 10;
        addToOutput("Trace successfully evaded! Reputation increased.", "success");
        showReputation();
    } else {
        addToOutput("No active trace to evade", "error");
    }
}

function handleExit() {
    addToOutput("Disconnecting from TOR network...", "system");
    setTimeout(() => {
        addToOutput("Connection terminated", "success");
        gameState.connected = false;
        gameState.currentMarket = null;
    }, 1000);
}

function listMarkets() {
    addToOutput("Available markets:", "system");
    gameState.markets.forEach(market => {
        addToOutput(`- ${market.name}: ${market.description}`, "system");
    });
}

function startTrace() {
    if (gameState.traceActive) return;

    gameState.traceActive = true;
    addToOutput("WARNING: TRACE DETECTED! Type 'evade trace' within 10 seconds!", "warning");
    
    gameState.traceTimeout = setTimeout(() => {
        if (gameState.traceActive) {
            gameState.traceActive = false;
            gameState.user.reputation -= 20;
            gameState.user.balance = Math.max(0, gameState.user.balance * 0.7);
            addToOutput("CRITICAL FAILURE: Trace completed! Reputation and balance decreased.", "error");
            showBalance();
            showReputation();
        }
    }, 10000);
}

function checkMissionCompletion(missionId) {
    const mission = gameState.activeMissions.find(m => m.id === missionId);
    if (mission && !mission.completed) {
        mission.completed = true;
        gameState.completedMissions.push(mission);
        gameState.activeMissions = gameState.activeMissions.filter(m => m.id !== missionId);
        
        if (missionId === 1) {
            gameState.user.reputation += 25;
            gameState.user.balance += 50;
            addToOutput(`Mission Complete: ${mission.name}`, "success");
            addToOutput(`Rewards: ${mission.reward}`, "success");
            showBalance();
            showReputation();
        } else if (missionId === 2) {
            gameState.user.reputation += 10;
            addToOutput(`Mission Complete: ${mission.name}`, "success");
            addToOutput(`Rewards: ${mission.reward}`, "success");
            showReputation();
        }
    }
}

function showHelp() {
    addToOutput("Available commands:", "system");
    addToOutput("- connect [market]: Connect to a dark web market", "system");
    addToOutput("- buy [item]: Purchase an item from current market", "system");
    addToOutput("- decrypt [ciphertext] [shift?]: Decrypt a message", "system");
    addToOutput("- transfer [amount]btc [wallet]: Transfer funds", "system");
    addToOutput("- scan net: Check for tracing attempts", "system");
    addToOutput("- evade trace: Attempt to evade detection", "system");
    addToOutput("- balance: Show current balance", "system");
    addToOutput("- reputation: Show reputation score", "system");
    addToOutput("- inventory: List owned items", "system");
    addToOutput("- missions: Show active missions", "system");
    addToOutput("- markets: List available markets", "system");
    addToOutput("- exit: Disconnect from current market", "system");
    addToOutput("- clear: Clear terminal", "system");
    addToOutput("- help: Show this help", "system");
}

function showBalance() {
    addToOutput(`Balance: ${gameState.user.balance} BTC`, "system");
}

function showReputation() {
    addToOutput(`Reputation: ${gameState.user.reputation}/100`, "system");
}

function showInventory() {
    if (gameState.user.inventory.length === 0) {
        addToOutput("Inventory is empty", "system");
        return;
    }

    addToOutput("Inventory:", "system");
    gameState.user.inventory.forEach(item => {
        addToOutput(`- ${item}`, "system");
    });
}

function showMissions() {
    if (gameState.activeMissions.length === 0) {
        addToOutput("No active missions", "system");
        return;
    }

    addToOutput("Active missions:", "system");
    gameState.activeMissions.forEach(mission => {
        addToOutput(`${mission.name}: ${mission.description}`, "system");
        addToOutput(`Reward: ${mission.reward}`, "system");
        addToOutput("----------------", "system");
    });
}

// Terminal input setup
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askCommand() {
    rl.question('> ', (cmd) => {
        processCommand(cmd);
        askCommand();
    });
}

// Start the game
initGame();
askCommand();