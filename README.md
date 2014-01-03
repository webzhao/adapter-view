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
        },
        view: {
            template: '#list_template'
        }
    }
});
```

初始化时的选项如下：

选项    | 类型    |  说明
--------|---------|------------------------





