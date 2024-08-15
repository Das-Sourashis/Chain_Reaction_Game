class player {
    constructor(color,n){
        this.color = color;
        this.name = n;
        this.start = false;
        this.count = 0;
    }
}

var numRows = 0 ;
var numCols = 0 ;
var noOfPlayer = 0 ;
let playerArray = [];
let state = 0;
let stack = [];
container.style.gridTemplateColumns = `repeat(${numCols}, auto)`;

let playerColor = [
    '#ff0000',//Red
    '#00ff00',//Green
    '#ffff00',//Yellow
    '#0000ff',//Blue
    '#800080',//Purple
    '#ff861d',//Orange
    '#00ffff',//Cyan
    '#ff00ff' //Magenta
];


function generateInputs() {

    // ##########
    numRows = parseInt(document.getElementById("rows").value);
    numCols = parseInt(document.getElementById("columns").value);
    noOfPlayer = parseInt(document.getElementById("players").value);
    if (isNaN(numRows) || isNaN(numCols) || isNaN(noOfPlayer)) {
        alert("Please enter valid numbers for Rows, Columns, and Players.");
        return;
    }
    if (numRows < 5 || numRows > 20 || numCols < 5 || numCols > 20 || noOfPlayer < 2 || noOfPlayer > 8) {
        alert("Please enter numbers within the specified range.");
        return;
    }
    // ################

    const numberInput = document.getElementById("players").value;
    const nameInputsContainer = document.getElementById(
      "nameInputsContainer"
    );

    // Clear any existing inputs
    nameInputsContainer.innerHTML = "";

    // Generate the specified number of text inputs
    for (let i = 0; i < numberInput; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.name = `nameInput${i + 1}`;
      input.placeholder = `Player ${i + 1}'s Name`;
      input.style.paddingRight = "20px";
      nameInputsContainer.appendChild(input);
    }

    // Create and append the Start button
    const startButton = document.createElement("button");
    startButton.type = "button";
    startButton.className = "start-button";
    startButton.textContent = "Start";
    startButton.onclick = startGame; // Set the onclick event to call startGame
    nameInputsContainer.appendChild(startButton);
  }

function startGame() {
    //////////
    // numRows = parseInt(document.getElementById("rows").value);
    // numCols = parseInt(document.getElementById("columns").value);
    // noOfPlayer = parseInt(document.getElementById("players").value);
    // if (isNaN(numRows) || isNaN(numCols) || isNaN(noOfPlayer)) {
    //     alert("Please enter valid numbers for Rows, Columns, and Players.");
    //     return;
    // }
    // if (numRows < 5 || numRows > 20 || numCols < 5 || numCols > 20 || noOfPlayer < 2 || noOfPlayer > 8) {
    //     alert("Please enter numbers within the specified range.");
    //     return;
    // }

    // Get the player names
    const inputs = document.querySelectorAll("#nameInputsContainer input[type='text']");
    const playerNames = Array.from(inputs)
      .map((input) => input.value.trim())
      .filter((value) => value !== "");

    // Check if all player names are entered
    if (playerNames.length !== noOfPlayer) {
      alert("Please enter all player names.");
      return;
    }

    // Check for duplicate names
    const uniqueNames = new Set(playerNames);
    if (uniqueNames.size !== playerNames.length) {
      alert("Player names must be unique. Please enter different names.");
      return;
    }

    generateGrid(numRows, numCols, noOfPlayer,playerNames);
}

//////////

function disableGridBoxListeners() {
    document.querySelectorAll('.grid-box').forEach(function(gridBox) {
        gridBox.removeEventListener('click', gridBoxClickHandler);
    });
}

function enableGridBoxListeners() {
    document.querySelectorAll('.grid-box').forEach(function(gridBox) {
        gridBox.addEventListener('click', gridBoxClickHandler);
    });
}

