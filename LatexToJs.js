export default function (input) {
    let init, fraction, square_root, nth_root, nth_power, sin, cos, tan, sinCosTanFramework, convert_others;

    init = function () {
        let st1 = input;
        st1 = st1.replace(/\s/g, "");
        st1 = st1.replace(/\\times/g, "*");
        st1 = st1.replace(/\\cdot/g, "*");
        st1 = st1.replace(/\\div/g, "/");

        st1 = st1.replace(/([0-9]+)\.([a-z\+\\\-\{\}\^\*]+)/g, "$1..**$2");// 不允许.后面跟除数字以外的字符  特意设置错误 lff

        st1 = st1.replace(/\}(([0-9\.]+)|\\pi)/g, "}*$1")// 将分数后面直接跟数字的情况 中间添加个* lff
        // st1 = st1.replace(/([0-9]+)\\frac/g, "$1+\\frac") //将数字后面直接加分数的情况 中间添加+ lff  添加这句之后之前的乘法变了加法  但是如果整数部分前有减号乘号的话 分数和整数没有成为一个整体
        st1 = st1.replace(/\.([0-9]+)\\frac/g, "..$1+\\frac");// 整数后面可接分数，小数后面直接跟分数情况 特意设置错误 lff
        // pi  pi和e的情况基本一致
        st1 = st1.replace(/([0-9\.]+)\\pi/g, "$1*pi");
        st1 = st1.replace(/\\pi([\.]+)/g, "pi**");// 将pi后面直接跟.的情况 排除掉，特意设置错误 lff
        // st1 = st1.replace(/\\pi([0-9a-zA-Z\.]+)/g, "pi*$1");//lff
        // st1 = st1.replace(/([0-9a-zA-Z\.]+)\\pi([0-9a-zA-Z\.]+)/g, "$1*pi*$2");//lff
        st1 = st1.replace(/\\pi/g, "pi");

        // e   下面用的\\e 都是有问题的  改为\e  但暂时不需要改 lff
        st1 = st1.replace(/([0-9\.]+)\e/g, "$1*e"); // st1 = st1.replace(/([0-9a-zA-Z\.]+)\e/g, "$1*e"); 去掉字母
        st1 = st1.replace(/\e([\.]+)/g, "e**");// 将e后面直接跟.的情况 排除掉，特意设置错误 lff
        // st1 = st1.replace(/\\e([0-9a-zA-Z\.]+)/g, "e*$1");
        // st1 = st1.replace(/([0-9a-zA-Z\.]+)\\e([0-9a-zA-Z\.]+)/g, "$1*e*$2");
        st1 = st1.replace(/\e/g, "e");

        // %
        st1 = st1.replace(/([0-9\.]+)\\%(([0-9\.]+)|\\pi|\\e)/g, "$1/100*$2");
        st1 = st1.replace(/([0-9\.]+)\\%/g, "$1/100");

        st1 = fraction(st1);
        st1 = square_root(st1);
        st1 = nth_root(st1);
        st1 = nth_power(st1);
        st1 = sin(st1);
        st1 = tan(st1);
        st1 = cos(st1);

        // clean up brackets
        st1 = st1.replace(/\\left\(/g, "(");
        st1 = st1.replace(/\\right\)/g, ")");
        st1 = st1.replace(/\\left\[/g, "(");
        st1 = st1.replace(/\\right\]/g, ")");
        st1 = st1.replace(/\\left\\\{/g, "(");
        st1 = st1.replace(/\\right\\\}/g, ")");
        // 把字母忽略
        // st1 = st1.replace(/[a-df-zA-Z]/g, "");
        return st1;
    };

    fraction = function (input) {
        while (input.search(/\\frac\{(((?![\{\}]).)*)\}\{(((?![\{\}]).)*)\}/) >= 0) {
            if (input.match(/([0-9]+)\\frac\{(((?![\{\}]).)*)\}\{(((?![\{\}]).)*)\}/))// http://jira.xuelebj.net/browse/CLASSROOM-4712  几又几分之几的情况处理
                { input = input.replace(/([0-9]+)\\frac\{(((?![\{\}]).)*)\}\{(((?![\{\}]).)*)\}/g, "(($1)+($2)/($4))"); }
            else
                { input = input.replace(/\\frac\{(((?![\{\}]).)*)\}\{(((?![\{\}]).)*)\}/g, "($1)/($3)"); }
        }

        if (input.search(/\\frac/) >= 0) {
            input = convert_others("fraction", input);
        }

        return input;
    };

    square_root = function (input) {
        while (input.search(/\\sqrt\{(((?![\{\}]).)*)\}/) >= 0) {
            input = input.replace(/\\sqrt\{(((?![\{\}]).)*)\}/g, "sqrt($1)");
        }

        if (input.search(/\\sqrt\{/) >= 0) {
            input = convert_others("square root", input);
        }

        return input;
    };

    nth_root = function (input) {
        while (input.search(/\\sqrt\[(((?![\{\}]).)*)\]\{(((?![\{\}]).)*)\}/) >= 0) {
            input = input.replace(/\\sqrt\[(((?![\{\}]).)*)\]\{(((?![\{\}]).)*)\}/g, "pow($3,1/$1)");
        }
        if (input.search(/\\sqrt\[/) >= 0) {
            input = convert_others("nth root", input);
        }
        return input;
    };

    nth_power = function (input) {
        // first case: single number with curly bracket power
        while (input.search(/([0-9a-zA-Z\.]+)\^\{(((?![\{\}]).)*)\}/) >= 0) {
            input = input.replace(/([0-9a-zA-Z\.]+)\^\{(((?![\{\}]).)*)\}/g, "pow($1,$2)");
        }
        // second case: single number without curly bracket
        while (input.search(/([0-9a-zA-Z\.]+)\^([0-9a-zA-Z\.]+)/) >= 0) {
            input = input.replace(/([0-9a-zA-Z\.]+)\^([0-9a-zA-Z\.]+)/g, "pow($1,$2)");
        }

        // third case: bracket number without curly bracket power
        while (input.search(/\\left\(([0-9a-zA-Z\.\+\*\-\\]+)\\right\)\^([0-9a-zA-Z\.]+)/) >= 0) {
            input = input.replace(/\\left\(([0-9a-zA-Z\.\+\*\-\\]+)\\right\)\^([0-9a-zA-Z\.]+)/g, "pow($1,$2)");
        }

        // forth case: bracket number with curly bracket power
        while (input.search(/\\left\(([0-9a-zA-Z\.\+\*\-\\]+)\\right\)\^\{(((?![\{\}]).)*)\}/) >= 0) {
            input = input.replace(/\\left\(([0-9a-zA-Z\.\+\*\-\\]+)\\right\)\^\{(((?![\{\}]).)*)\}/g, "pow($1,$2)");
        }

        // fifth case: bracket number with some brackets and division sign, with curly bracket power
        while (input.search(/\\left\(([0-9a-zA-Z\.\+\*\-\\\(\)\/]+)\\right\)\^\{(((?![\{\}]).)*)\}/) >= 0) {
            input = input.replace(/\\left\(([0-9a-zA-Z\.\+\*\-\\\(\)\/]+)\\right\)\^\{(((?![\{\}]).)*)\}/g, "pow($1,$2)");
        }
        // 匹配 (2)/(3)^3 lff
        while (input.search(/([0-9a-zA-Z\.\+\*\-\\\(\)\/]+)\^([0-9a-zA-Z\.]+)/) >= 0) {
            input = input.replace(/([0-9a-zA-Z\.\+\*\-\\\(\)\/]+)\^([0-9a-zA-Z\.]+)/g, "pow($1,$2)");
        }
        // 匹配  (2)/(3)^{2+1} lff
        while (input.search(/([0-9a-zA-Z\.\+\*\-\\\(\)\/]+)\^\{(((?![\{\}]).)*)\}/) >= 0) {
            input = input.replace(/([0-9a-zA-Z\.\+\*\-\\\(\)\/]+)\^\{(((?![\{\}]).)*)\}/g, "pow($1,$2)");
        }

        if (input.search(/\^/) >= 0) {
            input = convert_others("nth power", input);
        }
        return input;
    };

    sin = function (input) {
        return sinCosTanFramework("sin", input);
    };

    tan = function (input) {
        return sinCosTanFramework("tan", input);
    };

    cos = function (input) {
        return sinCosTanFramework("cos", input);
    };

    sinCosTanFramework = function (func, input) {
        const pat1 = new RegExp("\\\\" + func + "\\\\left\\(([0-9a-zA-Z\\.\\+\\*\\-\\\\\\(\\)\\/]+)\\\\right\\)");
        // eg: /\\sin\\left\(([0-9a-zA-Z\.\+\*\-\\\(\)\/]+)\\right\)/

        while (input.search(pat1) >= 0) {
            input = input.replace(pat1, func + "($1)");
        }
        const pat2 = new RegExp("\\\\" + func + "([0-9a-zA-Z]+)");
        // eg:  /\\sin([0-9a-zA-Z]+)/:

        while (input.search(pat2) >= 0) {
            input = input.replace(pat2, func + "($1)");
        }

        const pat3 = new RegExp("\\\\" + func);
        // eg:  /\\sin/
        if (input.search(pat3) >= 0) {
            input = convert_others(func, input);
        }

        return input;
    };

    convert_others = function (func, input) {
        let temp_input, arr, closest_pos, func_pos, frac_pos, sqrt_pos, root_pos, pow_pos, sin_pos, tan_pos, cos_pos;
        switch (func) {
            case "fraction":
                temp_input = input.match(/\\frac.*/)[0];
                func_pos = temp_input.search(/\\frac/);
                break;
            case "square root":
                temp_input = input.match(/\\sqrt\{.*/)[0];
                func_pos = temp_input.search(/\\sqrt\{/);
                break;
            case "nth root":
                temp_input = input.match(/\\sqrt\[.*/)[0];
                func_pos = temp_input.search(/\\sqrt\[/);
                break;
            case "nth power":
                temp_input = input.match(/\^.*/)[0];
                func_pos = temp_input.search(/\^/);
                break;
            case "sin":
                temp_input = input.match(/\\sin\{.*/)[0];
                func_pos = temp_input.search(/\\sin\{/);
                break;
            case "tan":
                temp_input = input.match(/\\tan\{.*/)[0];
                func_pos = temp_input.search(/\\tan\{/);
                break;
            case "cos":
                temp_input = input.match(/\\cos\{.*/)[0];
                func_pos = temp_input.search(/\\cos\{/);
                break;
            default:
                return;
        }
        frac_pos = temp_input.search(/\\frac/);
        sqrt_pos = temp_input.search(/\\sqrt\{/);
        root_pos = temp_input.search(/\\sqrt\[/);
        pow_pos = temp_input.search(/\^/);
        sin_pos = temp_input.search(/\\sin\{/);
        tan_pos = temp_input.search(/\\tan\{/);
        cos_pos = temp_input.search(/\\cos\{/);

        arr = [frac_pos, root_pos, sqrt_pos, pow_pos, sin_pos, tan_pos, cos_pos];
        arr.sort(function (a, b) {
            return b - a;
        });
        // desc order

        closest_pos = arr[arr.indexOf(0) - 1];
        // closest_pos = arr[arr.indexOf(0)];//by lff

        if (closest_pos <= 0 || closest_pos === undefined) {
            // if (closest_pos < 0 || closest_pos === undefined) {//by lff

            throw ("syntax error");
        }

        switch (closest_pos) {
            case frac_pos:
                input = fraction(input);
                break;
            case sqrt_pos:
                input = square_root(input);
                break;
            case root_pos:
                input = nth_root(input);
                break;
            case pow_pos:
                input = nth_power(input);
                break;
            case sin_pos:
                input = sin(input);
                break;
            case tan_pos:
                input = tan(input);
                break;
            case cos_pos:
                input = cos(input);
                break;
            default:
        }

        switch (func) {
            case "fraction":
                input = fraction(input);
                break;
            case "square root":
                input = square_root(input);
                break;
            case "nth root":
                input = nth_root(input);
                break;
            case "nth power":
                input = nth_power(input);
                break;
            case "sin":
                input = sin(input);
                break;
            case "tan":
                input = tan(input);
                break;
            case "cos":
                input = cos(input);
                break;
        }

        return input;
    };
    try {
        return init();
    } catch (e) {
        console.log("has Error")
    }
}
