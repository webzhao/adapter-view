(function(){
    var AdapterView = Widget.extend({

        /**
         * 可选配置项
         */
        attrs: {
            // 数据适配
            adapter: {
                url: '',                // 数据API地址
                method: 'get',          // 数据请求方式
                params: {},             // 请求数据时的参数
                type: 'json'            // 接口类型，json/jsonp
            },
            // 视图配置
            view: {
                template: '.template'   // 渲染视图用的模板
            },
            filter: null,               // 过滤数据的函数
            errmsg: '<div class="error">请求数据出错</div>'
        },

        /**
         * 初始化分页组件
         */
        setup: function() {
            this.__bindEvents();
            this.__compileTemplate();
            this.render();
            this.update();
        },

        /**
         * 属性改变后，重新取数据刷新UI
         */
        update: function() {
            var adapterView = this,
                method = adapterView.get('adapter.method').toLowerCase(),
                url = adapterView.get('adapter.url'),
                type = adapterView.get('adapter.type'),
                params = adapterView.get('adapter.params');
            if (method == 'post') {
                params = JSON.stringify(params);
            }
            $.ajax({
                method: method,
                url: url,
                contentType: 'application/json',
                dataType: type,
                data: params,
                success: function(data) {
                    var filter = adapterView.get('filter');
                    if (typeof filter === 'function') {
                        data = filter.call(adapterView, data);
                    }
                    adapterView.renderView(data);
                },
                error: function(xhr, status) {
                    adapterView.error(xhr, status);
                }
            });
        },

        /**
         * 渲染视图
         */
        renderView: function(data) {
            var html = this.__compiledTemplate(data);
            this.$element.html(html);
        },

        /**
         * 加载数据出错
         */
        error: function(xhr, status) {
            this.$element.html(this.get('errmsg'));
        },

        /**
         * 绑定事件
         */
        __bindEvents: function() {
            var adapterView = this;

            adapterView.on('change:adapter', function(){
                adapterView.update();
            });

            adapterView.on('change:view', function(){
                adapterView.__compileTemplate();
                adapterView.update();
            });
        },

        /**
         * 编译模板
         */
        __compileTemplate: function() {
            var template = this.get('view.template');
            if (/^\./.test(template)) { // .开头的selector，在当前容器下找模板内容
                template = this.$element.find(template).html();
            } else if (/^#/.test(template)) { // #开头的selector，全局找模板内容
                template = $(template).html();
            }
            this.__compiledTemplate = Handlebars.compile(template);
        }

    });
    this.AdapterView = AdapterView;
})();
