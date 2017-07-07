/*------------------------------------
title:基于jquery的划词插件 SelectLib

author:carrie

time:2016-08-30

----------------------------------------
说明：


** 将该文件引入项目之后，使用$().SelectLib(opts)调用
** 参数说明：
opts = {
		menu: [{
			title: '',                          选项名 字符串格式
			onEnter:function(text){}			回调函数 点击该菜单按钮调用的函数,参数text是选中的文本值
			}，
			{
			title: '',                        
			onEnter:function(){}
			}],
		}
}

--------------------------------------*/
(function($) {
	$.fn.SelectLib = function(opts) {
		const defaultOpts = {
			menu: [{
				title: '',
				onEnter:function(text){}
			}],
			// text: '',
			beforeSelect:function(){},
			afterSelect:function(){},
			onSelect:function(){},
			cancelSelect:function(){}
		}


		var newOpts = $.extend(defaultOpts, opts); //功能和自定义的extend差不多
		
		init(newOpts);
		
	};


	$.fn.SelectLib.getText = function(opts) {

	};

	var HTML = {
		btn: '<button id="searchBtn" type="button" class="btn btn-default btn-sm"></button>',
		icon: '<span class="glyphicon glyphicon-search" aria-hidden="true"></span>',
		menu: '<div id="searchMenu" class="list-group"></div>',
		menuItem: '<button type="button" class="list-group-item"></button>',
		body: 'body'
	};

	var DOM = {};


	var selecttext;

	// function extend(source, target) {
	// 	var temp = {};
	// 	for (var prop in source) {
	// 		if (source.hasOwnProperty(prop)) {
	// 			temp[prop] = target[prop] || source[prop];
	// 		}
	// 	}
	// 	return temp;
	// }

	

	function init(opts) {
		initDOM();
		createBtn();
		createMenu(opts.menu);
		initEvent(opts.menu);


	}

	function initDOM() {
		for (var prop in HTML) {
			if (HTML.hasOwnProperty(prop)) {
				DOM['$' + prop] = $(HTML[prop]);
			}
		}
	}

	function createBtn() {
		var $btn = DOM.$btn,
		    $icon = DOM.$icon,
			$body = DOM.$body;

		$btn.append($icon);
		$btn.css({
			position: 'fixed',
			top: '0',
			left: '0',
			display: 'none'
		});
		$body.append($btn);
	}

	function createMenu(menu) {
		var $menu = DOM.$menu,
			$menuItem = DOM.$menuItem,
			$body = DOM.$body,
			node;

		for (var i = 0, len = menu.length; i < len; i++) {
			node = $menuItem.clone();
			node.text(menu[i].title);
			$menu.append(node);
		}
		$menu.css({
			position: 'fixed',
			top: '30px',
			left: '0',
			display: 'none'
		});
		$body.append($menu);

	}

	function initEvent(menu) {
		var $searchBtn = $('#searchBtn'),
			$searchMenu = $('#searchMenu'),
			$document = $(document);

		$searchBtn.on('drop', function() {
			$searchMenu.toggle();
		});

		$searchBtn.on('mouseup', function(e) {
			e.stopPropagation();
			$searchMenu.fadeIn(500);
		});

		$searchMenu.on('mouseup', 'button', function(e) {
			e.stopPropagation(); 
			var index = $(this).index();
			menu[index].onEnter(selecttext);
		});


		$searchMenu.on('mouseleave', function(e){
			$searchMenu.fadeOut(300);
		});


		//使用setTimeout延迟来解决因浏览器不同导致触发事件执行顺序不同带来的bug
		$document.on('mouseup', function(e) {
			var t = setTimeout(function() {
				selecttext = selectText();
				
				var mouse = getMouseCliPos(e);

				if (selecttext && selecttext.length > 0) {

					$searchBtn.css({
						'top': mouse.y + 'px',
						'left': mouse.x + 'px'
					});
					$searchMenu.css({
						'top': mouse.y + 30 + 'px',
						'left': mouse.x + 'px'
					});
					updateText(menu, selecttext);
					$searchBtn.fadeIn();

				} else {
					$searchBtn.fadeOut(80);

				}
			}, 100);
		});

	}


	function updateText(menu, text) {
		var $btns = $('.list-group-item');
		$btns.each(function(i, btn) {
			var $btn = $(btn);
			$btn.text(menu[i].title + ' " ' + text + ' " ');
		})
	}


	function selectText() {
		if (window.getSelection) {
			selectText = function () {
				return window.getSelection().toString();
			}
		} else if (document.selection) {
			selectText = function () {
				return document.selection.createRange().text;
			}
		}
		return selectText();
	}

	function getMouseCliPos(e) {
		e = e || window.event;
		return {
			x: e.clientX,
			y: e.clientY
		};
	}

})(jQuery);


var dtOpts = {
			menu: [{
				title: '在本页中搜索',
				onEnter :function(text){
					console.log(text + "1");
					}
				},
				{
				title: '在本文档中搜索',
				onEnter :function(text){console.log(text + "2");}
				}
			],
		}
		
$(document).SelectLib(dtOpts);
