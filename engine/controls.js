class Control {
    /**
     * Initializes a new instance of the Control class.
     * @param {Object} [options={}] - Configuration options for the class.
     * @param {Object} [options.obj=null] - The object that the bindings will apply to.
     * @param {Function} [options.initializer=null] - A function to initialize the object.
     * @param {Object} [options.import=null] - Previously exported key bindings and functions.
     * @param {Object} [options.callbackMap=null] - A map of callback functions for imported bindings.
     */
    constructor(options = {}) {
        this.obj = options.obj || null;

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

        if (options.callbackMap) {
            this._importBindingsInternal(options.callbackMap);
        }

        this._setupEventListeners();
    }

    /**
     * Sets up event listeners for keydown and keyup events.
     */
    _setupEventListeners() {
        window.addEventListener('keydown', (e) => this._handleKeyDown(e));
        window.addEventListener('keyup', (e) => this._handleKeyUp(e));
    }

    /**
     * Handles the keydown event.
     * @param {KeyboardEvent} e - The keydown event.
     */
    _handleKeyDown(e) {
        console.log(`Key pressed: ${e.key}`);
        
        const key = e.key;

        if (this.capturing) {
            const { name, type, callback } = this.capturing;
            this.setBinding(name, type, key, callback);
            console.log(`Key '${key}' assigned to action '${name}'`);
            this.capturing = null;
            return;
        }

        if (!this.keyStates.has(key)) {
            this.keyStates.set(key, 0);
            this.pressedThisFrame.add(key);
        }
    }

    /**
     * Handles the keyup event.
     * @param {KeyboardEvent} e - The keyup event.
     */
    _handleKeyUp(e) {
        console.log(`Key released: ${e.key}`);
        
        const key = e.key;
        const duration = this.keyStates.get(key);

        this.keyStates.delete(key);
        this.pressedThisFrame.delete(key);

        if (this.releaseBindings.has(key)) {
            this.releaseBindings.get(key)(this.obj, duration);
        }

        if (this.releaseOnceBindings.has(key)) {
            this.releaseOnceBindings.get(key)(this.obj, duration);
        }
    }

    /**
     * Updates the key states and calls the corresponding callbacks.
     */
    update() {
        if (!this.paused){    
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
    }

    /**
     * Binds a callback to a key for continuous invocation while the key is held down.
     * @param {string} name - The name of the action.
     * @param {string} key - The key to bind.
     * @param {Function} callback - The function to be called every frame the key is held d* The callback receives two parameters:
     *   - `obj` (Object): The controlled object.
     *   - `frames` (number): The number of frames the key has been held down.
own.
* The callback receives two parameters:
     *   - `obj` (Object): The controlled object.
     *   - `frames` (number): The number of frames the key has been held down.
     */
    bind(name, key, callback) {
        this.namedBindings.set(name, key);
        this.namedCallbacks.set(name, callback);
        this.namedTypes.set(name, 'hold');
        this.bindings.set(key, callback);
    }

    /**
     * Binds a callback to a key for a single invocation when the key is pressed.
     * @param {string} name - The name of the action.
     * @param {string} key - The key to bind.
     * @param {Function} callback - The function to be called once when the key is* The callback receives one parameter:
     *   - `obj` (Object): The controlled object.
pressed.
* The callback receives one parameter:
     *   - `obj` (Object): The controlled object.
     */
    bindOnce(name, key, callback) {
        this.namedBindings.set(name, key);
        this.namedCallbacks.set(name, callback);
        this.namedTypes.set(name, 'once');
        this.onceBindings.set(key, callback);
    }

    /**
     * Binds a callback to a key, which will only trigger when the key is released.
     * @param {string} name - The name of the action.
     * @param {string} key - The key to bind.
     * @param {Function} callback - The function to be called when the key is released.
* The callback receives two parameters:
     *   - `obj` (Object): The controlled object.
     *   - `duration` (number): The number of frames the key was held down.
     */
    bindRelease(name, key, callback) {
        this.namedBindings.set(name, key);
        this.namedCallbacks.set(name, callback);
        this.namedTypes.set(name, 'release');
        this.releaseBindings.set(key, callback);
    }

    /**
     * Binds a callback to a key, which will trigger both while holding the key and one frame after the key is released.
     * @param {string} name - The name of the action.
     * @param {string} key - The key to bind.
     * @param {Function} callback - The function to be called every frame the key is held down,
     * and once after it is released.
     */
    bindWithReleaseTick(name, key, callback) {
        const combinedCallback = (obj, ticks) => callback(obj, ticks);

        this.namedBindings.set(name, key);
        this.namedCallbacks.set(name, combinedCallback);
        this.namedTypes.set(name, 'withReleaseTick');

        this.bindings.set(key, combinedCallback);

        this.releaseBindings.set(key, (obj, ticks) => {
            this.releaseTickKeys[key] = {
                ticks: 1,
                callback: () => callback(obj, ticks),
            };
        });
    }

    /**
     * Starts the process of capturing a key for binding to a specific action.
     * @param {string} name - The name of the action to bind.
     * @param {string} type - The type of the action ("hold", "once", "release", or "releaseOnce").
     * @param {Function} callback - The function to be called when the key is pressed.
     */
    captureBinding(name, type, callback) {
        this.capturing = { name, type, callback };
        console.log(`Press a key for action '${name}' (${type})`);
    }

    /**
     * Sets a binding for a specific action name.
     * @param {string} name - The name of the action.
     * @param {string} type - The type of the action ("hold", "once", "release", or "releaseOnce").
     * @param {string} key - The key to bind.
     * @param {Function} callback - The function to be called when the key is pressed.
     */
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

        if (type === 'hold') {
            this.bind(name, key, callback);
        } else if (type === 'once') {
            this.bindOnce(name, key, callback);
        } else if (type === 'release') {
            this.bindRelease(name, key, callback);
        } else if (type === 'releaseOnce') {
            this.releaseOnceBindings.set(key, callback);
        }
    }

    /**
     * Updates the callback for an existing binding.
     * @param {string} name - The name of the action.
     * @param {Function} newCallback - The new callback to be assigned.
     */
    updateBinding(name, newCallback) {
        const key = this.namedBindings.get(name);
        const type = this.namedTypes.get(name);
        if (!key || !type) return;

        this.namedCallbacks.set(name, newCallback);
        if (type === 'hold') {
            this.bindings.set(key, newCallback);
        } else if (type === 'once') {
            this.onceBindings.set(key, newCallback);
        } else if (type === 'release') {
            this.releaseBindings.set(key, newCallback);
        } else if (type === 'releaseOnce') {
            this.releaseOnceBindings.set(key, newCallback);
        }
    }

    /**
     * Updates the key for an existing binding.
     * @param {string} name - The name of the action.
     * @param {string} newKey - The new key to be assigned.
     */
    updateBindingKey(name, newKey) {
        const callback = this.namedCallbacks.get(name);
        const type = this.namedTypes.get(name);
        if (!callback || !type) return;

        this.setBinding(name, type, newKey, callback);
    }

    /**
     * Exports all the assigned keys and their types into an object.
     * @returns {Object} - An object containing the assigned keys and their types.
     */
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

    /**
     * Gets the key bound to an action by its name.
     * @param {string} name - The name of the action.
     * @returns {string|null} - The key bound to the action, or null if no key is bound.
     */
    getBoundKey(name) {
        return this.namedBindings.get(name) || null;
    }

    /**
     * Pauses the control system, preventing key events from being processed.
     */
    pause() {
        this.paused = true;
    }
    /**
     * Unpauses the control system, allowing key events to be processed again.
     */
    unpause() {
        this.paused = false;
    }

    /**
     * Imports bindings from an external source and assigns them to their corresponding callbacks.
     * @param {Object} callbackMap - A map of callback functions for each action.
     */
    _importBindingsInternal(callbackMap) {
        for (const [name, { key, type }] of Object.entries(callbackMap)) {
            const cb = callbackMap[name].callback;
            if (cb) this.setBinding(name, type, key, cb);
        }
    }
}
export default Control;
