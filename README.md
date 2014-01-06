# AdaterView

一个将模板和API数据相结合的组件，它从指定的数据源中获取数据，然后使用[Handlebars](http://handlebarsjs.com/)模板将数据进行渲染。以后若数据源更新，模板会自动渲染。

> 本组件是基于[WidgetCore](https://github.com/novawidgets/widgetcore)开发的，使用前请确保将其引入。

## 如何使用

首先要创建一个`AdapterView`的实例，在初始化的时候传入一些配置项。

```js
var adapterView = new AdapterView({
    element: '#user_list',
    adapter: {
        url: '/users/list',
        method: 'get',
        params: {
            pn: 0,
            ps: 20
        }
    },
    view: {
        template: '#list_template'
    },
});
```

初始化时的选项如下：

选项         | 类型     | 默认值       | 说明
-------------|----------|--------------|---------------------------
element      | Selector |              | 视图所绑定的元素
adapter      | JSON     |              | 关于数据源的配置
view         | JSON     |              | 关于视图的配置
filter       | Function |              | 在渲染前，对数据源进行处理
renderOnInit | Boolean  | false        | 是否在初始化时就取数据渲染
errmsg       | String   | 请求数据出错 | 是否在初始化时就取数据渲染

#### adapter配置

`adapter`是一个JSON配置，可以包含以下选项：

选项    | 类型   | 默认值 | 说明
--------|--------|--------|---------------------------------------------------------------
url     | String |        | 数据源URL
method  | String | get    | 数据请求方式
params  | JSON   | {}     | 请求参数，`get`时附在URL之后，`post`时将其stringify后放入请求体
type    | String | json   | json / jsonp
noCache | String | _t     | `get`请求时为防缓存设置的随机数参数，设置为`false`可将其去掉

#### view配置

`view`是关于视图的配置，只有`template`一个选项，它是一个字符串，表示该视图的`Handlebars`模板来源，其默认值为`.template`。

关于`template`的值，有一些约定：

* 如果以`.`开头，则从`AdapterView`绑定的元素内寻找。比如`.template`会把绑定元素下的`className`包含`template`的元素的`innerHTML`作为模板。
* 如果以`#`开头，则从整个页面寻找。比如`#template_a`会在页面中找到`id`为`template_a`的元素，将其`innerHTML`作为模板。
* 其它情况，会把`template`的值直接作为模板。

## 数据更新

如果数据源的URL或者发送的参数发生变化，本组件会自动发送请求，并更新UI显示。如果不想在更新数据源时自动更新UI，可以在设置参数时加上`silent: true`的选项。示例：

```js
/* 自动更新UI */
adapterView.set('params.pn', 3);
/* 不自动更新UI */
adapterView.set('url', '/user/list', {silent: true});
```

当你需要手工更新UI时，可以调用`update`方法：

```js
adapterView.update();
```

## 高级玩法

### 自定义数据源的获取

一般情况下，数据来自于`ajax`请求。如果你想使用本地的数据来渲染，可以在`update`方法调用之前，去获取数据并做展示，然后返回`false`以阻止默认的获取数据的代码的执行。

```js
adapterView.before('update', function(evt){
    this.renderView({ /* 使用静态数据 */
        a: 'some value',
        b: 123
    });
    return false; /* 阻止默认行为 */
});
```

### 渲染完成后的事件

你可以在渲染完成后，运行一些自己的代码，比如绑定事件等。

```js
adapterView.after('renderView', function(evt, data)) {
    /* 绑定事件 */
    this.$element.find('.submit').click(function() { /* do something */ });

    /* 创建分页 */
    var paginator = new Paginator({
        element: '.pagination',
        totalItems: data.total
    });
}
```

### 错误处理

在请求数据源出错时，`AdapterView`默认的行为是在视图里面显示配置的`errmsg`的内容。如果你想自己处理，可以在`error`方法调用前插入自己的处理逻辑，并返回`false`。

```js
adapterView.before('error', function(evt, xhr, status){
    if (status == 401) {
        alert('您还没有登录');
    }
    if (status == 403) {
        alert('请没有权限访问此内容');
    }
    return false;
});
```


