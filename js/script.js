window.onload = async function () {

    let clickboxes = await fetch('./clickboxes.json').then(res => res.json());
    console.log(clickboxes);

    var lobby = new Image();
    var holdingPrayer = new Image();
    var knife = new Image();
    var branch = new Image();
    var use_knife = new Image();
    var use_branch = new Image();
    var point_screen = new Image();

    var path = "./qs/Wave 2/North/Medium Zoom/High Height/Highlight/No Destination Qs/";
    var baScreenshotPath = "./qs/Wave 2/North/Medium Zoom/High Height/";

    // Includes probabilities of each spawn by duplicating the file name
    let dest_qs_files = ['17.png', '18.png', '18.png', '22.png', '22.png', '22.png', '25.png', '26.png', '27.png', '28.png',
        '29.png', '30.png', '30.png', '30.png', '33.png', '34.png', '35.png', '36.png', '37.png', '38.png', '38.png',
        '38.png', '41.png', '42.png', '43.png', '44.png', '45.png', '46.png', '46.png', '46.png', '46.png', '49.png',
        '50.png', '51.png', '52.png', '52.png', '53.png', '53.png', '53.png', '56.png', '56.png', '56.png', '57.png',
        '57.png', '57.png', '58.png', '58.png', '58.png', '59.png', '59.png', '59.png', '59.png', '59.png', '60.png',
        '60.png', '60.png', '61.png', '61.png', '61.png', '61.png', '61.png'];


    // Shortcut to create an array of 01.png to 61.png
    let all_qs_files = [];
    for (let i = 1; i <= 61; i++) {
        all_qs_files.push(i.toString().padStart(2, '0') + '.png');
    }

    var currentFiles = all_qs_files;

    const waveDropdown = document.getElementById("wave");
    const directionDropdown = document.getElementById("direction");
    const heightDropdown = document.getElementById("height");
    const zoomDropdown = document.getElementById("zoom");
    const highlightDropdown = document.getElementById("highlight");
    const tilesDropdown = document.getElementById("tiles");

    const coordsDiv = document.getElementById("coords");

    waveDropdown.onchange = ( () => {
        updateFilePath(waveDropdown.value, directionDropdown.value, heightDropdown.value, zoomDropdown.value, highlightDropdown.value, tilesDropdown.value);
    });

    directionDropdown.onchange = ( () => {
        updateFilePath(waveDropdown.value, directionDropdown.value, heightDropdown.value, zoomDropdown.value, highlightDropdown.value, tilesDropdown.value);
    });

    heightDropdown.onchange = ( () => {
        updateFilePath(waveDropdown.value, directionDropdown.value, heightDropdown.value, zoomDropdown.value, highlightDropdown.value, tilesDropdown.value);
    });

    zoomDropdown.onchange = ( () => {
        updateFilePath(waveDropdown.value, directionDropdown.value, heightDropdown.value, zoomDropdown.value, highlightDropdown.value, tilesDropdown.value);
    });

    highlightDropdown.onchange = ( () => {
        updateFilePath(waveDropdown.value, directionDropdown.value, heightDropdown.value, zoomDropdown.value, highlightDropdown.value, tilesDropdown.value);
    });

    tilesDropdown.onchange = ( () => {
        updateFilePath(waveDropdown.value, directionDropdown.value, heightDropdown.value, zoomDropdown.value, highlightDropdown.value, tilesDropdown.value);
    });


    var ping = document.getElementById('ping').value;
    var loadTime = document.getElementById('load-time').value;

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




    var backgroundCanvas = document.getElementById("backgroundCanvas");
    var backgroundContext = backgroundCanvas.getContext("2d");


    var RedYellowXCanvas = document.getElementById("RedYellowXCanvas");
    var RedYellowXContext = RedYellowXCanvas.getContext("2d");

    var PointScreenCanvas = document.getElementById("PointScreenCanvas");
    var PointScreenContext = PointScreenCanvas.getContext("2d");

    var inventoryCanvas = document.getElementById("inventoryCanvas");
    var inventoryContext = inventoryCanvas.getContext("2d");
    // inventoryContext.strokeRect(0, 0, inventoryCanvas.width, inventoryCanvas.height);

    var inventoryUseItemCanvas = document.getElementById("inventoryUseItemCanvas");
    var inventoryUseItemContext = inventoryUseItemCanvas.getContext("2d");

    var XPDropCanvas = document.getElementById("XPDropCanvas");
    var XPDropContext = XPDropCanvas.getContext("2d");
    XPDropContext.font = 'bold 48px osrsFont';

    var tickCounterCanvas = document.getElementById("tickCounterCanvas");
    var tickCounterContext = tickCounterCanvas.getContext("2d");

    holdingPrayer.src = baScreenshotPath + "wave.png";

    holdingPrayer.onload = function () {
        backgroundContext.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
        backgroundContext.drawImage(holdingPrayer, 0, 0);
    }

    knife.src = "./assets/knife.png";
    branch.src = "./assets/branch.png";
    use_knife.src = "./assets/use_knife.png";
    use_branch.src = "./assets/use_branch.png";
    point_screen.src = "./assets/point_screen.png";




    /* GIF drawing code ============================================================================== */
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d');

    const slots = {
        red_x: { frames: [], w: 0, h: 0, loaded: false, timers: [] },
        yellow_x: { frames: [], w: 0, h: 0, loaded: false, timers: [] }
    };

    let activeSlot = null;

    function clearCanvas() {
        RedYellowXContext.clearRect(0, 0, RedYellowXCanvas.width, RedYellowXCanvas.height);
    }

    async function loadGif(slot, url) {
        const s = slots[slot];
        s.loaded = false;
        s.frames = [];
        stopPlayback(slot);

        let buf;
        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error('HTTP ${resp.status}');
            buf = await resp.arrayBuffer();
        } catch {
            return;
        }

        const reader = new GifReader(new Uint8Array(buf));
        s.w = reader.width;
        s.h = reader.height;

        const n = reader.numFrames();
        const comp = new ImageData(s.w, s.h);
        const prev = new Uint8ClampedArray(s.w * s.h * 4);

        for (let i = 0; i < n; i++) {
            const info = reader.frameInfo(i);
            if (info.disposal === 3) prev.set(comp.data);

            reader.decodeAndBlitFrameRGBA(i, comp.data);

            s.frames.push({
                imageData: new ImageData(new Uint8ClampedArray(comp.data), s.w, s.h),
                delay: Math.max((info.delay || 10) * 10, 20),
            });

            if (info.disposal === 2) comp.data.fill(0);
            else if (info.disposal === 3) comp.data.set(prev);
        }

        s.loaded = true;
    }

    function stopPlayback(slot) {
        slots[slot].timers.forEach(clearTimeout);
        slots[slot].timers = [];
    }

    function stopAll() {
        stopPlayback('red_x');
        stopPlayback('yellow_x');
    }

    function playGifAt(slot, cx, cy) {
        const s = slots[slot];
        stopAll();
        clearCanvas();
        activeSlot = slot;

        offscreen.width = s.w;
        offscreen.height = s.h;

        const ox = Math.round(cx - s.w / 2);
        const oy = Math.round(cy - s.h / 2);
        let elapsed = 0;

        s.frames.forEach((frame, i) => {
            const t = setTimeout(() => {
                if (activeSlot !== slot) return; // superseded by another click

                offCtx.putImageData(frame.imageData, 0, 0);
                RedYellowXContext.clearRect(ox, oy, s.w, s.h);
                RedYellowXContext.drawImage(offscreen, ox, oy);

                if (i === s.frames.length - 1) {
                    clearCanvas();
                    activeSlot = null;
                }
            }, elapsed);

            s.timers.push(t);
            elapsed += frame.delay;
        });
    }

    function coords(e) {
        const r = RedYellowXCanvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - r.left) * RedYellowXCanvas.width / r.width),
            y: Math.round((e.clientY - r.top) * RedYellowXCanvas.height / r.height),
        };
    }


    loadGif('red_x', 'assets/red_click.gif');
    loadGif('yellow_x', 'assets/yellow_click.gif');
