# LatexToJs
latex convert to mathematical formula of JavaScript form

可以将latex数学公式转换成js形式的数学公式

使用如下：
引用该文件，可以在html中引用或者require引用 
<script src="../LatexToJs.js"></script>
or

var LatexToJs = require("../LatexToJs.js").default;


调用函数
如公式：
var latex="\sin23 + \sin\left(\tan39\right)";
LatexToJs(latex);


