//Edit 'key' and 'columns' to connect your spreadsheet

//enter google sheets key here
var key =
  "https://docs.google.com/spreadsheets/d/1bMi2KGbEKPz_mx6o-74wVBdalhAi93UEMzTl6DLzcjg/pubhtml?gid=0&single=true";
  
//"data" refers to the column name with no spaces and no capitals
//punctuation or numbers in your column name
//"title" is the column name you want to appear in the published table

var columns = [
{
	"data": "Title",
	"title": "Companion Title",
	"width": "25%",
	"className": "titleCol col"
},
{
	"data": "Parent Journal",
	"title": "Parent Journal Title",
	"width": "25%",
	"className": "journalCol col"
},
{
	"data": "W & L Parent Journal Ranking",
	"title": "W&L Rank",
	"width":"7.5%",
	"className": "rankCol col"
},
{
	"data": "Word Count Minimum",
	"title": "Word Min",
	"width": "7.5%",
	"className": "minCol col"
},
{
	"data": "Word Count Maximum",
	"title": "Word Max",
	"width": "7.5%",
	"className": "maxCol col"
},
{
	"data": "Contact Email",
	"title": "Contact",
	"width":"7.5%",
	render: function (data,type,row){
		if (data != "") {
			return '<a href="mailto:' + data + '">Email</a>';
		}
		else {
			return data;
		}
	},
	"className": "emailCol col"
},
{
	"data": "URL",
	"title": "Website",
	"width":"7.5%",
	render: function (data,type,row){
		if (data != "") {
			return '<a href="' + data + '">Link</a>';
		}
		else {
			return data;
		}
	},
	"className": "websiteCol col"
},
{
	"data": "Submission Method",
	"title": "Submission Method",
	"width": "12.5%",
	"className": "methodCol col"
}
];

//custom filtering function which will search word count column between min and max
$.fn.dataTable.ext.search.push(
	function (settings,data,dataIndex ){
		var wordCount = parseInt($('.wordCountSelect').val(),10);
		var min = parseFloat(data[3]) || 0; // use data for the min column -- sets blanks as zero
		var max = parseFloat(data[4]) || 9999999; // use data for the max column -- sets blanks as 10 million
 
		if (
			(isNaN(wordCount)) ||  //blank, all records "true"
			((wordCount <= max) && (wordCount >= min)) //input smaller than max, larger than min
		)
		{
			return true;
		}
		return false;
	}
);
//end filtering function

$(document).ready(function() {

	function initializeTabletopObject() {
		Tabletop.init(
			{
				key: key,
				callback: function(data, tabletop) {
					writeTable(data); //call up datatables function
				},
				simpleSheet: true,
				debug: false
			}
		);
	}

	initializeTabletopObject();

	function writeTable(data) {
		
		//select main div and put a table there
		//use bootstrap css to customize table style: http://getbootstrap.com/css/#tables
		$('#onlineCompanions').html('<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-condensed table-responsive" id="mySelection"></table>');
		
		//initialize the DataTable object and put settings in
		var table = $("#mySelection").DataTable({
			"autoWidth": false,
			"data": data,
			"columns": columns,
			"order": [
				[2, "asc"]
			], //order on rank
			"pageLength": 10,
			"lengthChange": false,
			"pagingType": "simple", //no page numbers
			'dom':'flipt', //puts dom in this order: filter, length changing, information, pagination, table
			'language': {
				'infoFiltered':"",
				'info':	'Showing _START_ to _END_ of _TOTAL_',
				"infoEmpty" : "",
				"zeroRecords" : "",
				"paginate": {
					"next":"<span class='nextPageSpan'><button class='nextPage btn btn-autofill'>Next ></button></span>",
					"previous":"<span class='prevPageSpan'><button class='prevPage btn btn-autofill'>< Previous</button></span>"
				}
			}
		});
		//end of var table
		
		//add classes for manipulating search and word count filters
		$('.dataTables_filter input').addClass('searchAllInput');
		$('.dataTables_filter label').addClass('searchAllLabel');
		$('.dataTables_filter').append('<label class="wordCountLabel">Word Count:<select class="wordCountSelect defaultOption" type="text"/></label>');
		$('.dataTables_filter input.searchAllInput').attr('placeholder','Companion Title, Parent Journal Title, Submission Method');
		
		//add Show All button
		$('.dataTables_filter').after("<span class='showAll'><button class='showAllBtn btn btn-autofill' type='button'>Show All</button></span>");
		$('.showAll .showAllBtn').unbind().on( 'click', function () {
			$this = $(this);
			if ($this.hasClass('showFewer'))
			{
				table.page.len( 10 ).draw();
				$this.text('Show All');
				$this.removeClass('showFewer');
			}
			else{
				table.page.len( -1 ).draw();
				$this.addClass('showFewer');
				$this.text('Show Fewer');
			}
		});
		
		//add Clear Search button:		
		$('.dataTables_filter').append("<span class='clear'><button class='clearBtn btn btn-autofill' type='button'>Clear Search</button></span>");
		$('.clear .clearBtn').unbind().on( 'click', function () {
			$('.dataTables_filter input').val('');
			$('.dataTables_filter select').val('default');
			$('.wordCountSelect').removeClass('nonDefaultOption');
			$('.wordCountSelect').addClass('defaultOption');
			table.search('').draw();
		});
		
		//redraw when new Word Count selected
		$('.wordCountSelect').unbind().change( function() {
			value = $(this).val();
			if (value == 'default')
			{
				$('.wordCountSelect').removeClass('nonDefaultOption');
				$('.wordCountSelect').addClass('defaultOption');
			}
			else{
				$('.wordCountSelect').removeClass('defaultOption');
				$('.wordCountSelect').addClass('nonDefaultOption');
			}
			table.draw();
		});
		
		//Add Word Count options
		$('.wordCountSelect').append( '<option value="default">Select Value</option><option value="2500">2,500</option><option value="5000">5,000</option><option value="7500">7,500</option><option value="10000">10,000+</option>' );
		
	} 
	//end of writeTable 
  
});
//end of document ready