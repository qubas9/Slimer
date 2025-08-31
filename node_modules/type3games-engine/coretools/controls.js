/**
 * @class Control
 * @classdesc A key binding and input handling system with recording and playback support.
 */
class Control {
    /**
     * Initializes a new instance of the Control class.
     * @param {Object} [obj] - The object that the bindings will apply to.
     * @param {Object} [callbackMap=null] - A map of callback functions for imported bindings.
     */
    constructor(obj, callbackMap = null) {
        this.obj = obj;

        this.bindings = new Map();
        this.onceBindings = new Map();
        this.releaseBindings = new Map();
        this.releaseOnceBindings = new Map();
        this.releaseTickKeys = {};
        this.keyStates = new Map();
        this.pressedThisFrame = new Set();

        this.namedBindings = new Map();
        this.namedCallbacks = new Map();
        this.namedTypes = new Map();

        this.capturing = null;
        this.paused = false;

        this.recording = false;
        this.recordedEvents = [];
        this.playingBack = false;
        this.playbackFrame = 0;
        this.playbackFrameCounter = 0;

        if (callbackMap) {
            this._importBindingsInternal(callbackMap);
        }

        this._setupEventListeners();
    }

    _setupEventListeners() {
        window.addEventListener("keydown", (e) => this._handleKeyDown(e));
        window.addEventListener("keyup", (e) => this._handleKeyUp(e));
    }

    _handleKeyDown(e) {
        const key = e.key;

        if (this.capturing) {
            const { name, type, callback } = this.capturing;
            this.setBinding(name, type, key, callback);
            this.capturing = null;
            return;
        }

        if (!this.keyStates.has(key)) {
            this.keyStates.set(key, 0);
            this.pressedThisFrame.add(key);
        }

        if (this.recording) {
            this.recordedEvents.push({
                type: "keydown",
                key,
                frame: this.playbackFrameCounter +1
            });
        }
    }

    _handleKeyUp(e) {
        const key = e.key;
        const duration = this.keyStates.get(key);

        this.keyStates.delete(key);
        this.pressedThisFrame.delete(key);

        if (this.releaseBindings.has(key)) {
            this.releaseBindings.get(key)(this.obj, duration);
        }

        if (this.releaseOnceBindings.has(key)) {
            this.releaseOnceBindings.get(key)(this.obj, duration);
            this.releaseOnceBindings.delete(key);
        }

        if (this.recording) {
            this.recordedEvents.push({
                type: "keyup",
                key,
                frame: this.playbackFrameCounter +1
            });
        }
    }

    update() {
        if (!this.paused) {
            for (const [key, duration] of this.keyStates.entries()) {
                this.keyStates.set(key, duration + 1);

                if (this.bindings.has(key)) {
                    this.bindings.get(key)(this.obj, duration + 1);
                }

                if (this.onceBindings.has(key) && this.pressedThisFrame.has(key)) {
                    this.onceBindings.get(key)(this.obj);
                }
            }

            for (const key in this.releaseTickKeys) {
                const data = this.releaseTickKeys[key];
                if (data.ticks > 0) {
                    data.ticks--;
                    data.callback(this.obj);
                } else {
                    delete this.releaseTickKeys[key];
                }
            }

            this.pressedThisFrame.clear();
        }

        if (this.playingBack) {
            while (this.recordedEvents.length && this.recordedEvents[0].frame == this.playbackFrameCounter) {
                const event = this.recordedEvents.shift();
                const simulatedEvent = new KeyboardEvent(event.type, { key: event.key });
                //console.log(`Simulating ${event.type} for key: ${event.key} at frame ${event.frame}`);
                
                if (event.type === "keydown") {
                    this._handleKeyDown(simulatedEvent);
                } else {
                    this._handleKeyUp(simulatedEvent);
                }
            }
            if (this.recordedEvents.length === 0) {
                this.stopPlayback();
            }
            
        }

        this.playbackFrameCounter++;
    }

    /** Starts recording key events. */
    startRecording() {
        this.recording = true;
        this.recordedEvents = [];
        
    }

