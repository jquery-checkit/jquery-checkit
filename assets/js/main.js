
// DOCUMENT READY
$(document).ready(function(){

	$('#checkit-table').checkIt({
    case_sensitive: false,        // Turn it on if you need search to be case sensitive
    highlight_color: "#92b427",   // You can set custom highlight color
    show_filter: false,           // Turn it on if you want to show the filter by default
    accents: false                // Use this if you have accented characters in the thead cells of your table WARNING: You need to include the latinise.js for this feature in yor html
  });
});