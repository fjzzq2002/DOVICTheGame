function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

var depth = 99999999;
all_quitters=[];
dictionary = ['hackmit', 'search', 'contact', 'online', 'service', 'people', 'health', 'should', 'product', 'system', 'policy', 'number', 'please', 'support', 'message', 'software', 'public', 'school', 'through', 'review', 'privacy', 'company', 'general', 'research', 'january', 'program', 'united', 'center', 'travel', 'report', 'member', 'before', 'because', 'office', 'national', 'design', 'posted', 'internet', 'within', 'shipping', 'reserved', 'subject', 'between', 'family', 'special', 'website', 'project', 'version', 'section', 'related', 'security', 'county', 'american', 'network', 'computer', 'download', 'without', 'current', 'control', 'history', 'personal', 'location', 'change', 'rating', 'children', 'during', 'return', 'shopping', 'account', 'digital', 'profile', 'another', 'property', 'quality', 'listing', 'content', 'country', 'private', 'little', 'customer', 'december', 'compare', 'include', 'college', 'article', 'provide', 'source', 'author', 'around', 'course', 'canada', 'training', 'credit', 'science', 'advanced', 'english', 'estate', 'select', 'thread', 'category', 'gallery', 'register', 'however', 'october', 'november', 'market', 'library', 'really', 'action', 'industry', 'provided', 'required', 'second', 'better', 'medical', 'friend', 'server', 'feedback', 'looking', 'complete', 'street', 'comment', 'working', 'against', 'standard', 'person', 'mobile', 'payment', 'student', 'recent', 'problem', 'memory', 'social', 'august', 'language', 'create', 'america', 'single', 'example', 'password', 'latest', 'question', 'browse', 'building', 'seller', 'february', 'result', 'release', 'request', 'making', 'picture', 'possible', 'future', 'london', 'meeting', 'become', 'interest', 'similar', 'garden', 'million', 'listed', 'learning', 'energy', 'delivery', 'popular', 'journal', 'welcome', 'central', 'notice', 'original', 'council', 'archive', 'format', 'society', 'safety', 'edition', 'further', 'updated', 'having', 'already', 'common', 'specific', 'several', 'living', 'called', 'display', 'limited', 'powered', 'director', 'natural', 'whether', 'period', 'planning', 'database', 'official', 'weather', 'average', 'window', 'france', 'region', 'island', 'record', 'direct', 'district', 'calendar', 'update', 'resource', 'present', 'either', 'document', 'material', 'written', 'federal', 'hosting', 'centre', 'finance', 'europe', 'reading', 'usually', 'together', 'percent', 'function', 'getting', 'global', 'economic', 'player', 'submit', 'germany', 'amount', 'included', 'though', 'weight', 'received', 'choose', 'magazine', 'camera', 'receive', 'domain', 'chapter', 'beauty', 'manager', 'position', 'michael', 'florida', 'simple', 'license', 'friday', 'annual', 'google', 'church', 'method', 'purchase', 'active', 'response', 'practice', 'hardware', 'figure', 'holiday', 'enough', 'designed', 'writing', 'discount', 'higher', 'created', 'remember', 'yellow', 'increase', 'kingdom', 'thought', 'french', 'storage', 'nature', 'africa', 'summary', 'growth', 'agency', 'monday', 'european', 'activity', 'although', 'western', 'income', 'overall', 'package', 'engine', 'regional', 'started', 'double', 'screen', 'exchange', 'continue', 'needed', 'season', 'someone', 'anything', 'printer', 'believe', 'effect', 'sunday', 'casino', 'volume', 'anyone', 'mortgage', 'silver', 'inside', 'solution', 'mature', 'rather', 'addition', 'supply', 'nothing', 'certain', 'running', 'jewelry', 'clothing', 'robert', 'homepage', 'advice', 'career', 'military', 'rental', 'decision', 'british', 'middle', 'taking', 'division', 'coming', 'tuesday', 'object', 'lesbian', 'machine', 'length', 'actually', 'client', 'capital', 'follow', 'sample', 'saturday', 'england', 'culture', 'george', 'choice', 'starting', 'thursday', 'consumer', 'airport', 'foreign', 'artist', 'outside', 'channel', 'letter', 'summer', 'degree', 'contract', 'button', 'matter', 'custom', 'virginia', 'almost', 'located', 'multiple', 'editor', 'featured', 'female', 'primary', 'cancer', 'reason', 'browser', 'spring', 'answer', 'friendly', 'schedule', 'purpose', 'feature', 'police', 'everyone', 'approach', 'physical', 'medicine', 'chicago', 'wanted', 'unique', 'survey', 'animal', 'mexico', 'regular', 'secure', 'simply', 'evidence', 'station', 'paypal', 'favorite', 'option', 'master', 'valley', 'recently', 'probably', 'improve', 'larger', 'impact', 'transfer'];

