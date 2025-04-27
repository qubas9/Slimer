# Documentation for the Control Class

The `Control` class is designed for managing user input and dynamically assigning keyboard shortcuts to actions (such as movement or other interactions). It supports an unlimited number of key bindings, dynamic assignment and modification of these bindings, and efficient management of key states.

## Constructor

```javascript
constructor(options = {})
```

**Description**:  
The constructor initializes a new controller for the given object. When creating an instance of the class, you can pass a configuration object `options`, which includes both the object to be controlled and an optional initialization function.

**Parameters**:
- `options` (Object, optional): An object containing configuration options for the controller.
  - `obj` (Object, optional): The object that will be controlled. If not provided, it defaults to `null`.
  - `initializer` (Function, optional): A function that is called after the object is initialized. It can be used to perform additional setup for the object.
  - `import` (Object, optional): An object containing previously exported key bindings and corresponding functions.
  - `callbackMap` (Object, optional): A mapping of action names to callback functions that will be used when importing key bindings.

**Usage Example**:
```
const player = {
    name: "Player1",
    health: 100,
    jump: function() { console.log("Jumping!"); },
    move: function(direction) { console.log(`Moving to the ${direction}`); }
};

const control = new Control({
    obj: player,
    initializer: (obj) => {
        console.log(`Initializing object: ${obj.name}`);
        obj.health = 150;  // Example: modify health
    }
});

// Export key bindings
const exportedBindings = control.exportBindings();
console.log("Exported Bindings:", exportedBindings);

// Later, upload the exported key bindings to a new Control instance
const newControl = new Control({
    obj: player,
    import: exportedBindings,
    callbackMap: {
        moveUp: (obj) => obj.move('up'),
        jump: (obj) => obj.jump(),
        sprint: (obj, duration) => console.log(`Sprinting for ${duration} frames.`)
    }
});
console.log("Key bindings successfully uploaded to the new control instance with callback mappings.");
```

## Methods

### `update()`

```
update()
```

**Description**:  
This method updates the state of the key bindings and executes corresponding actions for all pressed keys. It should be called regularly (e.g., in each animation frame or game loop).

**Parameters**:  
None.

**Usage Example**:
```
control.update();  // Call this in each frame to process actions
```

### `bind(name, key, callback)`

```
bind(name, key, callback)
```

**Description**:  
Binds a function to a specific key for continuous holding (i.e., the action is performed as long as the key is held down).

**Parameters**:
- `name` (String): The name of the action.
- `key` (String): The key to bind the action to.
- `callback` (Function): The function that will be executed while the key is held down.

**Usage Example**:
```
control.bind('moveUp', 'ArrowUp', (obj) => {
    obj.move('up');
});
```

### `bindOnce(name, key, callback)`

```
bindOnce(name, key, callback)
```

**Description**:  
Binds a function to a specific key for one-time pressing (i.e., the action is performed only when the key is pressed once).

**Parameters**:
- `name` (String): The name of the action.
- `key` (String): The key to bind the action to.
- `callback` (Function): The function that will be executed upon key press.

**Usage Example**:
```
control.bindOnce('jump', 'Space', (obj) => {
    obj.jump();
});
```

### `bindRelease(name, key, callback)`

```
bindRelease(name, key, callback)
```

**Description**:  
Binds a function to a specific key, but the callback is triggered only after the key is released. The callback receives two parameters: the object and the duration the key was held down.

**Parameters**:
- `name` (String): The name of the action.
- `key` (String): The key to bind the action to.
- `callback` (Function): The function that will be executed after the key is released. The function receives two parameters:
  - `obj` (Object): The object associated with the action.
  - `duration` (Number): The number of frames the key was held down.

**Usage Example**:
```
control.bindRelease('sprint', 'Shift', (obj, duration) => {
    console.log(`Shift was held for ${duration} frames.`);
});
```

### `bindWithReleaseTick(name, key, callback)`

```
bindWithReleaseTick(name, key, callback)
```

**Description**:  
Binds a function to a key similarly to `bind()`, but unlike it, this method will also execute the callback one extra frame after the key is released. This can be useful for smoothing transitions, slow fading, or "soft release" controls.

