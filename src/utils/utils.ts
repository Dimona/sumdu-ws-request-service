export class Utils {
  static patchObject<T extends Record<string, any>>(
    object: Partial<T>,
    values: { [key in keyof T]: any },
    options?: Partial<{ ignoreUndefined: boolean; ignoreNull: boolean }>,
  ): void {
    const { ignoreUndefined = false, ignoreNull = false } = options || {};
    if (typeof object !== 'object' || typeof values !== 'object') {
      return;
    }
    Object.keys(values).forEach(key => {
      if (ignoreUndefined && values[key] === undefined) {
        return;
      }
      if (ignoreNull && values[key] === null) {
        return;
      }
      object[key as keyof T] = values[key];
    });
  }

  static getCurrentTimestamp() {
    return new Date().valueOf();
  }
}
