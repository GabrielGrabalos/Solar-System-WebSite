class Planet extends CelestialBody {
    constructor(velocity, radius, color, orbit, angle = 0) {
        super({
            angle,
            velocity,
            radius,
            color,
            orbit
        });
    }

    draw(ctx, pz, isSelected) {
        super.draw(ctx, pz, isSelected);
    }

    drawOrbit(ctx, pz, isSelected) {
        super.drawOrbit(ctx, pz, isSelected);
    }

    update() {
        super.update();
    }
}