**Parameters**:
- `name` (String): The name of the action.
- `key` (String): The key to bind the action to.
- `callback(obj, frames)` (Function): The function that will be executed repeatedly while the key is held down and one extra time after release.
  - `obj` is the controlled object.
  - `frames` is the number of frames the key has been held (even for the extra release tick).

**Usage Example**:
```
control.bindWithReleaseTick('moveDown', 'ArrowDown', (obj, frames) => {
    obj.move('down', frames);
});
```

### `captureBinding(name, type, callback)`

```
captureBinding(name, type, callback)
```

**Description**:  
Captures a key press, which will then be automatically assigned to the specified action. This is useful for dynamic key binding.

**Parameters**:
- `name` (String): The action name to bind to the key.
- `type` (String): The type of binding, either "hold", "once", or "release" to match the behavior of `bind`, `bindOnce`, or `bindRelease`.
- `callback` (Function): The function to be executed when the key is pressed or released, depending on the type.

**Usage Example**:
```
control.captureBinding('jump', 'once', (obj) => {
    obj.jump();
});
```

### `setBinding(name, type, key, callback)`

```javascript
setBinding(name, type, key, callback)
```

**Description**:  
Sets a binding for a specific action name (e.g., jump, moveUp). The `type` parameter determines whether the binding behaves like `bind`, `bindOnce`, `bindRelease`, or `bindWithReleaseTick`.

**Parameters**:
- `name` (String): The action name to bind.
- `type` (String): The type of binding. Valid values are:
    - `"hold"`: Behaves like `bind`.
    - `"once"`: Behaves like `bindOnce`.
    - `"release"`: Behaves like `bindRelease`.
    - `"releaseTick"`: Behaves like `bindWithReleaseTick`.
- `key` (String): The key to bind to the action.
- `callback` (Function): The function that will be executed when the key is pressed, held, or released, depending on the binding type.

**Usage Example**:
```javascript
control.setBinding('moveLeft', 'hold', 'ArrowLeft', (obj) => {
    obj.move('left');
});
```

### `updateBinding(name, newCallback)`

```javascript
updateBinding(name, newCallback)
```

**Description**:  
Updates the function assigned to an existing action. This allows changing the behavior of an action without changing the key binding.

**Parameters**:
- `name` (String): The action name.
- `newCallback` (Function): The new function that will be executed when the key is pressed or released, depending on the original binding type.

**Usage Example**:
```javascript
control.updateBinding('jump', (obj) => {
    obj.jumpHigher();
});
```

### `updateBindingKey(name, newKey)`

```
updateBindingKey(name, newKey)
```

**Description**:  
Changes the key assigned to an action. This allows dynamically updating key bindings.

**Parameters**:
- `name` (String): The action name.
- `newKey` (String): The new key to be assigned to the action.

**Usage Example**:
```
control.updateBindingKey('jump', 'Enter');
```

### `exportBindings()`

```
exportBindings()
```

**Description**:  
Returns an exported object containing all current key bindings, their types, and associated actions. This object can be saved for later use or sharing.

**Parameters**:  
None.

**Usage Example**:
```
const bindings = control.exportBindings();
console.log(bindings);
```

### `getBoundKey(name)`

```
getBoundKey(name)
```

**Description**:  
Returns the key currently assigned to a specific action. If no key is assigned, it returns `null`.

**Parameters**:
- `name` (String): The action name.

**Usage Example**:
```
const key = control.getBoundKey('jump');
console.log(key);  // Might return 'Space' if Space is bound to the jump action
```

### `pause()`

```
pause()
```

**Description**:  
Pauses all key bindings, preventing any actions from being triggered. This is useful for temporarily disabling controls, such as during a pause menu or cutscene.

**Parameters**:  
None.

**Usage Example**:
```
control.pause();  // Disables all key bindings
```

### `unpause()`

```
unpause()
```

**Description**:  
Resumes all key bindings, re-enabling actions that were previously paused.

**Parameters**:  
None.

**Usage Example**:
```
control.unpause();  // Re-enables all key bindings
```

## Conclusion

The `Control` class provides a highly flexible system for managing key bindings and assigning them to actions. With features like dynamic key assignment, key updating, and support for both one-time presses and long presses, this system is ideal for games or interactive applications that require advanced control over user input.
