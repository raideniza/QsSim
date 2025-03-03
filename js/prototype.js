window.onload = function() {

    var mainCanvas;
    var mainContext;

    var inventoryCanvas;
    var inventoryContext;

    var showingLobby = false;

    var lobby = new Image();
    var holdingPrayer = new Image();
    var redClick = new Image();
    var yellowClick = new Image();

    var ping;
    var loadTime;

    var path = "./assets/Wave 2/North/High/Zoomed Middle/";

    // Includes probabilities of each spawn by duplicating the file name
    var files = ['01.png', '02.png', '02.png', '03.png', '03.png', '03.png', '04.png', '05.png', '06.png', '07.png',
        '08.png', '09.png', '09.png', '09.png', '10.png', '11.png', '12.png', '13.png', '14.png', '15.png', '15.png',
        '15.png', '16.png', '17.png', '18.png', '19.png', '20.png', '21.png', '21.png', '21.png', '21.png', '22.png',
        '23.png', '24.png', '25.png', '25.png', '26.png', '26.png', '26.png', '27.png', '27.png', '27.png', '28.png',
        '28.png', '28.png', '29.png', '29.png', '29.png', '30.png', '30.png', '30.png', '30.png', '30.png', '31.png',
        '31.png', '31.png', '32.png', '32.png', '32.png', '32.png', '32.png'];

    const waveDropdown = document.getElementById("wave");
    const directionDropdown = document.getElementById("direction");
    const heightDropdown = document.getElementById("height");
    const zoomDropdown = document.getElementById("zoom");

    waveDropdown.onchange = ( () => {
        updateFilePath(waveDropdown.value, directionDropdown.value, heightDropdown.value, zoomDropdown.value);
    });

    directionDropdown.onchange = ( () => {
        updateFilePath(waveDropdown.value, directionDropdown.value, heightDropdown.value, zoomDropdown.value);
    });

    heightDropdown.onchange = ( () => {
        updateFilePath(waveDropdown.value, directionDropdown.value, heightDropdown.value, zoomDropdown.value);
    });

    zoomDropdown.onchange = ( () => {
        updateFilePath(waveDropdown.value, directionDropdown.value, heightDropdown.value, zoomDropdown.value);
    });


    ping = document.getElementById('ping').value;
    loadTime = document.getElementById('load-time').value;

    const pingInputSlider = document.getElementById('ping');
    const pingInputSliderValue = document.getElementById('ping-value');
    const loadTimeInputSlider = document.getElementById('load-time');
    const loadTimeInputSliderValue = document.getElementById('load-time-value');

    pingInputSlider.oninput = ( () => {
        pingInputSliderValue.textContent = pingInputSlider.value + " ms";
        ping = pingInputSlider.value;
    });

    loadTimeInputSlider.oninput = ( () => {
        loadTimeInputSliderValue.textContent = loadTimeInputSlider.value + " ms";
        loadTime = loadTimeInputSlider.value;
    });



    function init() {
        redClick.src = "./assets/red_click.gif";
        yellowClick.src = "./assets/yellow_click.gif";

        holdingPrayer.src = path + "wave.png";

        mainCanvas = document.getElementById("mainCanvas");
        mainContext = mainCanvas.getContext("2d");

        inventoryCanvas = document.getElementById("inventoryCanvas");
        inventoryContext = inventoryCanvas.getContext("2d");

        holdingPrayer.onload = function () {
            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
            mainContext.drawImage(holdingPrayer, 0, 0);
        }

    }


    function setRandomLobby() {
        randInt = Math.floor(Math.random() * files.length);
        let url = path + files[randInt];
        lobby.src = url;

        lobby.onload = function() {
            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
            mainContext.drawImage(lobby, 0, 0);
        }
    }


    function updateFilePath(wave, direction, height, zoom) {
        path = "./assets/Wave " + wave + "/" + direction + "/" + height + "/" + zoom + "/";
        holdingPrayer.src = path + "wave.png";
        showingLobby = false;
    }



    init();


    
    mainCanvas.addEventListener("mousedown", (event) => {
        if (event.button === 0) {

            if (showingLobby === false) {
                setRandomLobby();
                showingLobby = true;
            }
            else {
                mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                mainContext.drawImage(holdingPrayer, 0, 0);

                showingLobby = false;
            }

        }
    });


    // document.addEventListener("contextmenu", function (event) {
    //     event.preventDefault();
    // });
}