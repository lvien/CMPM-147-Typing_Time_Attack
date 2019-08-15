class floatString {
    constructor(string,color,x,y,font,size)
    {
        this.string = string;
        this.color = color;
        this.x = x;
        this.y = y;
        this.yvel = random(1,2);
        this.xvel = random(-1.5,1.5);
        this.size = size;
        this.font = font;
        this.alpha = 255;
    }
    draw()
    {
        push();
        noStroke();
        if (this.alpha > 0)
        {
            this.alpha -= 2;
        }
        else
            this.alpha = 0;
        textFont(this.font);
        textSize(this.size);
        //fill(this.color);
        let c = color(this.color);
        c.setAlpha(this.alpha);
        fill(c);
        textAlign(CENTER,BOTTOM);
        text(this.string,this.x += this.xvel,this.y -= this.yvel);
        pop();
    }
}