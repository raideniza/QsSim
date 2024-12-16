window.onload = function() {

    var layer1;
    var layer2;
    var layer3;

    var ctx1;
    var ctx2;
    var ctx3;

    var WIDTH = 783;
    var HEIGHT = 566;
    var lobby = new Image();
    var inventory = new Image();
    var in_wave = new Image();
    var redClick = new Image();
    var yellowClick = new Image();

    // path can be in either Wave 2 or Wave 3
    // path can be in either Zoomed Out, Average, or Zoomed In
    // path can be in either north, south, east, or southeast

    var path = "./assets/Wave 2/Zoomed Out/";

    var files = ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png', '08.png', '09.png', '10.png',
        '11.png', '12.png', '13.png', '14.png', '15.png', '16.png', '17.png', '18.png', '19.png', '20.png',
        '21.png', '22.png', '23.png', '24.png', '25.png', '26.png', '27.png', '28.png', '29.png', '30.png',
        '31.png', '32.png', '33.png'];
    var url;

    var showingLobby; // bool: true if showing lobby, false if showing wave
    var currentTick;
    var clickMade;
    var ladderClicked = false;
    var lobbyIsLoaded = false;
    var ticksElapsedSinceSpawnedInLobby = 0;
    var successfulTrou = true;
    var tickCounterEnabled = true;
    var tickCounterIsWhite = true;

    var currentStreak = 0;
    var previousStreak = 0;
    var highestStreak = 0;

    var wave = "Wave 2";
    var camera = "North";
    var zoom = "Zoomed Out";
    var drawOutline = true;

    var ping = document.getElementById('ping').value;
    var loadTime = document.getElementById('load-time').value;

    const pingInputSlider = document.getElementById('ping');
    const pingInputSliderValue = document.getElementById('ping-value');
    const loadTimeInputSlider = document.getElementById('load-time');
    const loadTimeInputSliderValue = document.getElementById('load-time-value');

    pingInputSlider.oninput = ( () => {
        pingInputSliderValue.textContent = pingInputSlider.value + " ms";
        ping = pingInputSlider.value;
        
        currentStreak = 0;
        previousStreak = 0;
        highestStreak = 0;
        updateStreakText();
    });

    loadTimeInputSlider.oninput = ( () => {
        loadTimeInputSliderValue.textContent = loadTimeInputSlider.value + " ms";
        loadTime = loadTimeInputSlider.value;
        
        currentStreak = 0;
        previousStreak = 0;
        highestStreak = 0;
        updateStreakText();
    });


    function init() {

        showingLobby = false;
        currentTick = 0;
        clickMade = false;

        inventory.src = "./assets/inventory.png";
        in_wave.src = "./assets/wave.png";
        redClick.src = "./assets/red_click.gif";
        yellowClick.src = "./assets/yellow_click.gif";

        layer1 = document.getElementById("layer1");
        ctx1 = layer1.getContext("2d");
        
        layer2 = document.getElementById("layer2");
        ctx2 = layer2.getContext("2d");

        layer3 = document.getElementById("layer3");
        ctx3 = layer3.getContext("2d");

        // background is 783 x 566
        in_wave.onload = function () {
            ctx1.clearRect(0, 0, WIDTH, HEIGHT);
            ctx1.drawImage(in_wave, 0, 0);
        }

        // inventory is 204 x 275
        inventory.onload = function () {
            ctx2.clearRect(0, 0, 204, 275);
            ctx2.drawImage(inventory, 0, 0);
        }

        gameTick();

    }


    function gameTick() {
        setInterval(function () {
            if (showingLobby === true) {
                ticksElapsedSinceSpawnedInLobby = ticksElapsedSinceSpawnedInLobby + 1;
                if (ladderClicked === true) {
                    if (ticksElapsedSinceSpawnedInLobby === 1) {
                        successfulTrou = true;
                    }
                }
                if (clickMade === true) {
                    setTimeout(function () {
                        ctx1.clearRect(0, 0, WIDTH, HEIGHT);
                        ctx1.drawImage(in_wave, 0, 0);
                        showingLobby = false;
                        
                        if (successfulTrou === false) {
                            resetStreak();
                        }
                        else {
                            currentStreak = currentStreak + 1;
                        }
                        updateStreakText();

                    }, loadTime);
                }
            }
            else { // showingLobby === false
                if (clickMade === true) {
                    if (lobbyIsLoaded === true) {
                        ticksElapsedSinceSpawnedInLobby = 0;
                        successfulTrou = false;
                        ladderClicked = false;
                        setTimeout(function () {
                            drawLobbyAndLadderOutline();
                            showingLobby = true;
                        }, loadTime);
                    }
                }
            }

            if (tickCounterEnabled === true) {
                tickCounterIsWhite = !tickCounterIsWhite;
                let color = tickCounterIsWhite ? 'white' : 'black';
                drawTickCounterSquare(color);
            }

            clickMade = false;
            currentTick = currentTick + 1;
        }, 600)
    }


    function ladderClick(event) {
        redClick.style.position = "absolute";
        redClick.draggable = false;
        redClick.style.left = event.clientX - 8 + "px";
        redClick.style.top = event.clientY - 8 + "px";
        redClick.style.zIndex = 4;

        if (document.body.contains(redClick)) {
            document.body.removeChild(redClick);
            clearTimeout(redClickTimeout);
        }

        document.body.appendChild(redClick);

        redClickTimeout = setTimeout(function () {
            document.body.removeChild(redClick);
        }, 220);
    }


    function missClick(event) {
        yellowClick.style.position = "absolute";
        yellowClick.draggable = false;
        yellowClick.style.left = event.clientX - 8 + "px";
        yellowClick.style.top = event.clientY - 8 + "px";
        yellowClick.style.zIndex = 4;

        if (document.body.contains(yellowClick)) {
            document.body.removeChild(yellowClick);
            clearTimeout(yellowClickTimeout);
        }

        document.body.appendChild(yellowClick);

        yellowClickTimeout = setTimeout(function () {
            document.body.removeChild(yellowClick);
        }, 220);
    }


    function setRandomLobby() {
        randInt = Math.floor(Math.random() * files.length);
        
        ctx1.beginPath();
        ctx1.moveTo(ladderClickbox[wave][camera][zoom][randInt][0]['x'], ladderClickbox[wave][camera][zoom][randInt][0]['y']);
        for (let i = 1; i < ladderClickbox[wave][camera][zoom][randInt].length; i++) {
            ctx1.lineTo(ladderClickbox[wave][camera][zoom][randInt][i]['x'], ladderClickbox[wave][camera][zoom][randInt][i]['y']);
        }
        ctx1.closePath();

        url = path + files[randInt];

        lobbyIsLoaded = false;
        lobby.src = url;

        lobby.onload = function() {
            lobbyIsLoaded = true;
        }
    }


    function drawLobbyAndLadderOutline() {
        ctx1.clearRect(0, 0, WIDTH, HEIGHT);
        ctx1.drawImage(lobby, 0, 0);

        if (drawOutline === true) {
            ctx1.strokeStyle = "red";
            ctx1.lineWidth = 0.8;
            ctx1.stroke();
        }
    }


    function drawTickCounterSquare(color) {
        ctx3.clearRect(0, 0, 25, 25);
        ctx3.fillStyle = color;
        ctx3.fillRect(0, 0, 25, 25);
    }


    function updateStreakText() {
        counterDisplay.textContent = "Current streak: " + currentStreak;
        previousDisplay.textContent = "Previous streak: " + previousStreak;
        hiscoreDisplay.textContent = "Highest streak: " + highestStreak;
    }


    function resetStreak() {
        if (currentStreak > highestStreak) {
            highestStreak = currentStreak;
        }
        if (currentStreak !== 0) {
            previousStreak = currentStreak;
        }
        currentStreak = 0;
    }


    init();


    let canvasElem = document.querySelector("canvas");

    // Event listener for click events
    canvasElem.addEventListener("mousedown", (event) => {
        const rect = canvasElem.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
    
        if (showingLobby === false) {
            missClick(event);
            setRandomLobby();
            setTimeout(function () {
                clickMade = true;
            }, ping);
        }
        else {

            if (ctx1.isPointInPath(mouseX, mouseY)) {
                ladderClick(event);
                setTimeout(function () {
                    ladderClicked = true;
                    clickMade = true;
                }, ping);
            } else {
                missClick(event);
                setTimeout(function () {
                    ladderClicked = false;
                    clickMade = true;
                }, ping);
            }
        }
    });

}


