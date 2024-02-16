class Star extends CelestialBody {
    constructor(x, y, radius, color) {
        super(x, y, radius, color);
    }

    draw(ctx, pz, isSelected) {
        super.draw(ctx, pz, isSelected);
    }

    drawOrbit(ctx, pz, isSelected) {
        return;
    }

    update() {
        return;
    }
}