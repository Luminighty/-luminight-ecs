import { ComponentPrototype, PrototypeKey } from "..";
import { IPrototypeParser } from "../parser";


type ComponentParser = (component: Element) => object
type AttributeParser = (value: string) => unknown

export class XmlPrototypeParser implements IPrototypeParser {
	private parser = new DOMParser()

	constructor(
		private componentParser: Record<string, ComponentParser> = {},
		private attributeParser: Record<string, Record<string, AttributeParser> | AttributeParser> = {},
	) {
	}
	
	parse(data: string): [PrototypeKey, ComponentPrototype[]] {
		const entityDoc = this.parser.parseFromString(data, "text/xml");
		const root = entityDoc.documentElement;
	
		const id = root.getAttribute("id")!;
		const components: ComponentPrototype[] = [];

		for (let i = 0; i < root.children.length; i++) {
			const component = root.children[i];
			let props = this.parseAttributes(component);
			if (this.componentParser[component.tagName])
				props = { ...props, ...this.componentParser[component.tagName](component) }
			components.push({
				typeId: component.tagName,
				props
			})
		}
		
		return [id, components]
	}

	private parseAttributes(component: Element): object {
		const props = {};
		for (let j = 0; j < component.attributes.length; j++) {
			const attribute = component.attributes[j]
			props[attribute.name] = this.parseAttribute(component.tagName, attribute.name, attribute.value);
		}
		return props;
	}

	private parseAttribute(tag: string, key: string, value: string): unknown {
		const parser = this.attributeParser[tag]?.[key] ?? this.attributeParser[key];
		if (parser)
			return parser(value);
	
		if (value.startsWith("0x"))
			return parseInt(value);
		
		if (value.toLowerCase() === "false")
			return false;
		if (value.toLowerCase() === "true")
			return true;
	
		const number = parseFloat(value);
		return isNaN(number) ? value : number;
	}
}