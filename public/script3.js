const pz = new PanZoom();

const asters = [
    new Planet(1000 / 2, 157.97 * 2, 20, "#e09f3e"), // Mercury.
    new Planet(1750 / 2, 224.7 * 2, 18, "#ca6702"),  // Venus.
    new Planet(2500 / 2, 365.26 * 2, 30, "#0a9396"), // Earth.
    new Planet(3250 / 2, 686.67 * 2, 15, "#9b2226"), // Mars.
    new Planet(4000 / 2, 4333, 150, "#99582a"),      // Jupiter.
    new Planet(4750 / 2, 10759, 150, "#fec89a"),     // Saturn.
    new Planet(5500 / 2, 30687, 15, "#118ab2"),      // Uranus.
    new Planet(6250 / 2, 45190, 24, "#073b4c"),      // Neptune.
];

const amountOfAsters = asters.length; // Number of planets.

// ---------------------------- //

// Related variables:

let planetToBeSelected = -1; // Planet that the mouse is hovering over.
let selectedPlanet = -1; // Planet that is selected (clicked).

let planetWindow = false; // If the planet window is open.

let sunToBeSelected = false; // If the mouse is hovering over the sun.
let sunSelected = false; // If the sun is selected (clicked).

let focusCamera = false; // Should the camera focus on the selected planet?

let time = 0; // Used to calculate the position of the planets.

// ---------------------------- //

// ==================================================================================================== //

// Canvas setup:

let canvas = document.getElementById("canvas");
let context = canvas.getContext('2d');

const canvasWidth = canvas.width = window.innerWidth;
const canvasHeight = canvas.height = window.innerHeight;

const maxX = canvasWidth;
const maxY = canvasHeight;

const worldWidth = 12800 * 3 / 2;
const worldHeight = 7200 * 3 / 2;

function restrictOffset() {
    if (pz.OffsetX < -worldWidth / 2)
        pz.OffsetX = -worldWidth / 2;

    if (pz.OffsetY < -worldHeight / 2)
        pz.OffsetY = -worldHeight / 2;

    if (pz.OffsetX > worldWidth / 2 - canvasWidth / scaleX)
        pz.OffsetX = worldWidth / 2 - canvasWidth / scaleX;

    if (pz.OffsetY > worldHeight / 2 - canvasHeight / scaleY)
        pz.OffsetY = worldHeight / 2 - canvasHeight / scaleY;
}

// ==================================================================================================== //

// Draw functions:

const background = new Image();
background.src = "./stars.jpg";

function drawBackground() {
    context.drawImage(
        background,

        worldToScreenX(- worldWidth / 2),
        worldToScreenY(- worldHeight / 2),

        worldWidth * pz.Scale,
        worldHeight * pz.Scale
        );
}

function drawSun() {
    context.beginPath();

    context.arc(worldToScreenX(0), worldToScreenY(0), 250 * scaleX, 0, Math.PI * 2, false);

    context.fillStyle = "yellow";

    context.fill();

    // If the sun is to be selected, draw a circle around it:
    if (sunToBeSelected) {
        context.strokeStyle = "white";
        context.lineWidth = 8 * scaleX;
        context.stroke();
    }
}

function draw() {
    drawBackground();

    drawSun();

    // Draw the orbits:
    for (let i = 0; i < amountOfAsters; i++) {
        asters[i].drawOrbit();
    }

    // Draw the planets:
    for (let i = 0; i < amountOfAsters; i++) {
        asters[i].draw();
    }
}

function clear() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
}

function animate() {
    draw();

    updateCoordinates();

    requestAnimationFrame(animate);
}

// Updates the coordinates of the planets:
function updateCoordinates() {
    for (let i = 0; i < amountOfAsters; i++) {
        asters[i].x = asters[i].distance * Math.cos((asters[i].velocity * time) / 100 /* asters[i].distance*/);
        asters[i].y = -asters[i].distance * Math.sin((asters[i].velocity * time) / 100 /* asters[i].distance*/);
    }
}