unscramble = function (scene, pset_type, scene2) {
    scene2.input.keyboard.disableGlobalCapture();
    console.log(pset_type);
    console.log("minigame starts");
    var r1 = scene.add.rectangle(1000/2, 750/2, 600, 400, 0xffffff).setScrollFactor(0);
    var word = dictionary[getRandomInt_(0, dictionary.length - 1)].toUpperCase();
    var letters = [];
    var typed = [];
    var letterbox = [];
    var wordBox;
    var clearbt;
    var swapbt;

    // initialize the game
    var init = function(word) {
        var this_good=true;
        letters = []
        typed = []
        letterbox = [];
        wordBox = [];
        for (w of word) {
            letters.push(w);
            typed.push(false);
        }
        shuffle(letters);
        // TODO: cheating
        console.log(word);
        console.log(letters);
        var wordBoxWidth = letters.length * 30;
        wordBox = scene.add.rexInputText(1000/2, 750/2-70, wordBoxWidth, 50, {
            id: 'wordBox',
            type: 'text',
            text: '',
            fontSize: '34px',
            fontFamily: 'Inconsolata',
            border: 1,
            readOnly: true,
            boundsAlignV: "middle",
            color: '0x000000',
            backgroundColor: 'transparent',
            depth: depth,
            borderColor: '0x000000',
            maxLength: 50
        }).setOrigin(0.5).setScrollFactor(0);
        document.getElementById('wordBox').focus();
        var width = 40; // the width of each letter
        for (var i = 0; i < letters.length; i++) {
            letterbox.push(scene.add.rexInputText(1000/2 + (i + 0.5 - letters.length / 2.) * width + 10, 750/2+40, width, 50, {
                id: 'Box',
                type: 'text',
                text: letters[i],
                fontFamily: 'Inconsolata',
                fontSize: '34px',
                border: 0,
                readOnly: true,
                depth: depth,
                color: '0x000000',
                backgroundColor: 'transparent',
                borderColor: '0x000000',
                maxLength: 1
            }).setOrigin(0.5).setScrollFactor(0));
        }
        // initialize the buttons
        // clear button
        buttongroup = scene.rexUI.add.buttons({
            x: 1000/2, y: 750/2+100, width: 20,
            orientation: 'x',
            buttons: [
                createFlexibleButton(scene, 'clear', 40, 40, 20),
                createFlexibleButton(scene, 'skip', 40, 40, 20),
                createFlexibleButton(scene, 'quit', 40, 40, 20),
//                createFlexibleButton(scene, 'cheat', 40, 40, 20),
            ],
            space: {item: 40},
            align: 'center'
        }).setScrollFactor(0).layout();
        buttongroup
            .on('button.click', function (button, index, pointer, event) {
                console.log(button);
                if(button.text=='cheat') cheat();
                else if(button.text=='clear') reset();
                else if(button.text=='quit') quit();
                else swap();
            })
            .on('button.over', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle(5, 0xb58900);
            })
            .on('button.out', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle();
            });
        // test if the game is over
        var minigameover = function() {
            if (answer == word) {
                console.log("WINNER WINNER CHICKEN DINNER");
                // TODO: Send victory to server or something
                if (pset_type == 0) socket.emit('get_pset'); // get_pset
                else socket.emit('pset_progress');
                // destroy all minigame components
                r1.destroy();
                wordBox.destroy();
                buttongroup.destroy();
                for (var box of letterbox) {
                    box.destroy();
                }
                --ingame;
                this_good=false;
                scene2.input.keyboard.enableGlobalCapture();
                scene.scene.stop();
            }
            else if (answer.length == word.length) {
                // reload the puzzle
                console.log("WA");
                reset();
            }
        }
        var cheat = function() {
            if (pset_type == 0) socket.emit('get_pset'); // get_pset
            else socket.emit('pset_progress');
            // destroy all minigame components
            r1.destroy();
            wordBox.destroy();
            buttongroup.destroy();
            for (var box of letterbox) {
                box.destroy();
            }
            --ingame;
            this_good=false;
            scene2.input.keyboard.enableGlobalCapture();
            scene.scene.stop();
        };
        var quit = function() {
            if(!this_good) return;
            r1.destroy();
            wordBox.destroy();
            buttongroup.destroy();
            for (var box of letterbox) {
                box.destroy();
            }
            --ingame;
            this_good=false;
            scene2.input.keyboard.enableGlobalCapture();
            scene.scene.stop();
        };
        all_quitters.push(quit);
        // handle keyboard input
        wordBox.node.addEventListener("keypress", function (evt) {
            if (evt.which != 8 && evt.which != 0 && evt.which > 127) {
                evt.preventDefault();
                console.log(evt.which);
            }
            console.log(evt.which);
            var input = '';
            if (evt.which >= 97 && evt.which <= 97 + 25) {
                input = String.fromCharCode(evt.which - 32);
                console.log(input);
            }
            if (evt.which >= 64 && evt.which <= 64 + 25) {
                input = String.fromCharCode(evt.which);
                console.log(input);
            }
            for (var i = 0; i < letters.length; i++) {
                if (letters[i] == input && !typed[i])  {
                    typed[i] = true;
                    letterbox[i].text = "";
                    answer += input;
                    wordBox.text = answer
                    // test if game is over
                    minigameover(answer);
                    break;
                }
            }
            // backspace
            // not implemented
        });
    }

    init(word);

    var answer = "";

    // swap word
    var swap = function() {
        wordBox.destroy();
        buttongroup.destroy();
        for (var box of letterbox) {
            box.destroy();
        }
        answer = "";
        word = dictionary[getRandomInt_(0, dictionary.length - 1)].toUpperCase();
        init(word);
    }

    // reset the game
    var reset = function() {
        answer = "";
        for (var i = 0; i < letters.length; i++) {
            letterbox[i].text = letters[i];
            typed[i] = false;
        }
        wordBox.text = "";
    }
}

