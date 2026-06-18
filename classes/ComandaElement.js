export class ComandaElement {
  constructor(uploaded, orders) {
    this.date = new Date();
    this.file_enc = "";
    this.enc_key = "";
    this.uploaded = uploaded;
    this.manually_charged = false;
    this.orders = [...orders]; 
  }
  

  getRawDate() {
    return this.date;
  }
  
  getDate() {
    return this.date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  getTime() {
    return this.date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }
  
  getRoom() {
    return this.orders[0].getRoom();
  }

  getPrice() {
    let tot_price = 0;
    for (const element of this.orders) {
      tot_price += Number(element.getPrice() * element.getQuantity());
    }
    return tot_price;
  }

  getManuallyCharged() {
    return this.manually_charged;
  }

  getUploaded() {
    return this.uploaded;
  }

  getOrders() {
    return this.orders;
  }

  getOrdersNum() {
    return this.orders.length;
  }

  setUploaded(value) {
    this.uploaded = value;
  }

  setManuallyCharged(value) {
    this.manually_charged = value;
  }
}
