let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

let canvasWidth = canvas.width = window.innerWidth;
let canvasHeight = canvas.height = window.innerHeight;

const worldDimensions = { width: 12800, height: 7200 };

const pz = new PanZoom({ worldDimensions, screenDimensions: { width: canvasWidth, height: canvasHeight } });

const sun = new Star(0, 0, 250, "#ffcc00");

// Function to create a planet object:
function createPlanet(orbitalPeriod, radius, color, distanceToParent) {
    return new Planet(
        orbitalPeriod,
        radius,
        color,
        {
            parentCelestialBody: sun,
            distance: distanceToParent / 2,
            clockWise: false
        }
    );
}

// Array containing planet data:
const planetData = [
    { orbitalPeriod: 1, radius: 20, color: "#e09f3e", distanceToParent: 1000 }, // Mercury
    { orbitalPeriod: 1, radius: 18, color: "#ca6702", distanceToParent: 1750 },  // Venus
    { orbitalPeriod: 1, radius: 30, color: "#0a9396", distanceToParent: 2500 }, // Earth
    { orbitalPeriod: 1, radius: 15, color: "#9b2226", distanceToParent: 3250 }, // Mars
    { orbitalPeriod: 1, radius: 150, color: "#99582a", distanceToParent: 4000 },  // Jupiter
    { orbitalPeriod: 1, radius: 150, color: "#fec89a", distanceToParent: 4750 }, // Saturn
    { orbitalPeriod: 1, radius: 15, color: "#118ab2", distanceToParent: 5500 },  // Uranus
    { orbitalPeriod: 1, radius: 24, color: "#073b4c", distanceToParent: 6250 }   // Neptune
];

/*
Corrected distanceToParent values:

const planetData = [
    { orbitalPeriod: 1, radius: 20, color: "#e09f3e", distanceToParent: 5790 }, // Mercury
    { orbitalPeriod: 1, radius: 18, color: "#ca6702", distanceToParent: 10820 },  // Venus
    { orbitalPeriod: 1, radius: 30, color: "#0a9396", distanceToParent: 14960 }, // Earth
    { orbitalPeriod: 1, radius: 15, color: "#9b2226", distanceToParent: 22790 }, // Mars
    { orbitalPeriod: 1, radius: 150, color: "#99582a", distanceToParent: 77860 },  // Jupiter
    { orbitalPeriod: 1, radius: 150, color: "#fec89a", distanceToParent: 143350 }, // Saturn
    { orbitalPeriod: 1, radius: 15, color: "#118ab2", distanceToParent: 287250 },  // Uranus
    { orbitalPeriod: 1, radius: 24, color: "#073b4c", distanceToParent: 449510 }   // Neptune
];
*/

// Create an array of planet objects:
const celestialBodies = planetData.map(planet =>
    createPlanet(planet.orbitalPeriod, planet.radius, planet.color, planet.distanceToParent)
);

// Add the sun to the array:
celestialBodies.unshift(sun);

const moon = new Planet(
    2, 5, "#d3d3d3",
    {
        parentCelestialBody: celestialBodies[3], // Earth
        distance: 100,
    }
);

celestialBodies.push(moon);
const moon2 = new Planet(
    2, 5, "#ff00ff",
    {
        parentCelestialBody: celestialBodies[9], // moon
        distance: 50
    }
);

celestialBodies.push(moon2);

const moon3 = new Planet(
    3, 5, "#00ff00",
    {
        parentCelestialBody: celestialBodies[10], // moon
        distance: 20
    }
);

celestialBodies.push(moon3);

const moon4 = new Planet(
    4, 5, "#0000ff",
    {
        parentCelestialBody: celestialBodies[11], // moon
        distance: 10
    }
);

celestialBodies.push(moon4);

const amountOfCelestialBodies = celestialBodies.length;

const background = new Image();
background.src = "./stars.jpg";

function drawBackground() {
    ctx.drawImage(
        background,

        pz.WorldToScreenX(- worldDimensions.width / 2),
        pz.WorldToScreenY(- worldDimensions.height / 2),

        worldDimensions.width * pz.Scale,
        worldDimensions.height * pz.Scale
    );
}

function draw() {
    drawBackground();

    // Draw the orbits:
    for (let i = 0; i < amountOfCelestialBodies; i++) {
        celestialBodies[i].drawOrbit(ctx, pz, false);
        celestialBodies[i].draw(ctx, pz, false);
    }
}

function animate() {
    draw();

    // Updates the planets:
    for (let i = 0; i < amountOfCelestialBodies; i++) {
        celestialBodies[i].update();
    }

    requestAnimationFrame(animate);
}

pz.CenterOffset();
animate();

// Mouse functions:

function getCursorPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        mouseX: event.clientX - rect.left,
        mouseY: event.clientY - rect.top,
    }
}

canvas.addEventListener('mousedown', (event) => {

    const { mouseX, mouseY } = getCursorPosition(event);

    pz.MouseDown(mouseX, mouseY);
})

canvas.addEventListener('mousemove', (event) => {

    const { mouseX, mouseY } = getCursorPosition(event);

    pz.MouseMove(mouseX, mouseY);
})

canvas.addEventListener('mouseup', () => {
    pz.MouseUp();
})

canvas.addEventListener('wheel', (event) => {

    const { mouseX, mouseY } = getCursorPosition(event);

    pz.MouseWheel(mouseX, mouseY, event.deltaY);
});

window.onresize = () => {
    canvasWidth = canvas.width = window.innerWidth;
    canvasHeight = canvas.height = window.innerHeight;

    pz.ScreenDimensions = { width: canvas.width, height: canvas.height };
}