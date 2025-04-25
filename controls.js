class Control {
    constructor(options = {}) {
        this.obj = options.obj || null;

        this.bindings = new Map();
        this.onceBindings = new Map();
        this.keyStates = new Map();
        this.pressedThisFrame = new Set();

        this.namedBindings = new Map(); // name -> key
        this.namedCallbacks = new Map(); // name -> callback
        this.namedTypes = new Map(); // name -> "hold"/"once"

        this.capturing = null;

        // Volání inicializační funkce, pokud je poskytnuta
        if (options.initializer) {
            options.initializer(this.obj);
        }

        if (options.import && options.callbackMap) {
            this._importBindingsInternal(options.import, options.callbackMap);
        }

        window.addEventListener('keydown', (e) => {
            const key = e.key;
            if (this.capturing) {
                const { name, type, callback } = this.capturing;
                this.setBinding(name, type, key, callback);
                console.log(`Klávesa '${key}' přiřazena k akci '${name}'`);
                this.capturing = null;
                return;
            }

            if (!this.keyStates.has(key)) {
                this.keyStates.set(key, 0);
                this.pressedThisFrame.add(key);
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keyStates.delete(e.key);
            this.pressedThisFrame.delete(e.key);
        });
    }

    update() {
        for (const key of this.keyStates.keys()) {
            const duration = this.keyStates.get(key) + 1;
            this.keyStates.set(key, duration);

            if (this.bindings.has(key)) {
                this.bindings.get(key)(this.obj, duration);
            }

            if (this.onceBindings.has(key) && this.pressedThisFrame.has(key)) {
                this.onceBindings.get(key)(this.obj);
            }
        }

        this.pressedThisFrame.clear();
    }

    bind(key, callback) {
        this.bindings.set(key, callback);
    }

    bindOnce(key, callback) {
        this.onceBindings.set(key, callback);
    }

    captureBinding(name, type, callback) {
        this.capturing = { name, type, callback };
        console.log(`Stiskni klávesu pro akci '${name}' (${type})`);
    }

    setBinding(name, type, key, callback) {
        const oldKey = this.namedBindings.get(name);
        if (oldKey) {
            this.bindings.delete(oldKey);
            this.onceBindings.delete(oldKey);
        }

        this.namedBindings.set(name, key);
        this.namedCallbacks.set(name, callback);
        this.namedTypes.set(name, type);

        if (type === "hold") this.bind(key, callback);
        else this.bindOnce(key, callback);
    }

    updateBinding(name, newCallback) {
        const key = this.namedBindings.get(name);
        const type = this.namedTypes.get(name);
        if (!key || !type) return;

        this.namedCallbacks.set(name, newCallback);
        if (type === "hold") this.bindings.set(key, newCallback);
        else this.onceBindings.set(key, newCallback);
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

    _importBindingsInternal(data, callbackMap) {
        for (const [name, { key, type }] of Object.entries(data)) {
            const cb = callbackMap[name];
            if (cb) this.setBinding(name, type, key, cb);
        }
    }

    getBoundKey(name) {
        return this.namedBindings.get(name) || null;
    }
}
