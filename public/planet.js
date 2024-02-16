class Planet extends CelestialBody {
    constructor(x, y, velocity, radius, color, orbit) {
        super(x, y, velocity, radius, color, orbit);
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