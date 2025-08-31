class GameLoop {
    constructor({physic, render, fps}) {
        this.functions = [];
        this.isRunning = false;
        this.physic = physic;
        this.render = render;
        this.fps = fps || 60;
        this.frameDuration = 1000 / this.fps; // ms mezi snímky
        this.lastTime = 0;
        this.deltaTime = 0;
        this.timerId = null;

        // Pro testování přesnosti FPS
        this.frameCount = 0;
        this.fpsLastTime = 0;
        this.showFpsTest = true; // zapni/vypni test FPS
    }

    start() {
        if (this.isRunning) {
            console.warn("Game loop is already running.");
            return;
        }
        this.isRunning = true;
        this.lastTime = performance.now();
        this.fpsLastTime = this.lastTime;
        this.deltaTime = this.frameDuration / 1000; // fixní deltaTime v sekundách (např. 0.05s pro 20fps)
        this.frameCount = 0;
        this.#loop();
    }

    #loop() {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        const elapsed = currentTime - this.lastTime;

        if (elapsed >= this.frameDuration) {
            this.lastTime = currentTime - (elapsed % this.frameDuration);

            for (let fn of this.functions) {
                fn(this.deltaTime);
            }
            this.physic.update(this.deltaTime);
            this.render.render();

            // Test FPS přesnosti
            if (this.showFpsTest) {
                this.frameCount++;
                if (currentTime - this.fpsLastTime >= 1000) {
                    const realFps = (this.frameCount * 1000) / (currentTime - this.fpsLastTime);
                    //console.log(`Actual FPS: ${realFps.toFixed(2)} (target: ${this.fps})`);
                    this.frameCount = 0;
                    this.fpsLastTime = currentTime;
                }
            }
        }

        this.timerId = setTimeout(() => this.#loop(), this.frameDuration / 2);
    }

    stop() {
        this.isRunning = false;
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
        //console.log("Game loop stopped.");
    }

    step() {
        if (this.isRunning) {
            this.stop();
        }
        for (let fn of this.functions) {
            fn(this.deltaTime);
        }
        this.physic.update(this.deltaTime);
        this.render.render();
    }

    addFunction(fn) {
        if (typeof fn === "function") {
            this.functions.push(fn);
        } else {
            console.error("Provided argument is not a function.");
        }
    }
}

export default GameLoop;
