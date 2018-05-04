/*
File: Copy a layer to new layout.js
Description: This JavaScript copies a layer and all components on this layer to a new layout
*/

//import basic checks
if(typeof(isLayoutOpen) == "undefined")
{
	//import basic checks
	app.importScript(app.getAppScriptsFolder() + "/Dependencies/qx_validations.js");
	console.log("Loaded library for basic validation checks from application.");
}

if(isLayoutOpen()){
	var sourceLayoutDOM, targetLayoutDOM
	//Get DOM from the source Layout
	sourceLayoutDOM = app.activeLayoutDOM();
	//get the layer name to be copied
	var userLayerName = getValidLayerName(sourceLayoutDOM);
	if(userLayerName != null)
	{
		//copy the layer contents to new layout
		copyLayerToNewLayout(userLayerName);
	}			
}
/*======================Functions used in the JavaScript=============================*/

//get valid layer name input
function getValidLayerName(sourceLayoutDOM){
	var flag=0;
	while(flag ==0)
	{
		var strPromptLayerName = "Which layer do you want to copy? (Cancel to Exit) \r\n" ;
		
		//Append the prompt with names of available Layers
		strPromptLayerName += getLayerNamesAsString(sourceLayoutDOM);
		//set "Default" as default layer name
		var userLayerName = "Default";
		//Prompt with Default value
		userLayerName = prompt(strPromptLayerName, userLayerName);
		if(userLayerName == null)
			return null;
		else
		{
			userLayerName = userLayerName.trim();
			if (!userLayerName)
			{
				console.log("Invalid Layer name: '" + userLayerName + "'");				
			}
			else
			{
				var sourceLayerNode = getLayerWithName(sourceLayoutDOM, userLayerName);
				
				//Check if the user Layer Exists
				if(null == sourceLayerNode)
				{
					alert("Layer '" + userLayerName + "' does not exist!");		
				}
				else
				{
					console.log("Layer " + userLayerName + " EXISTS!");
					return userLayerName;
				}
			}
		}
	}
}

//gets the names as strings of layers present on the layout
function getLayerNamesAsString(layoutDOM)
{	
	//Get all the Layers
	var currentLayoutLayers = layoutDOM.getElementsByTagName("qx-layer");
	if(null == currentLayoutLayers)
	{
		return ""; //Blank String
	}
	else
	{
		var arrLayersNames = new Array();
		//Get the Layers Name in an Array
		for (var i = 0; i < currentLayoutLayers.length; i++){
			arrLayersNames.push(currentLayoutLayers[i].getAttribute("layer-name"));
		}
		return arrLayersNames.join(", "); //Comma Separated List of Items
	}
}

//copies the layer and constituents to new layout
function copyLayerToNewLayout(userLayerName)
{
	//Query all boxes on selected layer
	var strSelectorQuery = "qx-box[style*='--qx-layer-name:" + userLayerName + "']"	
	var boxesOnSourceLayer = sourceLayoutDOM.querySelectorAll(strSelectorQuery);
	
	//check if some boxes exist on layer entered
	if( (null == boxesOnSourceLayer) || (boxesOnSourceLayer.length <=0) )
	{
		alert("No boxes found on layer " + userLayerName);
	}
	else
	{	
		console.log(boxesOnSourceLayer.length + " boxes found on layer " + userLayerName);
		//Create a new Layout
		var srcLayout= app.activeLayout();
		var duplicatedLayout= srcLayout.duplicate();	
		
		//Get DOM from the target Layout
		targetLayoutDOM = duplicatedLayout.getDOM();
		
		//get all boxes on the target DOM
		var allboxes= targetLayoutDOM.getElementsByTagName("qx-box");
		
		//get all layers on the target DOM
		var alllayers= targetLayoutDOM.getElementsByTagName("qx-layer");
		
		//delete the boxes that are not on layer required
		var boxestoDelete=[];
		for(var i=0; i< allboxes.length; i++)
		{
			if(allboxes[i].style.qxLayerName.toLowerCase() != userLayerName.toLowerCase())
				boxestoDelete.push(allboxes[i]);
		}
		
		var layerstoDelete= [];
		for(var i=0; i< alllayers.length; i++)
		{
			if(alllayers[i].getAttribute("layer-name") != userLayerName)
				layerstoDelete.push(alllayers[i]);
		}
		deleteEntries(boxestoDelete);
		deleteEntries(layerstoDelete);
	}
}

function deleteEntries(arr){
	var i=0;
	while(arr[i] != null)// to traverse through all the entities of array
	{
		arr[i].remove();
		i++;
	}
}

function getLayerWithName(layoutDOM, layerName)
{	
	//Return first element of the query selector results [Since there can only be one layer with a unique name
	return layoutDOM.querySelectorAll("qx-layer[layer-name='" + layerName + "'")[0];
}