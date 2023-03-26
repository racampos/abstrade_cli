const { ethers } = require("ethers");
const hre = require("hardhat");
const { SimpleAccountAPI } = require("@account-abstraction/sdk");
const fs = require('fs');
const LIMIT_ORDER_ACCOUNT_ADDRESS = "0x8e0bd475dda70ea43a8902b4e573a977a006cb84" //Dummy Github account

async function fillOrder(order_id, filler_address, amount) {

    // Get LimitOrderAccount Contract already deployed on Gnosis Chain
    const limitOrderAccountABI = JSON.parse(fs.readFileSync("./limitOrderAccountABI.json").toString());
    limitOrderAccount = (await hre.ethers.getContractFactory(
        limitOrderAccountABI.abi,
        limitOrderAccountABI.bytecode
    )).attach(LIMIT_ORDER_ACCOUNT_ADDRESS); 

    console.log("Order to fill: " + order_id + ", Amount to fill: " + amount);
    
    owner_wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, hre.ethers.provider);
    amount_to_fill = BigInt(amount * 1e18);
    
    // tx = await sendUserOpToEntryPoint('fillLimitOrder', [order_id, filler_address, amount_to_fill, 0], owner_wallet);
    tx = await limitOrderAccount.connect(owner_wallet).fillLimitOrder(order_id, filler_address, amount_to_fill, 0, {gasLimit: 15000000});

}

async function getOrders() {

    // Get LimitOrderAccount Contract already deployed on Gnosis Chain
    const limitOrderAccountABI = JSON.parse(fs.readFileSync("./limitOrderAccountABI.json").toString());
    limitOrderAccount = (await hre.ethers.getContractFactory(
        limitOrderAccountABI.abi,
        limitOrderAccountABI.bytecode
    )).attach(LIMIT_ORDER_ACCOUNT_ADDRESS); 
    
    owner_wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, hre.ethers.provider);
    
    token_in = "";
    order_id = 1;
    console.log("\n");
    while ((token_in != "0x0000000000000000000000000000000000000000")) {
        limit_order = await limitOrderAccount.connect(owner_wallet).limitOrders(order_id);
        token_in = limit_order.tokenIn;
        const milliseconds = limit_order.expiry * 1000;
        const date = new Date(milliseconds);
        const dateString = date.toLocaleDateString();
        const timeString = date.toLocaleTimeString();
        
        if (token_in != "0x0000000000000000000000000000000000000000") {
            console.log(`Order ID: ${order_id}, Amount: ${limit_order.orderAmount/1e18}, Filled Amount: ${limit_order.filledAmount/1e18}, Expiry: ${dateString}, ${timeString}`);
        };
        
        order_id += 1;
    };
    console.log("\n");
}

module.exports = { fillOrder, getOrders };