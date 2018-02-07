var Buoyancy = pc.createScript('buoyancy');

// initialize code called once per entity
Buoyancy.prototype.initialize = function() {
    this.initialPosition = this.entity.getPosition().clone();
    this.initialRotation = this.entity.getEulerAngles().clone();
    this.time = Math.random() * 2 * Math.PI;
};

// update code called every frame
Buoyancy.prototype.update = function(dt) {
    this.time += 0.1;
    
    // Move the object up and down 
    var pos = this.entity.getPosition().clone();
    pos.y = this.initialPosition.y + Math.cos(this.time) * 0.07;
    this.entity.setPosition(pos.x,pos.y,pos.z);
    
    // Rotate the object slightly 
    var rot = this.entity.getEulerAngles().clone();
    rot.x = this.initialRotation.x + Math.cos(this.time * 0.25) * 1;
    rot.z = this.initialRotation.z + Math.sin(this.time * 0.5) * 2;
    this.entity.setLocalEulerAngles(rot.x,rot.y,rot.z);
};

// swap method called for script hot-reloading
// inherit your script state here
// Buoyancy.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/