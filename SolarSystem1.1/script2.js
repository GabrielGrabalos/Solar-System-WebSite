window.onload = function() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
  
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
  
    let camera = {
        x: 0,
        y: 0,
        zoom: 1
    }

    function draw() {
      context.fillRect(25-camera.x, 25-camera.y, 100, 100);
    }
  
    function clear() {
      context.clearRect(0,0, canvasWidth, canvasHeight);
    }
    var drag = false;
    var dragStart;
    var dragEnd;

    draw()
    
    canvas.addEventListener('mousedown', function(event) {
      dragStart = {
        x: event.pageX - canvas.offsetLeft,
        y: event.pageY - canvas.offsetTop
      }
  
      drag = true;
    })
  
    canvas.addEventListener('mousemove', function(event) {
      if (drag) {
        dragEnd = {
          x: event.pageX - canvas.offsetLeft,
          y: event.pageY - canvas.offsetTop
        }
        clear()
        camera = {
            x: camera.x - (dragEnd.x - dragStart.x),
            y: camera.y - (dragEnd.y - dragStart.y),
            zoom: camera.zoom
        };
        
        dragStart = dragEnd;
        draw()
      }
  
    })

    canvas.addEventListener('mouseup', function(event) { drag = false; } )


    this.canvas.addEventListener('wheel', (event) => {
        event.preventDefault();

        /*camera.zoom += event.deltaY * -0.01;

        // Restrict zoom
        camera.zoom = Math.min(Math.max(.125, camera.zoom), 4);

        draw();*/
    });
}