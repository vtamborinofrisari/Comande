export class EntryElement {
  constructor(text, price, quantity, room) {
    this.text = text;
    this.price = price;
    this.quantity = quantity;
    this.room = room;
  }
  
  addQuantity(qty_to_add) {
    this.quantity += qty_to_add;
    console.log(this.quantity);
  }
  
  getText() {
    return this.text;
  }

  getPrice() {
    return this.price;
  }

  getQuantity() {
    return this.quantity;
  }

  getRoom() {
    return this.room;
  }
}
