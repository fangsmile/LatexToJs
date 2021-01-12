# LatexToJs
latex convert to mathematical formula of JavaScript form

可以将latex数学公式转换成js形式的数学公式

使用如下：

引用该文件，可以在html中引用或者require引用
```html
<script src="../LatexToJs.js"></script>
or

var LatexToJs = require("../LatexToJs.js").default;
```

转换公式：
```javascript
var latex="\sin23 + \sin\left(\tan39\right)";

LatexToJs(latex);
```

转换的结果可以通过 [math.js](https://mathjs.org/) 计算结果
