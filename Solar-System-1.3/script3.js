window.onload = function () {



    class Planet {

        infos = [];


        constructor(x, velocity, radius, color) {
            this.velocity = velocity;
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
        }

        drawOrbit() {
            context.beginPath();

            context.arc(worldToScreenX(0), worldToScreenY(0), this.distance * scaleX, 0, Math.PI * 2, false);

            context.strokeStyle = this.color;

            context.stroke();
        }

    }



    const screenElements = [ // Represents the screen elements that are moving.
        new Planet(100, 1, 20),
        new Planet(175, 1, 18),
        new Planet(250, 1, 30),
        new Planet(325, 1, 15),
        new Planet(400, 1, 15),
        new Planet(475, 1, 15),
        new Planet(550, 1, 15),
        new Planet(625, 1, 24),
    ];

    const length = screenElements.length;

    let time = 0;












    // Canvas setup:

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');

    const canvasWidth = canvas.width = window.innerWidth;
    const canvasHeight = canvas.height = window.innerHeight - 5;

    let scaleX = 1;
    let scaleY = 1;
    let offsetX = 0;
    let offsetY = 0;

    const maxX = canvasWidth;  // World width.
    const maxY = canvasHeight; // World height.
    const minZoom = 0.125;
    const maxZoom = 5;

    centerCamera();



    // Gets the center of the wolrd:
    function getCenterX() { return maxX / 2; }
    function getCenterY() { return maxY / 2; }

    function centerCamera() {
        offsetX = -getCenterX();
        offsetY = -getCenterY();
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

    function draw() {
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
            screenElements[i].x = screenElements[i].distance * Math.cos((screenElements[i].velocity * time) / screenElements[i].distance);
            screenElements[i].y = -screenElements[i].distance * Math.sin((screenElements[i].velocity * time) / screenElements[i].distance);
        }

        //offsetX = screenElements[length - 1].x - canvasWidth / 2;
        //offsetY = screenElements[length - 1].y - canvasHeight / 2;

        time++;
    }

    animate();




    // Pan zoom:

    // World to screen functions:
    function worldToScreenX(worldX) { return (worldX - offsetX) * scaleX; }
    function worldToScreenY(worldY) { return (worldY - offsetY) * scaleY; }

    // Screen to world functions:
    function screenToWorldX(screenX) { return (screenX / scaleX) + offsetX; }
    function screenToWorldY(screenY) { return (screenY / scaleY) + offsetY; }


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
            dragEnd = {
                x: event.pageX - canvas.offsetLeft,
                y: event.pageY - canvas.offsetTop,
            };

            clear();

            offsetX -= (dragEnd.x - dragStart.x) / scaleX;
            offsetY -= (dragEnd.y - dragStart.y) / scaleY;

            dragStart = dragEnd;

            draw();
        }
        else {
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
                    return;
                }

                canvas.style.cursor = "default";
            }
        }
    })

    canvas.addEventListener('mouseup', function (event) { drag = false; })

    this.canvas.addEventListener('wheel', (event) => {
        event.preventDefault();

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

        clear();

        draw();
    });
}