// ==================================================================================================== //

// Call functions:

centerCamera();
animate();

// ==================================================================================================== //


// ==================================================================================================== //
// ||||||||||||||||||||||||||||||||||||||||| - Big Division - ||||||||||||||||||||||||||||||||||||||||| //
// ==================================================================================================== //


// ==================================================================================================== //

// Pan zoom functions:

// World to screen functions:
function worldToScreenX(worldX) { return (worldX - pz.OffsetX) * scaleX; }
function worldToScreenY(worldY) { return (worldY - pz.OffsetY) * scaleY; }

// Screen to world functions:
function screenToWorldX(screenX) { return (screenX / scaleX) + pz.OffsetX; }
function screenToWorldY(screenY) { return (screenY / scaleY) + pz.OffsetY; }

// ==================================================================================================== //

// Mouse functions:

function getCursorPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    }
}

function mousewhell(event) {
    // Gets the cursor position:
    const mousePos = getCursorPosition(event);

    // Mouse before zoom:
    const mouseBeforeZoomX = screenToWorldX(mousePos.x);
    const mouseBeforeZoomY = screenToWorldY(mousePos.y);


    // Zooms in or out:
    scaleX += event.deltaY * (- 0.001) * (scaleX / 2);
    scaleY += event.deltaY * (- 0.001) * (scaleY / 2);

    // Restrict zoom:
    scaleX = Math.min(Math.max(minZoom, scaleX), maxZoom);
    scaleY = Math.min(Math.max(minZoom, scaleY), maxZoom);


    // Mouse after zoom:
    const mouseAfterZoomX = screenToWorldX(mousePos.x);
    const mouseAfterZoomY = screenToWorldY(mousePos.y);


    // Adjusts offset so the zoom occurs relative to the mouse position:
    pz.OffsetX += (mouseBeforeZoomX - mouseAfterZoomX);
    pz.OffsetY += (mouseBeforeZoomY - mouseAfterZoomY);

    restrictOffset();
}

// ==================================================================================================== //

// Mouse events (Canvas) -> Pan zoom:

// ------------- //
// Variables:
let drag = false;
let dragStart;
let dragEnd;
// ------------- //

// -------------------------------------------- //

// Functions:

canvas.addEventListener('mousedown', function (event) {
    dragStart = {
        x: event.pageX - canvas.offsetLeft,
        y: event.pageY - canvas.offsetTop,
    }

    drag = true;
})

canvas.addEventListener('mousemove', function (event) {
    if (drag) {
        // ---------------------------- //
        // Checking conditions:
        if (click) click = false;

        if (focusCamera) unfocusCamera();

        if (doOldOffsets) doOldOffsets = false;

        if (bAnimate) {
            bAnimate = false;
            selectedPlanet = -1;
        }
        // ---------------------------- //

        // Gets drag end:
        dragEnd = {
            x: event.pageX - canvas.offsetLeft,
            y: event.pageY - canvas.offsetTop,
        };

        // Updates the offset:
        pz.OffsetX -= (dragEnd.x - dragStart.x) / scaleX;
        pz.OffsetY -= (dragEnd.y - dragStart.y) / scaleY;

        restrictOffset();


        dragStart = dragEnd; // Resets the dragStart.

        // Draw:
        clear();
        draw();
    }
    else {
        // Checks if the mouse is hovering a planet or it's orbit:

        if (!click) click = true; // Allows clicking again.

        // ---------------------------- //
        // Gets the cursor position:
        const cursor = getCursorPosition(event);

        const worldCursor = {
            x: screenToWorldX(cursor.x),
            y: screenToWorldY(cursor.y),
        }
        // ---------------------------- //

        const distance = Math.sqrt(Math.pow(worldCursor.x, 2) + Math.pow(worldCursor.y, 2));

        // Checks if the mouse is hovering a planet:
        for (let i = 0; i < amountOfAsters; i++) {
            const planet = asters[i];

            if (distance < planet.distance + planet.radius &&
                distance > planet.distance - planet.radius) {

                canvas.style.cursor = "pointer"; // Changes the cursor to a pointer.
                planetToBeSelected = i; // Sets the planet to be selected.

                return; // Stops the function.
            }
        }

        if (distance <= 250) {
            canvas.style.cursor = "pointer"; // Changes the cursor to a pointer.
            planetToBeSelected = -1; // Resets the planet to be selected.

            sunToBeSelected = true;

            return; // Stops the function.
        }
        else if (sunToBeSelected) {
            sunToBeSelected = false;
        }

        canvas.style.cursor = "default"; // Changes the cursor to the default.
        planetToBeSelected = -1; // Resets the planet to be selected.
    }
})

