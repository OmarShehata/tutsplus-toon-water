var DepthVisualize = pc.createScript('depthVisualize');

// initialize code called once per entity
DepthVisualize.prototype.initialize = function() {
    this.entity.camera.camera.requestDepthMap();
    this.antiCacheCount = 0; // To prevent the engine from caching our shader so we can live-update it 
    
    this.SetupDepthViz();
};

DepthVisualize.prototype.SetupDepthViz = function(){
    var device = this.app.graphicsDevice;
    var chunks = pc.shaderChunks;
    
    this.fs = '';
    this.fs += 'varying vec2 vUv0;';
    this.fs += 'uniform sampler2D uDepthMap;';
    this.fs += '';
    this.fs += 'float unpackFloat(vec4 rgbaDepth) {';
    this.fs += '    const vec4 bitShift = vec4(1.0 / (256.0 * 256.0 * 256.0), 1.0 / (256.0 * 256.0), 1.0 / 256.0, 1.0);';
    this.fs += '    float depth = dot(rgbaDepth, bitShift);';
    this.fs += '    return depth;';
    this.fs += '}';
    this.fs += '';
    this.fs += 'void main(void) {';
    this.fs += '    float depth = unpackFloat(texture2D(uDepthMap, vUv0)) * 30.0; ';
    this.fs += '    gl_FragColor = vec4(vec3(depth),1.0);';
    this.fs += '}';
        
    this.shader = chunks.createShaderFromCode(device, chunks.fullscreenQuadVS, this.fs, "renderDepth" + this.antiCacheCount);
    this.antiCacheCount ++;
    
    // We manually create a draw call to render the depth map on top of everything 
    this.command = new pc.Command(pc.LAYER_FX, pc.BLEND_NONE, function () {
       pc.drawQuadWithShader(device, null, this.shader);
    }.bind(this));
    this.command.isDepthViz = true; // Just mark it so we can remove it later

    //this.app.scene.drawCalls.push(this.command);
};

// update code called every frame
DepthVisualize.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
DepthVisualize.prototype.swap = function(old) { 
    this.antiCacheCount = old.antiCacheCount;
    
    // Remove the depth viz draw call 
    for(var i=0;i<this.app.scene.drawCalls.length;i++){
        if(this.app.scene.drawCalls[i].isDepthViz){
            this.app.scene.drawCalls.splice(i,1);
            break;
        }
    } 
    // Recreate it 
    this.SetupDepthViz();
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/