class Renderer3D {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.objects = [];
        this.camera = { x: 0, y: 0, z: -5 };
        this.angle = 0;
    }

    addObject(object) {
        this.objects.push(object);
    }

    rotateY(point, angle) {
        return {
            x: point.x * Math.cos(angle) - point.z * Math.sin(angle),
            y: point.y,
            z: point.x * Math.sin(angle) + point.z * Math.cos(angle)
        };
    }

    project(point) {
        const scale = 500 / (point.z - this.camera.z);
        return {
            x: this.width / 2 + point.x * scale,
            y: this.height / 2 - point.y * scale
        };
    }

    drawObject(object) {
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.lineWidth = 2;
        object.edges.forEach(([start, end]) => {
            const p1 = this.project(this.rotateY(object.points[start], this.angle));
            const p2 = this.project(this.rotateY(object.points[end], this.angle));
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
        });
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.objects.forEach(obj => this.drawObject(obj));
    }

    animate() {
        this.angle += 0.02;
        this.render();
        requestAnimationFrame(() => this.animate());
    }
}

class Cube {
    constructor(size, x, y, z) {
        this.points = [
            { x: -size, y: -size, z: z }, { x: size, y: -size, z: z },
            { x: size, y: size, z: z }, { x: -size, y: size, z: z },
            { x: -size, y: -size, z: z + size }, { x: size, y: -size, z: z + size },
            { x: size, y: size, z: z + size }, { x: -size, y: size, z: z + size }
        ];
        this.edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // Front face
            [4, 5], [5, 6], [6, 7], [7, 4], // Back face
            [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
        ];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const renderer = new Renderer3D("canvas");
    const cube = new Cube(1, 0, 0, 3);
    renderer.addObject(cube);
    renderer.animate();
});