canvas.addEventListener('mouseup', function (event) { drag = false; })

this.canvas.addEventListener('wheel', (event) => {
    event.preventDefault(); // Prevents the page from scrolling.

    // ---------------------------- //
    // Checking conditions:
    if (focusCamera) unfocusCamera();

    if (doOldOffsets) doOldOffsets = false;

    if (bAnimate) {
        bAnimate = false;
        selectedPlanet = -1;
    }
    // ---------------------------- //

    mousewhell(event);

    // Draw:
    clear();
    draw();
});

this.canvas.addEventListener('click', clickFunc)

function clickFunc(event) {
    if (click && !bAnimate) {
        if (planetToBeSelected != -1) { // If the mouse is hovering a planet.
            doOldOffsets = true;

            let oldSelectedPlanet = selectedPlanet;
            selectedPlanet = planetToBeSelected;

            // Selects the planet if it's not already selected:
            if (oldSelectedPlanet != selectedPlanet) {

                // Saves the old offsets (for when the camera is unfocused | will be used for animation):
                if (updateOldOffsets) {
                    oldpz.OffsetX = pz.OffsetX;
                    oldpz.OffsetY = pz.OffsetY;
                    oldScaleX = scaleX;
                    oldScaleY = scaleY;

                    updateOldOffsets = false;
                }

                //focusCamera = true;

                bAnimate = true;

                anInStart = time;
                anpz.OffsetX = pz.OffsetX;
                anpz.OffsetY = pz.OffsetY;
                anScaleX = scaleX;
                anScaleY = scaleY;
            }

            // Deselects the planet:
            else if (focusCamera) {
                unfocusCamera();
                oldSelectedPlanet = -1;
            }
        }

        else if (sunToBeSelected) {
            doOldOffsets = true;
            sunSelected = true;

            // Saves the old offsets (for when the camera is unfocused | will be used for animation):
            if (updateOldOffsets) {
                oldpz.OffsetX = pz.OffsetX;
                oldpz.OffsetY = pz.OffsetY;
                oldScaleX = scaleX;
                oldScaleY = scaleY;

                updateOldOffsets = false;
            }

            // Changes the scale so the sun (when focused) have a constant screen size:
            scaleX = scaleY = 2 / (250 /* <- Sun Radius */ / 25);

            pz.OffsetX = -canvasWidth / 2 / scaleX;
            pz.OffsetY = -canvasHeight / 2 / scaleY;
        }
        // Unfocuses on the selected planet (resets):
        else {
            focusCamera = false; // Resets the focusCamera variable.

            // Returns to the old offsets:
            if (doOldOffsets) {
                scaleX = oldScaleX;
                scaleY = oldScaleY;
                pz.OffsetX = oldpz.OffsetX;
                pz.OffsetY = oldpz.OffsetY;
            }

            selectedPlanet = -1; // Resets the selected planet.

            updateOldOffsets = true; // Allows the old offsets to be updated.
        }
    }
}

// -------------------------------------------- //

// ==================================================================================================== //