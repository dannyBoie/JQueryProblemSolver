function WaterJugProblem() {
    this.name = "Water Jug";

    this.introduction = 
	"You are given two empty jugs: jug X holds 3 gallons, jug Y holds 4. " +
        "Neither has any measuring markers on it. You have a ready supply " +
        "of water. You can fill either jug, empty either jug on the ground, " +
        "or pour all or some of either jug into the other.  The goal is to " +
        "get exactly 2 gallons of water into either jug.";

    this.initialState = new WaterJugState(0, 0);

    this.currentState = this.initialState;

    this.moveNames = [FILL_X, FILL_Y, EMPTY_X, EMPTY_Y, X_TO_Y, Y_TO_X];

    this.mover = new WaterJugMover();

    this.success = function () {
	return this.currentState.x === 2 || this.currentState.y === 2;
    };
}
