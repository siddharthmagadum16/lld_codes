// Enums
enum Color {
    BLACK = "BLACK",
    WHITE = "WHITE"
}

enum GameStatus {
    BLACK_WON = "BLACK_WON",
    WHITE_WON = "WHITE_WON",
    DRAW = "DRAW",
    ABORT = "ABORT",
    IN_PROGRESS = "IN_PROGRESS",
    START = "START"
}

enum PieceType {
    PAWN = "PAWN",
    ROOK = "ROOK",
    KNIGHT = "KNIGHT",
    BISHOP = "BISHOP",
    QUEEN = "QUEEN",
    KING = "KING"
}

// Position class
class Position {
    constructor(public row: number, public col: number) {}

    equals(other: Position): boolean {
        return this.row === other.row && this.col === other.col;
    }

    isValid(): boolean {
        return this.row >= 0 && this.row < 8 && this.col >= 0 && this.col < 8;
    }
}

// Forward declaration workaround
interface IChess {
    getBoard(): ChessBoard;
}

// Abstract Piece class
abstract class Piece {
    constructor(
        protected position: Position,
        protected color: Color,
        protected type: PieceType
    ) {}

    getPosition(): Position {
        return this.position;
    }

    getColor(): Color {
        return this.color;
    }

    getType(): PieceType {
        return this.type;
    }

    setPosition(position: Position): void {
        this.position = position;
    }

    abstract isValidMove(dest: Position, board: ChessBoard): boolean;
}

// Concrete Piece implementations
class Pawn extends Piece {
    constructor(position: Position, color: Color) {
        super(position, color, PieceType.PAWN);
    }

    isValidMove(dest: Position, board: ChessBoard): boolean {
        // Simplified pawn movement logic
        const direction = this.color === Color.WHITE ? -1 : 1;
        const startRow = this.color === Color.WHITE ? 6 : 1;

        // Move forward one square
        if (dest.col === this.position.col &&
            dest.row === this.position.row + direction &&
            !board.getPieceAt(dest)) {
            return true;
        }

        // Move forward two squares from starting position
        if (this.position.row === startRow &&
            dest.col === this.position.col &&
            dest.row === this.position.row + 2 * direction &&
            !board.getPieceAt(dest)) {
            return true;
        }

        return false;
    }
}

class King extends Piece {
    constructor(position: Position, color: Color) {
        super(position, color, PieceType.KING);
    }

    isValidMove(dest: Position, board: ChessBoard): boolean {
        // King can move one square in any direction
        const rowDiff = Math.abs(dest.row - this.position.row);
        const colDiff = Math.abs(dest.col - this.position.col);

        return rowDiff <= 1 && colDiff <= 1 && (rowDiff > 0 || colDiff > 0);
    }
}

class Rook extends Piece {
    constructor(position: Position, color: Color) {
        super(position, color, PieceType.ROOK);
    }

    isValidMove(dest: Position, board: ChessBoard): boolean {
        // Rook moves horizontally or vertically
        return this.position.row === dest.row || this.position.col === dest.col;
    }
}

// Player class
class Player {
    constructor(
        private name: string,
        private color: Color
    ) {}

    getName(): string {
        return this.name;
    }

    getColor(): Color {
        return this.color;
    }

    // In a real implementation, this would get input from UI or network
    async makeMove(): Promise<[Position, Position]> {
        // Placeholder - in real implementation would get user input
        console.log(`${this.name}'s turn (${this.color})`);
        // Return dummy move for now
        return [new Position(0, 0), new Position(0, 1)];
    }
}

// ChessBoard class
class ChessBoard {
    private board: (Piece | null)[][] = [];

    constructor() {
        this.initializeBoard();
    }

    private initializeBoard(): void {
        // Initialize empty board
        for (let i = 0; i < 8; i++) {
            this.board[i] = new Array(8).fill(null);
        }

        // Place pawns
        for (let col = 0; col < 8; col++) {
            this.board[1][col] = new Pawn(new Position(1, col), Color.BLACK);
            this.board[6][col] = new Pawn(new Position(6, col), Color.WHITE);
        }

        // Place rooks
        this.board[0][0] = new Rook(new Position(0, 0), Color.BLACK);
        this.board[0][7] = new Rook(new Position(0, 7), Color.BLACK);
        this.board[7][0] = new Rook(new Position(7, 0), Color.WHITE);
        this.board[7][7] = new Rook(new Position(7, 7), Color.WHITE);

        // Place kings
        this.board[0][4] = new King(new Position(0, 4), Color.BLACK);
        this.board[7][4] = new King(new Position(7, 4), Color.WHITE);
    }

    getPieceAt(position: Position): Piece | null {
        if (!position.isValid()) return null;
        return this.board[position.row][position.col];
    }

    movePiece(from: Position, to: Position): void {
        const piece = this.getPieceAt(from);
        if (piece) {
            this.board[to.row][to.col] = piece;
            this.board[from.row][from.col] = null;
            piece.setPosition(to);
        }
    }

    getKingPosition(color: Color): Position | null {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.getType() === PieceType.KING && piece.getColor() === color) {
                    return piece.getPosition();
                }
            }
        }
        return null;
    }

    isValidMove(from: Position, to: Position, player: Player): boolean {
        // Check if positions are within bounds
        if (!from.isValid() || !to.isValid()) return false;

        // Check if there's a piece at the starting position
        const piece = this.getPieceAt(from);
        if (!piece) return false;

        // Check if the piece belongs to the player
        if (piece.getColor() !== player.getColor()) return false;

        // Check if destination has a piece of the same color
        const destPiece = this.getPieceAt(to);
        if (destPiece && destPiece.getColor() === player.getColor()) return false;

        // Check if the move is valid for the piece type
        return piece.isValidMove(to, this);
    }
}

// Chess game class
class Chess implements IChess {
    private board: ChessBoard;
    private status: GameStatus;
    private currentPlayer: Player;
    private playerWhite: Player;
    private playerBlack: Player;

    constructor(player1: Player, player2: Player) {
        this.board = new ChessBoard();
        this.status = GameStatus.START;

        // Assign players based on color
        if (player1.getColor() === Color.WHITE) {
            this.playerWhite = player1;
            this.playerBlack = player2;
        } else {
            this.playerWhite = player2;
            this.playerBlack = player1;
        }

        this.currentPlayer = this.playerWhite; // White starts
    }

    getBoard(): ChessBoard {
        return this.board;
    }

    async start(): Promise<void> {
        this.status = GameStatus.IN_PROGRESS;
        console.log("Chess game started!");

        while (this.status === GameStatus.IN_PROGRESS) {
            try {
                const [from, to] = await this.currentPlayer.makeMove();

                if (this.board.isValidMove(from, to, this.currentPlayer)) {
                    this.board.movePiece(from, to);
                    console.log(`Move made: ${from.row},${from.col} to ${to.row},${to.col}`);

                    // Switch players
                    this.currentPlayer = this.currentPlayer === this.playerWhite ?
                        this.playerBlack : this.playerWhite;
                } else {
                    console.log("Invalid move, try again");
                }

                // In a real implementation, check for checkmate, stalemate, etc.
                // For demo, just stop after one move
                this.status = GameStatus.DRAW;
            } catch (error) {
                console.error("Error during move:", error);
                this.status = GameStatus.ABORT;
            }
        }

        console.log(`Game ended with status: ${this.status}`);
    }
}

// Main function
async function main(): Promise<void> {
    const playerA = new Player("sid", Color.BLACK);
    const playerB = new Player("sam", Color.WHITE);

    const chess = new Chess(playerA, playerB);
    await chess.start();
}

// Execute main
main().catch(console.error);