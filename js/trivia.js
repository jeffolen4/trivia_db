var xmlhttp;

function GetXmlHttpObject()
{
  if (window.XMLHttpRequest)
  {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      return new XMLHttpRequest();
    }
  if (window.ActiveXObject)
  {
      // code for IE6, IE5
      return new ActiveXObject("Microsoft.XMLHTTP");
    }

  return null;
}

function updateCityState()
{
xmlhttp=GetXmlHttpObject();
var zipCode = document.getElementById('zip').value;
var url="rtvCityState.php?parm="+zipCode;
url=url+"&sid="+Math.random();

xmlhttp.onreadystatechange=handleResponse;
xmlhttp.open("GET",url,true);
xmlhttp.send(null);

}


function handleResponse()
{
  if (xmlhttp.readyState==4)
  {
    var results = xmlhttp.responseText.split(",");
    document.getElementById('city').value = results[0];
    document.getElementById('state').value = results[1];
  }
}
