function randomXOR(seedObj) {
    seedObj.value ^= (seedObj.value << 13) & 0xffffffff;
    seedObj.value ^= (seedObj.value >> 17) & 0xffffffff;
    seedObj.value ^= (seedObj.value << 5) & 0xffffffff;
    seedObj.value &= 0xffffffff;

    return seedObj.value;
}

function random(seed, min, max) {
    return randomXOR(seed) % (max - min) + min;
}

function randInt(seed, min, max) {
    return Math.floor(random(seed, min, max));
}

// A class to create a collection of stars
// (white points on a canvas, to this usage case):
class starGenerator {
    constructor(worldSize) {
        this.stars = [];
        this.starCount = 0;
        this.worldSize = worldSize;
    }

    generateStars(amount) {
        for (let i = 0; i < amount; i++) {

            let seed = {
                value: i
            };

            const x = random(seed, -this.worldSize.width / 2, this.worldSize.width / 2);
            const y = random(seed, -this.worldSize.height / 2, this.worldSize.height / 2);
            const z = random(seed, 1.5, 3.5);
            const size = random(seed, 3, 6);
            const brightness = random(seed, 150, 255);

            const star = {
                x,
                y,
                z,
                size,
                brightness
            };

            this.stars.push(star);
        }
        this.starCount = amount;
    }

    getStars() {
        return this.stars;
    }

    drawStars(ctx, pz) {
        for (let i = 0; i < this.starCount; i++) {
            const star = this.stars[i];
            const brightness = star.brightness + Math.random(-1, 2) * 100;
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
            const size = star.size * pz.Scale;
            ctx.fillRect(pz.WorldToScreenX(star.x) / star.z, pz.WorldToScreenY(star.y) / star.z, size, size);
        }
    }
}