/* ================================================================================================ */


    const inventoryTopLeftX = 553;
    const inventoryTopLeftY = 230;
    const rows = 7;
    const cols = 4;
    var inventory = Array.from({ length: rows }, () => Array(cols).fill(""));
    // inventory[0][0] = 'h';
    inventory[1][0] = 'k';
    inventory[2][0] = 'b';


    function drawInventory() {
        inventoryUseItemContext.clearRect(0, 0, inventoryUseItemCanvas.width, inventoryUseItemCanvas.height);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let x = 37 + j * 42;
                let y = 45 + i * 36;
                if (inventory[i][j] === 'k') {
                    inventoryUseItemContext.drawImage(knife, x, y);
                }
                else if (inventory[i][j] === 'b') {
                    inventoryUseItemContext.drawImage(branch, x, y);
                }
            }
        }
    }


    function isInventoryClickInDeadSpace(x, y) {

        // let x = 40 + j * 42; (horizontal gap of 6)
        // let y = 45 + i * 36; (vertical gap of 4)

        // Is the click too high or too to the left
        if (x < 37 || y < 45) {
            return true;
        }

        // Is the click too low or too to the right
        else if (x > 202 || y > 293) {
            return true;
        }

        // Is the click in between different foods
        if (x % 42 >= 34 && x % 42 <= 39) {
            if (y % 36 >= 5 && y % 36 <= 8) {
                return true;
            }
        }

        // The click therefore must be on an item
        return false;
    }

    var knifeUsed = false;
    var branchUsed = false;
    var queueBranch = false;

    function useItem(x, y) {

        // Get the [x][y] of the food
        // inventory[x][y] will be either 'k' (knife) or 'b' (branch)
        // Handle use item logic

        let col_index = Math.floor((x - 37) / 42);
        let row_index = Math.floor((y - 45) / 36);

        let draw_x = 37 + col_index * 42;
        let draw_y = 45 + row_index * 36;

        if (inventory[row_index][col_index] === 'k') {
            if (branchUsed === true) {
                endTime = performance.now();
                clickTime = Math.floor(endTime) - Math.floor(startTime);
                differential = clickTime + Number(ping) - 1200;

                if (differential <= 0) {
                    xpDropColor = blue;
                    xpDropText = String(differential) + " ms";
                }
                else {
                    xpDropColor = red;
                    xpDropText = "+" + String(differential) + " ms";
                }
                const newXpDrop = prepareXpDrop(xpDropText, xpDropColor, 525, 250);
                activeAnimations.push(newXpDrop);
                setTimeout(() => {
                    queueBranch = true;
                }, ping);
                branchUsed = false;
                knifeUsed = false;
                drawInventory();
            }
            else if (knifeUsed === true) {
                knifeUsed = false;
                drawInventory();
            }
            else {
                inventoryUseItemContext.drawImage(use_knife, draw_x, draw_y);
                knifeUsed = true;
            }
        }
        else if (inventory[row_index][col_index] === 'b') {
            if (knifeUsed === true) {
                endTime = performance.now();
                clickTime = Math.floor(endTime) - Math.floor(startTime);
                differential = clickTime + Number(ping) - 1200;

                if (differential <= 0) {
                    xpDropColor = blue;
                    xpDropText = String(differential) + " ms";
                }
                else {
                    xpDropColor = red;
                    xpDropText = "+" + String(differential) + " ms";
                }
                const newXpDrop = prepareXpDrop(xpDropText, xpDropColor, 525, 250);
                activeAnimations.push(newXpDrop);
                setTimeout(() => {
                    queueBranch = true;
                }, ping);
                knifeUsed = false;
                branchUsed = false;
                drawInventory();
            }
            else if (branchUsed === true) {
                branchUsed = false;
                drawInventory();
            }
            else {
                inventoryUseItemContext.drawImage(use_branch, draw_x, draw_y);
                branchUsed = true;
            }
        }
    }


    var startTime;
    var endTime;
    var clickTime;
    var differential;
    const activeAnimations = [];
    var xpDropColor;
    var xpDropText;
    const blue = '#2127ca';
    const red = '#d2042d';


    function prepareXpDrop(text, color, startX, startY) {
        return {
            text: text,
            color: color,
            x: startX,
            y: startY,
            alpha: 1
        };
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r}, ${g}, ${b}`;
    }

    function animateClickSpeedAsXpDrop() {
        XPDropContext.clearRect(0, 0, XPDropCanvas.width, XPDropCanvas.height);

        activeAnimations.forEach((anim, index) => {
            XPDropContext.fillStyle = `rgba(${hexToRgb(anim.color)}, ${anim.alpha})`;
            XPDropContext.fillText(anim.text, anim.x, anim.y);

            anim.y -= 2;
            if (anim.y < 50) {
                anim.alpha -= 0.02;
            }

            if (anim.alpha <= 0) {
                activeAnimations.splice(index, 1);
            }
        });

        requestAnimationFrame(animateClickSpeedAsXpDrop);
    }






    var currentScreen = 'wave';
    var queueScreenChange = false;
    var queueMove = false;
    var tickCounterIsWhite = true;
    var clickLocation = null;
    var numberOfTicksElapsedInLobby = 0;
    var pointScreenIsOpen = false;
    var lobbyPreparedFlag = false;

    animateClickSpeedAsXpDrop();

    this.setTimeout(() => {
        drawInventory();
    }, 600);
    
    prepareRandomLobby();
    gameTick();


    function gameTick() {
        setInterval(() => {
            if (currentScreen === 'lobby') {

                if (numberOfTicksElapsedInLobby === 0 && queueMove === true) {
                    console.log("move on this tick");
                }
                if (numberOfTicksElapsedInLobby === 1 && queueBranch === true) {
                    console.log("branch on this tick");
                }

                if (pointScreenIsOpen === true) {
                    backgroundContext.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
                    backgroundContext.drawImage(holdingPrayer, 0, 0);
                    PointScreenContext.clearRect(0, 0, PointScreenCanvas.width, PointScreenCanvas.height);
                    queueBranch = false;
                    queueMove = false;
                    pointScreenIsOpen = false;
                    currentScreen = 'wave';
                    prepareRandomLobby();
                }
                else if (numberOfTicksElapsedInLobby === 2 && queueBranch === true) {
                    PointScreenContext.drawImage(point_screen, 30, 63);
                    pointScreenIsOpen = true;
                }
                else if (numberOfTicksElapsedInLobby === 1 && queueBranch === false) {
                    PointScreenContext.drawImage(point_screen, 30, 63);
                    pointScreenIsOpen = true;
                }

                numberOfTicksElapsedInLobby = numberOfTicksElapsedInLobby + 1;
            }

            else if (queueScreenChange === true) {
                startTime = performance.now();
                setTimeout(() => {
                    // if (tilesDropdown.value === "Destination Qs") {
                    //     setRandomLobby(dest_qs_files);
                    // }
                    // else {
                    //     setRandomLobby(all_qs_files);
                    // }
                    drawLobby();
                    currentScreen = "lobby";
                    numberOfTicksElapsedInLobby = 0;
                    queueScreenChange = false;
                    lobbyPreparedFlag = false;
                }, loadTime);
            }

            // else {
            //     if (lobbyPreparedFlag === false) {
            //         prepareRandomLobby()
            //     }
            // }

            tickCounterIsWhite = !tickCounterIsWhite;
            let tickCounterColor = tickCounterIsWhite ? 'white' : 'black';
            drawTickCounterSquare(tickCounterColor);
        }, 600);
    }


    function prepareRandomLobby() {
        let randInt = Math.floor(Math.random() * currentFiles.length);
        let ladderClickbox = parseInt(currentFiles[randInt].slice(0, 2), 10) - 1;
        let url = path + currentFiles[randInt];
        url = path + currentFiles[randInt];
        lobby.src = url;
        backgroundContext.beginPath();
        backgroundContext.moveTo(clickboxes[waveDropdown.value][directionDropdown.value][zoomDropdown.value][heightDropdown.value][ladderClickbox][0]['x'], clickboxes[waveDropdown.value][directionDropdown.value][zoomDropdown.value][heightDropdown.value][ladderClickbox][0]['y']);
        for (let i = 1; i < clickboxes[waveDropdown.value][directionDropdown.value][zoomDropdown.value][heightDropdown.value][ladderClickbox].length; i++) {
            backgroundContext.lineTo(clickboxes[waveDropdown.value][directionDropdown.value][zoomDropdown.value][heightDropdown.value][ladderClickbox][i]['x'], clickboxes[waveDropdown.value][directionDropdown.value][zoomDropdown.value][heightDropdown.value][ladderClickbox][i]['y']);
        }
        backgroundContext.closePath();
        lobbyPreparedFlag = true;

        // backgroundContext.strokeStyle = "red";
        // backgroundContext.lineWidth = 0.8;
        // backgroundContext.stroke();
    }


    function drawLobby() {
        backgroundContext.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
        backgroundContext.drawImage(lobby, 0, 0);

        // backgroundContext.beginPath();
        // backgroundContext.moveTo(clickboxes[waveDropdown.value][directionDropdown.value][zoomDropdown.value][heightDropdown.value][ladderClickbox][0]['x'], clickboxes[waveDropdown.value][directionDropdown.value][zoomDropdown.value][heightDropdown.value][ladderClickbox][0]['y']);
        // for (let i = 1; i < clickboxes[waveDropdown.value][directionDropdown.value][zoomDropdown.value][heightDropdown.value][ladderClickbox].length; i++) {
        //     backgroundContext.lineTo(clickboxes[waveDropdown.value][directionDropdown.value][zoomDropdown.value][heightDropdown.value][ladderClickbox][i]['x'], clickboxes[waveDropdown.value][directionDropdown.value][zoomDropdown.value][heightDropdown.value][ladderClickbox][i]['y']);
        // }
        // backgroundContext.closePath();

        // backgroundContext.strokeStyle = "red";
        // backgroundContext.lineWidth = 0.8;
        // backgroundContext.stroke();
    }

    function setRandomLobby(files) {
        let randInt = Math.floor(Math.random() * files.length);
        let ladderClickbox = parseInt(files[randInt].slice(0, 2), 10) - 1;
        let url = path + files[randInt];
        url = path + files[randInt];
        lobby.src = url;

        lobby.onload = function() {
            console.log("lobby loaded");
            backgroundContext.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
            backgroundContext.drawImage(lobby, 0, 0);

            backgroundContext.beginPath();
            backgroundContext.moveTo(clickboxes[waveDropdown.value][directionDropdown.value][zoomDropdown.value][heightDropdown.value][ladderClickbox][0]['x'], clickboxes[waveDropdown.value][directionDropdown.value][zoomDropdown.value][heightDropdown.value][ladderClickbox][0]['y']);
            for (let i = 1; i < clickboxes[waveDropdown.value][directionDropdown.value][zoomDropdown.value][heightDropdown.value][ladderClickbox].length; i++) {
                backgroundContext.lineTo(clickboxes[waveDropdown.value][directionDropdown.value][zoomDropdown.value][heightDropdown.value][ladderClickbox][i]['x'], clickboxes[waveDropdown.value][directionDropdown.value][zoomDropdown.value][heightDropdown.value][ladderClickbox][i]['y']);
            }
            backgroundContext.closePath();

            backgroundContext.strokeStyle = "red";
            backgroundContext.lineWidth = 0.8;
            backgroundContext.stroke();
        }
    }

    function updateFilePath(wave, direction, height, zoom, highlight, tiles) {
        path = "./qs/" + wave + "/" + direction + "/" + zoom + "/" + height + "/" + highlight + "/" + tiles + "/";
        baScreenshotPath = "./qs/" + wave + "/" + direction + "/" + zoom + "/" + height + "/";
        holdingPrayer.src = baScreenshotPath + "wave.png";
        currentFiles = tiles === "Destination Qs" ? dest_qs_files : all_qs_files;
        lobbyPreparedFlag = false;
        PointScreenContext.clearRect(0, 0, PointScreenCanvas.width, PointScreenCanvas.height);
        queueScreenChange = false;
        queueMove = false;
        queueBranch = false;
        currentScreen = "wave";
        prepareRandomLobby();
    }


    function drawTickCounterSquare(color) {
        tickCounterContext.clearRect(0, 0, 25, 25);
        tickCounterContext.fillStyle = color;
        tickCounterContext.fillRect(0, 0, 25, 25);
    }


    backgroundCanvas.addEventListener("mousedown", (event) => {
        if (event.button === 0) {

            if (knifeUsed === true || branchUsed === true) {
                knifeUsed = false;
                branchUsed = false;
                // inventoryUseItemContext.clearRect(0, 0, inventoryUseItemCanvas.width, inventoryUseItemCanvas.height);
                drawInventory();
                return;
            }

            const rect = backgroundCanvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            clickLocation = currentScreen;

            this.setTimeout(() => {
                if (currentScreen === clickLocation && clickLocation === 'wave') {
                    queueScreenChange = true;
                }
                if (currentScreen === clickLocation && clickLocation === 'lobby') {
                    queueMove = true;
                }
            }, ping);

            const { x, y } = coords(event);

            if (currentScreen === "lobby") {

                endTime = performance.now();
                clickTime = Math.floor(endTime) - Math.floor(startTime);
                differential = clickTime + Number(ping) - 600;

                if (differential <= 0) {
                    xpDropColor = blue;
                    xpDropText = String(differential) + " ms";
                }
                else {
                    xpDropColor = red;
                    xpDropText = "+" + String(differential) + " ms";
                }
                const newXpDrop = prepareXpDrop(xpDropText, xpDropColor, 525, 250);
                activeAnimations.push(newXpDrop);


                if (backgroundContext.isPointInPath(mouseX, mouseY)) {
                    playGifAt('red_x', x, y);
                }
                else {
                    playGifAt('yellow_x', x, y);
                }
            }
            else {
                playGifAt('yellow_x', x, y);
            }

        }
    });


    inventoryCanvas.addEventListener("mousedown", (event) => {

        if (event.button === 0) {

            const rect = backgroundCanvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = Math.floor(event.clientY - rect.top);

            const invyX = mouseX - inventoryTopLeftX;
            const invyY = mouseY - inventoryTopLeftY;
    
            // checks if an item in the inventory was actually clicked, not dead space or an empty space
            if (!isInventoryClickInDeadSpace(invyX, invyY) && inventory[Math.floor((invyY - 45) / 36)][Math.floor((invyX - 37) / 42)] !== '') {
                useItem(invyX, invyY);
            }
            else {
                knifeUsed = false;
                branchUsed = false;
                inventoryUseItemContext.clearRect(0, 0, inventoryUseItemCanvas.width, inventoryUseItemCanvas.height);
                drawInventory();
            }
        }
    });


    backgroundCanvas.addEventListener("mousemove", (event) => {
        const rect = backgroundCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        coordsDiv.textContent = `x: ${Math.floor(x)}, y: ${Math.floor(y)}`;
    });

}