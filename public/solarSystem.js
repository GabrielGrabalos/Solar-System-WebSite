class SolarSystem {
    constructor(data) {
        this.mainCelestialBody = null;
        this.celestialBodies = [];

        this.initializeSolarSystem(data);
    }

    get MainCelestialBody() {
        return this.mainCelestialBody;
    }

    set MainCelestialBody(value) {
        this.mainCelestialBody = value;
    }

    get CelestialBodies() {
        return this.celestialBodies;
    }

    set CelestialBodies(value) {
        this.celestialBodies = value;
    }

    /**
     * 
     * const data = [
     *        { id: 1, type: 'star', radius: 250, color: "#ffcc00" },                                                        // Sun
     *        { id: 2, type: 'planet', orbitalPeriod: 1, radius: 20,  color: "#e09f3e", distanceToParent: 1000, parent: 1 }, // Mercury
     *        { id: 3, type: 'planet', orbitalPeriod: 1, radius: 18,  color: "#ca6702", distanceToParent: 1750, parent: 1 }, // Venus
     *        { id: 4, type: 'planet', orbitalPeriod: 1, radius: 30,  color: "#0a9396", distanceToParent: 2500, parent: 1 }, // Earth
     *        { id: 5, type: 'planet', orbitalPeriod: 1, radius: 15,  color: "#9b2226", distanceToParent: 3250, parent: 1 }, // Mars
     *        { id: 6, type: 'planet', orbitalPeriod: 1, radius: 150, color: "#99582a", distanceToParent: 4000, parent: 1 }, // Jupiter
     *        { id: 7, type: 'planet', orbitalPeriod: 1, radius: 150, color: "#fec89a", distanceToParent: 4750, parent: 1 }, // Saturn
     *        { id: 8, type: 'planet', orbitalPeriod: 1, radius: 15,  color: "#118ab2", distanceToParent: 5500, parent: 1 }, // Uranus
     *        { id: 9, type: 'planet', orbitalPeriod: 1, radius: 24,  color: "#073b4c", distanceToParent: 6250, parent: 1 }  // Neptune
     *    ];
     */

    initializeSolarSystem(data) {
        const celestialBodiesMap = {};

        data.forEach(bodyData => {
            const { id, type, parent, ...props } = bodyData;
            let parentBody;

            if (parent) {
                parentBody = celestialBodiesMap[parent];
                if (!parentBody) {
                    throw new Error(`Parent with ID ${parent} not found for celestial body with ID ${id}`);
                }

                let orbit = {
                    parentCelestialBody: parentBody,
                    distance: props.distanceToParent,
                    clockwise: false
                };

                props.orbit = orbit;
            }


            const celestialBody = this.createCelestialBody(type, props, parentBody);
            this.celestialBodies.push(celestialBody);
            celestialBodiesMap[id] = celestialBody;

            if (parentBody) {
                celestialBody.orbit.parentCelestialBody = parentBody;
            }
        });
    }

    createCelestialBody(type, props, parentBody) {
        let celestialBody;

        switch (type) {
            case 'star':
                celestialBody = new Star(props);
                break;

            case 'planet':
                celestialBody = new Planet(props);
                break;

            // Handle other types like satellites, rings, etc.
            default:
                celestialBody = new CelestialBody(props);
        }

        return celestialBody;
    }
}