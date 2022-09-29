const fs = require('fs')
const path = require('path')
const { Client, Intents, MessageEmbed } = require('discord.js')
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, "GUILDS", "GUILD_MESSAGES"] });
bot.on('ready', () => {
    console.log("OK")
    console.log(`Logged in as ${bot.user.tag}!`);
    bot.user.setActivity({
        name: "睡阿",
        type: "STREAMING",
        url: "https://www.youtube.com/watch?v=uUBfbLdXArA",
    });
})
bot.on('messageCreate', async message => {
    let PTT = function() {
            return {
                ptt: function(text) { //把東西塞到資料庫裡去進去
                    if (message.content.startsWith(`/D ${text} `)) {
                        let a = message.content;
                        a = a.split(" ");
                        let b = a[2]
                        fs.appendFile(`./rdmvers/${text}.txt`, '"' + b + '"' + ',\n', function(err) {
                            if (err) throw err;
                            console.log("The “data to append” was appended to file!");
                        });
                        fs.readFile(`./rdmvers/${text}.txt`, function(err, data) {
                            if (err) throw err;
                            console.log(data.toString());
                            fs.writeFile(`./rdmvers/${text}.js`,
                                'function url(){\n\tlet dit = [\n' +
                                data.toString() +
                                ']\nreturn dit[Math.floor(Math.random()*(dit.length))];\n}\nmodule.exports= {url};',
                                function(err) {
                                    if (err) { console.log(err); }
                                });
                        });
                        message.channel.send(`已成功將 ${text} 新增至資料庫`);
                    }
                },
                rtt: function(text) {
                    if (message.content.startsWith(`//${text}` + " ")) {
                        let a = message.content;
                        let b = "";
                        let c = `//${text} `;
                        let d = c.length;
                        for (let i = d; i < a.length; i++) {
                            b += a[i];
                        }
                        fs.appendFile(`./rdmvers/${text}.txt`, '"' + b + '"' + ',\n', function(err) {
                            if (err) throw err;
                            console.log("The “data to append” was appended to file!");
                        });
                        fs.readFile(`./rdmvers/${text}.txt`, function(err, data) {
                            if (err) throw err;
                            console.log(data.toString());
                            fs.writeFile(`./rdmvers/${text}.js`,
                                'const badword =[\n' + data.toString() + '];\n' +
                                'let lengthOL = badword.length;\n' +
                                'module.exports= {badword,lengthOL};\n',
                                function(err) {
                                    if (err) { console.log(err); }
                                });
                        });
                        message.channel.send(`已成功將 ${text} 新增至資料庫`);
                    }
                },
                audio: function(a) {
                    a = Math.floor(Math.random() * 17);
                    const { voice } = message.member
                    const pyclID = voice.channelID;
                    voice.channel.join()
                        .then(connection => {
                            const dispatcher = connection.play(`./SongAudio/${a}.mp3`)
                            dispatcher.setVolume(0.5);
                            dispatcher.on("finish", end => {
                                let ptt = PTT();
                                ptt.audio(a);
                            })
                        })
                        .catch(console.error);
                }
            }
        }
        /**
         * @class OSUInput
         */
        /**
         * @MemberOf OSUInput
         * @param {string} game 遊戲代碼
         * @returns {void} 單純輸出Msg
         */
    function OSUInput(game) {
        if (message.content.startsWith(`/D ${game} `)) {
            let temp = message.content.split(" ");
            let game = temp[1];
            let msg = temp[2];
            const { v2, auth } = require('osu-api-extended')
            const osu = async() => {
                const {CLIENT_ID,CLIENT_SECRET}=require('./ID/ID.json');
                const main = async() => {
                    // Auth via client
                    await auth.login(CLIENT_ID, CLIENT_SECRET)
                    let data2 = await v2.user.details(msg, game, "username")
                        //console.log(data2)
                    return data2;
                }
                const str = async() => {
                    //await main();
                    //let json = require('./osu.json');
                    //console.log(json.statistics.grade_counts.ssh)
                    let strs = JSON.parse(await JSON.stringify(await main()))
                        //console.log(Object.keys(strs).length);
                    if (Object.keys(strs).length == 1) return false;
                    let statistics = strs.statistics;
                    console.log(strs.last_visit.split(/[T+]/))
                    let text = {
                        "is_online": strs.is_online,
                        "id": strs.id,
                        "用戶": strs.username,
                        "用戶圖片": strs.avatar_url,
                        "地區": strs.country_code,
                        "世界排名": statistics.global_rank,
                        "區域排名": statistics.country_rank,
                        "等級": statistics.level.current,
                        "遊玩次數": statistics.play_count,
                        "遊玩時間": Math.round(statistics.play_time / 60 / 60),
                        "PP": statistics.pp,
                        "ACC": statistics.hit_accuracy,
                        "地圖評分": {
                            "ssh": statistics.grade_counts.ssh,
                            "ss": statistics.grade_counts.ss,
                            "sh": statistics.grade_counts.sh,
                            "s": statistics.grade_counts.s,
                            "a": statistics.grade_counts.a
                        },
                        "排名總分": statistics.ranked_score,
                        "總分": statistics.total_score,
                        "最大combo數": statistics.maximum_combo,
                        "遊玩方式": strs.playstyle
                    };
                    ///console.log(text)
                    return text;
                };
                return await str();
            }
            const main = async() => {
                let text;
                text = await osu();
                if (text == false) {
                    message.reply("查無此人");
                    return;
                }
                let mark = text.地圖評分;
                if (text.is_online == true) text.is_online = ":green_circle: "
                else text.is_online = ":red_circle: ";
                const exampleEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('個人資訊')
                    .setURL(`https://osu.ppy.sh/users/${text.id}`)
                    .setAuthor({ name: game.toUpperCase(), iconURL: "https://i.imgur.com/HKeOd5V.png" })
                    .setDescription(
                        `遊戲ID:${text.用戶}\n` +
                        `等級:${text.等級}\n` +
                        `地區:${text.地區}\n` +
                        `世界排名:${text.世界排名}\n` +
                        `區域排名:${text.區域排名}\n` +
                        `PP:${text.PP}\n` +
                        `ACC:${text.ACC}%\n` +
                        `遊玩方式:${text.遊玩方式.join()}\n` +
                        `遊玩次數:${text.遊玩次數} (${text.遊玩時間}hr)\n` +
                        `地圖評分:
                        :regional_indicator_s: :regional_indicator_s: :regional_indicator_h:= ${mark.ssh}
                        :regional_indicator_s: :regional_indicator_s:=${mark.ss} 
                        :regional_indicator_s: :regional_indicator_h:=${mark.sh} 
                        :regional_indicator_s:=${mark.s} 
                        :regional_indicator_a:=${mark.a}\n` +
                        `是否再線:${text.is_online}`
                    )
                    .setThumbnail(text.用戶圖片.toString())
                    .setTimestamp()
                    .setFooter({ text: "Copyright©/2022-丁弟#8449", iconURL: 'https://yt3.ggpht.com/yti/APfAmoGLv0sTZimBG-wI2S-6H82ZO6JsDG8TwToApX5dAA=s88-c-k-c0x00ffffff-no-rj-mo' })
                message.channel.send({ embeds: [exampleEmbed] });
            }
            main();
        };
    }
    OSUInput("osu");
    OSUInput("fruits");
    OSUInput("mania");
    OSUInput("taiko");
    if (message.content.startsWith(`/calc` + " ")) {
        let ad = message.content;
        let b = "";

        let c = `/calc` + " ";
        let d = c.length;
        for (let i = d; i < ad.length; i++) {
            b += ad[i];
        }
        let as = require('./Calc.js')
        message.reply(as.CALLBACKcalc(b).toString());
    }
    if (message.content.startsWith(`/D calc`+" ")) {
        let ad = message.content;
        ad = ad.split(' ');
        ad[2]= ad[2].replaceAll('x','*')
        ad[2]= ad[2].replaceAll('`','')
        ad[2]= ad[2].replaceAll('message','')
        ad[2]= ad[2].replaceAll('require','')
        ad[2]= ad[2].replaceAll('fs','')
        ad[2]= ad[2].replaceAll('while','')
        ad[2]= ad[2].replaceAll('for','')
        ad[2]= ad[2].replaceAll('do','')
        console.log(ad[2])
        const { log10 ,log2,abs,sin,cos,tan,asin,acos,atan,log,LN10,LN2,sqrt,PI,pow} = require('mathjs')
        try{
            message.reply(eval(`${ad[2]}`).toString());
        }catch(err){
            message.reply("ERROR")
        }
    }
    if (message.content == "pin") {
        message.react('🍎');
        message.react('🍊');
        message.react('🍇');
        const s = message.id;
        message.delete({
            timeout: 20000
        });
    }
    if (message.content == "/D help") {
        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor({ name: '機器人指令如下', iconURL: 'https://i.imgur.com/RaCycfz.jpg' })
            .setDescription(
                `/D handsome\n` +
                `/D tri\n` +
                `/D @me\n` +
                `/D url <圖片連結>\n` +
                `/D Picture\n` +
                `/D replacefile\n` +
                `/D adj <形容詞>\n` +
                `/D n <名詞>\n` +
                `/D adv <副詞>\n` +
                `/D v <動詞>\n` +
                `/D prov <成語>\n` +
                `/D sentence\n` +
                `/calc <num>\n` +
                `/D weather <緯度> <經度>\n` +
                `/D osu <ID>\n` +
                `/D fruits <ID>\n` +
                `/D mania <ID>\n` +
                `/D taiko <ID>\n`
            )
            .setThumbnail(message.author.avatarURL())
            .setTimestamp()
            .setFooter({ text: 'Copyright©/2022-丁弟#8449', iconURL: 'https://yt3.ggpht.com/yti/APfAmoGLv0sTZimBG-wI2S-6H82ZO6JsDG8TwToApX5dAA=s88-c-k-c0x00ffffff-no-rj-mo' });
        message.channel.send({ embeds: [exampleEmbed] });
    }
    if (message.content == "/D handsome") {
        let a = message.author.id
        message.channel.send("<@" + a + ">" + " 好帥 LOL");
    } //好帥函式
    if (message.content == "/glide") {
        let c = message.guild.roles.cache
        console.log(c);
        //857939799879974923
        //828919940870438912
        message.member.roles.add('828919940870438912').catch(console.log());

    }
    if (message.content == "/D tri") {
        message.delete();
        let a = "";
        for (let i = 1; i <= 5; i++) {
            for (let j = i; j <= 5; j++) {
                a += j;
            }
            a += "\n";
        }
        message.channel.send(a);
    } //數字三角形
    if (message.content == "/D @me") {
        let a = message.author.id
        message.channel.send("<@" + a + ">");
    } //@自己
    let
        adv1 = require('.\\sentence\\adv'),
        adj1 = require('.\\sentence\\adj'),
        v1 = require('.\\sentence\\v'),
        n1 = require('.\\sentence\\n'),
        prov1 = require('.\\sentence\\prov'),
        yn1 = require('.\\sentence\\yn'),
        hesheit1 = require('.\\sentence\\hesheit'),
        hesheitis1 = require('.\\sentence\\hesheitis'),
        _7w1 = require('.\\sentence\\_7w'),
        url1 = require('.\\sentence\\url');

    /**
     * @class Sentence
     * @class SentInput
     */
    /** 
     * @MemberOf Sentence
     * @param {string} text 放入要的型態
     * @param {string} txt Json型態檔的的名子
     * @param {object} ste Json物件變數
     * @returns {boolean} 進行組合
     */
    function sentence(text, txt, ste) {
        if (ste.sentence.indexOf(text) > -1) {
            return false
        }
        ste.sentence[ste.sentence.length] = text;
        //console.log(JSON.stringify(ste)); //Debug 
        //console.log(txt); //Debug 
        fs.writeFile(path.join(__dirname, `.\\sentence\\${txt}.json`),
                JSON.stringify(ste, null, '\t'),
                'utf8',
                function(err) {
                    if (err) { console.log(err) }
                }) // write it back 
        return true
    }
    /** 
     * @MemberOf SentInput
     * @param {string} text 放入要的型態
     * @param {object} ste Json物件變數
     * @returns {void} 添加物件至資料庫 
     */
    function SentInput(text, ste) {
        if (message.content.startsWith(`/D ${text} `)) {
            let a = message.content;
            a = a.split(" ");
            let txt = a[2];
            let bool_ = sentence(txt, text, ste);
            if (bool_ == true) {
                message.channel.send(`已成功將 ${txt} 新增至${text}.json 資料庫`);
            } else message.channel.send("已存在相同的值")
        }
    }
    SentInput("n", n1)
    SentInput("adv", adv1)
    SentInput("adj", adj1)
    SentInput("v", v1)
    SentInput("prov", prov1)
    SentInput("url", url1)
    if (message.content == "/D Picture") {
        let url_random = Math.floor(Math.random() * url1.sentence.length)
        message.channel.send(url1.sentence[url_random])
    }
    if (message.content == "/D sentence") {
        let RDM = Math.floor(Math.random() * 10)
        let N1_random = Math.floor(Math.random() * n1.sentence.length)
        let N2_random = Math.floor(Math.random() * n1.sentence.length)
        let hesheitis_random = Math.floor(Math.random() * hesheitis1.sentence.length)
        let hesheit_random = Math.floor(Math.random() * hesheit1.sentence.length)
        let v_random = Math.floor(Math.random() * v1.sentence.length)
        let adj_random = Math.floor(Math.random() * adj1.sentence.length)
        let prov_random = Math.floor(Math.random() * prov1.sentence.length)
        let yn_random = Math.floor(Math.random() * yn1.sentence.length)
        let _7w_random = Math.floor(Math.random() * _7w1.sentence.length)
            //console.log("1:", RDM, N1_random, hesheitis_random, hesheit_random, v_random, adj_random, prov_random, yn_random)
            //console.log("2:", n1.sentence.length, hesheitis1.sentence.length, hesheit1.sentence.length, v1.sentence.length, adj1.sentence.length, prov1.sentence.length, yn1.sentence.length)
            //Debug
        switch (RDM) {
            case (0):
                message.channel.send((hesheitis1.sentence[hesheitis_random] + n1.sentence[N1_random]) + ".");
                break;
            case (1):
                message.channel.send((n1.sentence[N1_random] + v1.sentence[v_random] + adj1.sentence[adj_random]) + ".");
                break;
            case (2):
                message.channel.send((n1.sentence[N1_random] + v1.sentence[v_random] + n1.sentence[N2_random]) + ".");
                break;
            case (3):
                message.channel.send((n1.sentence[N1_random] + prov1.sentence[prov_random]) + ".");
                break;
            case (4):
                message.channel.send((n1.sentence[N1_random] + adj1.sentence[adj_random]) + ".");
                break;
            case (5):
                message.channel.send((n1.sentence[N1_random] + yn1.sentence[yn_random] + n1.sentence[N2_random]) + ".");
                break;
            case (6):
                message.channel.send((hesheit1.sentence[hesheit_random] + v1.sentence[v_random] + hesheit1.sentence[hesheit_random] + adj1.sentence[adj_random] + n1.sentence[N2_random]) + ".");
                break;
            case (7):
                message.channel.send((n1.sentence[N1_random] + yn1.sentence[yn_random] + n1.sentence[N2_random]) + ".");
                break;
            case (8):
                message.channel.send((_7w1.sentence[_7w_random] + n1.sentence[N1_random]));
                break;
            case (9):
                message.channel.send(("如何" + adj1.sentence[adj_random] + "?"));
                break;
            default:
                break;
        }
    }
    if (message.content.startsWith(`/D weather `)) {
        let a = message.content;
        a = a.split(' ').filter(item => item != '');
        let lat = a[2];
        let lon = a[3];
        if (lat > 90 | lat < -90) {
            message.reply("緯度錯誤")
            return
        }
        if (lon > 180 | lon < -180) {
            message.reply("經度錯誤")
            return
        }
        let URL = `openweatherURLHere`;
        let request = require("request");
        const main = async() => {
            request(URL, function(error, response, body) {
                if (!error) {
                    //console.log(body)
                    //console.log(JSON.parse(body))
                    let te = JSON.parse(body);
                    let main = te.main;
                    let weather = te.weather[0];
                    let wind = te.wind;
                    let location = te.coord;
                    let sys = te.sys;
                    if (sys.country === undefined) sys.country = "未定義";
                    if (te.name === '') te.name = "未定義";
                    if (main.pressure === undefined) main.pressure = "未定義";
                    if (main.humidity === undefined) main.humidity = "未定義";
                    if (main.sea_level === undefined) main.sea_level = "未定義";
                    if (main.grnd_level === undefined) main.grnd_level = "未定義";
                    if (wind.gust === undefined) wind.gust = "未定義";
                    const exampleEmbed = new MessageEmbed()
                        .setAuthor({ name: "天氣狀況", iconURL: `http://openweathermap.org/img/wn/${weather.icon}@2x.png` })
                        .setDescription(
                            "經度:" + location.lon +
                            " 緯度:" + location.lat + "\n" +
                            "國家:" + sys.country +
                            " 地區:" + te.name + "\n" +
                            "溫度:" + (main.temp - 273.15).toFixed(1) + "°C\n" +
                            "體感溫度:" + (main.feels_like - 273.15).toFixed(1) + "°C\n" +
                            "最高溫:" + (main.temp_max - 273.15).toFixed(1) + "°C\n" +
                            "最低溫:" + (main.temp_min - 273.15).toFixed(1) + "°C\n" +
                            "壓力:" + (main.pressure) + " hPa\n" +
                            "濕度:" + (main.humidity) + "%\n" +
                            "海平面:" + (main.sea_level) + "mm\n" +
                            "陸地高度:" + (main.grnd_level) + "mm\n" +
                            "風速:" + (wind.speed) + "m/s\n" +
                            "風向:" + (wind.deg) + "°" + "\n" +
                            "陣風:" + (wind.gust) + "m/s" + "\n"
                        )
                        .setThumbnail(`http://openweathermap.org/img/wn/${weather.icon}@2x.png`)
                        .setTimestamp()
                        .setFooter({ text: "Copyright©/2022-丁弟#8449", iconURL: 'https://yt3.ggpht.com/yti/APfAmoGLv0sTZimBG-wI2S-6H82ZO6JsDG8TwToApX5dAA=s88-c-k-c0x00ffffff-no-rj-mo' })
                    message.channel.send({ embeds: [exampleEmbed] });
                } else {
                    console.log("擷取錯誤：" + error);
                }

            })

        }
        main();
    }
})
if(true){
    const{Botid} = require('./ID/ID.json');
    bot.login(Botid);
}