unscramble_scene = new Phaser.Scene("unscramble");

unscramble_scene.init = function (data) {
    this.pset_type = data.pset_type;
    this.pscene = data.pscene;
}
unscramble_scene.preload = function () {
    this.load.scenePlugin({
        key: 'rexuiplugin',
        url: 'js/rexuiplugin.min.js',
        sceneKey: 'rexUI'
    });
};

unscramble_scene.create = function () {
    var self = this;
    unscramble(self, self.pset_type, self.pscene);
}


calcgame = function (scene, pset_type, scene2) {
    scene2.input.keyboard.disableGlobalCapture();
    console.log(pset_type);
    console.log("minigame calculator starts");
    var r1 = scene.add.rectangle(1000/2, 750/2, 600, 400, 0xffffff).setScrollFactor(0);
    var letters = [];
    var typed = [];
    var letterbox = [];
    var wordBox;

    // initialize the game
    var init = function() {
        var this_good=true;
        var problem = "";
        if(Math.random()<0.6) {
            var m=(Math.random()<0.5)?'+':'-';
            var a,b;
            while(1) {
                a=getRandomInt_(1,99);
                b=getRandomInt_(1,99);
                if(m=='-'&&a<b) continue;
                break;
            }
            problem=a+m+b;
        }
        else {
            problem=getRandomInt_(2,9)+'*'+getRandomInt_(2,9);
        }
        var answer=eval(problem);
        console.log(problem,answer);
        scene.add.text(1000/2,750/2-70,problem,{
            fontSize: 50, color: "#000000",
            fontFamily: 'Montserrat'
        }).setOrigin(0.5);
        wordBox = scene.add.rexInputText(1000/2, 750/2-10, 200, 50, {
            id: 'wordBox',
            type: 'text',
            text: '',
            fontSize: '34px',
            fontFamily: 'Inconsolata',
            border: 1,
//            readOnly: true,
            boundsAlignV: "middle",
            color: '0x000000',
            backgroundColor: 'transparent',
            depth: depth,
            borderColor: '0x000000',
            maxLength: 50
        }).setOrigin(0.5).setScrollFactor(0);
        document.getElementById('wordBox').focus();
        // initialize the buttons
        buttongroup = scene.rexUI.add.buttons({
            x: 1000/2, y: 750/2+100, width: 20,
            orientation: 'x',
            buttons: [
                createFlexibleButton(scene, 'clear', 40, 40, 20),
                createFlexibleButton(scene, 'quit', 40, 40, 20)
            ],
            space: {item: 40},
            align: 'center'
        }).setScrollFactor(0).layout();
        buttongroup
            .on('button.click', function (button, index, pointer, event) {
                console.log(button);
                if(button.text=='clear') reset();
                else quit();
            })
            .on('button.over', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle(5, 0xb58900);
            })
            .on('button.out', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle();
            });
        // test if the game is over
        var minigameover = function() {
            try
            {
            if (answer == wordBox.text) {
                console.log("WINNER WINNER CHICKEN DINNER");
                // TODO: Send victory to server or something
                if (pset_type == 0) socket.emit('get_pset'); // get_pset
                else socket.emit('pset_progress');
                // destroy all minigame components
                r1.destroy();
                wordBox.destroy();
                buttongroup.destroy();
                --ingame; this_good=false;
                scene2.input.keyboard.enableGlobalCapture();
                scene.scene.stop();
            }
            else if (answer.length == word.length) {
                // reload the puzzle
                console.log("WA");
                reset();
            }
            }catch(e) {return;}
        }
        var quit = function() {
            if(!this_good) return;
            r1.destroy();
            wordBox.destroy();
            buttongroup.destroy();
            --ingame; this_good=false;
            scene2.input.keyboard.enableGlobalCapture();
            scene.scene.stop();
        };
        all_quitters.push(quit);
        // handle keyboard input
        wordBox.node.addEventListener("keypress", function (evt) {
            if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
                evt.preventDefault();
            }
            function chkgame() {
                if(wordBox==null||(!ingame)) return;
                if(answer==wordBox.text) minigameover();
            };
            chkgame();
            setTimeout(chkgame,100);
            setTimeout(chkgame,300);
            setTimeout(chkgame,500);
            setTimeout(chkgame,700);
        });
    };

    init();
    // swap word
    var swap = function() {
        wordBox.destroy();
        buttongroup.destroy();
        init();
    }

    // reset the game
    var reset = function() {
        wordBox.text='';
    }
}


calcgame_scene = new Phaser.Scene("calcgame");

calcgame_scene.init = function (data) {
    this.pset_type = data.pset_type;
    this.pscene = data.pscene;
}
calcgame_scene.preload = function () {
    this.load.scenePlugin({
        key: 'rexuiplugin',
        url: 'js/rexuiplugin.min.js',
        sceneKey: 'rexUI'
    });
};

calcgame_scene.create = function () {
    var self = this;
    calcgame(self, self.pset_type, self.pscene);
}