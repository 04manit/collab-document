$(function () {
    var syncClient;
    var syncStream;
    var message = document.getElementById('message');
    var text_area = document.getElementById('text_area');
    var select_element = document.getElementById('select')
    var background_color;


    $.getJSON('/token', function(tokenResponse) {
        syncClient = new Twilio.Sync.Client(tokenResponse.token, { logLevel: 'info' });

        // create the stream object
        syncClient.stream('messageData').then(function(stream) {
            syncStream = stream;
            // listen update and sync drawing data
            syncStream.on('messagePublished', function(event) {
                console.log('syncStream:',event.message.value);
                syncDrawingData(event.message.value);


            });
        });
    });

    function syncDrawingData(data){
        document.getElementById('text_area').value = data.my_message;

        if (data.color == "white"){
            document.getElementById('text_area').style.backgroundColor = "white";
        }
        if (data.color == "red"){
            document.getElementById('text_area').style.backgroundColor = "red";
        }
        if (data.color == "yellow"){
            document.getElementById('text_area').style.backgroundColor = "yellow";
        }
        if (data.color == "green"){
            document.getElementById('text_area').style.backgroundColor = "green";
        }
    }
    
    function messageSync(){
        data = document.getElementById('text_area').value;
        setTimeout(function (){
            settingSyncData();
        }, 1700);
    }
    
    function settingSyncData(){
        syncStream.publishMessage({
            color: background_color,
            my_message: data
        });
    }

    function select_color(){
        color = document.getElementById("select").value;

        if (color == "white"){
            background_color = 'white';
        }
        if (color == "red"){
            background_color = 'red';
        }
        if (color == "yellow"){
            background_color = 'yellow';
        }
        if (color == "green"){
            background_color = 'green';
        }
    }

    text_area.addEventListener('keyup', messageSync);
    select_element.addEventListener('change', select_color);

});