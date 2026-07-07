// SPDX-License-Identifier: AGPL-3.0-only 
import * as loader from "/js/loader.js";
import { StringSetElement } from '/classes/StringSetElement.js';
import { EntryElement } from '/classes/EntryElement.js';
import { ComandaElement } from '/classes/ComandaElement.js';
export const hash_sets = new Map();
export const items = [];
export const filters = new Set([]);
export const results_hashed = [];
export const results_searched = [];
export const rooms_list = [ '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135' ];

const accepted_codes_0 = new Set([ '123', '456', '789' ]);  // Operator's passwords; !!!password hash, recommended instead of clear text!!!
const accepted_codes_1 = new Set([ '234' ]);  // Manager's password; !!!password hash recommended, instead of clear text!!!

export const order = [];

let order_entries = []; // list of orders that compose the currently work-in-progress comanda
let queue_comande = []; // queue of comande that failed to be sent to the server and are retained for future sending or manual entry fallback

const input = document.getElementById("search-input");
input.addEventListener("input", function() {
  search_filter();
  refresh();
});

const x_button = document.getElementById("top_order_x_button");
x_button.addEventListener("click", function() {
  const m_container = document.getElementById('main-container');
  const o_container = document.getElementById('overlay');
  m_container.classList.remove("blurred");
  o_container.classList.remove("active");
});

const less_button = document.getElementById("qty_button_less");  // action of the - button on the popup
less_button.addEventListener("click", function() {
  const qty_popup = document.getElementById('qty_var');
  if (qty_popup.quantity > 1) {
    qty_popup.quantity--;
    if (qty_popup.quantity === 1) {
      less_button.classList.toggle("active");
    }
    if (qty_popup.quantity === 11) {
      more_button.classList.toggle("active");
    }
    qty_popup.textContent = qty_popup.quantity;
    refresh_price();
  } 
});

const more_button = document.getElementById("qty_button_more");  // action of the + button on the popup
more_button.addEventListener("click", function() {
  const qty_popup = document.getElementById('qty_var');
  if (qty_popup.quantity < 12) {
    qty_popup.quantity++;
    if (qty_popup.quantity === 2) {
      less_button.classList.toggle("active");
    }
    if (qty_popup.quantity === 12) {
      more_button.classList.toggle("active");
    }
    qty_popup.textContent = qty_popup.quantity;
    refresh_price();
  } 
});

const add_button = document.getElementById("bottom_order_add_button"); // action of the ADD button on the popup
add_button.addEventListener("click", function() {
  const m_container = document.getElementById("main-container");
  const o_container = document.getElementById("overlay");
  const title_popup = document.getElementById('title_popup');
  const qty_popup = document.getElementById("qty_var");
  const tot_popup = document.getElementById("tot");
  var entry_is_in_array = false;

  if (isCartHealthy()) {
    for (const element of order_entries) {
      if (element.getText() === title_popup.textContent) {
        entry_is_in_array = true;
        element.addQuantity(qty_popup.quantity);
        console.log(element.getQuantity());
      }
    }
    if (!entry_is_in_array) {
      const entry = new EntryElement(title_popup.textContent, tot_popup.price, qty_popup.quantity, getRoomBold());
      order_entries.push(entry);
      console.log(order_entries);
    }
    handleCartWIP();
    m_container.classList.remove("blurred");
    o_container.classList.remove("active");    
  } else {
    createAlertInfo("Can't add item! Checkout Cart");
    o_container.classList.remove("active"); 
  }
});

export const o_picker = document.getElementById("picker");

const del_button = document.getElementById("del-button");
del_button.addEventListener("click", function() {
  input.value = "";
  search_filter();
  refresh();
});