function gridBoxClickHandler() {
    let c = rgbToHex(window.getComputedStyle(document.getElementById(this.id)).backgroundColor);
    console.log(c, playerArray[state].color);
    if (c === "#f1f1f1" || c === playerArray[state].color) {
        disableGridBoxListeners(); // Disable event listeners during action processing
        editGrid(this.id); // Perform the action
        enableGridBoxListeners(); // Re-enable event listeners after action processing
    }
    console.log(playerArray);
}

function generateGrid(numRows, numCols, noOfPlayer,playerNames) {
    let gridContainer = document.getElementById('container');
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${numCols}, auto)`;
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            let gridId = i + "_" + j;
            let grid = document.createElement('div');
            grid.className = 'grid-box';
            grid.id = gridId;
            grid.textContent = '0';
            gridContainer.appendChild(grid);
        }
    }
    for (let i = 0; i < noOfPlayer; i++) {
        playerArray.push(new player(playerColor[i], playerNames[i]));
    }
    changeShadowColor(state);
    enableGridBoxListeners(); // Add event listeners for grid boxes

    document.body.style.backgroundColor = "#ffffff";
    document.body.style.background = "none";

    document.getElementById("game_div").style.display = "block";
    document.querySelector(".startContainer").style.display = "none";

    const playerMenu = document.getElementsByClassName("dropdown-menu");

    for(let i = 0; i < noOfPlayer; i++){
        let playerListItem = document.createElement('li')
        playerListItem.innerText = playerNames[i];
        playerListItem.style.backgroundColor = playerColor[i];
        playerMenu[0].appendChild(playerListItem);
    }
}

async function editGrid(id) {
    let [row, col] = id.split('_').map(Number);
    let clickedGrid = document.getElementById(id);
    let currentValue = parseInt(clickedGrid.textContent);

    currentValue++;
    clickedGrid.textContent = currentValue;
    clickedGrid.style.backgroundColor = playerArray[state].color;
    playerArray[state].start = true;
    playerArray[state].count ++;

    if (((row === 0 || row === numRows - 1) && (col === 0 || col === numCols - 1)) && currentValue >= 2) {
        await new Promise(resolve => setTimeout(resolve, 0)); // Delay execution for 0ms
        await resetAndIncrementNeighbors(clickedGrid, row, col);
    } else if ((row === 0 || row === numRows - 1 || col === 0 || col === numCols - 1) && currentValue >= 3) {
        await new Promise(resolve => setTimeout(resolve, 0)); // Delay execution for 0ms
        await resetAndIncrementNeighbors(clickedGrid, row, col);
    } else if (currentValue >= 4) {
        await new Promise(resolve => setTimeout(resolve, 0)); // Delay execution for 0ms
        await resetAndIncrementNeighbors(clickedGrid, row, col);
    }
    changeState();
    console.log(state,noOfPlayer);
    changeShadowColor(state);
}

async function resetAndIncrementNeighbors(clickedGrid, row, col) {
    let queue = [];
    let visited = new Set(); // Set to track visited cells

    queue.push([row, col]);
    visited.add(`${row}_${col}`);
    let currentPlayer = playerArray[state];

    async function processQueue() {
        if (queue.length > 0) {
            let [currentRow, currentCol] = queue.shift();
            visited.delete(`${currentRow}_${currentCol}`);
            let currentGrid = document.getElementById(`${currentRow}_${currentCol}`);
            let currentValue = parseInt(currentGrid.textContent);
            let temp = 0;

            let directions = [
                [-1, 0],
                [0, -1], [1, 0],
                [0, 1]
            ];

            let newCol, newRow;
            for (let [dx, dy] of directions) {
                newRow = currentRow + dx;
                newCol = currentCol + dy;
                let neighborGrid = document.getElementById(`${newRow}_${newCol}`);
                if (neighborGrid) {
                    temp++;
                    let color =  rgbToHex(window.getComputedStyle(neighborGrid).backgroundColor);
                    let neighborValue = parseInt(neighborGrid.textContent);
                    if (color!="#f1f1f1"){
                        playerArray.find(player => player.color === color).count -= neighborValue;
                        playerArray.find(player => player.color === currentPlayer.color).count += neighborValue;
                    }
                    neighborValue++;
                    setTimeout(() => {
                        neighborGrid.textContent = neighborValue;
                        neighborGrid.style.backgroundColor = playerArray[state].color;
                    }, 0);
                    if (((newRow === 0 || newRow === numRows - 1) && (newCol === 0 || newCol === numCols - 1)) && neighborValue >= 2) {
                        addElement(newRow, newCol);
                    } else if ((newRow === 0 || newRow === numRows - 1 || newCol === 0 || newCol === numCols - 1) && neighborValue >= 3) {
                        addElement(newRow, newCol);
                    } else if (neighborValue >= 4) {
                        addElement(newRow, newCol);
                    }
                }
            }

            setTimeout(() => {
                bomPrint(temp, currentValue, currentGrid, newCol, newRow);
            }, 0);
            
            for (let index = 0; index < playerArray.length; index++) {
                console.log(playerArray[index].count);
                if(playerArray[index].count === 0 && playerArray[index].start === true){
                    stack.push(playerArray.splice(index,1));
                    noOfPlayer--;
                    if(noOfPlayer === state){// so than n-1 dose not became 1
                        state--;
                    }
                }
            }
            console.log(playerArray);
        
            if(playerArray.length == 1){
                endGame();
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 0)); 
            await processQueue();
        }
    }

    function addElement(newRow, newCol) {
        if (visited.has(`${newRow}_${newCol}`)) {
            queue = queue.filter(cell => cell[0] !== newRow || cell[1] !== newCol); 
        }
        queue.push([newRow, newCol]);
        visited.add(`${newRow}_${newCol}`);
    }

    await processQueue();
}

function bomPrint(temp, currentValue, currentGrid, newCol, newRow) {
    if (temp < currentValue) {
        currentValue = 1;
        currentGrid.textContent = '1';
    } else {
        currentValue = 0;
        currentGrid.textContent = '0';
        currentGrid.style.backgroundColor = "#f1f1f1";
    }
}

const changeState = ()=>{
    state = (state+1)%noOfPlayer;
}

const changeShadowColor = (i) => {
    console.log(playerArray);
    const gridBoxes = document.querySelectorAll(".grid-box");
    gridBoxes.forEach((element) => {
        element.style.boxShadow = `0 0 10px ${playerArray[i].color}`;
    });

    changeNavPlayer(i);
}

function changeNavPlayer(i){
    document.getElementById("player-name").textContent = playerArray[i].name;
    document.getElementById("player-box").style.backgroundColor = playerArray[i].color;
}

function rgbToHex(rgb) {
    var rgbArray = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!rgbArray) return rgb;

    var r = parseInt(rgbArray[1]);
    var g = parseInt(rgbArray[2]);
    var b = parseInt(rgbArray[3]);

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const endGame =  ()=>{
    const popup = document.getElementById('popup');
	const winnerMessage = document.getElementById('winnerMessage');
	const closeButton = document.getElementById('closeButton');

    popup.style.backgroundColor = playerArray[0].color+'40'
    function showPopup() {
      winnerMessage.textContent =playerArray[0].name + " won the game.";
      popup.style.display = 'block';
    }
    function hidePopup() {
      popup.style.display = 'none';
      location.reload()
    }
    closeButton.addEventListener('click', hidePopup);

    showPopup();
}

// Function to handle end game action
function handleEndGame() {
    alert("Game Over!");
    endGame();
}

// Add event listener to the end game button
document.addEventListener("DOMContentLoaded", () => {
    const endGameButton = document.getElementById("endGameButton");
    if (endGameButton) {
        endGameButton.addEventListener("click", handleEndGame);
    }
});
