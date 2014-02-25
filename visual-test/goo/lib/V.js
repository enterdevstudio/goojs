
define([
	'goo/entities/GooRunner',
	'goo/entities/World',
	'goo/renderer/Material',
	'goo/renderer/shaders/ShaderLib',
	'goo/renderer/Camera',
	'goo/shapes/Sphere',
	'goo/shapes/Box',
	'goo/entities/components/CameraComponent',
	'goo/scripts/OrbitCamControlScript',
	'goo/entities/components/ScriptComponent',
	'goo/math/Vector3',
	'goo/renderer/light/PointLight'
], function (
	GooRunner,
	World,
	Material,
	ShaderLib,
	Camera,
	Sphere,
	Box,
	CameraComponent,
	OrbitCamControlScript,
	ScriptComponent,
	Vector3,
	PointLight
	) {
	'use strict';

	var V = {};

	V.toVector3 = function (obj, def) {
		if (Array.isArray(obj)) {
			return new Vector3(obj);
		} else if (obj instanceof Vector3) {
			return obj;
		} else if (obj && (typeof obj.x === 'number') && (typeof obj.y === 'number') && (typeof obj.z === 'number')) {
			return new Vector3(obj.x, obj.y, obj.z);
		} else {
			return def;
		}
	};

	V.addOrbitCamera = function (spherical, lookAt, dragButton) {
		spherical = V.toVector3(spherical, new Vector3(20, Math.PI / 2, 0));
		lookAt = V.toVector3(lookAt, new Vector3(0, 0, 0));

		var camera = new Camera();
		var orbitScript = new OrbitCamControlScript({
			domElement : V.goo.renderer.domElement,
			spherical : spherical,
			demoMode: true,
			moveInterval: 4000,
			moveInitialDelay: 200,
			lookAtPoint: lookAt,
			drag: 5.0,
			releaseVelocity: true,
			interpolationSpeed: 7,
			dragButton: typeof dragButton === 'number' ? dragButton : -1
		});

		var cameraEntity = V.goo.world.createEntity(camera, [0, 0, 3], orbitScript, 'CameraEntity').addToWorld();

		return cameraEntity;
	};

	function getRandomColor() {
		var angle = Math.random() * Math.PI * 2;
		var color = [
			angle,
			angle + Math.PI * 2 / 3,
			angle + Math.PI * 4 / 3
		].map(function (v) { return Math.sin(v) / 2 + 0.5; });
		color.push(1);

		return color;
	}

	V.getColoredMaterial = function (r, g, b, a) {
		var material = new Material(ShaderLib.simpleLit);
		if (arguments.length === 0) {
			//material.materialState.diffuse = getRandomColor();
			material.uniforms.materialDiffuse = getRandomColor();
		} else {
			//material.materialState.diffuse = [r, g, b, a || 1];
			material.uniforms.materialDiffuse = [r, g, b, a || 1];
		}
		return material;
	};

	V.addColoredShapes = function(nShapes, meshData, rotation) {
		nShapes = nShapes || 15;
		rotation = rotation || [0, 0, 0];

		for (var i = 0; i < nShapes; i++) {
			for (var j = 0; j < nShapes; j++) {
				var sphereMaterial = Material.createMaterial(ShaderLib.simpleColored, 'ShapeMaterial' + i + '_' + j);
				sphereMaterial.uniforms.color = [i / nShapes, j / nShapes, 0.3];
				V.goo.world.createEntity(meshData, sphereMaterial, [i - nShapes/2, j - nShapes/2, 0]).setRotation(rotation).addToWorld();
			}
		}
	};

	V.addColoredSpheres = function(nSpheres) {
		V.addColoredShapes(nSpheres, new Sphere(32, 32));
	};

	V.addColoredBoxes = function(nBoxes) {
		V.addColoredShapes(nBoxes, new Box(0.9, 0.9, 0.9), [Math.PI / 2, Math.PI / 4, Math.PI / 8]);
	};

	V.addLights = function () {
		var world = V.goo.world;
		world.createEntity(new PointLight(), [100, 100, 100]).addToWorld();
		world.createEntity(new PointLight(), [-100, -100, -100]).addToWorld();
	};

	V.showNormals = function (entity) {
		var normalsMeshData = entity.meshDataComponent.meshData.getNormalsMeshData();
		var normalsMaterial = Material.createMaterial(ShaderLib.simpleColored, '');
		normalsMaterial.uniforms.color = [0.2, 1.0, 0.6];
		var normalsEntity = V.goo.world.createEntity(normalsMeshData, normalsMaterial);
		normalsEntity.transformComponent.transform = entity.transformComponent.transform;
		normalsEntity.addToWorld();
		return normalsEntity;
	};

	V.initGoo = function (_options) {
		var options = { showStats: true, logo: 'bottomleft' };
		if (_options && _options.logo) {
			options.logo = _options.logo;
		}

		V.goo = new GooRunner(options);
		V.goo.renderer.domElement.id = 'goo';
		document.body.appendChild(V.goo.renderer.domElement);
		return V.goo;
	};

	return V;
});