const cart_overlay = document.createElement("div");  // creating cart popup
cart_overlay.classList.add("overlay_2-style");
const cart_popup = document.createElement("div");
cart_popup.classList.add("popup_2-style");
const top_cart_popup = document.createElement("div");
top_cart_popup.classList.add("top_cart_popup-style");
const top_spacer_cart = document.createElement("div");
top_spacer_cart.classList.add("top_cart_spacer-style");
const top_title_cart = document.createElement("div");
top_title_cart.classList.add("title_cart_popup-style");
const top_title_room_cart = document.createElement("div");
top_title_room_cart.classList.add("top_cart_room-style");
top_title_room_cart.textContent = "CART";
const top_title_spacer_cart = document.createElement("div");
top_title_spacer_cart.classList.add("top_title_spacer-style");
const top_title_number_cart = document.createElement("div");
top_title_number_cart.classList.add("top_cart_number-style");
top_title_number_cart.textContent = "EMPTY";
const top_cart_x_button = document.createElement("button");
top_cart_x_button.addEventListener("click", function() {
  quit_cart();
})
top_cart_x_button.classList.add("top_order_x_button-style");
const x_button_icon = document.createElement("img");
x_button_icon.src = "./assets/cross-mark-svgrepo-com.svg";
x_button_icon.alt = "icon";
x_button_icon.classList.add("x_button-style");
const center_cart_popup = document.createElement("div");
center_cart_popup.classList.add("center_cart_popup-style");
const center_cart_left_popup = document.createElement("div");
center_cart_left_popup.classList.add("center_left_popup-style");
const center_cart_right_popup = document.createElement("div");
center_cart_right_popup.classList.add("center_right_popup-style");
const controls_canvas_div = document.createElement("div");
controls_canvas_div.classList.add("controls_canvas-style");
const center_right_spacer_div = document.createElement("div");
center_right_spacer_div.classList.add("center_right_spacer-style");
const clear_canvas_btn = document.createElement("button");
clear_canvas_btn.id = "clearBtn";
clear_canvas_btn.classList.add("clearBtn-style");
const img_button_icon = document.createElement("img");
img_button_icon.classList.add("eraser_icon-style");
img_button_icon.src = "./assets/eraser-svgrepo-com.svg";
img_button_icon.alt = "icon";
clear_canvas_btn.appendChild(img_button_icon);
const canvas_container = document.createElement("div");
canvas_container.classList.add("canvas_container-style");
canvas_container.id = "canvasContainer";
const canvas_cart = document.createElement("canvas");
canvas_cart.classList.add("canvas_cart-style");
canvas_cart.id = "drawingCanvas";
canvas_cart.width = 450;
canvas_cart.height = 200;

const ctx = canvas_cart.getContext('2d');

let isDrawing = false;   // Are we currently drawing?
let lastX = 0;           // Last known X position
let lastY = 0;           // Last known Y position

function drawLine(x1, y1, x2, y2) {
    console.log(x1, y1, x2, y2);
    ctx.beginPath();                        // Start a new path
    ctx.moveTo(x1, y1);                     // Move pen to start point
    ctx.lineTo(x2, y2);                     // Create line to end point
    ctx.stroke();                           // Actually render the line
}
 
function handleMouseDown(e) {
    isDrawing = true;
    // Get mouse position relative to canvas
    lastX = e.offsetX;
    lastY = e.offsetY;
    console.log(lastX, lastY);
}

function handleMouseMove(e) {
    if (!isDrawing) return;               // Only draw if mouse is held down
 
    const currentX = e.offsetX;
    const currentY = e.offsetY;
 
    // Set line style BEFORE drawing
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;// Line thickness
    ctx.lineCap = 'round';             // Rounded line ends
    ctx.lineJoin = 'round';              // Smooth joins between segments
 
    // Draw a line from the last point to the current point
    drawLine(lastX, lastY, currentX, currentY);
 
    // Update last position
    lastX = currentX;
    lastY = currentY;
}

function handleMouseUp() {
    isDrawing = false;
}

canvas_cart.addEventListener('mousedown', handleMouseDown);
canvas_cart.addEventListener('mousemove', handleMouseMove);
canvas_cart.addEventListener('mouseup', handleMouseUp);
canvas_cart.addEventListener('mouseleave', handleMouseUp);   // Stop if cursor leaves

function clear_canvas() {  // clear canvas from all strokes
    ctx.clearRect(0, 0, canvas_cart.width, canvas_cart.height);
}

clear_canvas_btn.addEventListener('click', function() {
    clear_canvas();
});


