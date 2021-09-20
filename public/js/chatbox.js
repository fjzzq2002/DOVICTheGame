var createFlexibleButton = function (scene, text, width, height, fontsize, align='center', font='Montserrat') {
    return scene.rexUI.add.label({
        width: width, height: height,
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x268bd2),
        text: scene.add.text(0, 0, text, {fontSize: fontsize,
            color: "#ffffff", fontStyle: "bold", fontFamily: font}).setResolution(2),
        space: {
            left: 10,
            right: 10,
        },
        align: align
    });
};

thechatBox=null;

makeChatBox = function (scene, socket, room, scene2=scene) {
    var chatbutton = scene.rexUI.add.buttons({
        x: 1000-140, y: 750-40,
        orientation: 'y',
        buttons: [
            createFlexibleButton(scene, 'Send to Chat', 120, 40, 30)
        ],
        space: {item: 30},
        align: 'center'
    }).layout().setScrollFactor(0);
    // the input box
    var chatBox = scene.add.rexInputText(1000-200, 750-100, 5, 10, {
                id: 'chatBox',
                type: 'textarea',
                placeholder: '(Chat as ' + playerName + ')',
                fontSize: '22px',
                border: 1,
                color: '0xffffff',
                backgroundColor: 'white',
                maxLength: 56
    }).setScrollFactor(0).resize(350, 60).setOrigin(0.5);
    thechatBox=chatBox;

    // the output box
    var textBox = scene.add.rexInputText(1000-560, 750-80, 5, 10, {
        id: 'textBox',
        type: 'textarea',
        text: "",
        fontSize: '18px',
        border: 1,
        color: '0xffffff',
        backgroundColor: 'white',
        maxLength: 200,
        readOnly: true
    }).setScrollFactor(0).resize(320, 100).setOrigin(0.5);

    wordBox.node.addEventListener("keydown", function (evt) {
        switch(evt.keyCode) {
            case 27:
                chatBox.text = "";
                document.getElementById("textBox").focus();
                break;
            default: break;
        }
    });

    chatBox.node.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            var txt=chatBox.text;
            var real_txt='';
            for(var t of txt) if(t!='\n'&&t!='\r') real_txt+=t;
            if(real_txt!='')
                socket.emit("chatmessage", real_txt, room);
            chatBox.text = "";
            document.getElementById("textBox").focus();

        }
    });
    
    chatBox.node.addEventListener("focus", function(event) {
        console.log(scene2,'??');
        ingame++;
        scene2.input.keyboard.disableGlobalCapture();
    });
    chatBox.node.addEventListener("blur", function(event) {
        console.log(scene2,'??');
        ingame--;
        scene2.input.keyboard.enableGlobalCapture();
    });

    messages = [];

    chatbutton
    .on('button.click', function (button, index, pointer, event) {
        // console.log("chat sent");
        socket.emit("chatmessage", chatBox.text, room);
        chatBox.text = "";
        document.getElementById("textBox").focus();
    })
    .on('button.over', function (button, groupName, index) {
        button.getElement('background').setStrokeStyle(5, 0xb58900);
    })
    .on('button.out', function (button, groupName, index) {
        button.getElement('background').setStrokeStyle();
    });
    socket.removeAllListeners("newchat");
    socket.on("newchat", function (msg) {
        messages.push(msg);
        var chatstr = "";
        for (var i = Math.max(0, messages.length - 4); i < messages.length; ++i) {
            if(chatstr!='') chatstr+='\n';
            chatstr += messages[i];
        }
        textBox.text = chatstr;
//        setTimeout(function(){textBox.scrollTop=0;textBox.scrollLeft=0;},100);
    });
};