let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

let offscreenCanvas = document.createElement('canvas');
let offscreenCtx = offscreenCanvas.getContext('2d');

let canvasWidth = canvas.width = offscreenCanvas.width = window.innerWidth;
let canvasHeight = canvas.height = offscreenCanvas.height = window.innerHeight;

const worldDimensions = { width: 12800, height: 7200 };

const pz = new PanZoom({ worldDimensions, screenDimensions: { width: canvasWidth, height: canvasHeight } });


let mouse = { x: 0, y: 0 };

let celestialBodyToBeSelected = -1;
let selectedCelestialBody = null;

const sun = new Star(0, 0, 250, "#ffcc00");

const system = new SolarSystem(sun);

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

// Create an array of planet objects:
const celestialBodies = planetData.map(planet =>
    system.createPlanet(planet.orbitalPeriod, planet.radius, planet.color, planet.distanceToParent)
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

const amountOfCelestialBodies = celestialBodies.length;

const starGen = new starGenerator(worldDimensions);
starGen.generateStars(10000);

// =============== || ANIMATION & DRAWING || =============== //

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear the canvas.

    // Update and draw the stars:
    updateStars();
    ctx.drawImage(offscreenCanvas, 0, 0);

    let isAnyHovering = -1; // Variable to check if any celestial body is being hovered.

    // Draw the orbits:
    for (let i = 0; i < amountOfCelestialBodies; i++) {
        const celestialBody = celestialBodies[i];

        // Check if the celestial body is being hovered or if the orbit is being hovered.
        // If there is already a hovering object, then don't check for hovering objects anymore:
        const isHovering =
            (
                !isAnyHovering != -1 &&
                (
                    celestialBody.isHoveringOrbit(pz, mouse.x, mouse.y) ||
                    celestialBody.isHovering(pz, mouse.x, mouse.y)
                )
            );

        // Draw the orbit and the celestial body:
        celestialBody.drawOrbit(ctx, pz, isHovering);
        celestialBody.draw(ctx, pz, isHovering);

        if (isHovering) isAnyHovering = i; // Set the isAnyHovering variable to the current index.
    }

    // Update the cursor:
    if (isAnyHovering != -1)
        canvas.style.cursor = "pointer";
    else
        canvas.style.cursor = "default";

    celestialBodyToBeSelected = isAnyHovering; // Set the celestial body to be selected to the current index.
}

let framesLeft = 60;

function animate() {
    // If a celestial body is selected, then animate to it:
    if (selectedCelestialBody) {

        // If there are frames left, then animate to the selected celestial body:
        if (framesLeft > 0) {

            pz.requestAnimationFrameTo(
                selectedCelestialBody.x,
                selectedCelestialBody.y,
                1,
                framesLeft
            );

            framesLeft--;
        }

        // If there are no frames left, then focus on the selected celestial body:
        else {
            pz.requestFocusOn(
                selectedCelestialBody.x,
                selectedCelestialBody.y
            );
        }
    }

    draw();

    // Updates the planets:
    for (let i = 0; i < amountOfCelestialBodies; i++) {
        celestialBodies[i].update();
    }

    requestAnimationFrame(animate);
}

// Start the animation:
pz.CenterOffset();
animate();

// ================== || HELPFUL FUNCTIONS || ================== //

function updateStars() {
    offscreenCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    starGen.drawStars(offscreenCtx, pz);
}

// Function to deselect the selected celestial body:
function deselectCelestialBody() {
    if (!selectedCelestialBody) return;

    selectedCelestialBody = null;
    framesLeft = 60;
}

// =============== || EVENT LISTENERS || =============== //

// Mouse functions:

function getCursorPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        mouseX: event.clientX - rect.left,
        mouseY: event.clientY - rect.top,
    }
}

canvas.addEventListener('mousedown', (event) => {
    deselectCelestialBody();

    const { mouseX, mouseY } = getCursorPosition(event);

    pz.MouseDown(mouseX, mouseY);
})

canvas.addEventListener('mousemove', (event) => {

    const { mouseX, mouseY } = getCursorPosition(event);

    mouse.x = mouseX;
    mouse.y = mouseY;

    pz.MouseMove(mouseX, mouseY);
})

canvas.addEventListener('mouseup', () => {
    pz.MouseUp();
})

canvas.addEventListener('wheel', (event) => {
    deselectCelestialBody();

    const { mouseX, mouseY } = getCursorPosition(event);

    pz.MouseWheel(mouseX, mouseY, event.deltaY);
});

canvas.addEventListener('click', () => {
    if (!pz.Click) return;

    if (celestialBodyToBeSelected != -1) {
        selectedCelestialBody = celestialBodies[celestialBodyToBeSelected];
    }
    else {
        selectedCelestialBody = null;
    }
});

// Resize the canvas when the window is resized:
window.onresize = () => {
    canvasWidth = canvas.width = offscreenCanvas.width = window.innerWidth;
    canvasHeight = canvas.height = offscreenCanvas.height = window.innerHeight;

    pz.ScreenDimensions = { width: canvasWidth, height: canvasHeight };
}