canvas_container.appendChild(canvas_cart);
controls_canvas_div.appendChild(clear_canvas_btn);
center_cart_right_popup.appendChild(controls_canvas_div);
center_cart_right_popup.appendChild(center_right_spacer_div);
center_cart_right_popup.appendChild(canvas_container);
center_cart_popup.appendChild(center_cart_left_popup);
center_cart_popup.appendChild(center_cart_right_popup);
const bottom_cart_popup = document.createElement("div");
bottom_cart_popup.classList.add("bottom_cart_popup-style");
const bottom_cart_popup_div_1 = document.createElement("div");
bottom_cart_popup_div_1.classList.add("bottom_cart_popup_div-style");
const bottom_cart_popup_div_2 = document.createElement("div");
bottom_cart_popup_div_2.classList.add("bottom_cart_popup_div-style");
const bottom_cart_popup_button_delete_cart = document.createElement("button");
const bottom_cart_popup_button_confirm_cart = document.createElement("button");
bottom_cart_popup_button_delete_cart.classList.add("bottom_cart_send_button-style");
bottom_cart_popup_button_confirm_cart.classList.add("bottom_cart_send_button-style");
bottom_cart_popup_button_delete_cart.textContent = "DELETE";
bottom_cart_popup_button_confirm_cart.textContent = "CONFIRM";
bottom_cart_popup_button_delete_cart.addEventListener("click", function() {
  createAlertCartDelete();
})
bottom_cart_popup_button_confirm_cart.addEventListener("click", function() { // da modificare
  if (order_entries.length > 0) {
    createKeyPad(0).then((access_granted) => {
      if (access_granted) {

      const random_boolean = Math.random() < 0.5; // this should be the result of the fetch("yourserver.com") code. You should insert your communication code at this point of the program
      
      queue_comande.push(new ComandaElement(random_boolean, order_entries));
      console.log(queue_comande);
      order_entries.length = 0;
      handleCartWIP();
      updateChecklistNotification();
      quit_cart();
      }
    })
  }
})
bottom_cart_popup_div_1.appendChild(bottom_cart_popup_button_delete_cart);
bottom_cart_popup_div_2.appendChild(bottom_cart_popup_button_confirm_cart);
top_cart_popup.appendChild(top_spacer_cart);
top_title_cart.appendChild(top_title_room_cart);
top_title_cart.appendChild(top_title_spacer_cart);
top_title_cart.appendChild(top_title_number_cart);
top_cart_popup.appendChild(top_title_cart);
top_cart_x_button.appendChild(x_button_icon);
top_cart_popup.appendChild(top_cart_x_button);
cart_popup.appendChild(top_cart_popup);
cart_popup.appendChild(center_cart_popup);
bottom_cart_popup.appendChild(bottom_cart_popup_div_1);
bottom_cart_popup.appendChild(bottom_cart_popup_div_2);
cart_popup.appendChild(bottom_cart_popup);
cart_overlay.appendChild(cart_popup);
document.body.appendChild(cart_overlay);

const queue_button = document.getElementById("checklist_icon_button");
queue_button.addEventListener("click", function() {
  const m_container = document.getElementById("main-container");
  m_container.classList.add("blurred");
  if (queue_comande.length === 0) {
    createAlertInfo("Nothing in queue. All right!");
  } else {
    truncate_queue_comande();
    createAlertQueue();
  }
})

const cart_icon_div = document.getElementById("shopping_bag_icon_button");
cart_icon_div.addEventListener("click", function() {
  const m_container = document.getElementById('main-container'); // closing order popup window
  m_container.classList.add("blurred");
  cart_overlay.classList.add("active");
})

function createAlertInfo(infoText) {
  const overlay = document.getElementById("overlay_3");
  overlay.classList.add("active");
  const alert = document.createElement("div");
  alert.classList.add("popup_3-style");
  const alert_text_div = document.createElement("div");
  alert_text_div.textContent = infoText;
  alert_text_div.classList.add("alert_text_div-style");
  const alert_button_div = document.createElement("div");
  alert_button_div.classList.add("alert_button_div-style");
  const button = document.createElement("button");
  button.textContent = "OK";
  button.classList.add("button_alert-style");
  button.addEventListener("click", function() {
    const m_container = document.getElementById("main-container");
    m_container.classList.remove("blurred");
    overlay.classList.remove("active");
    overlay.replaceChildren();
  })

  alert.appendChild(alert_text_div);
  alert_button_div.appendChild(button);
  alert.appendChild(alert_button_div);
  overlay.appendChild(alert);
}

function createAlertCartDelete() {
  const overlay = document.getElementById("overlay_3");
  overlay.classList.add("active");
  const alert = document.createElement("div");
  alert.classList.add("popup_3-style");
  const alert_top_div = document.createElement("div");
  alert_top_div.classList.add("alert_top_div-style");
  const alert_top_spacer_div = document.createElement("div");
  alert_top_spacer_div.classList.add("top_cart_spacer-style");
  const alert_title_popup_div = document.createElement("div");
  alert_title_popup_div.classList.add("alert_title-style");
  const top_x_button = document.createElement("button");
  top_x_button.classList.add("top_order_x_button-style");
  const alert_text_div = document.createElement("div");
  alert_text_div.textContent = "Deleting ALL entries. Are you sure?";
  alert_text_div.classList.add("alert_text_div-style");
  const alert_button_div = document.createElement("div");
  alert_button_div.classList.add("alert_button_div-style");
  const x_button_img = document.createElement("img");
  x_button_img.classList.add("x_button-style");
  x_button_img.src = "/assets/cross-mark-svgrepo-com.svg";
  x_button_img.alt = "icon";
  const button_del = document.createElement("button");
  button_del.textContent = "DEL";
  button_del.classList.add("button_alert-style");
  top_x_button.addEventListener("click", function() {
    cart_overlay.classList.remove("blurred");
    overlay.classList.remove("active");
    overlay.replaceChildren();
  })
  button_del.addEventListener("click", function() {
    order_entries.length = 0;
    handleCartWIP();
    quit_cart();

    cart_overlay.classList.remove("blurred");
    overlay.classList.remove("active");
    overlay.replaceChildren();
  })

  alert_top_div.appendChild(alert_top_spacer_div);
  alert_top_div.appendChild(alert_title_popup_div);
  top_x_button.appendChild(x_button_img);
  alert_top_div.appendChild(top_x_button);
  alert.appendChild(alert_top_div);
  alert.appendChild(alert_text_div);
  alert_button_div.appendChild(button_del);
  alert.appendChild(alert_button_div);
  overlay.appendChild(alert);
}

