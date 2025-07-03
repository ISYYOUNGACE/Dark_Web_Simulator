
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

// DOM Elements
const outputEl = document.getElementById('output');
const commandInput = document.getElementById('command-input');
const balanceStatus = document.getElementById('balance-status');
const reputationStatus = document.getElementById('reputation-status');

// Initialize game
function initGame() {
    addToOutput("Initializing Dark Web Simulator...", "system-msg");
    
    setTimeout(() => {
        addToOutput("Establishing TOR connection...", "system-msg");
        
        setTimeout(() => {
            addToOutput("Connected to TOR network", "success-msg");
            addToOutput("Type 'help' for available commands", "system-msg");
            
            // Show intro message
            showAsciiArt();
        }, 1000);
    }, 500);
}

// ASCII art for intro
function showAsciiArt() {
    const ascii = `
  ____            _        __        __         _ 
 |  _ \\  __ _  _| | ___   \\ \\      / /_  _ __| |
 | | | |/ \` |/ _\` |/ _ \\   \\ \\ /\\ / / _ \\| '_| |
 | || | (| | (| |  __/    \\ V  V / () | |  |_|
 |/ \\,|\\,|\\|     \\/\\/ \\/||  ()
            `;
    
    addToOutput(ascii, "ascii-art");
    addToOutput("Welcome to the Dark Web Simulator. Proceed with caution.", "system-msg");
}

// Terminal output
function addToOutput(text, className = "system-msg") {
    const entry = document.createElement('div');
    entry.className = "log-entry " + className;
    entry.textContent = text;
    outputEl.appendChild(entry);
    outputEl.scrollTop = outputEl.scrollHeight;
}

// Command processing
function processCommand(cmd) {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();
    const params = args.slice(1);

    // Add command to output with special styling
    addToOutput("> " + cmd, "command-msg");

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
            clearTerminal();
            break;
        case 'exit':
            handleExit();
            break;
        case 'markets':
            listMarkets();
            break;
        default:
            addToOutput("Unknown command: " + command, "error-msg");
            addToOutput("Type 'help' for available commands", "system-msg");
    }
}

// Command handlers
function handleConnect(params) {
    if (params.length === 0) {
        addToOutput("Usage: connect [market_name]", "error-msg");
        addToOutput("Available markets: onionMarket, hackerForum, shadowExchange", "system-msg");
        return;
    }

    const marketName = params[0];
    const market = gameState.markets.find(m => m.name === marketName);

    if (market) {
        gameState.connected = true;
        gameState.currentMarket = market;
        addToOutput("Connected to " + marketName, "success-msg");
        addToOutput(market.description, "system-msg");
        addToOutput("Available items:", "system-msg");
        
        market.items.forEach(item => {
            addToOutput("- " + item.name + " (" + item.price + " BTC, Rep: " + item.reputationReq + ")", "system-msg");
        });
        
        // Start trace with 30% probability when connecting
        if (Math.random() < 0.3) {
            startTrace();
        }
        
        // Check mission completion
        checkMissionCompletion(2);
    } else {
        addToOutput("Market not found: " + marketName, "error-msg");
        addToOutput("Available markets: onionMarket, hackerForum, shadowExchange", "system-msg");
    }
}

function handleBuy(params) {
    if (!gameState.connected) {
        addToOutput("Not connected to any market. Use 'connect [market]'", "error-msg");
        return;
    }

    if (params.length === 0) {
        addToOutput("Usage: buy [item_name]", "error-msg");
        addToOutput("Available items:", "system-msg");
        gameState.currentMarket.items.forEach(item => {
            addToOutput("- " + item.name, "system-msg");
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
                addToOutput("Purchased " + itemName + " for " + item.price + " BTC", "success-msg");
                showBalance();
                showReputation();
                
                // Check mission completion
                if (itemName === "data dump") {
                    checkMissionCompletion(1);
                }
            } else {
                addToOutput("Insufficient funds", "error-msg");
            }
        } else {
            addToOutput("Reputation too low for this purchase", "error-msg");
        }
    } else {
        addToOutput("Item not available: " + itemName, "error-msg");
        addToOutput("Available items:", "system-msg");
        gameState.currentMarket.items.forEach(item => {
            addToOutput("- " + item.name, "system-msg");
        });
    }
}

