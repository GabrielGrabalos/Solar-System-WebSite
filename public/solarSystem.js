class SolarSystem {
    constructor(mainCelestialBody, args){
        this.mainCelestialBody = mainCelestialBody;
    }

    createPlanet(orbitalPeriod, radius, color, distanceToParent) {
        return new Planet(
            orbitalPeriod,
            radius,
            color,
            {
                parentCelestialBody: sun,
                distance: distanceToParent / 2,
                clockWise: false
            },
            Math.random() * Math.PI * 2
        );
    }
}