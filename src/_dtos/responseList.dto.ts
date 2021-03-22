export class ResponseListDTO<T> {
  count: number;
  data: T[];

  constructor(data: T[]) {
    let index = 1;
    this.count = data.length;
    this.data = data.map((d) => {
      return {
        index: index++,
        ...d,
      };
    });
  }
}
export class ResponseSingleDTO<T> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}
