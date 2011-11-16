<!DOCTYPE html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<%@page contentType="text/html; charset=GBK"%>

<link rel="stylesheet"
	href="http://code.jquery.com/mobile/1.0rc3/jquery.mobile-1.0rc3.min.css" />
<link rel="stylesheet" type="text/css" href="/css/wqt.css" />
<script src="http://code.jquery.com/jquery-1.6.4.min.js"></script>
<script
	src="http://code.jquery.com/mobile/1.0rc3/jquery.mobile-1.0rc3.min.js"></script>


<div data-role="page" id="task">
	<div data-role="header">
		<a href="main.jsp" data-role="button" data-icon="home"
			data-transition="pop">����</a>
		<h1>�������</h1>
		<a href="#input-task" data-role="button"
			data-icon="refresh" data-transition="pop">ˢ��</a>
	</div>
	<div data-role="content"></div>
	<div data-role="footer" data-position="fixed" class="ui-bar">
	    <a href="#input-task" data-role="button" data-icon="plus">���</a> 
		<a href="index.html" data-role="button" data-icon="delete">ɾ��</a>
		<a href="index.html" data-role="button" data-icon="arrow-u">ȫѡ</a> 
		<a href="index.html" data-role="button" data-icon="arrow-d">��ѡ</a>
	</div>
</div>

<div data-role="page" id="input-task">
   <div data-role="header">
      <a href="#task" data-role="button" data-icon="home"></a>
      <h1>�������</h1>
      <a href="#" data-role="button" data-icon="refresh"></a>
   </div>
   <div data-role="content"> 
      <div data-role="fieldcontain">
	     <label for="username">��������:</label>
	     <input type="text" name="taskName" id="taskName" value="" placeholder="��������"/>
      </div>
   </div>
   <div data-role="footer" data-position="fixed">
      <div data-role="navbar">
      <ul>
         <li><a href="#nav1" class="ui-btn-active">�ύ</a></li>
         <li><a href="#nav2">����</a></li>
         <li><a href="#nav2">����</a></li>
         <li><a href="/index.jsp" data-rel="dialog" data-transition="pop">����</a></li>
      </ul>
      </div>
   </div>
</div>