
// A class to create a collection of stars
// (white points on a canvas, to this usage case):

class StarGenerator {
    constructor(worldSize) {
        this.stars = [];
        this.starCount = 0;
        this.worldSize = worldSize;
    }

    get Stars() {
        return this.stars;
    }

    // =============== || RANDOM FUNCTIONS || =============== //

    randomXOR(seedObj) {
        seedObj.value ^= (seedObj.value << 13) & 0xffffffff;
        seedObj.value ^= (seedObj.value >> 17) & 0xffffffff;
        seedObj.value ^= (seedObj.value << 5) & 0xffffffff;
        seedObj.value &= 0xffffffff;

        return seedObj.value;
    }

    random(seed, min, max) {
        return this.randomXOR(seed) % (max - min) + min;
    }

    randInt(seed, min, max) {
        return Math.floor(this.random(seed, min, max));
    }

    // =============== || STAR GENERATION || =============== //

    generateStars(amount) {
        const startPoint = {
            x: -this.worldSize.width / 2,
            y: -this.worldSize.height / 2
        };

        const endPoint = {
            x: this.worldSize.width / 2,
            y: this.worldSize.height / 2
        };

        for (let i = 0; i < amount; i++) {
            let seed = { value: i };

            const x = this.random(seed, startPoint.x, endPoint.x);
            const y = this.random(seed, startPoint.y, endPoint.y);
            const size = this.random(seed, 3, 6);
            const brightness = this.random(seed, 150, 255);

            const star = { x, y, size, brightness };

            this.stars.push(star);
        }

        this.starCount = amount;
    }

    // =============== || DRAWING || =============== //

    drawStars(ctx, pz) {
        for (let i = 0; i < this.starCount; i++) {
            const star = this.stars[i];

            const flicker = (Math.random() < 0.3 ? 100 : 0) * Math.random(-1, 2); // Has a 30% chance to generate a flicker on the star.
            const brightness = star.brightness + flicker;

            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;

            const sizeWithZoom = star.size * pz.Scale;

            ctx.fillRect(
                pz.WorldToScreenX(star.x),
                pz.WorldToScreenY(star.y),
                sizeWithZoom,
                sizeWithZoom
            );
        }
    }
}