function createAlertEntryDel(entry_to_delete) {
  const overlay = document.getElementById("overlay_3");
  overlay.classList.add("active");
  const alert = document.createElement("div");
  alert.classList.add("popup_3-style");
  const alert_top_div = document.createElement("div");
  alert_top_div.classList.add("alert_top_div-style");
  const alert_top_spacer_div = document.createElement("div");
  alert_top_spacer_div.classList.add("top_cart_spacer-style");
  const alert_title_popup_div = document.createElement("div");
  alert_title_popup_div.classList.add("alert_title-style");
  alert_title_popup_div.textContent = entry_to_delete.getText();
  const top_x_button = document.createElement("button");
  top_x_button.classList.add("top_order_x_button-style");
  const alert_text_div = document.createElement("div");
  alert_text_div.textContent = "Deleting entry. Are you sure?";
  alert_text_div.classList.add("alert_text_div-style");
  const alert_button_div = document.createElement("div");
  alert_button_div.classList.add("alert_button_div-style");
  const x_button_img = document.createElement("img");
  x_button_img.classList.add("x_button-style");
  x_button_img.src = "/assets/cross-mark-svgrepo-com.svg";
  x_button_img.alt = "icon";
  const button_del = document.createElement("button");
  button_del.textContent = "DEL";
  button_del.classList.add("button_alert-style");
  top_x_button.addEventListener("click", function() {
    cart_overlay.classList.remove("blurred");
    overlay.classList.remove("active");
    overlay.replaceChildren();
  })
  button_del.addEventListener("click", function() {
    order_entries = order_entries.filter(x => x.getText() !== entry_to_delete.getText());
    handleCartWIP();
    cart_overlay.classList.remove("blurred");
    overlay.classList.remove("active");
    overlay.replaceChildren();
  })

  alert_top_div.appendChild(alert_top_spacer_div);
  alert_top_div.appendChild(alert_title_popup_div);
  top_x_button.appendChild(x_button_img);
  alert_top_div.appendChild(top_x_button);
  alert.appendChild(alert_top_div);
  alert.appendChild(alert_text_div);
  alert_button_div.appendChild(button_del);
  alert.appendChild(alert_button_div);
  overlay.appendChild(alert);
}

function createKeyPad(id) {
  const overlay = document.getElementById("overlay_3");
  overlay.insertAdjacentHTML('beforeend', loader.keypad_html);
  const keypad_title = overlay.querySelector("#keypad_title");
  const display = overlay.querySelector("#keypad_display");
  display.textContent = "";
  let password = "";

  if (id === 0) {
    keypad_title.textContent = "Operator's code";
  } else if (id === 1) {
    keypad_title.textContent = "Manager's code";
  }
  
  cart_overlay.classList.add("blurred");
  overlay.classList.add("active");
  
  const elements = overlay.querySelectorAll(".keypad_btn-style");
  elements.forEach(el => {
    el.addEventListener("click", function() {
      if (display.textContent.length > 5) {
        display.textContent = "";
        display.classList.remove("wrong_code");
      }
      if (display.textContent.length < 5) {
        display.classList.remove("wrong_code");
        display.textContent += "*";
        password += el.value;
      }
    })
  })

  const canc_btn = overlay.querySelector("#keypad_canc");
  canc_btn.addEventListener("click", function() {
    if (display.textContent.length > 0) {
      display.textContent = display.textContent.slice(0, -1);
      password = password.slice(0, -1);
    }
  })

  return new Promise((resolve) => {
    const keypad_x_button = overlay.querySelector("#keypad_x_button");
    keypad_x_button.addEventListener("click", function() {
      overlay.classList.remove("active");
      cart_overlay.classList.remove("blurred");
      overlay.replaceChildren();
      resolve(false);
    })
    
    const ok_btn = overlay.querySelector("#keypad_ok");
    ok_btn.addEventListener("click", function() {
      if (id === 0) {
        if (accepted_codes_0.has(password)) {
          
          cart_overlay.classList.remove("blurred");
          overlay.classList.remove("active");
          overlay.replaceChildren();
          resolve(true);
        } else {
          display.textContent = "WRONG, RETRY!";
          password = "";
          display.classList.add("wrong_code");
        }
      } else if (id === 1) {
        if (accepted_codes_1.has(password)) {
          
          cart_overlay.classList.remove("blurred");
          overlay.classList.remove("active");
          overlay.replaceChildren();

          resolve(true);
        } else {
          display.textContent = "WRONG, RETRY!";
          password = "";
          display.classList.add("wrong_code");
        }  
      }
    })
  });
}

