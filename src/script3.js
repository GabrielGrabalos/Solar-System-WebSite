window.onload = function () {

    // ================== 1.6 ================== //

    // ==================================================================================================== //

    // Planets:

    // ---------------------------- //

    // Planet class:

    class Planet {

        infos = []; // TODO (Will hold information about the planet, such as its name, mass, etc.).


        constructor(distance, velocity, radius, color) {

            this.x = distance; // Distance from the sun.
            this.y = 0; // Inicial Y position.

            this.velocity = 365.26 / velocity; // Velocity in days | The smaller the speed, the faster the planet will orbit the sun

            this.radius = radius;
            this.distance = distance; // Distance from the sun (radius of the orbit).

            this.color = color; // Temporary.
        }

        x;
        y;

        distance;

        // Draw the planet:
        draw() {

            context.beginPath();

            context.arc(worldToScreenX(this.x), worldToScreenY(this.y), this.radius * scaleX, 0, Math.PI * 2, false);

            context.fillStyle = this.color;

            context.fill();

            // If the planet is selected, draw a circle around it:
            if (this == screenElements[planetToBeSelected]) {
                context.strokeStyle = "white";
                context.lineWidth = 4 * scaleX;
                context.stroke();
            }
        }

        // Draw the orbit:
        drawOrbit() {
            context.beginPath();

            context.arc(worldToScreenX(0), worldToScreenY(0), this.distance * scaleX, 0, Math.PI * 2, false);

            // Changes line width in case the planet is selected:
            if (this != screenElements[planetToBeSelected]) {
                context.lineWidth = 2 * scaleX;
            }
            else {
                context.lineWidth = 4 * scaleX;
            }

            context.strokeStyle = "white";

            context.stroke();
        }

    }

    // ---------------------------- //

    // Array of planets:

    const screenElements = [ // Represents the screen elements that are moving.

        new Planet(1000 / 2, 157.97 * 2, 20, "#e09f3e"), // Mercury.
        new Planet(1750 / 2, 224.7 * 2, 18, "#ca6702"),  // Venus.
        new Planet(2500 / 2, 365.26 * 2, 30, "#0a9396"), // Earth.
        new Planet(3250 / 2, 686.67 * 2, 15, "#9b2226"), // Mars.
        new Planet(4000 / 2, 4333, 150, "#99582a"),      // Jupiter.
        new Planet(4750 / 2, 10759, 150, "#fec89a"),     // Saturn.
        new Planet(5500 / 2, 30687, 15, "#118ab2"),      // Uranus.
        new Planet(6250 / 2, 45190, 24, "#073b4c"),      // Neptune.
    ];

    const length = screenElements.length; // Number of planets.

    // ---------------------------- //

    // Related variables:

    let planetToBeSelected = -1; // Planet that the mouse is hovering over.
    let selectedPlanet = -1; // Planet that is selected (clicked).

    let focusCamera = false; // Should the camera focus on the selected planet?

    let time = 0; // Used to calculate the position of the planets.

    // ---------------------------- //

    // ==================================================================================================== //

    // Canvas setup:

    let canvas = document.getElementById("canvas");
    let context = canvas.getContext('2d');

    const canvasWidth = canvas.width = window.innerWidth;
    const canvasHeight = canvas.height = window.innerHeight - 4;

    let scaleX = 0.5;
    let scaleY = 0.5;
    let offsetX = 0;
    let offsetY = 0;

    let oldOffsetX = 0;
    let oldOffsetY = 0;
    let oldScaleX = 0;
    let oldScaleY = 0;
    let doOldOffsets = false;

    let updateOldOffsets = true;

    const maxX = canvasWidth;
    const maxY = canvasHeight;

    const worldWidth = 12800 * 3 / 2;
    const worldHeight = 7200 * 3 / 2;

    const minZoom = 0.125 * 2 / 3;
    const maxZoom = 5;

    let click = true; // Used to prevent clicking when dragging the camera.

    // ==================================================================================================== //

    // Camera functions:

    // Gets the center of the wolrd:
    function getCenterX() { return maxX / 2; }
    function getCenterY() { return maxY / 2; }

    function centerCamera() {
        offsetX = -getCenterX() * 1 / scaleX;
        offsetY = -getCenterY() * 1 / scaleY;
    }

    function focusOnCamera(i) {
        offsetX = screenElements[i].x - (canvasWidth / 2) / scaleX;
        offsetY = screenElements[i].y - (canvasHeight / 2) / scaleY;
    }

    function unfocusCamera() {
        focusCamera = false;
        selectedPlanet = -1;
    }

    function restrictOffset() {
        if (offsetX < -worldWidth / 2)
            offsetX = -worldWidth / 2;

        if (offsetY < -worldHeight / 2)
            offsetY = -worldHeight / 2;

        if (offsetX > worldWidth / 2 - canvasWidth / scaleX)
            offsetX = worldWidth / 2 - canvasWidth / scaleX;

        if (offsetY > worldHeight / 2 - canvasHeight / scaleY)
            offsetY = worldHeight / 2 - canvasHeight / scaleY;
    }

    // ==================================================================================================== //

    // Draw functions:

    const background = document.getElementById("stars"); // Gets the background image.

    function drawBackground() {
        context.drawImage(background,

            worldToScreenX(- worldWidth / 2),
            worldToScreenY(- worldHeight / 2),

            worldWidth * scaleX,
            worldHeight * scaleY);
    }

    function draw() {
        drawBackground();

        // Draw the orbits:
        for (let i = 0; i < length; i++) {
            screenElements[i].drawOrbit();
        }

        // Draw the planets:
        for (let i = 0; i < length; i++) {
            screenElements[i].draw();
        }
    }

    function clear() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    // ==================================================================================================== //

    // Animation functions:

    function animate() {
        clear();
        draw();

        updateCoordinates();

        // Focuses camera on the selected planet:
        if (focusCamera) {
            focusOnCamera(selectedPlanet);
        }

        requestAnimationFrame(animate);
    }

    // Updates the coordinates of the planets:
    function updateCoordinates() {
        for (let i = 0; i < length; i++) {
            screenElements[i].x = screenElements[i].distance * Math.cos((screenElements[i].velocity * time) / 100 /* screenElements[i].distance*/);
            screenElements[i].y = -screenElements[i].distance * Math.sin((screenElements[i].velocity * time) / 100 /* screenElements[i].distance*/);
        }

        time++;
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
    function worldToScreenX(worldX) { return (worldX - offsetX) * scaleX; }
    function worldToScreenY(worldY) { return (worldY - offsetY) * scaleY; }

    // Screen to world functions:
    function screenToWorldX(screenX) { return (screenX / scaleX) + offsetX; }
    function screenToWorldY(screenY) { return (screenY / scaleY) + offsetY; }

    // ==================================================================================================== //

    // Mouse functions:

    function getCursorPosition(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        }
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
            // ---------------------------- //

            // Gets drag end:
            dragEnd = {
                x: event.pageX - canvas.offsetLeft,
                y: event.pageY - canvas.offsetTop,
            };

            // Updates the offset:
            offsetX -= (dragEnd.x - dragStart.x) / scaleX;
            offsetY -= (dragEnd.y - dragStart.y) / scaleY;

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

            // Checks if the mouse is hovering a planet:
            for (let i = 0; i < length; i++) {
                const planet = screenElements[i];
                const distance = Math.sqrt(Math.pow(worldCursor.x, 2) + Math.pow(worldCursor.y, 2));

                if (distance < planet.distance + planet.radius &&
                    distance > planet.distance - planet.radius) {

                    canvas.style.cursor = "pointer"; // Changes the cursor to a pointer.
                    planetToBeSelected = i; // Sets the planet to be selected.

                    return; // Stops the function.
                }

                canvas.style.cursor = "default"; // Changes the cursor to the default.
                planetToBeSelected = -1; // Resets the planet to be selected.
            }
        }
    })

    canvas.addEventListener('mouseup', function (event) { drag = false; })

    this.canvas.addEventListener('wheel', (event) => {
        event.preventDefault(); // Prevents the page from scrolling.

        // ---------------------------- //
        // Checking conditions:
        if (focusCamera) unfocusCamera();

        if (doOldOffsets) doOldOffsets = false;
        // ---------------------------- //

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
        offsetX += (mouseBeforeZoomX - mouseAfterZoomX);
        offsetY += (mouseBeforeZoomY - mouseAfterZoomY);


        restrictOffset();

        // Draw:
        clear();
        draw();
    });

    this.canvas.addEventListener('click', clickFunc)

    function clickFunc(event) {
        if (click) {
            if (planetToBeSelected != -1) { // If the mouse is hovering a planet.
                doOldOffsets = true;

                let oldSelectedPlanet = selectedPlanet;
                selectedPlanet = planetToBeSelected;

                // Selects the planet if it's not already selected:
                if (oldSelectedPlanet != selectedPlanet) {

                    // Saves the old offsets (for when the camera is unfocused | will be used for animation):
                    if (updateOldOffsets) {
                        oldOffsetX = offsetX;
                        oldOffsetY = offsetY;
                        oldScaleX = scaleX;
                        oldScaleY = scaleY;

                        updateOldOffsets = false;
                    }

                    // Changes the scale so the planet (when focused) have a constant screen size:
                    scaleX = 2 / (screenElements[selectedPlanet].radius / 25);
                    scaleY = 2 / (screenElements[selectedPlanet].radius / 25);

                    focusCamera = true;

                    // =================================================== //
                    // Animation tests and prototypes:
                    /*let i = 0;

                    animateCamera();

                    function animateCamera() {
                        offsetX -= offsetX / ((screenElements[selectedPlanet].x - (canvasWidth / 2) / scaleX) / 100 * i);
                        offsetY -= offsetY / ((screenElements[selectedPlanet].y - (canvasHeight / 2) / scaleY) / 100 * i);

                        scaleX = (2 / (screenElements[selectedPlanet].radius / 50)) / 100 * i;
                        scaleY = (2 / (screenElements[selectedPlanet].radius / 50)) / 100 * i;

                        clear();
                        draw();

                        i++;

                        if (i < 100)
                            requestAnimationFrame(animateCamera);
                        else
                            requestAnimationFrame(animate);
                    }*/

                    // Animates camera to the selected planet (Prototype):
                    /*for (let i = 0; i < 100; i++) {
                        setTimeout(function () {
                            offsetX -= offsetX / ((screenElements[selectedPlanet].x - (canvasWidth / 2) / scaleX) / 100 * i);
                            offsetY -= offsetY / ((screenElements[selectedPlanet].y - (canvasHeight / 2) / scaleY) / 100 * i);

                            scaleX = (2 / (screenElements[selectedPlanet].radius / 50)) / 100 * i;
                            scaleY = (2 / (screenElements[selectedPlanet].radius / 50)) / 100 * i;

                            clear();
                            draw();

                            if (i == 99) {
                                focusCamera = true;
                            }
                        }, 1000 / 30 * i);
                    }*/

                    // =================================================== //
                }

                // Deselects the planet:
                else if (focusCamera) {
                    unfocusCamera();
                    oldSelectedPlanet = -1;
                }
            }
            // Unfocuses on the selected planet (resets):
            else {
                focusCamera = false; // Resets the focusCamera variable.

                // Returns to the old offsets:
                if (doOldOffsets) {
                    scaleX = oldScaleX;
                    scaleY = oldScaleY;
                    offsetX = oldOffsetX;
                    offsetY = oldOffsetY;
                }

                selectedPlanet = -1; // Resets the selected planet.

                updateOldOffsets = true; // Allows the old offsets to be updated.
            }
        }
    }

    // -------------------------------------------- //

    // ==================================================================================================== //
}