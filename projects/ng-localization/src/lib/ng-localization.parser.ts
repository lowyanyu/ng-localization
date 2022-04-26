import { Injectable } from '@angular/core';

export abstract class LocalizationParser {

  abstract interpolate(expr: string, params?: any): string;
  abstract getValue(target: any, key: string): any;
}

@Injectable()
export class LocalizationDefaultParser extends LocalizationParser {
  templateMatcher: RegExp = /{{\s?([^{}\s]*)\s?}}/g;

  public interpolate(expr: string, params?: any): string {
    let result: string;

    if (typeof expr === 'string') {
      result = this.interpolateString(expr, params);
    } else {
      result = expr as string;
    }

    return result;
  }

  getValue(target: any, key: string): any {
    const keys = key.split('.');
    key = '';
    do {
      key += keys.shift();
      if ( (target !== undefined) && (target[key] !== undefined) && (typeof target[key] === 'object' || !keys.length)) {
        target = target[key];
        key = '';
      } else if (!keys.length) {
        target = undefined;
      } else {
        key += '.';
      }
    } while (keys.length);

    return target;
  }

  private interpolateString(expr: string, params?: any) {
    if (!params) {
      return expr;
    }

    return expr.replace(this.templateMatcher, (substring: string, b: string) => {
      const r = this.getValue(params, b);
      return (r !== undefined) ? r : substring;
    });
  }
}
