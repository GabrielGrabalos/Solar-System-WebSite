class CelestialBody {

    constructor(x, y, velocity, radius, color, orbit) {
        this.x = x;
        this.y = y;

        this.velocity = velocity;

        this.radius = radius;
        this.color = color;

        /**
         * 
         *  orbit: {
         *      parentCelestialBody: CelestialBody, // The CelestialBody that this orbits
         *  
         *      distance: number, // The distance from the parentCelestialBody
         *  
         *      clockwise: boolean, // Whether the orbit is clockwise or not
         *  }
         * 
        **/

        this.orbit = orbit;
    }

    draw(ctx, pz, isSelected) {
        ctx.beginPath();

        ctx.arc(
            pz.WorldToScreenX(this.x),
            pz.WorldToScreenY(this.y),
            this.radius * pz.Scale,
            0, Math.PI * 2, false
        );

        ctx.fillStyle = this.color;

        ctx.fill();

        if (isSelected) {
            ctx.strokeStyle = "white";

            ctx.lineWidth = 4 * pz.Scale;

            ctx.stroke();
        }
    }

    drawOrbit(ctx, pz, isSelected) {
        if (!this.orbit) return;

        const parent = this.orbit.parentCelestialBody;

        ctx.beginPath();

        ctx.arc(
            pz.WorldToScreenX(parent.x),
            pz.WorldToScreenY(parent.y),
            this.orbit.distance * pz.Scale,
            0, Math.PI * 2, false
        );

        ctx.lineWidth = 4 * pz.Scale * (isSelected) ? 2 : 1;
        ctx.strokeStyle = "white";

        ctx.stroke();
    }

    update() {
        if (!this.orbit) return;

        let parent = this.orbit.parentCelestialBody;

        let distance = this.orbit.distance;

        let angle = Math.atan2(this.y - parent.y, this.x - parent.x);

        let x = parent.x + distance * Math.cos(angle + this.velocity * 0.1);
        let y = parent.y + distance * Math.sin(angle + this.velocity * 0.1);

        this.x = x;
        this.y = y;
    }
}