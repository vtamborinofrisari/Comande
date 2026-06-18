export const keypad_html = await fetch('/components/keypad.html').then(response => response.text());
export const comanda_html = await fetch('/components/comanda_menu.html').then(response => response.text());
export const comanda_menu_item = await fetch('/components/comanda_menu_item.html').then(response => response.text());
export const comanda_menu_charged_buttons = await fetch('/components/comanda_menu_charged_buttons.html').then(response => response.text());
