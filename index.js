
let losingStreak = 0;
let start ="X"
$(function(){

    $(".grid").click(function(){
        if (board.turn == "player"){
            board.finaliseMove($(this).data("x"),$(this).data("y"),board.player)
        }
    })
    
    $("#begin").click(function(){
        $(".main-screen").css({"padding-top":"0px"})
        $(".grid").each(function(){
            $(this).css({"backgroundImage":"none","pointer-events":"auto"})
        })

        if (start =="X"){
            start = "O";
        } else {
            start ="X";
        }
        delete board;

        board = new Board( $("#difficulty").text(),start);
        $(".main-screen").hide();
    })
    

})

function player(p){
    this.type = p;
    if (p == "X"){
        this.color = "url('/assets/cross.png')";
    } 
    else {this.color = "url('/assets/circle.webp')";}
}


class ai {
    constructor(type,difficulty) {
        if (type=="X"){
            this.type ="O";
            this.color ="url('/assets/circle.webp')";
        } else {
            this.type = "X";
            this.color ="url('/assets/cross.png')";
        }
        this.difficulty= difficulty;
    }


    makeMove(){
        if (this.difficulty == "easy"){
            this.easyMove();
        }  else if (this.difficulty =="medium"){
            this.impossibleMove();
        } else {
            this.impossibleMove();
        }
    }

    easyMove (){
        let moves = board.findMoves();
        let rand = moves[Math.floor(Math.random() * moves.length)];
        board.finaliseMove(rand[0]+1,rand[1]+ 1,this)
    }

    impossibleMove(){
        var bestMove = this.minimax(board.board,this).index
        board.finaliseMove(bestMove[0] +1,bestMove[1] + 1,this)
    }

    minimax(Cboard,pl){
        let moves = board.findMoves();
        var cBoard = Cboard

        if (board.checkWinner(board.player.type)){
            return {score : -1}
        } else if (board.checkWinner(board.ai.type)){
            return {score: 1}
        } else if (moves.length === 0) {
            return {score: 0}
        }

        const Records = [];
            for (var i=0;i<moves.length;i++){
                const currentRecord = {};
                currentRecord.index = moves[i]
                board.makeMove(moves[i][0] + 1,moves[i][1] + 1,pl)

                if (pl == board.player){
                    const result = this.minimax(cBoard,board.ai)
                    currentRecord.score = result.score;
                } else {
                    const result = this.minimax(cBoard,board.player)
                    currentRecord.score = result.score;
                }
                
                board.undoMove()
                Records.push(currentRecord)
            }
            let bestTestPlay = null;

            if (pl === board.ai) {
                let bestScore = -Infinity;
                for (let i = 0; i < Records.length; i++) {
                    if (Records[i].score > bestScore) {
                        bestScore = Records[i].score;
                        bestTestPlay = i;
                    }
                }
            } else {
                let bestScore = Infinity;
                for (let i = 0; i < Records.length; i++) {
                    if (Records[i].score < bestScore) {
                        bestScore = Records[i].score;
                        bestTestPlay = i;
                    }
                }
            }
        return Records[bestTestPlay];
    }
}

class Board {
    constructor(dif,startType){
        this.state = false;
        this.player = new player(startType);
        this.moves = [];
        this.audio = new Audio("/assets/scribble.mp3");
        this.turn = "player"
        this.ai = new ai(this.player.type,dif);
        this.board = [["-","-","-"],
                      ["-","-","-"],
                      ["-","-","-"]]
    }

    findMoves(){
        let availableMoves = []
        for (var i=0;i<3;i++){
            for (var p=0;p<3;p++){
                if (this.board[i][p] == "-"){
                    availableMoves.push([p,i]);
                }
            }
        }
        return availableMoves
    }

    reverseGo() {
        if (this.turn =="player"){
            this.turn = "ai";
        } else {
            this.turn ="player";
        }
    }

    paintBoard (x,y,player){
        $(".grid[data-x='"+x+"'][data-y='"+y+"']").css({"backgroundImage":player.color,"pointer-events":"none"})

    }

    makeMove(x,y,player) {
        this.board[y-1][x-1] = player.type;
        this.moves.push([x,y]);
    }

    undoMove (){
        let lastMove = this.moves[this.moves.length-1];
        this.board[lastMove[1]-1][lastMove[0]-1] = "-";
        this.moves.splice(this.moves.length-1,1);
    }

    finaliseMove(x,y,player){
        this.makeMove(x,y,player);
        this.paintBoard (x,y,player);
        this.audio.play();
        if (this.checkWinner(player.type)){
            if (player.type == this.ai.type){
                losingStreak++;
            } else {
                losingStreak = 0;
            }
            this.finishGame(`${player.type} Has Won`)
            
        } else if (this.findMoves().length === 0){
            losingStreak++;
            this.finishGame("DRAW")
            
        } else {
            this.reverseGo()
            if (this.turn=="ai"){
                board.ai.makeMove();
            } 
        }
    }

    finishGame(Outcome){
        $(".losingStreak").text(losingStreak)
        $(".game-text").text(Outcome)
        $(".main-screen").show();
    }

    checkWinner(pl){
        const board = this.board;
    
        if (((board[0][0] == pl) && (board[1][1] == pl) && (board[2][2] == pl)) || ((board[0][2] == pl) && (board[1][1] == pl) && (board[2][0] == pl))){
            return true
        }
        for (var i=0;i<3;i++){ 
            if (((board[i][0] == pl) && (board[i][1] == pl) && (board[i][2] == pl)) || ((board[0][i] == pl) && (board[1][i] == pl) && (board[2][i] == pl))){
                return true        
            }
        } 
        
        return false
    }

    
}

