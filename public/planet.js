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

        context.arc(worldToScreenX(this.x), worldToScreenY(this.y), this.radius * scale, 0, Math.PI * 2, false);

        context.fillStyle = this.color;

        context.fill();

        // If the planet is selected, draw a circle around it:
        if (this == screenElements[planetToBeSelected]) {
            context.strokeStyle = "white";
            context.lineWidth = 4 * scale;
            context.stroke();
        }
    }

    // Draw the orbit:
    drawOrbit(isSelected) {
        context.beginPath();

        context.arc(worldToScreenX(0), worldToScreenY(0), this.distance * scale, 0, Math.PI * 2, false);

        // If the planet is selected, draw a thicker orbit:
        context.lineWidth = 4 * scaleX * (isSelecte )? 2 : 1;

        context.strokeStyle = "white";

        context.stroke();
    }

}