function createAlertQueue() {
  const overlay = document.getElementById("overlay_3");
  overlay.classList.add("active");
  const alert = document.createElement("div");
  alert.classList.add("popup_2-style");
  const alert_top_div = document.createElement("div");
  alert_top_div.classList.add("top_cart_popup-style");
  const alert_top_left_div = document.createElement("div");
  alert_top_left_div.classList.add("top_queue_div_left-style");
  const syncButton = document.createElement("div");
  syncButton.classList.add("sync_button-style");
  syncButton.textContent = "SYNC";
  const alert_title_popup_div = document.createElement("div");
  alert_title_popup_div.classList.add("title_queue_popup-style");
  alert_title_popup_div.textContent = "Recents";
  const alert_top_right_div = document.createElement("div");
  alert_top_right_div.classList.add("top_queue_spacer_right-style");
  const top_x_button = document.createElement("button");
  top_x_button.classList.add("top_order_x_button-style");
  const x_button_img = document.createElement("img");
  x_button_img.classList.add("x_button-style");
  x_button_img.src = "/assets/cross-mark-svgrepo-com.svg";
  x_button_img.alt = "icon";
  const queue_container = document.createElement("div");
  queue_container.id = "queue_container";
  queue_container.classList.add("queue_container-style");
  showQueueInAlert(queue_container);

  syncButton.addEventListener("click", function() {
    top_x_button.click();
    if (isQueueSynced()) {
      createAlertInfo("Nothing to sync  to server");
    } else {
      if (syncQueueComandeToServer()) {
        createAlertInfo("Successful sync to server");
      } else {
        createAlertInfo("Failed sync to server!"); 
      }
    }
  })
  
  top_x_button.addEventListener("click", function() {
    const m_container = document.getElementById("main-container");

    updateChecklistNotification();
    
    m_container.classList.remove("blurred");
    overlay.classList.remove("active");
    overlay.replaceChildren();
  })

  alert_top_left_div.appendChild(syncButton);
  alert_top_div.appendChild(alert_top_left_div);
  alert_top_div.appendChild(alert_title_popup_div);
  alert_top_div.appendChild(alert_top_right_div);
  top_x_button.appendChild(x_button_img);
  alert_top_div.appendChild(top_x_button);
  alert.appendChild(alert_top_div);
  alert.appendChild(queue_container);
  overlay.appendChild(alert);

  for (let i = 0; i < queue_comande.length; i++) {
    const element = queue_comande[i];
    if (element.getUploaded()) {
      continue;
    }
    const element_summary_div = document.getElementById("comanda_item" + i);
 
    const yes_button = document.getElementById('comanda_menu_yes_button' + i);
    const no_button = document.getElementById('comanda_menu_no_button' + i);

    yes_button.addEventListener("click", function() {
      if (!element.getManuallyCharged()) {
        no_button.classList.remove("active");
        element.setManuallyCharged(true);
        element_summary_div.classList.remove("manuallyChargedNot");
        element_summary_div.classList.add("manuallyCharged");
        yes_button.classList.add("active");
      }
    })
  
    no_button.addEventListener("click", function() {
      if (element.getManuallyCharged()) {
        yes_button.classList.remove("active");
        element.setManuallyCharged(false);
        element_summary_div.classList.remove("manuallyCharged");
        element_summary_div.classList.add("manuallyChargedNot");
        no_button.classList.add("active");
      }
    })
  }
}

