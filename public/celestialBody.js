class CelestialBody {

    constructor(args) {
        this.angle = args.angle || 0;

        let velocity = args.velocity || 0;

        let orbit = args.orbit || null;

        this.velocity = velocity * (orbit?.clockwise ? 1 : -1);

        this.radius = args.radius || 0;
        this.color = args.color || "white";

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

        // If the orbit is defined, then the x and y will be calculated based on the distance and angle:
        let x = this.orbit? this.orbit.parentCelestialBody.x + this.orbit.distance * Math.cos(this.angle) : 0;
        let y = this.orbit? this.orbit.parentCelestialBody.y + this.orbit.distance * Math.sin(this.angle) : 0;

        this.x = args.x || x;
        this.y = args.y || y;
    }

    // ============================== || DRAWING FUNCTIONS || ============================== //

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
            0, Math.PI * 2 + 1, false
        );

        ctx.lineWidth = 4 * pz.Scale * (isSelected) ? 2 : 1;
        ctx.strokeStyle = "white";

        ctx.stroke();
    }

    // ============================== || UPDATING FUNCTIONS || ============================== //

    update() {
        if (!this.orbit || !this.orbit.parentCelestialBody || !this.orbit.distance) return;
    
        let parent = this.orbit.parentCelestialBody;
        let distance = this.orbit.distance;
    
        // Calculate the new angle based on the velocity:
        let deltaAngle = this.velocity / distance;
        let newAngle = this.angle + deltaAngle;
    
        let x = parent.x + distance * Math.cos(newAngle);
        let y = parent.y + distance * Math.sin(newAngle);
    
        this.x = x;
        this.y = y;

        this.angle = newAngle;
    }

    // ============================== || HOVERING FUNCTIONS || ============================== //

    isHovering(pz, mouseX, mouseY) {
        return Math.sqrt(
            Math.pow(pz.WorldToScreenX(this.x) - mouseX, 2) +
            Math.pow(pz.WorldToScreenY(this.y) - mouseY, 2)
        ) < this.radius * pz.Scale;
    }

    isHoveringOrbit(pz, mouseX, mouseY) {
        // Checks if the mouse is on the world range of 40 pixels of the orbit:
        if (!this.orbit) return false;

        const parent = this.orbit.parentCelestialBody;
        
        const x = pz.WorldToScreenX(parent.x);
        const y = pz.WorldToScreenY(parent.y);

        const distance = this.orbit.distance * pz.Scale;
        const mouseDistance = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);

        const range = 40 * pz.Scale;

        return (
            mouseDistance > distance - range &&
            mouseDistance < distance + range
        );
    }
}