import debug from 'debug';
import { Project, Node } from 'ts-morph';
const log = debug('ast');

interface DataType {
  /** type name */
  name: string;
  /** type description */
  jsDoc: string;
  /** interface define or not */
  interface?: boolean;
  properties: PropertyType[];
}

interface PropertyType {
  /** type property key */
  key: string;
  value: string;
  /** when typeReference is true, the properties has value  */
  properties: PropertyType[];
  jsDoc: string;
  /** the type is reference or not */
  typeReference: boolean;
}

export const ts2treeTable = (code: string) => {
  const project = new Project();
  const sourceFile = project.createSourceFile('temp.ts', code);
  const result: DataType[] = [];

  /**
   * get type info
   */
  const TypeAliasDeclarations = sourceFile.getTypeAliases();
  TypeAliasDeclarations.forEach(typleAlias => {
    result.push({
      name: typleAlias.getName(),
      jsDoc: typleAlias.getJsDocs().map(jsDoc => jsDoc.getInnerText().trim())[0],
      properties: [
        {
          key: typleAlias.getName(),
          value: typleAlias.getTypeNodeOrThrow().getText(),
          properties: [],
          jsDoc: typleAlias.getJsDocs().map(jsDoc => jsDoc.getInnerText().trim())[0],
          typeReference: typleAlias.getTypeNodeOrThrow().getKindName() === 'TypeReference',
        },
      ],
    });
  });

  /**
   * get interface info
   */
  const interfaceDeclarations = sourceFile.getInterfaces();
  interfaceDeclarations.forEach(interfaceDeclaration => {
    result.push({
      name: interfaceDeclaration.getName(),
      jsDoc: interfaceDeclaration.getJsDocs().map(jsDoc => jsDoc.getInnerText().trim())[0],
      interface: true,
      properties: interfaceDeclaration.getProperties().map(property => {
        const propNode = property.getTypeNode();

        const tempValue = property.getTypeNodeOrThrow().getText();
        let tempProperties: PropertyType[] = [];
        if (Node.isTypeLiteral(propNode)) {
          tempProperties = propNode.getProperties().map(prop => ({
            key: prop.getName(),
            value: prop.getTypeNodeOrThrow().getText(),
            properties: [],
            jsDoc: prop.getJsDocs().map(jsDoc => jsDoc.getInnerText().trim())[0],
            typeReference: true,
          }));
        }

        return {
          key: property.getName(),
          value: tempValue,
          properties: tempProperties,
          jsDoc: property.getJsDocs().map(jsDoc => jsDoc.getInnerText().trim())[0],
          typeReference: Node.isTypeReference(propNode),
        };
      }),
    });
  });

  return replaceTypeReference(result);
};

/**
 * replace depth is 0, typeReference
 * @param dataTypes
 * @returns
 */
const replaceTypeReference = (dataTypes: DataType[]) => {
  for (const dataType of dataTypes) {
    for (const property of dataType.properties) {
      if (property.typeReference) {
        const findDataType = dataTypes.find(d => d.name === property.value);
        property.properties = findDataType?.properties ?? [];
      }
    }
  }
  return dataTypes;
};
