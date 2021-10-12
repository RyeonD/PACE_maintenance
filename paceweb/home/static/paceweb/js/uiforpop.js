
var alarm = null;
var callback = null;
var loopback = null;

// 일시 처리
//var currDate = new Date(); 
// 현재 날짜시간 생성
//currDate=dateToYYYYMMDD(currDate);

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
});

$("#myclick").click(function() {
	$.get("/output/", function(data) {
		$("#myOutput").html(data);
	}, "html");
});

$(function(){
	$('#frmChat').submit(function(e){
	// this function overrides the form's submit() method, allowing us to use AJAX calls to communicate with the ChatScript server
	e.preventDefault();  // Prevent the default submit() method
	var name = $('#txtUser').val();
        if (name == '') {
		alert('Please provide your name.');
		document.getElementById('txtUser').focus();
         }
	var chatLog = $('#responseHolder').html();
	//var youSaid = '<strong>' + name + ':</strong> ' + $('#txtMessage').val() + "<br>\n";
	var youSaid = 	'<li class="right clearfix">'
				+	'    <span class="pull-right">'
				+   '        <i class="fa fa-user" style="font-size:24px;"></i>'
    			+	'    </span>'
    			+	'    <div class="chat-body clearfix" id="chatBodyMessage">'
    			+	'        <div class="header">'
    			+	'            <small class="text-muted">'
    			+	'                <i class="fa fa-clock-o fa-fw"></i>' + dateToYYYYMMDD(new Date()) 
    			+	'            </small>'
    			+	'            <strong class="pull-right primary-font">' + name + '</strong>'
    			+	'        </div>'
    			+	'		 <div style="cborder: 0px solid orange; border-radius: 20px 0px 20px 20px; margin: 5px 0px 5px 10px; padding: 10px; background: #06b79a; color: #fff; float: right; border-top-right-radius: 0;">'
    			+	'        <p>' + $('#txtMessage').val() + '</p>'
    			+	'    	 </div>'
    			+	'    </div>'
    			+	'</li>';

	update(youSaid);
	var data = $(this).serialize();
	sendMessage(data);

	//$('#txtMessage').val('').focus();
	$('#txtMessage').val('').blur();
	
	});

	$('#txtMessage').keypress(function(){
        window.clearInterval(loopback);
        window.clearTimeout(callback);
    });
	// any user typing cancels loopback or callback for this round 
		
});
function sendMessage(data){ //Sends inputs to the ChatScript server, and returns the response-  data - a JSON string of input information
$.ajax({
	url: '/chatapp/call_chatbot',
//	url: '/ark/chatapp/call_chatbot', 
	//dataType : "jsonp",
	dataType: 'text',
	data: data,
    type: 'post',
    success: function(response){
		var reSplit = response.split('\n');
		var size=1;
		if (reSplit.length>1){
			size = reSplit.length-1
		}
		for (var i=0; i<size;i++){
			processResponse(parseCommands(reSplit[i]));
		}
		
    },
    error: function(xhr, status, error){
		// 에코로 대체
		//processResponse(parseCommands(data));
		alert('oops? Status = ' + status + ', error message = ' + error + "\nResponse = " + xhr.responseText);
    }
  });
}
function parseCommands(response){ // Response is data from CS server. This processes OOB commands sent from the CS server returning the remaining response w/o oob commands

	var len  = response.length;
	var i = -1;

	while (++i < len )
	{
		if (response.charAt(i) == ' ' || response.charAt(i) == '\t') continue; // starting whitespace
		if (response.charAt(i) == '[')  break;	                         // we have an oob starter
		return response;						// there is no oob data 
	}

	if ( i == len) return response; // no starter found
	var user = $('#txtUser').val();
     
	// walk string to find oob data and when ended return rest of string
	var start = 0;
	while (++i < len )
	{
		if (response.charAt(i) == ' ' || response.charAt(i) == ']') // separation
		{
			if (start != 0) // new oob chunk
			{
				var blob = response.slice(start,i);
				start = 0;
				var commandArr = blob.split('=');
				if (commandArr.length == 1) continue;	// failed to split left=right
				var command = commandArr[0]; // left side is command 
				var interval = (commandArr.length > 1) ? commandArr[1].trim() : -1;
// right side is millisecond count
				if (interval == 0)  /* abort timeout item */
				{ 
					switch (command){
						case 'alarm':
							window.clearTimeout(alarm);
							alarm = null;
							break;
						case 'callback':
							window.clearTimeout(callback);
							callback = null;
							break;
						case 'loopback':
							window.clearInterval(loopback);
							loopback = null;
							break;
					}
				}
				else if (interval == -1) interval = -1; // do nothing
				else
				{
					var timeoutmsg = {user: user, send: true, message: '[' + command + ' ]'}; // send naked command if timer goes off 
					switch (command) {
						case 'alarm':
							alarm = setTimeout(function(){sendMessage(timeoutmsg );}, interval);
							break;
						case 'callback':
							callback = setTimeout(function(){sendMessage(timeoutmsg );}, interval);
							break;
						case 'loopback':
							loopback = setInterval(function(){sendMessage(timeoutmsg );}, interval);
							break;
                                                case 'avatar' :
                                                        document.getElementById("avatarImage").src = "images/" + interval;
                                                        break;
					}
				}
			} // end new oob chunk
			if (response.charAt(i) == ']') return response.slice(i + 2); // return rest of string, skipping over space after ] 
		} // end if
		else if (start == 0) start = i;	// begin new text blob
	} // end while
	return response;	// should never get here
 }

