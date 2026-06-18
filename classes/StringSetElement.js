export class StringSetElement {
  constructor(text, price,  values = []) {
    this.text = text;
    this.price = price;
    this.values = new Set(values);
  }

  addValue(value) {
    this.values.add(value);
  }

  removeValue(value) {
    this.values.delete(value);
  }

  hasValue(value) {
    return this.values.has(value);
  }

  getText() {
    return this.text;
  }

  getPrice() {
    return this.price;
  }

  getValues() {
    return [...this.values];
  }
}
