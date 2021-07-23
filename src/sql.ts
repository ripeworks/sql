import { getClient } from "./client";

class Query {
  strings: string[];
  values: any[];

  constructor(strings: string[], values: any[]) {
    this.strings = strings;
    this.values = values;
  }

  get query() {
    return this.sql;
  }

  get text() {
    return this.strings.reduce((prev, curr, i) => prev + "$" + i + curr);
  }

  get sql() {
    return this.strings.join("?");
  }

  append(statement: Query | string) {
    if (statement instanceof Query) {
      this.strings = [...this.strings, ...statement.strings];
      this.values = [...this.values, ...statement.values];
    } else {
      this.strings = [...this.strings, statement];
    }

    return this;
  }

  async first() {
    const rows = await this.then();

    if (rows && rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  }

  async then() {
    const client = getClient();
    await client.connect();
    const result = await client.query(this);
    await client.clean();
    return result;
  }
}

export function sql(strings: string[], ...values: any) {
  return new Query(strings, values);
}
