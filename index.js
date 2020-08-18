const inquirer = require('inquirer');
const net = require('net')
const fs = require('fs');
const server = require('./serverInfo.json')
const weaponsArray = fs.readFileSync('weaponsRotationList.txt').toString().split("\n");

giveRandomWeapons()

function giveRandomWeapons(){
    async() =>{
        let activeSocket = await spinServer(server)
        let players = activeSocket.playerList.PlayerList
        let thisWeapon = weaponsArray[i]
        let promiseArray = []
        players.forEach(player => {
            const command = 'GiveItem ' + player.UniqueId + ' ' + thisWeapon
            const commandPromise = commandHandler(activeSocket,command)
            promiseArray.push(commandPromise)
        });
        const giveAll = await Promise.all(promiseArray)
        console.log(giveAll)
    }
}

function commandHandler(socket, command) {
    return new Promise(resolve => {
            socket.write(command)
            socket.once('data', function(data) {
                return resolve(data.toString())
            });
        }
    )}


//returns socket obj
function spinServer(server) {
    return new Promise(resolve => {
        socket = net.Socket();
        socket.connect(server.port, server.ip, () => {});
        socket.on('error', function(err) {
            console.log(err)
            resolve(false)
        });
        socket.on('data', function(data) {
            if (data.toString().startsWith('Password:')) {
                socket.write(server.password)
                console.log(data.toString())
            }
            if (data.toString().startsWith('Authenticated=1')) {
                console.log('Logged in!');
                (async() => {
                    resolve(socket);
                    socket.playerList = JSON.parse(await commandHandler(socket, 'RefreshList'))
                })();
                setInterval(function() {
                    (async() => {
                        socket.playerList = JSON.parse(await commandHandler(socket, 'RefreshList'))
                    })();
                }, 60000);
            }
            if (data.toString().startsWith('Authenticated=0')) {
                console.log('Login wrong!');
            }
        });
    });
}


function connect() {
    const port = 9100
    const host = 'localhost'
    client.connect(port, host, () => {})
}
