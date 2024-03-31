export class SpriteComponent {
	sprite;

	constructor(world, {src}) {
		const renderer = world.getDependecy(Renderer);
		this.sprite = renderer.createSprite(src)
	}
}
