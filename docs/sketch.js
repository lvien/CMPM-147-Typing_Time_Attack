function preload()
{
    types = [];
    wrong = [];
    for (let i = 1; i <= 7; i++)
        types.push(loadSound('assets/type'+i+'.ogg'));
    for (let i = 1; i <= 4; i++)
        wrong.push(loadSound('assets/whack'+i+'.ogg'));
    correct = loadSound('assets/correct.ogg');
    type = loadSound('assets/type.ogg');
    space = loadSound('assets/space.ogg');
}

function setup() {
    var canvas = createCanvas(displayWidth, 900);
    canvas.parent('sketch-holder');
    time = second();
    correct.setVolume(0.50);
    game = new TypingGame(typeCallback,function(){correct.play();},wrongCallback, function(){boom.play();},function(){fail.play();});
}

function typeCallback()
{
    let num = types[Math.floor(random(7))];
    num.setVolume(0.75);
    num.play();
}

function wrongCallback()
{
    let num = wrong[Math.floor(random(4))];
    num.play();
}

function draw()
{
    //console.log(game.gameTimer);
    game.draw();
}
function keyPressed()
{
    if (game.getState() < 3)
        game.pressKey(key);
    return false;
}

function keyReleased()
{
    if (game.getState() < 3)
        game.releaseKey(keyCode);
}

document.onkeypress = function(e) {
    e = e || window.event;
    var charCode = e.keyCode || e.which;
    if (charCode === 32) {
        e.preventDefault();
        return false;
    }
}