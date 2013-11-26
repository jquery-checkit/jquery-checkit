# jQuery CheckIt! plugin

This plugin helps you to check your checkboxes in a huge data table by a quick search filter and an extended, detailed filter.

## Features

* Check all checkboxes in the data table
* Clear all checked items
* Quick filter with free text search
* Advanced filter with string, numeric and date data types
* The advanced filter inits your data table's head, and make filter attributes for every column
* In advanced filter you can use more relations such as equals, not equals, contains, not contains
* If you use numeric or date data type, you can work with intervals (between and not between relations)
* You can clear every filter attribute in extended mode



## Usage

### Step 1.

Include the scripts and the css files into the head section of your HTML file.

```
<link rel="stylesheet" href="assets/css/jquery.checkit.css">
```

```
<script src="assets/js/checkit/jquery.checkit.js"></script>
```

### Step 2.

Copy the CheckIt! control section code before your data table!


	<div id="checkit-control">
		<form action="" method="post"> 
		  <!-- CheckIt filter container -->
		  <div id="checkit-filter-container">
		    <div id="checkit-quick-filter">
		      <h3>Quick filter</h3>		
		      <div class="quick-filters">
		        <div>
		          <label for="search-text">Text</label>
		          <input type="text" name="search_text" id="search-text">
		        </div>
		      </div>
		      <input type="submit" name="checkit_quick_filter" value="CheckIt!" class="button green-button">
		      <input type="button" name="display_advanced_filter" value="Advanced filter" class="button blue-button">
		    </div>		
		    <div id="checkit-advanced-filter">
		      <h3>Advanced filter</h3>
		      <div class="advanced-filters"></div>
		      <input type="submit" name="checkit_advanced_filter" value="CheckIt!" class="button green-button">
		      <input type="button" name="display_quick_filter" value="Quick filter" class="button blue-button">
		    </div>
		  </div>
		  <!-- /CheckIt filter container -->  
			<input type="submit" name="checkit_all" value="CheckIt! all" class="button green-button">
			<input type="submit" name="checkit_clear" value="Clear selection" class="button red-button">
			<input type="button" name="checkit_filter" value="Filter" class="button blue-button">
		</form>
	</div>



### Step 3.

Set data types on your thead cells!

	<thead>
		<tr>
			<td>&nbsp;</td>
			<td data-type="string"><p>Name</p></td>
			<td data-type="string"><p>Email</p></td>
			<td data-type="string"><p>Phone</p></td>
			<td data-type="numeric"><p>Age</p></td>
			<td data-type="string"><p>Gender</p></td>
			<td data-type="date"><p>Register date</p></td>
		</tr>
	</thead>


### Step 4.

Put checkboxes in the first column of your data table!

### Step 5.

Call the script!


	<script>
		$('#checkit-table').checkIt({
	    case_sensitive: false,        // Turn it on if you need search to be case sensitive
	    highlight_color: "#92b427",   // You can set custom highlight color
	    show_filter: false,           // Turn it on if you want to show the filter by default
	    accents: false                // Use this if you have accented characters in the thead cells of your table WARNING: You need to include the latinise.js for this feature in yor html
	  });
	</script>


## Contact

You can contact us on CodeCanyon or via email.

Email: gergoo.mail@gmail.com