/*
 *  일반적인 ajax 호출 관련 자바스크립트
 */
var ajaxUtil = (function($){
	var configMap = {
			contextPath : location.href,
			success : '1',
			fail : '0',
			ok: "OK",
			internalServerError: 'INTERNAL_SERVER_ERROR',
			unknown: 'UNKNOWN'
	},
	getContextPath, sendCommand, sendCommandSync, ajaxRequest, 
	createHtmlList, convertTimestampToDateString, initModule,
	_colModel, getColModel, getHeaderNm, getKeyVal, getExStyle;

	getContextPath = function(){
		var prefix = location.href.substring(0, location.href.indexOf('/fidoadminweb/'));
		return prefix + '/fidoadminweb';
	};

	sendCommand = function( url, paramData, callbackFn, isJson ) {
		ajaxRequest(true, url, paramData, callbackFn, isJson );
	}

	sendCommandSync = function( url, paramData, callbackFn, isJson ) {
		ajaxRequest(false, url, paramData, callbackFn, isJson );
	}

	ajaxRequest = function( isAsync, url, paramData, callbackFn, isJson ){

		var settings;
		//optional default setting 
		//$.ajaxSetup();

		settings = {
				async : isAsync,
				//cache : settings.cache,
				contentType : 'application/json',
				data : paramData,
				dataType : 'json',
//				error: function(jqXHR, textStatus, errorThrown){	//(object, string, string)
////					// Common Layer Show
////					alert(url + '\r\n' + textStatus + ', ' + errorThrown);
////					// textStatus status, statusCode(), responseXML, responseText
//				 	var msg = $.parseJSON(jqXHR.responseText);
//					$.alert( textStatus + ', ' + errorThrown ).addBlueBtn('확인','확인',function($layer){
//						$layer.hide();
//					}).show();
////
//				},
				//headers : settings.headers,
				//method : settings.method, //type과 동일 jQuery 1.9.0 버전 이후 사용가능
				success : function( data, textStatus, jqXHR ) {
					if ( callbackFn ) {
						callbackFn( data );
					}
				},
				type : 'post', 
				url : url
		};

		$.ajax( settings );
	};

	$.fn.serializeObject = function()
	{
	    var o = {};
	    var a = this.serializeArray();
	    $.each(a, function() {
	        if (o[this.name] !== undefined) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } else {
	            o[this.name] = this.value || '';
	        }
	    });
	    return o;
	};
	
	createHtmlList = function( list, $table ){
		var _tr, _td, _name, _txt, _c, _l, _em,
			_list = list, 
//			_colModel = colModel,
			colspan = _colModel.length;
		
		//table 초기화
		$table.children('tr').remove();
		
		if ( _list.length > 0 ) {
			$.each( _list, function( idx, element ){
				_tr = document.createElement('tr');
				
				$.each( _colModel, function(i, col){
					
					_td = document.createElement('td');
					_name = _.isNull(element[col['name']]) ? '' : element[col['name']];
					
    				if ( col['type'] == 'checkbox' ) {
    					_c = document.createElement("input");
    			        _c.setAttribute('type', "checkbox");
    			        _c.setAttribute('name', "unNamedCheckbox");
    			        _c.setAttribute('data-rowvalues', escape(JSON.stringify(element)));
    			        _td.appendChild( _c );
    				}
    				else if ( col['type'] == 'link' ) {
    					_l = document.createElement("a");
    					_l.addEventListener('click', function(){ col['onclick'](escape(JSON.stringify(element))) }, false );
						_txt = document.createTextNode( _name );
						_l.appendChild( _txt );
						_td.appendChild( _l );
    				}
    				else {
    					if ( col['formatter'] ) {
    						_txt = document.createTextNode( col['formatter'].call(null, _name) );
    					} else {
    						_txt = document.createTextNode( _name );
    					}
    					_td.appendChild( _txt );
    				}
    				_tr.appendChild( _td );
    			}); // end $.each
				$table.append( _tr );
    		}); // end $.each
    	} else {
    		_tr = document.createElement('tr');
    		
    		_td = document.createElement('td');
    		_td.setAttribute('colspan', colspan);
    		_txt = document.createTextNode('조회목록이 없습니다.');
    		_em = document.createElement('em');
			_em.appendChild( _txt );
			_td.appendChild( _em );
			
			_tr.appendChild( _td );
			
			$table.append( _tr );
    	}
	}
	
	getColModel = function(){
		return _colModel;
	};
	
	getHeaderNm = function(){
		return _.filter(_.pluck(ajaxUtil.getColModel(), 'title'), function(title){ return title != ''}).join(',');
	}
	
	getKeyVal = function(){
		return _.filter(_.pluck(ajaxUtil.getColModel(), 'name'), function(name){ return name != ''}).join(',');
	}
	
	getExStyle = function(){
		return _.pluck(ajaxUtil.getColModel(), 'excelStyle').join(',');
	}
	
	initModule = function( colModel ) {
		/*-----------------------------------
		 * |	_colModel.col Attribute 	|
		 * ----------------------------------
		 * 1. title
		 * 2. name
		 * 3. type
		 * 4. formatter
		 * 5. excelStyle
		 * 6. excludeType
		 * 7. excludeIndex 
		 */ 
		
		_colModel = colModel;
	};
	
	return { initModule : initModule, sendCommand : sendCommand, getColModel : getColModel,
		sendCommandSync : sendCommandSync, createHtmlList : createHtmlList };

}(jQuery)); //더글라스 클락포트의 권장 표기법
