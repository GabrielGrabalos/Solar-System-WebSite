class Planet extends CelestialBody {
    constructor(velocity, radius, color, orbit) {
        super(orbit.distance, 0, velocity, radius, color, orbit);
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