window.onload = function () {



    class Planet {

        infos = [];


        constructor(x, velocity, radius, color) {
            this.velocity = 365.26 / velocity;
            this.color = color;

            this.x = x;
            this.y = 0;

            this.radius = radius;

            this.distance = x;
        }

        x;
        y;
        distance;


        draw() {

            context.beginPath();

            context.arc(worldToScreenX(this.x), worldToScreenY(this.y), this.radius * scaleX, 0, Math.PI * 2, false);

            context.fillStyle = this.color;

            context.fill();

            if (this == screenElements[planetToBeSelected]) {
                context.strokeStyle = "white";
                context.lineWidth = 4 * scaleX;
                context.stroke();
            }
        }

        drawOrbit() {
            context.beginPath();

            context.arc(worldToScreenX(0), worldToScreenY(0), this.distance * scaleX, 0, Math.PI * 2, false);

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



    const screenElements = [ // Represents the screen elements that are moving.
        new Planet(1000 / 2, 157.97 * 2, 20, "#e09f3e"),
        new Planet(1750 / 2, 224.7 * 2, 18, "#ca6702"),
        new Planet(2500 / 2, 365.26 * 2, 30, "#0a9396"),
        new Planet(3250 / 2, 686.67 * 2, 15, "#9b2226"),
        new Planet(4000 / 2, 4333, 150, "#99582a"),
        new Planet(4750 / 2, 10759, 150, "#fec89a"),
        new Planet(5500 / 2, 30687, 15, "#118ab2"),
        new Planet(6250 / 2, 45190, 24, "#073b4c"),
    ];

    const length = screenElements.length;

    let planetToBeSelected = -1;
    let selectedPlanet = -1;

    let focusCamera = false;

    let time = 0;

    // ==================================================================================================== //

    // Canvas setup:

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');

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

    let click = true;

    // ==================================================================================================== //

    centerCamera();


    // Gets the center of the wolrd:
    function getCenterX() { return maxX / 2; }
    function getCenterY() { return maxY / 2; }

    function centerCamera() {
        offsetX = -getCenterX() * 1 / scaleX;
        offsetY = -getCenterY() * 1 / scaleY;
    }

    // Gets screen coordinates by obj center:
    function onScreenCoordinates(obj) {
        return {
            x: worldToScreenX(obj.x - obj.width / 2),
            y: worldToScreenY(obj.y - obj.height / 2),
            width: obj.width * scaleX,
            height: obj.height * scaleY,
        }
    }

    // ==================================================================================================== //


    const background = document.getElementById("stars");

    function drawBackground() {
        context.drawImage(background,
            worldToScreenX(- worldWidth / 2),
            worldToScreenY(- worldHeight / 2),
            worldWidth * scaleX,
            worldHeight * scaleY);
    }

    function drawBoundaries() {
        context.lineWidth = 10 * scaleX;

        context.beginPath();
        context.moveTo(worldToScreenX(0 - worldWidth / 2), worldToScreenY(0 - worldHeight / 2));
        context.lineTo(worldToScreenX(worldWidth - worldWidth / 2), worldToScreenY(0 - worldHeight / 2));
        context.stroke();

        context.beginPath();
        context.moveTo(worldToScreenX(0 - worldWidth / 2), worldToScreenY(0 - worldHeight / 2));
        context.lineTo(worldToScreenX(0 - worldWidth / 2), worldToScreenY(worldHeight - worldHeight / 2));
        context.stroke();

        context.beginPath();
        context.moveTo(worldToScreenX(worldWidth - worldWidth / 2), worldToScreenY(0 - worldHeight / 2));
        context.lineTo(worldToScreenX(worldWidth - worldWidth / 2), worldToScreenY(worldHeight - worldHeight / 2));
        context.stroke();

        context.beginPath();
        context.moveTo(worldToScreenX(0 - worldWidth / 2), worldToScreenY(worldHeight - worldHeight / 2));
        context.lineTo(worldToScreenX(worldWidth - worldWidth / 2), worldToScreenY(worldHeight - worldHeight / 2));
        context.stroke();
    }

    function draw() {
        drawBackground();

        drawBoundaries();

        for (let i = 0; i < length; i++) {
            screenElements[i].drawOrbit();
        }

        for (let i = 0; i < length; i++) {
            screenElements[i].draw();
        }
    }


    function clear() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    function animate() {
        clear();
        draw();
        updateCoordinates();

        requestAnimationFrame(animate);
    }

    function updateCoordinates() {
        for (let i = 0; i < length; i++) {
            screenElements[i].x = screenElements[i].distance * Math.cos((screenElements[i].velocity * time) / 100 /* screenElements[i].distance*/);
            screenElements[i].y = -screenElements[i].distance * Math.sin((screenElements[i].velocity * time) / 100/* / screenElements[i].distance*/);
        }

        // Focuses camera on the last planet:
        if (focusCamera) {
            focusOnCamera(selectedPlanet);
        }

        time++;
    }

    animate();

    function focusOnCamera(i) {
        offsetX = screenElements[i].x - (canvasWidth / 2) / scaleX;
        offsetY = screenElements[i].y - (canvasHeight / 2) / scaleY;
    }

    function unfocusCamera() {
        focusCamera = false;

        selectedPlanet = -1;
    }

    // ==================================================================================================== //

    // Pan zoom:

    // World to screen functions:
    function worldToScreenX(worldX) { return (worldX - offsetX) * scaleX; }
    function worldToScreenY(worldY) { return (worldY - offsetY) * scaleY; }

    // Screen to world functions:
    function screenToWorldX(screenX) { return (screenX / scaleX) + offsetX; }
    function screenToWorldY(screenY) { return (screenY / scaleY) + offsetY; }


    //Restricts offset:
    function restrictOffset() {
        if (offsetX < -worldWidth / 2) offsetX = -worldWidth / 2;
        if (offsetY < -worldHeight / 2) offsetY = -worldHeight / 2;
        if (offsetX > worldWidth / 2 - canvasWidth / scaleX) offsetX = worldWidth / 2 - canvasWidth / scaleX;
        if (offsetY > worldHeight / 2 - canvasHeight / scaleY) offsetY = worldHeight / 2 - canvasHeight / scaleY;
    }


    function getCursorPosition(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        }
    }


    let drag = false;
    let dragStart;
    let dragEnd;

    canvas.addEventListener('mousedown', function (event) {
        dragStart = {
            x: event.pageX - canvas.offsetLeft,
            y: event.pageY - canvas.offsetTop,
        }

        drag = true;
    })

    canvas.addEventListener('mousemove', function (event) {
        if (drag) {
            if (click) click = false;

            if (focusCamera) {
                unfocusCamera();
            };

            if (doOldOffsets) doOldOffsets = false;

            dragEnd = {
                x: event.pageX - canvas.offsetLeft,
                y: event.pageY - canvas.offsetTop,
            };
            clear();

            offsetX -= (dragEnd.x - dragStart.x) / scaleX;
            offsetY -= (dragEnd.y - dragStart.y) / scaleY;

            restrictOffset();

            dragStart = dragEnd;

            draw();

        }
        else {
            // Checks if the mouse is hovering a planet or it's orbit:

            if (!click) click = true;

            const cursor = getCursorPosition(event);
            const worldCursor = {
                x: screenToWorldX(cursor.x),
                y: screenToWorldY(cursor.y),
            }

            for (let i = 0; i < length; i++) {
                const planet = screenElements[i];
                const distance = Math.sqrt(Math.pow(worldCursor.x, 2) + Math.pow(worldCursor.y, 2));

                if (distance < planet.distance + planet.radius && distance > planet.distance - planet.radius) {
                    canvas.style.cursor = "pointer";
                    planetToBeSelected = i;
                    return;
                }

                canvas.style.cursor = "default";
                planetToBeSelected = -1;
            }
        }
    })

    canvas.addEventListener('mouseup', function (event) { drag = false; })

    this.canvas.addEventListener('wheel', (event) => {
        event.preventDefault();

        if (focusCamera) {
            unfocusCamera();
        };

        if (doOldOffsets) doOldOffsets = false;

        const mousePos = getCursorPosition(event);

        const mouseBeforeZoomX = screenToWorldX(mousePos.x);
        const mouseBeforeZoomY = screenToWorldY(mousePos.y);

        scaleX += event.deltaY * (- 0.001) * (scaleX / 2);
        scaleY += event.deltaY * (- 0.001) * (scaleY / 2);

        // Restrict zoom:
        scaleX = Math.min(Math.max(minZoom, scaleX), maxZoom);
        scaleY = Math.min(Math.max(minZoom, scaleY), maxZoom);

        const mouseAfterZoomX = screenToWorldX(mousePos.x);
        const mouseAfterZoomY = screenToWorldY(mousePos.y);

        // Adjusts offset so the zoom occurs relative to the mouse position:
        offsetX += (mouseBeforeZoomX - mouseAfterZoomX);
        offsetY += (mouseBeforeZoomY - mouseAfterZoomY);

        restrictOffset();

        clear();

        draw();
    });

    this.canvas.addEventListener('click', clickFunc)

    function clickFunc(event) {
        if (click) {
            if (planetToBeSelected != -1) {
                doOldOffsets = true;

                let oldSelectedPlanet = selectedPlanet;
                selectedPlanet = planetToBeSelected;


                if (oldSelectedPlanet != selectedPlanet) {
                    if (updateOldOffsets) {
                        oldOffsetX = offsetX;
                        oldOffsetY = offsetY;
                        oldScaleX = scaleX;
                        oldScaleY = scaleY;

                        updateOldOffsets = false;
                    }

                    scaleX = 2 / (screenElements[selectedPlanet].radius / 50);
                    scaleY = 2 / (screenElements[selectedPlanet].radius / 50);

                    focusCamera = true;
                }
                else if (focusCamera) {
                    unfocusCamera();
                    oldSelectedPlanet = -1;
                }


                // Animates camera to the selected planet (Prototype):
                /*for (let i = 0; i < 100; i++) {
                    setTimeout(function () {
                        offsetX -= offsetX / ((screenElements[selectedPlanet].x - (canvasWidth / 2) / scaleX) / 100 * i);
                        offsetY -= offsetY / ((screenElements[selectedPlanet].y - (canvasHeight / 2) / scaleY) / 100 * i);

                        scaleX = (2 / (screenElements[selectedPlanet].radius / 50)) / 100 * i;
                        scaleY = (2 / (screenElements[selectedPlanet].radius / 50)) / 100 * i;
                    }, 1000 / 30 * i);
                }*/


            }
            else {
                focusCamera = false;

                if (doOldOffsets) {
                    scaleX = oldScaleX;
                    scaleY = oldScaleY;
                    offsetX = oldOffsetX;
                    offsetY = oldOffsetY;
                }

                selectedPlanet = -1;

                updateOldOffsets = true;
            }
        }
    }
}