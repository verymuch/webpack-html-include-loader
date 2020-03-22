[README in English click here](./README-en.md)

## 简介

这是一个webpack loader, 可以方便地在一个html文件中包含另一个html文件。并且被包含的HTML变化时，会动态更新。

## 基础用法

如果你想在某个html文件中包含另一个html文件，如：`header.html`，你可以像下面这样写：

```
<%- include("./incs/header.html") %>
```

此外，你可以已在包含html文件的时候传入自定义参数，如下所示：

```
<%- include("./incs/header.html", {"title": "首页"}) %>
```

在`header.html`中可以通过`<%= title %>`来注入变量。

> 需要注意的是，传入参数的时候，格式需要时JSON序列化的字符串，因为需要对其进行转义，如果格式不正确会报错。

这都是最基础的功能，`webpack-html-include-loader`还支持**嵌套包含，即在包含的html中再次包含其他文件**。这会大大提高我们使用的灵活度。

如果你害怕会出现过多的嵌套，还可以通过自定义选项`options`来限制最大嵌套层数，参见下一部分。

## 自定义选项

### maxIncludes 最大包含嵌套层数

默认值为`5`，如果有需要可以适当放大和减小。

### includeStartTag 包含块起始标记

默认值为`<%-`，如果你更习惯使用其他标记，可以通过该参数进行调整。

### includeEndTag 包含块结束标记

默认值为`%>`，如果你更习惯使用其他标记，可以通过该参数进行调整。

### variableStartTag 变量起始标记

默认值为`<%=`，如果你更习惯使用其他标记，可以通过该参数进行调整。

### variableEndTag 变量结束标记

默认值为`%>`，与包含块结束标记相同，如果你更习惯使用其他标记，可以通过该参数进行调整。

