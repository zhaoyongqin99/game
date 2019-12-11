import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             value: null,
//         }
//     }
//     render() {
//         return (
//             <button 
//             className="square" 
//             onClick={() => { this.setState({ value: "X" }) }}>
//                 {this.state.value}
//             </button>
//         )
//     }
// }

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}>
            {props.value}
        </button>
    )
}
class Board extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         squares: Array(9).fill(null),
    //         xIsNext: true
    //     }
    // }

    // handleClick(i) {
    //     const squares = this.state.squares.slice();
    //     if (calculateWinner(squares) || squares[i]) {
    //         return;
    //     }
    //     squares[i] = this.state.xIsNext ? 'X' : 'O';
    //     this.setState({
    //         squares: squares,
    //         xIsNext: !this.state.xIsNext
    //     });
    // }

    renderSquare(i) { //定义了一个方法引入组件Square
        return <Square
            value={this.props.squares[i]} //对应的取出每一个button的值 然后传过去
            onClick={() => this.props.onClick(i)} /> //传给每一个button点击事件 
    }

    render() {
        // const status = 'Next player:'+(this.state.xIsNext ? 'X':'O');
        // const winner = calculateWinner(this.state.squares);
        // let status;
        // if (winner) {
        //     status = 'Winner: ' + winner;
        // } else {
        //     status = 'Next player:' + (this.state.xIsNext ? 'X' : 'O');
        // }
        return (
            <div>
                {/* <div className='status'>{status}</div> */}
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            isclick: false,
            winnerlist:[]
        }
    }

    handleClick(i) {
        console.log(this.state.stepNumber)
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        console.log("history", history); //这里是所有的历史记录
        const current = history[history.length - 1]; //取出上一次的跳棋记录
        console.log("current", current);
        const squares = current.squares.slice();
        console.log("squares", squares)

        if (calculateWinner(squares) || squares[i]) { //如果有人赢了 游戏结束
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });

    }

    jumpTo(step, e) { //这里表示跳到第几步的跳棋动作
        //console.log(step)  //遍历所有的li 第step个li就是被点击的li 那么我们需要就将其变颜色
        var lilist = document.getElementsByTagName("li");
        lilist = Array.prototype.slice.call(lilist)
        // console.log("lilist",lilist)

        lilist.map((item, index) => {
            item.setAttribute("class", "");
            if (index == step) {
                // console.log("第"+step+"个li被选中")
                item.setAttribute("class", "historyli")
            }
        })
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        console.log("render里面的history", history);
        const current = history[this.state.stepNumber]; //最新的一个操作
        console.log("render里面的current", current);
        const winner = calculateWinner(current.squares);
        // console.log("render里面的winner",winner)

        console.log("render里面的current.squares",current.squares)
        let row = 0; let col = 0;
        current.squares.map((item, index) => {
            if (item != null) {
                // console.log(index,item)
                if (index % 3 > 0) {
                    row = parseInt(index / 3) + 1;
                    col = (index % 3) + 1
                } else if (index % 3 == 0) {
                    col = 3;
                }

            }
        })
        //这里的move就是index step就是index对应的值item
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move + ":  " : 'Go to game start:  '
            const footprint = row + '行' + col + '列'
            return (
                <li key={move} onClick={() => this.jumpTo(move)}>
                    {desc}{footprint}
                </li>
            )
        })

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)} />
                    {/* 给组件传handleClick事件 获取点击到的数据 */}
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        )
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
            console.log(lines[i])
            return squares[a]
        }
    }
    return null;
}

ReactDOM.render(
    <Game />, document.getElementById('root')
)