function handleDecrypt(params) {
    if (params.length < 1) {
        addToOutput("Usage: decrypt [ciphertext] [key?]", "error-msg");
        addToOutput("Example: decrypt \"fdhvdu\" shift=3", "system-msg");
        return;
    }

    const ciphertext = params[0].replace(/"/g, '');
    let shift = 3; // Default Caesar shift
    
    // Check if shift parameter is provided
    if (params.length > 1 && params[1].includes('shift=')) {
        shift = parseInt(params[1].split('=')[1]);
    }

    if (isNaN(shift)) {
        addToOutput("Invalid shift value. Using default shift=3", "warning-msg");
        shift = 3;
    }

    const decrypted = caesarDecrypt(ciphertext, shift);
    addToOutput("Decrypted message: " + decrypted, "success-msg");
    
    // 20% chance of triggering trace during decryption
    if (Math.random() < 0.2) {
        startTrace();
    }
}

function handleTransfer(params) {
    if (params.length < 2) {
        addToOutput("Usage: transfer [amount]btc [destination_wallet]", "error-msg");
        addToOutput("Example: transfer 50btc wallet3", "system-msg");
        return;
    }

    const amountStr = params[0];
    const amount = parseInt(amountStr);
    const destination = params[1];

    if (isNaN(amount)) {
        addToOutput("Invalid amount", "error-msg");
        return;
    }

    if (gameState.user.balance >= amount) {
        gameState.user.balance -= amount;
        addToOutput("Transferred " + amount + " BTC to " + destination, "success-msg");
        showBalance();
    } else {
        addToOutput("Insufficient funds", "error-msg");
    }
}

function handleScan(params) {
    if (params.length === 0 || params[0] !== 'net') {
        addToOutput("Usage: scan net", "error-msg");
        return;
    }

    if (gameState.traceActive) {
        addToOutput("WARNING: Active trace detected! Type 'evade trace' immediately!", "warning-msg");
    } else {
        addToOutput("No active traces detected", "success-msg");
    }
}

function handleEvade(params) {
    if (params.length === 0 || params[0] !== 'trace') {
        addToOutput("Usage: evade trace", "error-msg");
        return;
    }

    if (gameState.traceActive) {
        clearTimeout(gameState.traceTimeout);
        gameState.traceActive = false;
        gameState.user.reputation += 10;
        addToOutput("Trace successfully evaded! Reputation increased.", "success-msg");
        showReputation();
        
        // Remove trace alert
        const alert = document.querySelector('.trace-alert');
        if (alert) alert.remove();
    } else {
        addToOutput("No active trace to evade", "error-msg");
    }
}

function handleExit() {
    addToOutput("Disconnecting from TOR network...", "system-msg");
    setTimeout(() => {
        addToOutput("Connection terminated", "success-msg");
        gameState.connected = false;
        gameState.currentMarket = null;
    }, 1000);
}

function listMarkets() {
    addToOutput("Available markets:", "system-msg");
    gameState.markets.forEach(market => {
        addToOutput("- " + market.name + ": " + market.description, "system-msg");
    });
}

// Game mechanics
function startTrace() {
    if (gameState.traceActive) return;

    gameState.traceActive = true;
    addToOutput("WARNING: TRACE DETECTED! Type 'evade trace' within 10 seconds!", "warning-msg");
    
    // Create visual alert
    const alert = document.createElement('div');
    alert.className = 'trace-alert';
    alert.textContent = 'TRACE IN PROGRESS!';
    document.getElementById('terminal').appendChild(alert);
    
    gameState.traceTimeout = setTimeout(() => {
        if (gameState.traceActive) {
            gameState.traceActive = false;
            gameState.user.reputation -= 20;
            gameState.user.balance = Math.max(0, gameState.user.balance * 0.7); // Lose 30% of funds
            addToOutput("CRITICAL FAILURE: Trace completed! Reputation and balance decreased.", "error-msg");
            showBalance();
            showReputation();
            
            // Remove trace alert
            alert.remove();
        }
    }, 10000);
}

function caesarDecrypt(ciphertext, shift) {
    return ciphertext.replace(/[a-z]/gi, c => {
        const base = c < 'a' ? 65 : 97;
        return String.fromCharCode(
            (c.charCodeAt(0) - base - shift + 26) % 26 + base
        );
    });
}

function checkMissionCompletion(missionId) {
    const mission = gameState.activeMissions.find(m => m.id === missionId);
    if (mission && !mission.completed) {
        mission.completed = true;
        gameState.completedMissions.push(mission);
        gameState.activeMissions = gameState.activeMissions.filter(m => m.id !== missionId);
        
        // Apply rewards
        if (missionId === 1) {
            gameState.user.reputation += 25;
            gameState.user.balance += 50;
            addToOutput("Mission Complete: " + mission.name, "success-msg");
            addToOutput("Rewards: " + mission.reward, "success-msg");
            showBalance();
            showReputation();
        } else if (missionId === 2) {
            gameState.user.reputation += 10;
            addToOutput("Mission Complete: " + mission.name, "success-msg");
            addToOutput("Rewards: " + mission.reward, "success-msg");
            showReputation();
        }
    }
}

// UI commands
function showHelp() {
    addToOutput("Available commands:", "system-msg");
    addToOutput("- connect [market]: Connect to a dark web market", "system-msg");
    addToOutput("- buy [item]: Purchase an item from current market", "system-msg");
    addToOutput("- decrypt [ciphertext] [shift?]: Decrypt a message", "system-msg");
    addToOutput("- transfer [amount]btc [wallet]: Transfer funds", "system-msg");
    addToOutput("- scan net: Check for tracing attempts", "system-msg");
    addToOutput("- evade trace: Attempt to evade detection", "system-msg");
    addToOutput("- balance: Show current balance", "system-msg");
    addToOutput("- reputation: Show reputation score", "system-msg");
    addToOutput("- inventory: List owned items", "system-msg");
    addToOutput("- missions: Show active missions", "system-msg");
    addToOutput("- markets: List available markets", "system-msg");
    addToOutput("- exit: Disconnect from current market", "system-msg");
    addToOutput("- clear: Clear terminal", "system-msg");
    addToOutput("- help: Show this help", "system-msg");
}

function showBalance() {
    balanceStatus.textContent = gameState.user.balance + " BTC";
    addToOutput("Balance: " + gameState.user.balance + " BTC", "system-msg");
}

function showReputation() {
    reputationStatus.textContent = gameState.user.reputation;
    addToOutput("Reputation: " + gameState.user.reputation + "/100", "system-msg");
}

function showInventory() {
    if (gameState.user.inventory.length === 0) {
        addToOutput("Inventory is empty", "system-msg");
        return;
    }

    addToOutput("Inventory:", "system-msg");
    gameState.user.inventory.forEach(item => {
        addToOutput("- " + item, "system-msg");
    });
}

function showMissions() {
    if (gameState.activeMissions.length === 0) {
        addToOutput("No active missions", "system-msg");
        return;
    }

    addToOutput("Active missions:", "system-msg");
    gameState.activeMissions.forEach(mission => {
        const missionEl = document.createElement('div');
        missionEl.className = 'mission-active';
        missionEl.innerHTML = "<strong>" + mission.name + ":</strong> " + mission.description + "<br><strong>Reward:</strong> " + mission.reward;
        outputEl.appendChild(missionEl);
    });
}

function clearTerminal() {
    outputEl.innerHTML = '';
    addToOutput("Terminal cleared", "system-msg");
    addToOutput("Type 'help' for available commands", "system-msg");
}

// Event listeners
commandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = commandInput.value.trim();
        if (command) {
            processCommand(command);
            commandInput.value = '';
        }
    }
});

// Initialize the game
window.onload = initGame;