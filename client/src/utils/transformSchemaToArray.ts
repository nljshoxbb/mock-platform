interface SpecifiedFieldItem {
  /** 字段名 */
  name: string;
  /** 当前字段的路径 */
  key: string;
  /** table 组件所需 */
  dataIndex: string;
  /** 字段类型 */
  type: string;
  /** 字段描述 */
  description: string;
  /** 当前字段的路径 */
  path: string;
}

export const transformSchemaToArray = (
  schema: any,
  namePath = '',
  result: any[] = [],
  collection: any = {},
  /** 字段 自定义的数据 */
  specifiedField: (obj: SpecifiedFieldItem) => any = () => {}
) => {
  if (schema) {
    if (schema.type === 'object' && schema.properties) {
      Object.keys(schema.properties).map((i: any) => {
        const item = schema.properties[i];
        const path = namePath ? `${namePath}.${i}` : i;

        if (item) {
          const common = {
            name: i,
            path,
            key: path,
            dataIndex: path,
            type: item.type,
            description: item.description
          };

          const specifiedFieldRes = specifiedField(common) || {};

          if (item.type === 'object') {
            result.push({
              ...common,
              children: transformSchemaToArray(item, path, [], collection, specifiedField),
              ...specifiedFieldRes
            });
          } else if (item.type === 'array') {
            const itemsPath = namePath ? `${namePath}.${i}.items` : `items.${i}`;
            return result.push({
              ...common,
              ...specifiedFieldRes,
              children: [
                {
                  name: 'items',
                  key: itemsPath,
                  dataIndex: itemsPath,
                  type: item.type,
                  children: transformSchemaToArray(item.items, `${path}.items`, [], collection, specifiedField)
                }
              ]
            });
          } else {
            if (item.mock) {
              collection[path] = item.mock.value;
            }

            return result.push({
              ...common,
              default: item.default,
              ...specifiedFieldRes
            });
          }
        }
      });
    }
  }
  return result;
};