function showQueueInAlert(container) {
  for (let i = queue_comande.length - 1; i >= 0; i--) {
  const element = queue_comande[i];
  const parser = new DOMParser();
  const element_html = parser.parseFromString(loader.comanda_html, 'text/html');
  const element_date = element_html.querySelector('#summary_date');
  element_date.textContent = element.getDate();
  const element_time = element_html.querySelector('#summary_time');
  element_time.textContent = element.getTime();
  const element_room = element_html.querySelector('#summary_room');
  element_room.textContent = element.getRoom();
  const element_price = element_html.querySelector('#summary_price');
  element_price.textContent = '€  ' + price_to_classic(element.getPrice());

  const element_summary = element_html.querySelector(".comanda_summary-style");
  element_summary.id = "comanda_item" + i;
  if (!element.getUploaded()) {
     element.getManuallyCharged() ? element_summary.classList.add("manuallyCharged"): element_summary.classList.add("manuallyChargedNot");
  }
  
  const element_details = element_html.querySelector('.list_div');

  for (const element_order of element.getOrders()) {

  const entry_html = parser.parseFromString(loader.comanda_menu_item, 'text/html');

  const number_entry_div = entry_html.querySelector('#number_entry_div');
  const price_entry_div = entry_html.querySelector('#price_entry_div');
  const name_entry_div = entry_html.querySelector('#name_entry_div');
  const tot_entry_div = entry_html.querySelector('#tot_entry_div');

  number_entry_div.textContent = element_order.getQuantity();
  price_entry_div.textContent = '€  ' + price_to_classic(element_order.getPrice());
  name_entry_div.textContent = element_order.getText();
  tot_entry_div.textContent = '€  ' + price_to_classic(element_order.getPrice() * element_order.getQuantity());

  element_details.insertAdjacentHTML('beforeend', entry_html.body.innerHTML);
  }

  if (!element.getUploaded()) {
    const charged_buttons_html = parser.parseFromString(loader.comanda_menu_charged_buttons, 'text/html');

    const yes_button = charged_buttons_html.querySelector('#comanda_menu_yes_button');
    yes_button.id = 'comanda_menu_yes_button' + i;
    const no_button = charged_buttons_html.querySelector('#comanda_menu_no_button');
    no_button.id = 'comanda_menu_no_button' + i;  

    element.getManuallyCharged() ?  yes_button.classList.add("active") : no_button.classList.add("active");
    
    element_details.insertAdjacentHTML('beforeend', charged_buttons_html.body.innerHTML);
  }
  

  container.insertAdjacentHTML('beforeend', element_html.body.innerHTML);
  }  
}

function truncate_queue_comande() {
  const date_threashold = new Date(Date.now() - 86400000); // Truncate successfully uploaded comande older than 1 day from queue_comande array

  for (let i = queue_comande.length - 1; i >= 0; i--) {
    if ((queue_comande[i].getUploaded() || queue_comande[i].getManuallyCharged()) && queue_comande[i].getRawDate() < date_threashold) {
      queue_comande.splice(i, 1);
    }
  }
}



function quit_cart() {
  const m_container = document.getElementById('main-container');
  m_container.classList.remove("blurred");
  cart_overlay.classList.remove("active");
}

function price_to_classic(price) {
  return Math.floor(price/100) + ',' + Math.floor((price%100)/10) + price%10;  
}

function refresh_price() {
  const qty_popup = document.getElementById("qty_var");
  const tot_popup = document.getElementById("tot");
  tot_popup.textContent = '€  ' + price_to_classic(qty_popup.quantity * tot_popup.price);
}

export function parse(txt) {
  const lines = txt.split('\n');
  lines.pop();

  for (const line of lines) {
    const split_line = line.split('#');
    const name = split_line[0].slice(0,30); // limit name of product at 30 characters of length
    const price = split_line[1];
    split_line.splice(0, 2);
    const hashtags = split_line.map(str => str.toUpperCase().slice(0,12));  // hashtags are case insensitive
   
    items.push(new StringSetElement(name, price, hashtags));

    for (const hashtag of hashtags) {  // insert the found hashtag in the set, duplicates are not counted
      filters.add(hashtag);
    }
  }
}

export function hash_filter() {

  const parent = document.getElementById('filter-background');
  const active_hash_sets = new Map();
  
  for (const button of parent.querySelectorAll('*')) {
    if (button.dataset.active === "true") {
      active_hash_sets.set(button.id, hash_sets.get(button.id));
    }
  }

  if (active_hash_sets.size === 0) {
    results_hashed.length = 0;
    for (const item of items) {
      results_hashed.push(item.getText());
      console.log(item.getText());
    }
    results_hashed.sort();
    return;
  }
  console.log(active_hash_sets);
  
  const set_intrsc = new Set();
  for (const key of active_hash_sets.keys()) {
    const e = active_hash_sets.get(key);
    for (const element of e.values()) {
      set_intrsc.add(element);
    }
    active_hash_sets.delete(key);
    break;
  }

  for (const key of active_hash_sets.keys()) {
    const e = set_intrsc.intersection(active_hash_sets.get(key));
    set_intrsc.clear();
    for (const element of e.values()) {
      set_intrsc.add(element);
    }
  }

  const names = Array.from(set_intrsc);
  names.sort();
  results_hashed.length = 0;
  for (const name of names) {
    results_hashed.push(name);
    // console.log(name);
  }
}

