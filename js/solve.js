var choose = "Choose Problem";
var problems = [new FarmerProblem(), new WaterJugProblem()];
var problem = problems[0];

// Variables representing jQuery objects
var problemPanel;
var selector;
var probName;
var intro;
var state;
var moveList;
var feedback;
var resetButton;
var continueButton;
var endButton;
var moveCount = 0;
var congratulations;
var solved;
var moveText;
var displayMoves;
var goodbyePanel;
var goodbyeMessage;
var congratsPanel;
var congratButton;

var bSize;

var delay = 500;

function init() { // called when the document is ready
    
    problemPanel = $("#problemPanel");
    moveList = $("#moveTable");
    state = $("#state");
    probName = $("#probName");
    intro = $("#intro");
    feedback = $("#message");
    
    congratsPanel = $("<div></div>");
    congratsPanel.addClass("outer");
    congratsPanel.addClass("background");
    congratulations = $("<div></div>").text("Congratulations!");
    congratulations.addClass("congratsMessage");
    congratulations.addClass("centerBold");
    solved = $("<div></div>").text("You solved the problem using");
    solved.addClass("solvedMessage");
    solved.addClass("centerBold");
    moveText = $("<div></div>").text("moves");
    moveText.addClass("movesMessage");
    moveText.addClass("centerBold");
    $("body").append(congratsPanel);
    
    goodbyePanel = $("<div></div>");
    goodbyePanel.addClass("outer");
    goodbyePanel.addClass("background");
    goodbye = $("<div></div>").text("Goodbye!");
    goodbye.addClass("centerBold");
    goodbye.addClass("goodbye");
    goodbyePanel.append(goodbye);
    $("body").append(goodbyePanel);

    resetButton = $("#reset");
    resetButton.click(function() { 
        reset(); 
    });
    
    selector = $("#selector");
    
    selector.append($("<option></option>").text(choose));  // Default selector option
    
    selector.change(function() {                           
        if (selector.val() === choose) {
            problemPanel.slideUp(delay);
        }
        else {
            problemPanel.slideUp(delay, function(){   // Note use of callback
                changeProblem();                      // function to avoid
                problemPanel.slideDown(delay);        // timing issues
            });
        }
    });
    
    problems.forEach(function(p) {
        selector.append($("<option></option>").text(p.name));
    });
    

    
    problemPanel.hide();   // Do not show problem panel initially
    congratsPanel.hide();
    goodbyePanel.hide();
    
    

}

function changeProblem() {
    
    problem = problemForName(selector.val());
    probName.text(problem.name);
    intro.text(problem.introduction);
    state.attr("cols", "" + problem.currentState.width);
    state.attr("rows", "" + problem.currentState.height);
    updateState();
    clearTable();
    clearMessage();
    bSize = computeButtonSize();
    
    problem.moveNames.forEach(function(move) {
        var item = $("<li></li>").append(createButton(move));
        moveList.append(item); 
    });
}

function problemForName(probName) {    
    var prob;
    problems.forEach(function(p) {
        if (p.name === probName) prob = p;
    });  
    return prob;
}

function clearTable() {
    moveList.empty();
}

function computeButtonSize() { // determines largest move name so move buttons
    var size = 0;              // have uniform size
    problem.moveNames.forEach(function(move) {
        if (move.length > size) {
            size = move.length;
        }
    });
    return size + 1;    // add some length to provide a margin
}

function createButton(move) {
    var button = $("<input></input>");
    button.attr("type", "button");
    button.val(move);
    button.css("width", bSize + "ex");
    button.click(function() {
        clearMessage();
        tryMove(move);
    });
    return button;
}

function tryMove(move) {
    var newState = problem.mover.doMove(move, problem.currentState);
    if (newState === null)
        displayMessage("That move is not possible");
    else {
        problem.currentState = newState;
        moveCount = moveCount + 1;
        updateState();
    }
    if (problem.success()) {
        congratulate();
        
        //displayMessage("Congratulations. You solved the problem.");
    }
}

function congratulate() {
    selector.prop("disabled", true);
    
    buttons = $("<div></div>");
    buttons.addClass("buttons");
    
    continueButton = $("<button></button>").text("Continue");
    continueButton.addClass("navButton");
    continueButton.click(problemPanelDisplay);
    
    endButton = $("<button></button>").text("Quit");
    endButton.addClass("navButton");
    
    endButton.click(gButtonPush);
    
    buttons.append(continueButton);
    buttons.append(endButton);
    
    stateText = $("<textarea readonly></textarea>").text(
            problem.currentState.toString());
    stateText.addClass("statetext");
    
    moveCountText = $("<div></div>").text(moveCount.toString());
    moveCountText.addClass("moveCount");
    moveCountText.addClass("centerBold");
    
    congratsPanel.append(stateText);
    congratsPanel.append(congratulations);
    congratsPanel.append(solved);
    congratsPanel.append(moveCountText);
    congratsPanel.append(moveText);
    congratsPanel.append(buttons);
    
    congratsPanel.show();
    problemPanel.hide();
}

function gButtonPush () {
    congratsPanel.hide();
    goodbyePanel.show();
}

function problemPanelDisplay() {
    
    selector.prop("disabled", false);
    reset();
    congratsPanel.empty();
    congratsPanel.hide();
    problemPanel.hide();
        selector.append($("<option></option>").text(choose));  // Default selector option

}

function displayMessage(message) {
    feedback.text(message);
}

function clearMessage() {
    displayMessage("");
}

function updateState() {
    state.val(problem.currentState);
}

function reset() {
    problem.currentState = problem.initialState;
    updateState();
    clearMessage();
    moveCount = 0;
}
