$(document).ready(function(){
	//���벼��
	$('body').layout({ applyDefaultStyles: true });
	//��߲˵�
	$("#accordion").accordion({ header: "h3" });
	//�ر�tab
	$('#tabs span.ui-icon-close').live('click', function() {
			var index = $('li',$tabs).index($(this).parent());
			$tabs.tabs('remove', index);
		});
	//��ģ���ʽ����tab
	var $tabs = $('#tabs').tabs({
			tabTemplate: '<li><a href="#{href}">#{label}</a> <span class="ui-icon ui-icon-close">Remove Tab</span></li>',
			add: function(event, ui) {
				var tab_content = $tab_content_input.val() || 'Tab '+tab_counter+' content.';
				$(ui.panel).append('<p>'+tab_content+'</p>');
			}
		});
	//����tab��ʼ��
	tabid = 1;
	var $tabs = $('#tabs').tabs({
	    add: function(event, ui) {
	        $tabs.tabs('select', '#' + ui.panel.id);
	    }
	});
	//�ı䰴ťui
	$("button, input:submit, a", ".demo").button();
	$("a", ".demo").click(function() { return false; });
						
	//���
	jQuery("#list9").jqGrid({
		datatype: "local",
		height: 250,
	   	colNames:['���','��ҵ', '����', '����','���ɼ���','�Ƿ����','�Żݷ�ʽ'],
	   	colModel:[
	   		{name:'id',index:'id', align:"center", sorttype:"int"},
	   		{name:'invdate',index:'invdate',align:"center", width:120},
	   		{name:'name',index:'name',align:"center"},
	   		{name:'amount',index:'amount', width:80, align:"center"},
	   		{name:'tax',index:'tax', width:80, align:"center"},		
	   		{name:'total',index:'total', width:120,align:"center", sorttype:"date"},		
	   		{name:'note',index:'note', width:150,align:"center", sortable:false}		
	   	],
	   	multiselect: true,
	   	caption: "֧���б�"
	});
	var mydata = [
			{id:"100001",invdate:"����",name:"ҵ��",amount:"������",tax:"����",total:"2010-07-30",note:"���"},
			{id:"110881",invdate:"����",name:"���۲�",amount:"������",tax:"����",total:"2010-07-30",note:"���"},
			{id:"000881",invdate:"����",name:"���۲�",amount:"������",tax:"����",total:"2010-07-30",note:"���"},
			{id:"201001",invdate:"����",name:"ҵ��",amount:"������",tax:"����",total:"2010-07-30",note:"���"},
			{id:"700088",invdate:"����",name:"ҵ��",amount:"������",tax:"����",total:"2010-07-30",note:"���"},
			{id:"700088",invdate:"����",name:"ҵ��",amount:"������",tax:"����",total:"2010-07-30",note:"���"},
			{id:"700088",invdate:"����",name:"ҵ��",amount:"������",tax:"����",total:"2010-07-30",note:"���"},
			{id:"700088",invdate:"����",name:"ҵ��",amount:"������",tax:"����",total:"2010-07-30",note:"���"},
			{id:"700088",invdate:"����",name:"ҵ��",amount:"������",tax:"����",total:"2010-07-30",note:"���"},
			{id:"700088",invdate:"����",name:"ҵ��",amount:"������",tax:"����",total:"2010-07-30",note:"���"}
			];
	for(var i=0;i<=mydata.length;i++)
		jQuery("#list9").jqGrid('addRowData',i+1,mydata[i]);
	
	
});

//�¿�tab
function openTab(tabName,url){
	$('#tabs').tabs("add","#newtab"+tabid,tabName);
	$("div #newtab" + tabid ).load("query.html");
	tabid++;
	//$('#tabs').tabs('select', '#' + ui.panel.id);
}
function queryForm(id,list){
	alert('a');
}