export function search_filter() {

  if (document.getElementById("search-input").value === "") {
    del_button.classList.add("active");
  } else {
    del_button.classList.remove("active");
  }
  
  results_searched.length = 0;
  for (const result of results_hashed) {
    const text_searched = new RegExp(document.getElementById("search-input").value, 'i');
    if (text_searched.test(result) || text_searched === "//" ) {
      results_searched.push(result);    
    }
  }
  results_searched.sort()
  console.log(results_searched);
}

export function refresh() {
  const r_container = document.getElementById('result-container');
  r_container.replaceChildren();

  for (const name of results_searched) {
    const element = document.createElement('div');

    element.classList.add('result-item');

    const sub_element_name = document.createElement('div');
    sub_element_name.classList.add('result_subitem_name');
    sub_element_name.textContent = name;
    
    const sub_element_price = document.createElement('div');
    sub_element_price.classList.add('result_subitem_price');
    for (const item of items) {
      if (item.getText() === name) {
        sub_element_price.price = item.getPrice();
        sub_element_price.textContent = '€  ' + price_to_classic(sub_element_price.price);
      }
    }

    element.appendChild(sub_element_name);
    element.appendChild(sub_element_price);
    
    element.addEventListener("click", () => {
      const m_container = document.getElementById('main-container');
      const o_container = document.getElementById('overlay');
      const title_popup = document.getElementById('title_popup');
      const tot_popup = document.getElementById('tot');
      const qty_button_less_popup = document.getElementById('qty_button_less');
      const qty_button_more_popup = document.getElementById('qty_button_more');
      const qty_popup = document.getElementById('qty_var');
      
      title_popup.textContent = name;
      tot_popup.price = sub_element_price.price;
      tot_popup.textContent = '€  ' + price_to_classic(sub_element_price.price);
      qty_button_less_popup.classList.remove("active");
      qty_popup.quantity = 1;
      qty_button_more_popup.classList.add("active");
      qty_popup.textContent = qty_popup.quantity;
      m_container.classList.toggle("blurred");
      o_container.classList.toggle("active");
    })

    r_container.appendChild(element);    
  }
}


export function create_buttons() {
  const parent = document.getElementById('filter-background');
  let count = 0;
  for (const filter of filters) {
    const button = document.createElement("button");
    count += 1;
    if (count === 17) {
      break;
    }
    button.type = "button";
    button.id = filter;
    button.textContent = '#' + filter;
    button.dataset.active = "false";
    button.classList.add("invert-btn");
    button.addEventListener("click", () => {
      button.dataset.active = button.dataset.active === "true" ? "false" : "true";
      button.classList.toggle('active');
      hash_filter();
      search_filter();
      refresh();
    })
    if (count === 1 || count === 6 || count === 12) {
      const previous = document.getElementById("current_row");
      if (previous) {
        previous.id = "row" + count;
      }
      const pseudo_row = document.createElement('div');
      pseudo_row.classList.add("filter_row-style");
      pseudo_row.id = "current_row";
      parent.appendChild(pseudo_row);  
    }
    const row = document.getElementById("current_row");
    row.appendChild(button);
  }
}

export function create_hash_sets() {

  for (const filter of filters.values()) {
    const hash_set = new Set();
    for (const item of items) {
      if (item.hasValue(filter)) {
        hash_set.add(item.getText());
      }
    }
    hash_sets.set(filter, hash_set);
  }
}

export function create_picker_items() {
  const o_top_spacer = document.createElement("div");
  o_top_spacer.classList.add("picker_spacer_top-style");
  o_picker.appendChild(o_top_spacer);
  for (const room of rooms_list) {
    const element = document.createElement("div");
    element.textContent = room;
    element.classList.add("picker_item-style");
    o_picker.appendChild(element);
  }
  const o_bottom_spacer = document.createElement("div");
  o_bottom_spacer.classList.add("picker_spacer_bottom-style");
  o_picker.appendChild(o_bottom_spacer);
}

export function getRoomBold() {
  const children = o_picker.children;
  for (const element of children) {
    const c_top = getRelativePosition(element, o_picker).top;
    const c_bottom = getRelativePosition(element, o_picker).bottom;
    if (c_top < 60 && c_bottom > 60) {
      return element.textContent;
    }
  }
}