// top left -> top right -> bottom right -> bottom left
var ladderClickbox =
    {
        "Wave 2": {
            "North": {
                "Average": [
                    // array goes here
                ],
                "Zoomed In": [
                    // array goes here
                ],
                // First [i] is the screenshot 0-32. Second [i] is the coordinate (top left, top right, bottom right, bottom left)
                "Zoomed Out": [
                    [{'x': 502, 'y': 342}, {'x': 525, 'y': 342}, {'x': 528, 'y': 366}, {'x': 505, 'y': 366}], // done
                    [{'x': 481, 'y': 368}, {'x': 504, 'y': 368}, {'x': 507, 'y': 392}, {'x': 483, 'y': 392}], // done
                    [{'x': 478, 'y': 342}, {'x': 500, 'y': 342}, {'x': 503, 'y': 366}, {'x': 481, 'y': 366}], // done
                    [{'x': 471, 'y': 254}, {'x': 491, 'y': 254}, {'x': 493, 'y': 275}, {'x': 472, 'y': 275}], // done
                    [{'x': 455, 'y': 367}, {'x': 479, 'y': 367}, {'x': 481, 'y': 392}, {'x': 457, 'y': 392}], // done
                    [{'x': 454, 'y': 342}, {'x': 477, 'y': 342}, {'x': 479, 'y': 365}, {'x': 455, 'y': 365}], // done
                    [{'x': 453, 'y': 319}, {'x': 475, 'y': 319}, {'x': 477, 'y': 341}, {'x': 454, 'y': 341}], // done
                    [{'x': 451, 'y': 296}, {'x': 473, 'y': 296}, {'x': 475, 'y': 318}, {'x': 452, 'y': 318}], // done
                    [{'x': 450, 'y': 275}, {'x': 471, 'y': 275}, {'x': 473, 'y': 296}, {'x': 451, 'y': 296}], // done
                    [{'x': 448, 'y': 256}, {'x': 468, 'y': 256}, {'x': 471, 'y': 275}, {'x': 450, 'y': 275}], // done
                    [{'x': 431, 'y': 368}, {'x': 454, 'y': 368}, {'x': 456, 'y': 392}, {'x': 432, 'y': 392}], // done
                    [{'x': 430, 'y': 343}, {'x': 452, 'y': 344}, {'x': 454, 'y': 366}, {'x': 431, 'y': 366}], // done
                    [{'x': 429, 'y': 321}, {'x': 451, 'y': 321}, {'x': 453, 'y': 343}, {'x': 430, 'y': 343}], // done
                    [{'x': 428, 'y': 298}, {'x': 450, 'y': 298}, {'x': 451, 'y': 320}, {'x': 429, 'y': 319}], // done
                    [{'x': 428, 'y': 276}, {'x': 448, 'y': 277}, {'x': 449, 'y': 296}, {'x': 428, 'y': 296}], // done
                    [{'x': 426, 'y': 256}, {'x': 447, 'y': 256}, {'x': 448, 'y': 276}, {'x': 427, 'y': 276}], // done
                    [{'x': 406, 'y': 368}, {'x': 430, 'y': 368}, {'x': 430, 'y': 393}, {'x': 406, 'y': 393}], // done
                    [{'x': 405, 'y': 343}, {'x': 428, 'y': 343}, {'x': 429, 'y': 367}, {'x': 406, 'y': 367}], // done
                    [{'x': 405, 'y': 320}, {'x': 427, 'y': 320}, {'x': 428, 'y': 343}, {'x': 406, 'y': 343}], // done
                    [{'x': 404, 'y': 298}, {'x': 426, 'y': 298}, {'x': 427, 'y': 320}, {'x': 405, 'y': 320}], // done
                    [{'x': 404, 'y': 277}, {'x': 426, 'y': 277}, {'x': 426, 'y': 297}, {'x': 404, 'y': 297}], // done
                    [{'x': 405, 'y': 256}, {'x': 425, 'y': 256}, {'x': 425, 'y': 275}, {'x': 405, 'y': 275}], // done
                    [{'x': 380, 'y': 368}, {'x': 404, 'y': 368}, {'x': 405, 'y': 391}, {'x': 381, 'y': 391}], // done
                    [{'x': 381, 'y': 344}, {'x': 404, 'y': 344}, {'x': 404, 'y': 368}, {'x': 380, 'y': 368}], // done
                    [{'x': 382, 'y': 321}, {'x': 404, 'y': 321}, {'x': 404, 'y': 343}, {'x': 381, 'y': 343}], // done
                    [{'x': 381, 'y': 300}, {'x': 403, 'y': 300}, {'x': 403, 'y': 321}, {'x': 381, 'y': 320}], // done
                    [{'x': 381, 'y': 255}, {'x': 403, 'y': 255}, {'x': 403, 'y': 276}, {'x': 381, 'y': 276}], // done
                    [{'x': 356, 'y': 368}, {'x': 379, 'y': 368}, {'x': 379, 'y': 393}, {'x': 356, 'y': 393}], // done
                    [{'x': 357, 'y': 344}, {'x': 380, 'y': 344}, {'x': 379, 'y': 368}, {'x': 356, 'y': 368}], // done
                    [{'x': 357, 'y': 321}, {'x': 380, 'y': 321}, {'x': 380, 'y': 343}, {'x': 356, 'y': 343}], // done
                    [{'x': 358, 'y': 298}, {'x': 380, 'y': 298}, {'x': 380, 'y': 320}, {'x': 357, 'y': 320}], // done
                    [{'x': 358, 'y': 276}, {'x': 380, 'y': 276}, {'x': 380, 'y': 297}, {'x': 358, 'y': 297}], // done
                    [{'x': 359, 'y': 256}, {'x': 380, 'y': 256}, {'x': 380, 'y': 276}, {'x': 359, 'y': 276}]  // done
                ]
            }
        }
    };