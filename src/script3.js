window.onload = function () {

    // ================== 1.9 ================== //

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
    const maxZoom = 3;

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

        console.log("unfocus");
    }

    function animateIN(i) {
        /*const initialPointA = { x: screenElements[i].x, y: screenElements[i].y };
        const initialPointB = { x: 0, y: 0 };

        const finalPointA = { x: 0, y: 0 };
        const finalPointB = { x: screenElements[i].x, y: screenElements[i].y };


        const intersectingPoint = findIntersectingPoint(initialPointA.x, initialPointA.y,
            finalPointA.x, finalPointA.y,
            initialPointB.x, initialPointB.y,
            finalPointB.x, finalPointB.y);

        const pointBeforeZoom = { x: worldToScreenX(intersectingPoint.x), y: worldToScreenY(intersectingPoint.y) };

        scaleX += ((50 / screenElements[selectedPlanet].radius) - anScaleX) / 100;
        scaleY = scaleX;

        const pointAfterZoom = { x: screenToWorldX(pointBeforeZoom.x), y: screenToWorldY(pointBeforeZoom.y) };

        offsetX += pointAfterZoom.x - pointBeforeZoom.x;
        offsetY += pointAfterZoom.y - pointBeforeZoom.y;*/


        offsetX = anOffsetX + ((screenElements[selectedPlanet].x - (canvasWidth / 2) / scaleX) - anOffsetX) / 100 * i;
        offsetY = anOffsetY + ((screenElements[selectedPlanet].y - (canvasHeight / 2) / scaleY) - anOffsetY) / 100 * i;

        //Zoom (Prototype):

        // Mouse before zoom:
        const mouseBeforeZoomX = offsetX + canvasWidth / scaleX;
        const mouseBeforeZoomY = offsetY + canvasHeight / scaleY;

        scaleX += ((50 / screenElements[selectedPlanet].radius) - anScaleX) / 100;
        scaleY += ((50 / screenElements[selectedPlanet].radius) - anScaleY) / 100;

        // Mouse after zoom:
        const mouseAfterZoomX = offsetX + canvasWidth / scaleX;
        const mouseAfterZoomY = offsetY + canvasHeight / scaleY;


        // Adjusts offset so the zoom occurs relative to the center of the screen:
        offsetX += (mouseBeforeZoomX - mouseAfterZoomX);
        offsetY += (mouseBeforeZoomY - mouseAfterZoomY);

        restrictOffset();

        if (i == 100) {
            focusCamera = true;
            bAnimate = false;

            console.log(selectedPlanet);
        }
    }

    function findPoint(k, x1, y1, x2, y2) {

        if (x1 === x2)
            return undefined;

        return (y1 - y2) * (k - x1) / (x1 - x2) + y1;
    }

    function findIntersectingPoint(x1, y1, x2, y2, a1, b1, a2, b2) {
        const a = (y1 - y2) / (x1 - x2);
        const b = y1 - x1 * (y1 - y2) / (x1 - x2);

        const c = (b1 - b2) / (a1 - a2);
        const d = b1 - a1 * (b1 - b2) / (a1 - a2);

        const x = (d - b) / (a - c);

        const y = findPoint(x, x1, y1, x2, y2);

        return {
            x, y
        }
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

    // ---------------------------- //

    // Related variables:

    let anInStart = 0; // Time that the animation started.
    let bAnimate = false; // Should the camera animate in?

    let anOffsetX = 0; // Offset X of the animation (start).
    let anOffsetY = 0; // Offset Y of the animation (start).
    let anScaleX = 0; // Scale X of the animation (start).
    let anScaleY = 0; // Scale Y of the animation (start).

    // ---------------------------- //

    function animate() {
        clear();
        draw();

        updateCoordinates();

        if (bAnimate) {
            animateIN(time - anInStart - 1);
        }

        // Focuses camera on the selected planet:
        else if (focusCamera) {
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

            const distance = Math.sqrt(Math.pow(worldCursor.x, 2) + Math.pow(worldCursor.y, 2));

            // Checks if the mouse is hovering a planet:
            for (let i = 0; i < length; i++) {
                const planet = screenElements[i];

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
        if (click && !bAnimate) {
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

                    //focusCamera = true;

                    bAnimate = true;

                    anInStart = time;
                    anOffsetX = offsetX;
                    anOffsetY = offsetY;
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
                    oldOffsetX = offsetX;
                    oldOffsetY = offsetY;
                    oldScaleX = scaleX;
                    oldScaleY = scaleY;

                    updateOldOffsets = false;
                }

                // Changes the scale so the sun (when focused) have a constant screen size:
                scaleX = scaleY = 2 / (250 /* <- Sun Radius */ / 25);

                offsetX = -canvasWidth / 2 / scaleX;
                offsetY = -canvasHeight / 2 / scaleY;
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