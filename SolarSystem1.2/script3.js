window.onload = function () {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    let scaleX = 1;
    let scaleY = 1;
    let offsetX = 0;
    let offsetY = 0;

    const maxX = canvasWidth;  // World width.
    const maxY = canvasHeight; // World height.
    const minZoom = 0.125;
    const maxZoom = 5;

    centerCamera();

    // World to screen functions:
    function worldToScreenX(worldX) { return (worldX - offsetX) * scaleX; }
    function worldToScreenY(worldY) { return (worldY - offsetY) * scaleY; }

    // Screen to world functions:
    function screenToWorldX(screenX) { return (screenX / scaleX) + offsetX; }
    function screenToWorldY(screenY) { return (screenY / scaleY) + offsetY; }


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

    const square = {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
    }

    function draw() {
        const owcSquare = onScreenCoordinates(square);

        context.fillRect(owcSquare.x, owcSquare.y, owcSquare.width, owcSquare.height)
    }

    function clear() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    draw();

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
        //scaleX = Math.min(Math.max(minZoom, scaleX), maxZoom);
        //scaleY = Math.min(Math.max(minZoom, scaleY), maxZoom);

        const mouseAfterZoomX = screenToWorldX(mousePos.x);
        const mouseAfterZoomY = screenToWorldY(mousePos.y);

        // Adjusts offset so the zoom occurs relative to the mouse position:
        offsetX += (mouseBeforeZoomX - mouseAfterZoomX);
        offsetY += (mouseBeforeZoomY - mouseAfterZoomY);

        clear();

        draw();
    });
}
