import { ComponentPrototype, PrototypeKey } from "..";
export { XmlPrototypeParser } from "./xmlParser";

export interface IPrototypeParser {
	parse(data: string): [PrototypeKey, ComponentPrototype[]]
}