    /** Stops recording and returns the recorded data. */
    stopRecording() {
        this.recording = false;
        return [...this.recordedEvents];
    }

    /** Starts playback of recorded events. */
    startPlayback(events) {
        this.recordedEvents = [...events];
        this.playingBack = true;
        
    }

    /** Stops playback. */
    stopPlayback() {
        this.playingBack = false;
        this.recordedEvents = [];
    }

    bind(name, key, callback) {
        this.namedBindings.set(name, key);
        this.namedCallbacks.set(name, callback);
        this.namedTypes.set(name, "hold");
        this.bindings.set(key, callback);
    }

    bindOnce(name, key, callback) {
        this.namedBindings.set(name, key);
        this.namedCallbacks.set(name, callback);
        this.namedTypes.set(name, "once");
        this.onceBindings.set(key, callback);
    }

    bindRelease(name, key, callback) {
        this.namedBindings.set(name, key);
        this.namedCallbacks.set(name, callback);
        this.namedTypes.set(name, "release");
        this.releaseBindings.set(key, callback);
    }

    bindReleaseOnce(name, key, callback) {
        this.namedBindings.set(name, key);
        this.namedCallbacks.set(name, callback);
        this.namedTypes.set(name, "releaseOnce");
        this.releaseOnceBindings.set(key, callback);
    }

    bindWithReleaseTick(name, key, callback) {
        const combinedCallback = (obj, ticks) => callback(obj, ticks);

        this.namedBindings.set(name, key);
        this.namedCallbacks.set(name, combinedCallback);
        this.namedTypes.set(name, "withReleaseTick");

        this.bindings.set(key, combinedCallback);

        this.releaseBindings.set(key, (obj, ticks) => {
            this.releaseTickKeys[key] = {
                ticks: 1,
                callback: () => callback(obj, ticks),
            };
        });
    }

    captureBinding(name, type, callback) {
        this.capturing = { name, type, callback };
    }

    setBinding(name, type, key, callback) {
        const oldKey = this.namedBindings.get(name);
        if (oldKey) {
            this.bindings.delete(oldKey);
            this.onceBindings.delete(oldKey);
            this.releaseBindings.delete(oldKey);
            this.releaseOnceBindings.delete(oldKey);
        }

        this.namedBindings.set(name, key);
        this.namedCallbacks.set(name, callback);
        this.namedTypes.set(name, type);

        if (type === "hold") this.bind(name, key, callback);
        else if (type === "once") this.bindOnce(name, key, callback);
        else if (type === "release") this.bindRelease(name, key, callback);
        else if (type === "releaseOnce") this.bindReleaseOnce(name, key, callback);
    }

    updateBinding(name, newCallback) {
        const key = this.namedBindings.get(name);
        const type = this.namedTypes.get(name);
        if (!key || !type) return;

        this.namedCallbacks.set(name, newCallback);
        if (type === "hold") this.bindings.set(key, newCallback);
        else if (type === "once") this.onceBindings.set(key, newCallback);
        else if (type === "release") this.releaseBindings.set(key, newCallback);
        else if (type === "releaseOnce") this.releaseOnceBindings.set(key, newCallback);
    }

    updateBindingKey(name, newKey) {
        const callback = this.namedCallbacks.get(name);
        const type = this.namedTypes.get(name);
        if (!callback || !type) return;

        this.setBinding(name, type, newKey, callback);
    }

    exportBindings() {
        const out = {};
        for (const [name, key] of this.namedBindings.entries()) {
            out[name] = {
                key,
                type: this.namedTypes.get(name),
            };
        }
        return out;
    }

    getBoundKey(name) {
        return this.namedBindings.get(name) || null;
    }

    pause() {
        this.paused = true;
    }

    unpause() {
        this.paused = false;
    }

    _importBindingsInternal(callbackMap) {
        for (const [name, { key, type }] of Object.entries(callbackMap)) {
            const cb = callbackMap[name].callback;
            if (cb) this.setBinding(name, type, key, cb);
        }
    }
}

export default Control;
