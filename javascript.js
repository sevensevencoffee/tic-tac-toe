function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for(let i = 0; i < rows; i++) {
        board[i] = [];
        for(let j = 0; j < columns; j++) {
            board[i].push((Cell()));
        }
    }

    const getBoard = () => board;

    const dropMove = (row, column, player) => {
        if(board[row][column].getValue() === 0) {
            board[row][column].addStep(player);
            return true;
        }
        return false;
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
      };

    return {getBoard, dropMove, printBoard}
}

function Cell() {
    let value = 0;

    const addStep = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addStep,
        getValue
    };
}

function GameController(
    playerOneName = "X",
    playerTwoName = "O"
){
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: 1
        },
        {
            name: playerTwoName,
            token: 2
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const checkWinner = () => {
        const b = board.getBoard().map(row => row.map(cell => cell.getValue()));

        for(i=0; i<3; i++) {
            if(b[i][0] === b[i][1] && b[i][1] === b[i][2] && b[i][0] !=0) return players.find(p => p.token === b[i][0]);
            if(b[0][i] === b[1][i] && b[1][i] === b[2][i] && b[0][i] !=0) return players.find(p => p.token === b[0][i]);
        }

        if(b[0][0] === b[1][1] && b[1][1] === b[2][2] && b[0][0] !=0) return players.find(p => p.token === b[0][0]);
        if (b[0][2] === b[1][1] && b[1][1] === b[2][0] && b[0][2] != 0) return players.find(p => p.token === b[0][2]);
        return 0;
    };

    const playRound = (row, column) => {
        console.log(
            `Dropping ${getActivePlayer().name}'s token into row ${row} and column ${column}...`
          );
        const moveResult = board.dropMove(row, column, getActivePlayer().token);

        const result = {
            success: moveResult,
            player: getActivePlayer(),
        };
        
        const winner = checkWinner();

        if(winner) {
            console.log(`${winner} wins!`)
        } else {
        switchPlayerTurn();
        printNewRound();
        }

        return {
            playRound,
            getActivePlayer,
            getBoard,
            checkWinner  
        };
    }

    const getBoard = () => board.getBoard();

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        checkWinner
    };
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const winnerDiv = document.querySelector(".winner");

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const winner = game.checkWinner();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn`
        if(winner) {
            winnerDiv.textContent = `${winner.name} wins!`;
        } else {
            winnerDiv.textContent = "";
        }

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = cell.getValue() === 0 ? "": (cell.getValue() === 1 ? "X" : "O");
                boardDiv.appendChild(cellButton);
            }) 
        });
    }

    function clickHandleButton(e) {
       
        if(e.target.classList.contains("cell")) {
            const selectedRow = parseInt(e.target.dataset.row);
            const selectedColumn = parseInt(e.target.dataset.column);    
            game.playRound(selectedRow, selectedColumn);
            updateScreen();
        }
    }

    boardDiv.addEventListener("click", clickHandleButton);

    updateScreen();

}

ScreenController();
