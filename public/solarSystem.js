class SolarSystem {
    constructor(data) {
        this.celestialBodies = [];

        this.initializeSolarSystem(data);
    }

    get CelestialBodies() {
        return this.celestialBodies;
    }

    set CelestialBodies(value) {
        this.celestialBodies = value;
    }

    initializeSolarSystem(data) {
        const celestialBodiesMap = {};

        data.forEach(bodyData => {
            const { id, type, parent, ...props } = bodyData;
            let parentBody;

            // If the celestial body has a parent,
            // then get the parent celestial body:
            if (parent) {

                // Get the parent celestial body from the map:
                parentBody = celestialBodiesMap[parent];

                if (!parentBody) {
                    throw new Error(`Parent with ID ${parent} not found for celestial body with ID ${id}`);
                }

                // Initialize orbit:
                let orbit = {
                    parentCelestialBody: parentBody,
                    distance: props.distanceToParent,
                    clockwise: false
                };

                props.orbit = orbit;
            }


            // Create the celestial body and add it to the celestial bodies array:
            const celestialBody = this.createCelestialBody(type, props);
            
            this.celestialBodies.push(celestialBody);

            celestialBodiesMap[id] = celestialBody;
        });
    }

    createCelestialBody(type, props) {
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