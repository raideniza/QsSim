window.onload = async function () {

    let clickboxes = await fetch('./clickboxes.json').then(res => res.json());
    console.log(clickboxes);

    var lobby = new Image();
    var holdingPrayer = new Image();

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

    var animationCanvas = document.getElementById("animationCanvas");
    var animationContext = animationCanvas.getContext("2d");

    var inventoryCanvas = document.getElementById("inventoryCanvas");
    var inventoryContext = inventoryCanvas.getContext("2d");

    var tickCounterCanvas = document.getElementById("tickCounterCanvas");
    var tickCounterContext = tickCounterCanvas.getContext("2d");

    holdingPrayer.src = baScreenshotPath + "wave.png";

    holdingPrayer.onload = function () {
        backgroundContext.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
        backgroundContext.drawImage(holdingPrayer, 0, 0);
    }




    /* GIF drawing code ============================================================================== */
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d');

    const slots = {
        red_x: { frames: [], w: 0, h: 0, loaded: false, timers: [] },
        yellow_x: { frames: [], w: 0, h: 0, loaded: false, timers: [] }
    };

    let activeSlot = null;

    function clearCanvas() {
        animationContext.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
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
                animationContext.clearRect(ox, oy, s.w, s.h);
                animationContext.drawImage(offscreen, ox, oy);

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
        const r = animationCanvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - r.left) * animationCanvas.width / r.width),
            y: Math.round((e.clientY - r.top) * animationCanvas.height / r.height),
        };
    }


    loadGif('red_x', 'assets/red_click.gif');
    loadGif('yellow_x', 'assets/yellow_click.gif');
/* ================================================================================================ */


    var currentScreen = 'wave';
    var queueScreenChange = false;
    var tickCounterIsWhite = true;
    var clickLocation = null;

    
    gameTick();


    function gameTick() {
        setInterval(() => {
            if (queueScreenChange === true) {
                if (currentScreen === "wave") {
                    setTimeout(() => {
                        if (tilesDropdown.value === "Destination Qs") {
                            setRandomLobby(dest_qs_files);
                        }
                        else {
                            setRandomLobby(all_qs_files);
                        }
                        currentScreen = "lobby";
                    }, loadTime);
                }
                else { // if inside lobby...

                    backgroundContext.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
                    backgroundContext.drawImage(holdingPrayer, 0, 0);

                    currentScreen = "wave";
                }
                queueScreenChange = false;
            }

            tickCounterIsWhite = !tickCounterIsWhite;
            let tickCounterColor = tickCounterIsWhite ? 'white' : 'black';
            drawTickCounterSquare(tickCounterColor);
        }, 600);
    }


    function setRandomLobby(files) {
        let randInt = Math.floor(Math.random() * files.length);
        let ladderClickbox = parseInt(files[randInt].slice(0, 2), 10) - 1;
        let url = path + files[randInt];
        url = path + files[randInt];
        lobby.src = url;

        lobby.onload = function() {
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
        currentScreen = "wave";
    }


    function drawTickCounterSquare(color) {
        tickCounterContext.clearRect(0, 0, 25, 25);
        tickCounterContext.fillStyle = color;
        tickCounterContext.fillRect(0, 0, 25, 25);
    }


    backgroundCanvas.addEventListener("mousedown", (event) => {
        if (event.button === 0) {

            const rect = backgroundCanvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            clickLocation = currentScreen;

            this.setTimeout(() => {
                if (currentScreen === clickLocation) {
                    queueScreenChange = true;
                }
            }, ping);

            const { x, y } = coords(event);

            if (currentScreen === "lobby") {
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


    backgroundCanvas.addEventListener("mousemove", (event) => {
        const rect = backgroundCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        coordsDiv.textContent = `x: ${Math.floor(x)}, y: ${Math.floor(y)}`;
    });

}