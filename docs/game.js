class TypingGame {
    constructor(typeCallback,correctCallback,wrongCallback)
    {
        this.correctCallback = correctCallback;
        this.type = typeCallback; //sound effect
        this.wrong = wrongCallback;
        this.parser = new GenerativeGrammar();
        this.skill = 0;
        this.deleteTimer = 0;
        this.input = "";
        this.title = "Typing Time Attack";
        this.prompt = "type to start";
        this.progress = 0;
        this.y = 128;
        this.score = 0;
        this.skills = ["ez","Granny Typer","Middle School Elective","Teenage Texter","Live Sports Subtitles"];
        this.accuracy = 0;
        this.state = 0; //0 = menu, 1 = tutorial, 2 = playing, 3 = game over
        this.key = "";
        this.correct = 0;
        this.letters = 0;
        this.maxTime = 60;
        this.font = "";
        this.codename = "";
        this.completed = 0;
        this.allFonts = ["Times New Roman","Comic Sans MS","Century Gothic","Arial"];
        this.fontColor = "";
        this.allColors = ["LightBlue","LightGreen","Pink","Yellow","Orange"];
        this.time = 0;
        this.timeWPM = 0;
        this.gameTimer = 0;
        this.wpm = 0;
        this.rate = 0;
        this.messages = [];
        this.constant = 72/(5-this.skill);
        this.speed = 0;
    }
    startGame()
    {
        this.deleteTimer = 0;
        this.input = "";
        this.prompt = "type to start";
        this.progress = 0;
        this.y = 128;
        this.score = 0;
        this.accuracy = 0;
        this.key = "";
        this.correct = 0;
        this.letters = 0;
        this.font = "";
        this.codename = "";
        this.completed = 0;

        this.gameTimer = 0;
        this.wpm = 0;
        this.rate = 0;
        this.messages = [];
        this.speed = 0;

        this.font = this.allFonts[Math.floor(random(this.allFonts.length))];
        this.fontColor = this.allColors[Math.floor(random(this.allColors.length))];
        this.deleteTimer = 0;
        this.progress = 0;

        if (this.skill < 2)
            this.speed = 2;
        else
            this.speed = this.constant/this.prompt.length;
        if (this.speed > 4)
            this.speed = 4;
    }
    newFloat(string,color,x,y)
    {
        let float = new floatString(string,color,x,y,"Arial Black",24);
        this.messages.push(float);
    }
    drawFloat()
    {
        //update all floaty messages
        for (let i = 0; i < this.messages.length; i++)
        {
            let message = this.messages[i];
            message.draw();
            if (message.alpha <= 0) //no longer visible
            {
                this.messages.splice(i,1); //remove
            }
        }
    }
    updateScore(amount)
    {
        if (this.state == 2)
        {
            let color = "LightGreen";
            let sign = "+";
            if (amount < 0)
            {
                sign = "";
                color = "Red";
            }
            this.score += amount;
            if (this.score < 0)
                this.score = 0;
            this.newFloat(sign+amount,color,displayWidth-750,650);
        }
    }
    pressKey(key)
    {
        this.key = key;
        if (key.length == 1)
        {
            if (this.state == 2)this.letters++;
            this.input += key;
            if (this.state == 0) //title is an easter egg!!
            {
                this.type();
                this.title += key;
            }
        }
        if (this.state == 1||this.state == 2)
        {
            if (this.input[this.progress] == this.prompt[this.progress])
            {
                if (this.state == 2)
                    this.rate++;
                this.updateScore(1);
                this.type();
                if (this.state == 2)this.correct++;
                if (++this.progress >= this.prompt.length)
                {
                    if (this.state == 2)
                        this.completed++;
                    this.correctCallback();
                    this.updateScore(this.prompt.length);
                    this.newPrompt();
                }
            }
            else if (key.length == 1)
            {
                this.updateScore(-2);
                this.wrong();
            }

            if (this.letters == 0)
                this.accuracy = 0;
            else
                this.accuracy = Math.round(100*(this.correct/this.letters));
        }
    }
    newPrompt()
    {
        if (this.state == 1)
        {
            this.time = (second()+1)%60;
            this.timeWPM = (second()+4)%60;
        }
        this.parser.setSkill(this.skill);
        this.state = 2;
        this.font = this.allFonts[Math.floor(random(this.allFonts.length))];
        this.fontColor = this.allColors[Math.floor(random(this.allColors.length))];
        this.input = "";
        this.deleteTimer = 0;
        this.progress = 0;
        this.parser.generate();
        this.prompt = this.parser.getString();
        this.y = 24;

        if (this.skill < 2)
            this.speed = 2;
        else
        {
            this.constant = 72/(5-this.skill);
            this.speed = this.constant/this.prompt.length;
        }
        if (this.speed > 4)
            this.speed = 4;
    }
    releaseKey(key)
    {
        this.key = "";
        if (key == 8)
            this.deleteTimer = 0;
    }
    checkBackSpace()
    {
        //backspace button is pressed
        if (keyIsDown(8))
        {
            if (this.input||this.title)
            {
                //press once to delete, hold for a while to rapid delete
                if (this.deleteTimer == 0||(this.deleteTimer%2 == 0 && this.deleteTimer > 20))
                {
                    //delete only incorrect chars
                    if (this.input.length > this.progress)
                    {
                        this.type();
                        this.input = this.input.substr(0,this.input.length-1);
                    }
                    if (this.state == 0 && this.title)
                    {
                        this.type();
                        this.title = this.title.substr(0,this.title.length-1);
                    }
                }
                this.deleteTimer++;
            }
        }
    }
    update()
    {
        this.checkBackSpace();
        //5 seconds elapsed
        if (second() == this.time && this.state == 2) //WPM Timer
        {
            if (second() == this.timeWPM)
            {
                this.timeWPM = (second()+4)%60;
                this.wpm = Math.round((this.rate/5)*12);
                this.rate = 0;
            }
            this.gameTimer++;

            //count chars typed
            this.time = (second()+1)%60;
            if (this.gameTimer >= this.maxTime) //120
            {
                this.wrong();
                this.time = (second()+2)%60;
                this.state = 3;
            }
        }
    }
    getState()
    {
        return this.state;
    }
    drawPrompt()
    {
        push();
        if (this.state == 2)
        {
            let prompt = this.parser.getPrompt();
            let offset = 0;
            noStroke();
            for (let i = 0; i < prompt.words.length; i++)
            {
                fill(this.fontColor);
                let word = prompt.words[i];
                text(word,25+offset,this.y);
                offset += textWidth(word);
                if (prompt.nouns[i])
                {
                    word = prompt.nouns[i];
                    if (prompt.names[i] == 2)
                        fill("Magenta");
                    text(word,25+offset,this.y);
                    offset += textWidth(word);
                }
            }
        }
        else
        {
            fill(this.fontColor);
            text(this.prompt,25,this.y);
        }
        fill("White");
        let offset = 0;
        let correct = this.prompt.substr(0,this.progress);
        offset = textWidth(correct);
        text(correct,25,this.y+30); //0.75
        let incorrect = this.input.substr(this.progress);
        if (this.input.length > this.progress)
            fill("Red");
        incorrect += "^";
        text(incorrect,25+offset,this.y+30);
        pop();
    }
    drawKeyboard()
    {
        let keyboardOffset = 150;
        let clicked = false;
        let LOWER = ["`1234567890-="," qwertyuiop[]\\"," asdfghjkl;'"," zxcvbnm,./"];
        let CAPS = ["~!@#$%^&*()_+"," QWERTYUIOP{}|"," ASDFGHJKL:\""," ZXCVBNM<>?"];
        let keys = [];
        if (keyIsDown(16))
            keys = CAPS;
        else
            keys = LOWER;
        let rowoffset = 0;
        let size = 40;
        push();
        textSize(24);
        textFont("Arial");
        let spaceOffset = {"x":0,"y":0};
        for (let i = 0; i < keys.length; i++)
        {
            let row = keys[i];
            for (let j = 0; j < row.length; j++)
            {
                let char = row[j];
                if (this.key == char)
                {
                    clicked = true;
                    if (this.key == this.prompt[this.progress-1]||!this.input)
                        fill(64,255,64);
                    else
                        fill(255,128,128);
                }
                else
                    fill(255);
                noStroke();
                let x = keyboardOffset+((size+3)*j)+(i*10);
                let y = 650+((size+4)*i);
                if (char == "c"||char == "C")
                {
                    spaceOffset.x = x;
                    spaceOffset.y = y+(size+4);
                }
                if (char != " ")
                {
                    rect(x,y,size,size);
                    fill("Black");
                    textAlign(CENTER,CENTER);
                    text(row[j],x+(size/2),y+(size/2));
                }

            }
        }
        //Backspace
        if (keyIsDown(8))
            fill(192);
        else
            fill(255);
        rect(keyboardOffset+(size+3)*13,650,size*2,size);
        fill("Black");
        text("Back",keyboardOffset+(size+3)*13+size,650+(size/2));
        
        //Shift Key
        if (keyIsDown(16))
            fill(192);
        else
            fill(255);

        let shiftY = 650+(size+4)*3;
        let shiftW = ((size+3)*1)+(3*10)-3;
        rect(keyboardOffset,shiftY,shiftW,size);
        rect(keyboardOffset+((size+3)*11)+(3*10),shiftY,shiftW,size);

        //Space key
        if (this.key == " ")
        {
            if (this.prompt[this.progress-1] == " "||!this.input)
                fill(64,255,64);
            else
                fill(255,128,128);
        }
        else
            fill(255);
        let barWidth = (size+3)*6;
        rect(spaceOffset.x,spaceOffset.y,barWidth-3,size);
        pop();
        if (this.grace)
            this.grace = false;
    }
    drawScore()
    {
        //print rank after a few seconds
        if (!this.codename && second() == this.time)
        {
            this.time = -1;
            let noun = this.parser.makeObject();
            this.codename = noun;
            this.wrong();
        }

        background(240);
        fill("Black");
        rect(0,0,width,height);
        fill("White");
        textAlign(LEFT, TOP);
        textFont("Arial Black");
        noStroke();
        textSize(64);
        text("Score: "+this.score+"\nAccuracy: "+this.accuracy+"%"+"\nWPM: "+this.wpm+
            "\nPrompts completed: "+this.completed,100,100);
        push();
        fill("Blue");
        textAlign(CENTER,CENTER);
        let x = width/2;
        let y = 800;
        //player can reset after seeing rank
        if (this.time == -1)
        {
            let w = textWidth("Main Menu");
            if (mouseX <= x+w && mouseX >= x-w)
            {
                if (mouseY <= y+32 && mouseY >= y-32)
                {
                    fill(128,128,255);
                    if (mouseIsPressed)
                    {
                        this.type();
                        //go to main menu
                        this.state = 0;
                    }
                }
            }
            text("Main Menu",x,y);
        }
        pop();
        fill("Red");
        text("Rank: "+this.codename,100,500);
    }
    drawHud()
    {
        fill("LightBlue");
        textAlign(LEFT, TOP);
        textFont("Arial Black");
        noStroke();
        textSize(48);
        let min = Math.floor((this.maxTime-this.gameTimer)/60);
        let sec = (this.maxTime-this.gameTimer)%60;
        text("Score: "+this.score+"\nTime Left: "+min+":"+("0"+sec).substr(-2)+"\nAccuracy: "+
            this.accuracy+"%"+"\nWPM: "+this.wpm,displayWidth-975,650);
    }
    drawMenu()
    {
        background(240);
        this.checkBackSpace();
        textSize(96);
        textAlign(CENTER,CENTER);
        fill("Black");
        rect(0,0,width,height);
        fill("White");
        textFont("Times New Roman");
        text (this.title,width/2,150);

        textSize(48);
        fill("Red");
        textFont("Arial Black");
        text("Choose a skill",300,400);

        //create clickable menu items
        fill("Purple");
        for (let i = 0; i < this.skills.length; i++)
        {
            push();
            let skill = this.skills[i];
            let y = 300+(i*100);
            let x = width/2;
            //mouse is hovered over menu item
            if (mouseX <= x+(textWidth(skill)/2) && mouseX >= x-(textWidth(skill)/2))
            {
                if (mouseY >= y-24 && mouseY <= y+24)
                {
                    //highlight menu item
                    fill(128,128,255);
                    //player pressed item
                    if (mouseIsPressed)
                    {
                        this.state = 1;
                        this.skill = i;
                        this.type();
                        this.startGame();
                        break;
                    }
                }
            }
            text(skill,width/2,y);
            pop();
        }
    }
    draw()
    {
        //sets appropriate game state
        switch (this.state)
        {
            case 0:
                this.drawMenu();
                break;
            case 1:
            case 2:
                this.update();
                this.drawGame();
                break;
            default:
                this.drawScore();
                break;
        }
    }
    drawGame()
    {
        background(240);
        fill("Black");
        rect(0,0,width,height);
        textSize(24);
        stroke("Black");
        strokeWeight(4);
        textFont(this.font);
        textAlign(LEFT,BOTTOM);
        //didn't type fast enough
        if (this.y > 625+40)
        {
            //make new prompt and deduct points
            this.updateScore(-this.prompt.length*2);
            this.newPrompt();
            this.wrong();
        }
        if (this.state == 2)this.y += this.speed;
        this.drawPrompt();
        fill(96);
        rect(0,625,displayWidth-325,height-625);
        fill("Blue");
        rect(displayWidth-1000,625,675,height-625);
        fill("Red");
        //text(this.input,400,400);
        this.drawHud();
        this.drawKeyboard();

        this.drawFloat();
    }
}