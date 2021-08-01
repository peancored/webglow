import Box from '../../geometry/box';
import Cone from '../../geometry/cone';
import Cylinder from '../../geometry/cylinder';
import Plane from '../../geometry/plane';
import Sphere from '../../geometry/sphere';
import Geometry from '../../standard/geometry';
import Model from '../model';
import File from '../project-hierarchy/file';
import { PoolItem } from './types';

export default class GeometryPool {
	pool: PoolItem[] = [
		{
			id: 'Box',
			geometry: new Box({ size: [1, 1, 1] }),
		},
		{
			id: 'Cone',
			geometry: new Cone({
				segments: 30,
				radius: 1,
				height: 2,
			}),
		},
		{
			id: 'Plane',
			geometry: new Plane({
				width: 50,
				length: 50,
				widthSegments: 1,
				lengthSegments: 1,
			}),
		},
		{
			id: 'Sphere',
			geometry: new Sphere({
				widthSegments: 30,
				heightSegments: 30,
				radius: 1,
			}),
		},
		{
			id: 'Cylinder',
			geometry: new Cylinder({
				segments: 30,
				radius: 1,
				height: 2,
			}),
		},
	];

	geometryFromFile(file: File) {
		const geometries = Model.fromJSON(JSON.parse(file.content)).generate();

		geometries.forEach((geometry) => {
			this.pool.push({
				geometry,
				fileId: file.id,
				id: geometry.id,
			});
		});
	}

	get(id: string) {
		return this.pool.find((item) => item.id === id)?.geometry;
	}

	getByFileId(id: string) {
		return this.pool
			.filter((item) => item.fileId === id)
			.map((item) => item.geometry);
	}
}
