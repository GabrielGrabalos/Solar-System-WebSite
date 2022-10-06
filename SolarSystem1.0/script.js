window.onload = function() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
  
  
    function draw() {
      context.fillRect(25, 25, 100, 100);
    }
  
    function clear() {
      context.clearRect(0, 0, canvas.width, canvas.height);
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
        context.translate(dragEnd.x - dragStart.x, dragEnd.y - dragStart.y);
        dragStart=dragEnd
        draw()
      }
  
    })

    canvas.addEventListener('mouseup', function(event) {
        drag = false;
      })
  }