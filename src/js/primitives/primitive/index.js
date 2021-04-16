import { mat4, vec3 } from 'gl-matrix';
import vertexSource from './shaders/vertex.glsl';
import fragmentSource from './shaders/fragment.glsl';
import { hexToRgb } from '../../helpers';
import GLProgram from '../../standard/gl-program';
import Transform from '../../standard/transform';
import HierarchyNode from '../../standard/hierarchy/node';

export default class Primitive extends GLProgram {
	constructor(
		gl,
		name,
		{
			enableLighting = true,
			enableSpecular = false,
			specularStrength = 80,
		} = {}
	) {
		super(gl);

		this.enableLighting = enableLighting;
		this.enableSpecular = enableSpecular;
		this.specularStrength = specularStrength;

		this.node = new HierarchyNode(name, this, false, null, true);

		this.transform = new Transform();
	}

	createProgram(_vertexSource, _fragmentSource) {
		if (_vertexSource || _fragmentSource) {
			super.createProgram(_vertexSource, _fragmentSource);
			return;
		}

		super.createProgram(vertexSource, fragmentSource);
	}

	setupAttributes() {
		super.setupAttributes();

		this.buffers.position = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);

		this.attributes.position = this.gl.getAttribLocation(
			this.program,
			'aPosition'
		);

		this.gl.vertexAttribPointer(
			this.attributes.position,
			3,
			this.gl.FLOAT,
			false,
			0,
			0
		);
		this.gl.enableVertexAttribArray(this.attributes.position);

		this.buffers.color = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);

		this.attributes.color = this.gl.getAttribLocation(this.program, 'aColor');

		this.gl.vertexAttribPointer(
			this.attributes.color,
			3,
			this.gl.FLOAT,
			false,
			0,
			0
		);

		this.gl.enableVertexAttribArray(this.attributes.color);

		this.buffers.normal = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.normal);

		this.attributes.normal = this.gl.getAttribLocation(this.program, 'aNormal');

		this.gl.vertexAttribPointer(
			this.attributes.normal,
			3,
			this.gl.FLOAT,
			false,
			0,
			0
		);
		this.gl.enableVertexAttribArray(this.attributes.normal);
	}

	setupUniforms() {
		super.setupUniforms();

		this.uniforms.worldViewProjection = this.gl.getUniformLocation(
			this.program,
			'uWorldViewProjection'
		);

		this.uniforms.viewWorldPosition = this.gl.getUniformLocation(
			this.program,
			'uViewWorldPosition'
		);

		this.uniforms.world = this.gl.getUniformLocation(this.program, 'uWorld');
		this.uniforms.worldInverseTranspose = this.gl.getUniformLocation(
			this.program,
			'uWorldInverseTranspose'
		);

		this.uniforms.directionalLight = this.gl.getUniformLocation(
			this.program,
			'uDirectionalLight'
		);

		this.uniforms.directionalLightNumber = this.gl.getUniformLocation(
			this.program,
			'uDirectionalLightNumber'
		);

		this.uniforms.shadeColor = this.gl.getUniformLocation(
			this.program,
			'uShadeColor'
		);

		this.uniforms.pointLight = this.gl.getUniformLocation(
			this.program,
			'uPointLight'
		);

		this.uniforms.pointLightNumber = this.gl.getUniformLocation(
			this.program,
			'uPointLightNumber'
		);

		this.uniforms.enableLighting = this.gl.getUniformLocation(
			this.program,
			'uEnableLighting'
		);

		this.uniforms.enableSpecular = this.gl.getUniformLocation(
			this.program,
			'uEnableSpecular'
		);

		this.uniforms.specularStrength = this.gl.getUniformLocation(
			this.program,
			'uSpecularStrength'
		);

		this.gl.uniform3f(
			this.uniforms.shadeColor,
			...vec3.scale(vec3.create(), hexToRgb('#666666').vec3, 0.05)
		);

		this.gl.uniform1f(this.uniforms.enableSpecular, this.enableSpecular);
		this.gl.uniform1f(this.uniforms.specularStrength, this.specularStrength);
		this.gl.uniform1f(this.uniforms.enableLighting, this.enableLighting);

		this.updateMatrix();
	}

	setupDirectionalLight(lightSources) {
		if (!lightSources || !lightSources.length) {
			return;
		}

		this.gl.useProgram(this.program);
		this.gl.bindVertexArray(this.vao);
		this.gl.uniformMatrix3fv(
			this.uniforms.directionalLight,
			false,
			new Float32Array(lightSources.map((l) => l.toMat3Array()).flat()),
			0,
			lightSources.length * 3 * 3
		);
		this.gl.uniform1ui(
			this.uniforms.directionalLightNumber,
			lightSources.length
		);
	}

	setupPointLight(lightSources) {
		if (!lightSources || !lightSources.length) {
			return;
		}

		this.gl.useProgram(this.program);
		this.gl.bindVertexArray(this.vao);
		this.gl.uniformMatrix3fv(
			this.uniforms.pointLight,
			false,
			new Float32Array(lightSources.map((l) => l.toMat3Array()).flat()),
			0,
			lightSources.length * 3 * 3
		);
		this.gl.uniform1ui(this.uniforms.pointLightNumber, lightSources.length);
	}

	updateMatrix() {
		const world = this.updateWorldMatrix();

		const uWorldViewProjection = this.transform.getWorldViewProjection(world);

		this.gl.useProgram(this.program);
		this.gl.bindVertexArray(this.vao);

		this.gl.uniformMatrix4fv(
			this.uniforms.worldViewProjection,
			false,
			uWorldViewProjection
		);

		return uWorldViewProjection;
	}

	updateWorldMatrix() {
		const uWorld = this.transform.getWorld(this.node);

		this.gl.useProgram(this.program);
		this.gl.bindVertexArray(this.vao);

		this.gl.uniformMatrix4fv(this.uniforms.world, false, uWorld);
		this.gl.uniformMatrix4fv(
			this.uniforms.worldInverseTranspose,
			false,
			mat4.transpose(mat4.create(), mat4.invert(mat4.create(), uWorld))
		);
		this.gl.uniform3f(
			this.uniforms.viewWorldPosition,
			...window.global.camera.vPosition
		);

		return uWorld;
	}
}