function processResponse(response) { // given the final CS text, converts the parsed response from the CS server into HTML code for adding to the response holder div
	//response = replace('\n','<br>\n');
	//var botSaid = '<strong>' + botName + ':</strong> ' + response + "<br>\n";
	//var botSaid = '<strong>' + botName + ':</strong> ' + response + "<br>\n";
	var botSaid = 	'<li class="left clearfix">'
		+	'    <span class="pull-left">'
		+   '        <i class="fa fa-android" style="font-size:24px;"></i>'
		+	'    </span>'
		+	'    <div class="chat-body clearfix" id="chatBodyMessage">'
		+	'        <div class="header">'
		+	'            <strong class="primary-font">' + botName + '</strong>'
		+	'            <small class="pull-right text-muted">'
		+	'                <i class="fa fa-clock-o fa-fw"></i>' + dateToYYYYMMDD(new Date()) +  '</small>'
		+	'        </div>'
		+	'		 <div id="responseMessage" style="border: 0px solid orange; border-radius: 0px 20px 20px 20px;  margin: 5px 10px 5px 0px; padding: 10px; background: #efefef; color: #6f6f6f; float: left; border-top-left-radius: 0;">'
		+	'        <p>' + response + '</p>'
		+	'    	 </div>'
		+	'    </div>'
		+	'</li>';
	
	update(botSaid);
	//speak(response);
}

//데이트 포멧 
function dateToYYYYMMDD(date){
    function pad(num) {
        num = num + '';
        return num.length < 2 ? '0' + num : num;
    }
    return date.getFullYear() + '-' + pad(date.getMonth()+1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()); 
}

function update(text){ // text is  HTML code to append to the 'chat log' div. This appends the input text to the response div
	/**
    var el = document.getElementsByClassName("panel-body");
	el.scrollTop = el.scrollHeight - el.scrollTop;

	var chatLog = $('#responseHolder').html();
	$('#responseHolder').html(chatLog + text);
	var rhd = $('#responseHolder');
	var h = rhd.get(0).scrollHeight;
	rhd.scrollTop(h);
    $("#responseHolder").scrollTop(1000);
    */
	var chatLog = $('#responseHolder').html();
	$('#responseHolder').html(chatLog + text);
	//스크롤이 항상 최신 대화가 보이도록 대화메시지 출력후 맨아래로 설정
	var rhd = $('.panel-body');
	var h = rhd.get(0).scrollHeight;
	rhd.scrollTop(h);
	//div 에 focus 주기
	//document.getElementById("responseMessage").scrollIntoView();
}

