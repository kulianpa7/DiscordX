function CALLBACKcalc(CALC) {
    function Calc(calc) {
        var s = calc;
        if (s[0] == '-') s = s.replace('-', '!')

        function Find(cal) {
            var vs = [];
            var j = 0;
            for (var i = 0; i < cal.length; i++) {
                if (cal[i] == '+' || cal[i] == '-' || cal[i] == 'x' || cal[i] == '/') {
                    vs[j] = cal[i];
                    j++;
                }
            }
            return vs;
        }

        function F(b, chss, object) {
            var sd = b[object.j];
            object.j += 1;
            while (true) {
                if (chss[object.i] == '+' || chss[object.i] == '-' || chss.length == object.i) {
                    object.i--;
                    object.j--;
                    return sd;
                }
                if (chss[object.i] == 'x') {
                    sd *= b[object.j]
                }
                if (chss[object.i] == '/') {
                    sd /= b[object.j]
                }
                object.i++;
                object.j++;
            }
        }
        var count = s.split(/[+x/-]/).filter(item => item != '');
        for (var i = 0; i < count.length; i++) {
            count[i] = count[i].replace('!', '-');
        }
        var vs = Find(s);
        var object = { i: 0, j: 1 };
        var sum = Number(count[0]);
        for (var i = 0; i < count.length; i++) {
            count[i] = Number(count[i]);
            if (isNaN(Number(count[i]))) return "有誤1";
            if (count[i] == '' && count[i] != 0) return "有誤2";
        }
        for (object.i; object.i < count.length; object.i++) {
            switch (vs[object.i]) {
                case '+':
                    if (vs[object.i + 1] == 'x' || vs[object.i + 1] == '/') continue;
                    sum += count[object.j];
                    break;
                case '-':
                    if (vs[object.i + 1] == 'x' || vs[object.i + 1] == '/') continue;
                    sum -= count[object.j];
                    break;
                case 'x':
                    if (object.i != 0 && vs[object.i - 1] == '+' || object.i != 0 && vs[object.i - 1] == '-') {
                        if (vs[object.i - 1] == '-') sum -= F(count, vs, object);
                        else sum += F(count, vs, object);
                    } else {
                        sum *= count[object.j];
                    }
                    break;
                case '/':
                    if (object.i != 0 && vs[object.i - 1] == '+' || object.i != 0 && vs[object.i - 1] == '-') {
                        if (vs[object.i - 1] == '-') sum -= F(count, vs, object);
                        else sum += F(count, vs, object);
                    } else {
                        sum /= count[object.j];
                    }
                    break;
            }
            object.j += 1;
        }
        return Number(sum.toPrecision(12));
    }
    var a = { w: CALC };

    function Sr(a) {
        a.w += '\0';
        var result = [];
        var re = 0;
        var temp = [];
        var tr1 = 0;
        var tr2 = 0;
        var i = 0;
        while (a.w[i] != '\0') {
            if (a.w[i] == '(') {
                tr1 = i;
            }
            if (a.w[i] == ')') {
                temp[re] = '';
                tr2 = i;
                for (var j = tr1 + 1; j < tr2; j++) {
                    temp[re] += a.w[j];
                }
                result[re] = temp[re];
                re++;
            }
            i++;
        }
        for (var k = 0; k < re; k++) {
            a.w = a.w.replace(`(${temp[k]})`, `q${k}`);
        }
        return result;
    }

    function LastCalc(S) {
        for (var i = 0; i < S.length; i++) {
            S[i] = Calc(S[i]);
            if (S[i] < 0) {
                S[i] = `!${-S[i]}`
            }
            a.w = a.w.replace(`q${i}`, `${S[i]}`)
        }
        a.w = a.w.replace('\0', '');
        //a.w = a.w.replace(/-/g, '!');
        return Calc(a.w);
    } //參數帶入Sr(a);
    return LastCalc(Sr(a));
}
module.exports = { CALLBACKcalc };