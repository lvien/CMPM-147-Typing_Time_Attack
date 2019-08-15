class GenerativeGrammar {
    constructor()
    {
        this.skill = 0;

        this.adj = ["angry","bald","basic","blind","busy","crazy","dead","depressed","drunk","fat","fingerless","free","giant","good 'ol","happy","hungry","incredulous","iron-deficient",
        "lackadaisical","mighty","naked","oddball","pregnant","raw","rotten","sad","skinny","sleepy","sweaty","swole","tiny","unscrupulous","wet","wild"];

        this.nouns = ["alien","animal","apple","bear","boy","brick","car","dog","dollar","donkey","earwig","elephant","falafel","girl","hippie","hot dog",
        "man","monkey","onion","platypus","raccoon","salmon","scrambled egg","shish kebab","spider","tree","woman"];

        this.names = ["Aaron","Andy","Billy","Bob","Brian","Brianna","Claire","Dave","Ed","Ellie","Freddie","Gina","James","Jill","Lee","Leon",
        "Leslie","Morty","Roger","Zed"];

        this.long_names = ["Arnold Schwarzenegger","Billy Bob Thornton","Catherine Zeta-Jones","Chloe Grace Moretz","Christopher Mintz-Plasse",
        "Christopher Walken","Conan O'Brien","Daniel Day-Lewis","Edward Van Halen", "F. Scott Fitzgerald","Genghis Khan","Gordon Ramsay",
        "Led Zeppelin","Ludwig Van Beethoven","Napoleon Bonaparte","Nikolaj Coster-Waldau","Rick and Morty","Shaquille O'Neal",
        "Sylvester Stallone","Thanos","Zach Galifianakis"];

        this.verbs = ["ate","attacked","challenged","cooked","destroyed","drop-kicked","harassed","ignored","paid for","petted","proposed to","roasted","shipped",
        "shooed","smelt","smiled at","taunted","underestimated"];

        this.struct;
    }
    setSkill(skill)
    {
        this.skill = skill;
    }
    makeObject() //generate adjective and noun
    {
        let n = this.nouns.concat(this.long_names);
        let one = this.makeAdjective().key;
        let two = n[Math.floor(random(n.length))];
        //make first letters uppercased
        let c = one[0].toUpperCase();
        one = c+one.substr(1);
        c = two[0].toUpperCase();
        two = c+two.substr(1);
        return one+" "+two;
    }
    makeNoun(skill)
    {
        let list = this.nouns.concat(this.names);
        if (skill > 3)
            list = list.concat(this.long_names);
        
        let num = Math.floor(random(list.length));
        let string = "";
        let n = false;
        string = list[num];
        if (num >= this.names.length+this.nouns.length)
        {
            n = 2;
        }
        else if (num >= this.nouns.length)
            n = 1;

        return {"name":n,"key":string};
    }
    makeVerb()
    {
        let num = Math.floor(random(this.verbs.length));
        let string = this.verbs[num];

        return string;
    }
    makeAdjective()
    {
        let num = Math.floor(random(this.adj.length));
        let string = this.adj[num];
        let v = this.isVowel(string[0]);

        return {"vowel":v,"key":string};
    }
    generateChar()
    {
        this.struct = {"words":[],"nouns":[],"names":[]};
        let expressions = "qwertyuiopasdfghjklzxcvbnm";
        this.struct.words.push(expressions[Math.floor(random(expressions.length))]);
        return this.struct;
    }
    generate()
    {
        this.struct = {"words":[],"nouns":[],"names":[]};
        let key;
        let final = "";
        switch (this.skill)
        {
            case 0:
            case 1:
                key = this.makeNoun(this.skill);
                if (!key.name)
                    final += "The ";
                final += key.key;

                if (this.skill == 0)
                    final = final.toLowerCase();
                this.struct.words.push(final);
                break;
            case 2:
                final = "The ";
                final += this.makeAdjective().key+" ";
                this.struct.words.push(final);
                key = this.makeNoun(this.skill);
                this.struct.nouns.push(key.key);
                this.struct.names.push(key.name);
                break;
            case 3:
                final = "The ";
                final += this.makeAdjective().key+" ";
                this.struct.words.push(final);
                key = this.makeNoun(this.skill);
                this.struct.nouns.push(key.key);
                this.struct.names.push(key.name);
                final = " "+this.makeVerb() + " ";
                key = this.makeNoun(this.skill);
                if (!key.name)
                {
                    let char = key.key[0];
                    if (this.isVowel(char))
                        final += "an ";
                    else
                        final += "a ";
                }
                this.struct.words.push(final);
                this.struct.nouns.push(key.key);
                this.struct.names.push(key.name);
                break;
            case 4:
                final = "The ";
                final += this.makeAdjective().key+" ";
                this.struct.words.push(final);
                key = this.makeNoun(this.skill);
                this.struct.nouns.push(key.key);
                this.struct.names.push(key.name);
                key = this.makeAdjective();
                final = " "+this.makeVerb();
                if (key.vowel)
                    final += " an ";
                else
                    final += " a ";
                final += key.key+" ";
                this.struct.words.push(final);
                key = this.makeNoun(this.skill);
                this.struct.nouns.push(key.key);
                this.struct.names.push(key.name);
                break;
            default:
                
                break;
        }
        return this.struct;


    }
    getPrompt()
    {
        return this.struct;
    }
    getString()
    {
        let final = "";
        for (let i = 0; i < this.struct.words.length; i++)
        {
            
            final += this.struct.words[i];
            if (this.struct.nouns.length)
                final += this.struct.nouns[i];
        }
        return final;
    }
    isVowel(char)
    {
        switch (char)
        {
            case 'a':
            case 'e':
            case 'i':
            case 'o':
            case 'u':
                return true;;
                break;
            default:
                return false;
                break;
        }
    }
}