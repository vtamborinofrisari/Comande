// SPDX-License-Identifier: AGPL-3.0-only 
import * as utils from "/js/functions.js";
import { StringSetElement } from "/classes/StringSetElement.js";

const response = await fetch("beverage_list.txt");
const text = await response.text();

utils.parse(text);  // parse txt-file representing a list of product_name#price#hashtag1#hashtag2...
utils.create_buttons();  // create hashtag filter-buttons
utils.create_hash_sets();
utils.create_picker_items();

const p_children = utils.o_picker.children;
for (const element of p_children) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry =>{
      element.classList.toggle("focused", entry.isIntersecting);   
    });
  }, {
    root: utils.o_picker,
    threshold: 1   
  });
  observer.observe(element);
}

utils.hash_filter();
utils.search_filter();
utils.refresh(); // should be results_searched