export function getRelativePosition(child, container) {
  const childRect = child.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return {
    top: childRect.top - containerRect.top,
    bottom: childRect.bottom - containerRect.top
  } 
}

export function isCartHealthy() {  // verify if cart has exceded constraints of items or money
  let total = 0;
  for (const element of order_entries) {
    total += element.getQuantity() * element.getPrice();
  }

  if ( order_entries.length < 7 && total < 10000 ) {
    return true;
  } else {
    return false;
  }
}

function compute_tot_cart() {
  let total_value = 0;
  for (const entry of order_entries) {
    total_value += entry.getQuantity() * entry.getPrice();
  }
  return total_value;
}

export function handleCartWIP() {  // handle notification dot on cart icon and locker-image and picker-locking in the order popup
  const picker = document.getElementById("picker");
  const locker = document.getElementById("locker_div");

  if (order_entries.length > 0) {
    top_title_room_cart.textContent = "ROOM";
    top_title_number_cart.textContent = order_entries[0].getRoom();
    center_cart_left_popup.replaceChildren();
    for (const entry of order_entries) {
      const entry_div = document.createElement("div");
      entry_div.classList.add("entry-style");
      entry_div.addEventListener("click", function() {
        cart_overlay.classList.add("blurred");
        createAlertEntryDel(entry);
      })

      const number_entry_div = document.createElement("div");
      const multiply_entry_div = document.createElement("div");
      multiply_entry_div.textContent = "x";
      const price_entry_div = document.createElement("div");
      const name_entry_div = document.createElement("div");
      const tot_entry_div = document.createElement("div");

      number_entry_div.classList.add("entry_number-style");
      multiply_entry_div.classList.add("entry_multiply-style");
      price_entry_div.classList.add("entry_price-style");
      name_entry_div.classList.add("entry_name-style");
      tot_entry_div.classList.add("entry_totline-style");

      number_entry_div.textContent = entry.getQuantity();
      price_entry_div.textContent = '€  ' + price_to_classic(entry.getPrice());
      name_entry_div.textContent = entry.getText();
      tot_entry_div.textContent = '€  ' + price_to_classic(entry.getPrice() * entry.getQuantity());

      entry_div.appendChild(number_entry_div);
      entry_div.appendChild(multiply_entry_div);
      entry_div.appendChild(price_entry_div);
      entry_div.appendChild(name_entry_div);
      entry_div.appendChild(tot_entry_div);

      center_cart_left_popup.appendChild(entry_div);
    }
    const entry_tot_div = document.createElement("div");
    const tot_text_div = document.createElement("div");
    const tot_price_div = document.createElement("div");

    entry_tot_div.classList.add("entry_tot_div-style");
    tot_text_div.classList.add("tot_text_div-style");
    tot_price_div.classList.add("tot_price_div-style");

    tot_text_div.textContent = "TOT: ";
    tot_price_div.textContent = '€  ' + price_to_classic(compute_tot_cart());

    entry_tot_div.appendChild(tot_text_div);
    entry_tot_div.appendChild(tot_price_div);
    center_cart_left_popup.appendChild(entry_tot_div);
    
    document.getElementById('shopping_bag_icon_button').classList.add('has-notification');
    picker.classList.add("locked");
    locker.classList.add("active");
  } else {
    top_title_room_cart.textContent = "CART";
    top_title_number_cart.textContent = "EMPTY";
    center_cart_left_popup.replaceChildren();
    document.getElementById('shopping_bag_icon_button').classList.remove('has-notification');
    picker.classList.remove("locked");
    locker.classList.remove("active");
  }

  clear_canvas_2();  // clear the canvas from any stroke
}

function updateChecklistNotification() {
  isQueueSynced() ? document.getElementById('checklist_icon_button').classList.remove('has-notification') : document.getElementById('checklist_icon_button').classList.add('has-notification'); 
}

function isQueueSynced() {
  let notification = true;
  for (const element of queue_comande) {
    if (!element.getUploaded()) {
      if (!element.getManuallyCharged()) {
        notification = false;
       }
    }
  }
  return notification;
}

function syncQueueComandeToServer() {
  let connected = true;
  for (const element of queue_comande) {
    if (!element.getUploaded() && !element.getManuallyCharged()) {
      const random_boolean = Math.random() < 0.5; // this should be the result of the fetch("yourserver.com") code. You should insert your communication code at this point of the program

      if (random_boolean) {
        element.setUploaded(true);
      } else {
        connected = false;
        break;
      }
    }
  }
  updateChecklistNotification();
  return connected;
}

function clear_canvas_2() {
  const ctx_2 = canvas_cart.getContext('2d');
  ctx_2.clearRect(0, 0, canvas_cart.width, canvas_cart.height);
} 
