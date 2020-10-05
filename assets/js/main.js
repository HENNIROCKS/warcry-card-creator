writeValue = function(ctx, value, pos) {
    var scale = getScalingFactor(getCanvas(), getBackgroundImage());
    pos = {x: pos.x / scale.x, y: pos.y / scale.y };

    ctx.save();
    ctx.scale(scale.x, scale.y);
    ctx.fillText(value, pos.x, pos.y);
    ctx.restore();
}

getScalingFactor = function(canvas, warcryCardOne) {
    return {
        x: canvas.width  / warcryCardOne.width,
        y: canvas.height / warcryCardOne.height
    };
}

getCanvas = function() {
    return document.getElementById("canvas");
}

getContext = function() {
    return getCanvas().getContext("2d");
}

getBackgroundImage = function() {
    // return document.getElementById("warcryCardOne");

    if (document.getElementById("backgroundStyleOne").checked) {
        return document.getElementById("warcryCardOne");

    } else if (document.getElementById("backgroundStyleTwo").checked) {
        return document.getElementById("warcryCardTwo");

    }
}

drawBackground = function() {
    getContext().drawImage(
        getBackgroundImage(), 0, 0, getCanvas().width, getCanvas().height
    );
}

scalePixelPosition = function(pixelPosition) {
    var scalingFactor = getScalingFactor(getCanvas(), getBackgroundImage());
    var scaledPosition = {x: pixelPosition.x * scalingFactor.x, y: pixelPosition.y * scalingFactor.y};
    return scaledPosition;
}

writeScaled = function(value, pixelPos) {
    var scaledPos = scalePixelPosition(pixelPos);
    writeValue(getContext(), value, scaledPos);
}

drawCardElementFromInput = function(inputElement, pixelPosition) {
    var value = inputElement.value;
    writeScaled(value, pixelPosition);
}

drawCardElementFromInputId = function(inputId, pixelPosition) {
    drawCardElementFromInput(document.getElementById(inputId), pixelPosition);
}

drawToughness = function(value) {
    writeScaled(value, {x: 545, y: 391});
}

drawWounds = function(value) {
    writeScaled(value, {x: 380, y: 510});
}

drawMove = function(value) {
    writeScaled(value, {x: 220, y: 391});
}

drawPointCost = function(value) {
    writeScaled(value, {x: 805, y: 160});
}

getWeaponStatblockImage = function() {
    return document.getElementById("weapon-profile");
}

drawWeaponStatblock = function(pixelPosition) {
    var image = getWeaponStatblockImage();
    var scaledPosition = scalePixelPosition(pixelPosition);
    var scaledSize = scalePixelPosition({x: image.width, y: image.height});
    getContext().drawImage(
        image,
        scaledPosition.x,
        scaledPosition.y,
        scaledSize.x,
        scaledSize.y);
}

drawWeapon = function(weaponData, pixelPosition) {
    drawWeaponStatblock(pixelPosition);

    var statsPosY = pixelPosition.y + 95;

    var range = (weaponData.rangeMin > 0 ? (weaponData.rangeMin + "-") : "") + weaponData.rangeMax;

    getContext().textAlign = "center";

    writeScaled(range, {x: pixelPosition.x + 250, y: statsPosY});

    writeScaled(
        weaponData.attacks,
        {x: pixelPosition.x + 440, y: statsPosY});

    writeScaled(
        weaponData.strength,
        {x: pixelPosition.x + 620, y: statsPosY});

    writeScaled(
        weaponData.damageBase + "/" + weaponData.damageCrit,
        {x: pixelPosition.x + 790, y: statsPosY});

    var position = scalePixelPosition({x: pixelPosition.x + 20, y: pixelPosition.y + 30});
    var size = scalePixelPosition({x: 120, y: 120});
    drawImageSrc(position, size, weaponData.runemark);
}

function getWeapon(weaponId) {
    return $(weaponId).find("#weaponEnabled")[0].checked ? $(weaponId) : null;
}

function getWeapon1() {
    return getWeapon("#weapon1");
}

function getWeapon2() {
    return getWeapon("#weapon2");
}

function getLabel(element)
{
    return $(element).prop("labels")[0];
}

function getImage(element)
{
    return $(element).find("img")[0];
}

function getSelectedRunemark(radioDiv) {
    var checked = $(radioDiv).find('input:checked');
    if (checked.length > 0)
    {
        return getImage(getLabel(checked[0])).getAttribute("src");
    }
    return null;
}

function setSelectedRunemark(radioDiv, runemark, radioGroupName, bgColor)
{
    // uncheck all
    {
        var checked = $(radioDiv).find('input:checked');
        for (var i = 0; i < checked.length; i++)
        {
            checked[i].checked = false;
        }
        var icons = $(radioDiv).find('img');
        for (var i = 0; i < icons.length; i++)
        {
            icons[i].style.backgroundColor = bgColor;
        }
    }

    if (runemark != null)
    {
        var queryString = "img[src='"+ runemark +"']";
        var img = $(radioDiv).find(queryString);
        if (img.length > 0)
        {
            var radioButton = $(img[0].parentNode.parentNode).find("input")[0];
            radioButton.checked = true;
            img[0].style.backgroundColor = "#b2221a";
        }
        else
        {
            var newDiv =
                addToImageRadioSelector(
                    runemark,
                    radioDiv,
                    radioGroupName,
                    bgColor);
            $(newDiv).find("img")[0].style.backgroundColor = "#b2221a";
            $(newDiv).find("input")[0].checked = true;
        }
    }
}

function getSelectedFactionRunemark() {
    return getSelectedRunemark($('#factionRunemarkSelect')[0]);
}

function setSelectedFactionRunemark(runemark) {
    setSelectedRunemark($('#factionRunemarkSelect')[0], runemark, "faction", "black");
}

function drawImage(scaledPosition, scaledSize, image)
{
    if (image != null)
    {
        if (image.complete)
        {
            getContext().drawImage(image, scaledPosition.x, scaledPosition.y, scaledSize.x, scaledSize.y);
        }
        else
        {
            image.onload = function(){ drawImage(scaledPosition, scaledSize, image); };
        }
    }
}

function drawImageSrc(scaledPosition, scaledSize, imageSrc)
{
    if (imageSrc != null)
    {
        var image = new Image();
        image.onload = function(){ drawImage(scaledPosition, scaledSize, image); };
        image.src = imageSrc;
    }
}

function drawTagRunemark(index, runemark) {
    var positions = [{x: 575, y: 550}, {x: 750, y: 550}, {x: 662.5, y: 400}];
    if (index >= positions.length) return;

    var img = $("#circle")[0];

    var position = scalePixelPosition(positions[index]);
    var size = scalePixelPosition({x: 160, y: 160});
    getContext().drawImage(img, position.x, position.y, size.x, size.y);

    position = scalePixelPosition({x: positions[index].x + 15, y: positions[index].y + 15});
    size = scalePixelPosition({x: 130, y: 130});
    drawImageSrc(position, size, runemark);
}

function drawModel(imageUrl, imageProps)
{
    if (imageUrl != null)
    {
        var image = new Image();
        image.onload = function(){
            var position = scalePixelPosition({x: 590 + imageProps.offsetX, y: imageProps.offsetY});
            var scale = imageProps.scalePercent/100.0;
            var width = image.width * scale;
            var height = image.height * scale;
            getContext().drawImage(image, position.x, position.y, width, height);

            URL.revokeObjectURL(image.src);
        };
        image.src = imageUrl;
    }
}

function getName()
{
    var textInput = $("#saveNameInput")[0];
    return textInput.value;
}

function setName(name)
{
    var textInput = $("#saveNameInput")[0];
    textInput.value = name;
}

function getModelImage()
{
    var imageSelect = $("#imageSelect")[0];

    if (imageSelect.files.length > 0)
    {
        return URL.createObjectURL(imageSelect.files[0]);
    }

    return null;
}

function setModelImage(image)
{
    var imageSelect = $("#imageSelect")[0];

    if (image != null)
    {
        // TODO: Not sure how to do this. It might not even be possible! Leave it for now...
        // imageSelect.files[0] = image;
    }
    else
    {
        imageSelect.value = null;
    }
}

function getDefaultModelImageProperties()
{
    return {
        offsetX: 0,
        offsetY: 0,
        scalePercent: 100
    };
}

function getModelImageProperties()
{
    return {
        offsetX: $("#imageOffsetX")[0].valueAsNumber,
        offsetY: $("#imageOffsetY")[0].valueAsNumber,
        scalePercent: $("#imageScalePercent")[0].valueAsNumber
    };
}

function setModelImageProperties(modelImageProperties)
{
    $("#imageOffsetX")[0].value = modelImageProperties.offsetX;
    $("#imageOffsetY")[0].value = modelImageProperties.offsetY;
    $("#imageScalePercent")[0].value = modelImageProperties.scalePercent;
}

function getDefaultWeaponData()
{
    var weaponData = new Object;
    weaponData.enabled = true;
    weaponData.rangeMin = 0;
    weaponData.rangeMax = 1;
    weaponData.attacks = 1;
    weaponData.strength = 3;
    weaponData.damageBase = 1;
    weaponData.damageCrit = 2;
    weaponData.runemark = null;
    return weaponData;
}

function getDefaultWeaponData1()
{
    var data = getDefaultWeaponData();
    data.enabled = true;
    return data;
}

function getDefaultWeaponData2()
{
    var data = getDefaultWeaponData();
    data.enabled = false;
    return data;
}

function readWeaponControls(weaponId)
{
    var weaponData = new Object;
    var weaponDiv = $(weaponId);
    weaponData.enabled = weaponDiv.find("#weaponEnabled")[0].checked;
    weaponData.rangeMin = weaponDiv.find("#rangeMin")[0].value;
    weaponData.rangeMax = weaponDiv.find("#rangeMax")[0].value;
    weaponData.attacks = weaponDiv.find("#attacks")[0].value;
    weaponData.strength = weaponDiv.find("#strength")[0].value;
    weaponData.damageBase = weaponDiv.find("#damageBase")[0].value;
    weaponData.damageCrit = weaponDiv.find("#damageCrit")[0].value;
    weaponData.runemark = getSelectedRunemark(weaponDiv.find("#weaponRunemarkSelect")[0]);
    return weaponData;
}

function writeWeaponControls(weaponId, weaponData, weaponName)
{
    weaponDiv = $(weaponId);
    weaponDiv.find("#weaponEnabled")[0].checked = weaponData.enabled;
    weaponDiv.find("#weaponInputs")[0].style.display = weaponData.enabled ? "block" : "none";
    weaponDiv.find("#rangeMin")[0].value = weaponData.rangeMin;
    weaponDiv.find("#rangeMax")[0].value = weaponData.rangeMax;
    weaponDiv.find("#attacks")[0].value = weaponData.attacks;
    weaponDiv.find("#strength")[0].value = weaponData.strength;
    weaponDiv.find("#damageBase")[0].value = weaponData.damageBase;
    weaponDiv.find("#damageCrit")[0].value = weaponData.damageCrit;
    setSelectedRunemark(
        weaponDiv.find("#weaponRunemarkSelect")[0],
        weaponData.runemark,
        weaponName,
        "white");
}

function readTagRunemarks()
{
    var array = new Array;
    var checkedBoxes = $("#tagRunemarkSelect").find('input:checked');
    for (i = 0; i < checkedBoxes.length; i++)
    {
        array.push(getImage(getLabel(checkedBoxes[i])).getAttribute("src"));
    }
    return array;
}

function setSelectedTagRunemarks(selectedRunemarksArray)
{
    var tagRunemarksDiv = $("#tagRunemarkSelect");
    // uncheck all
    {
        var checked = tagRunemarksDiv.find('input:checked');
        for (var i = 0; i < checked.length; i++)
        {
            checked[i].checked = false;
        }
        var icons = tagRunemarksDiv.find('img');
        for (var i = 0; i < icons.length; i++)
        {
            icons[i].style.backgroundColor = "white";
        }
    }

    for (var i = 0; i < selectedRunemarksArray.length; i++)
    {
        var runemark = selectedRunemarksArray[i];
        var queryString = "img[src='"+ runemark +"']";
        var imgs = tagRunemarksDiv.find(queryString);
        if (imgs.length > 0)
        {
            var checkbox = $(imgs[0].parentNode.parentNode).find("input")[0];
            checkbox.checked = true;
            imgs[0].style.backgroundColor = "#b2221a";
        }
        else
        {
            var newDiv =
                addToImageCheckboxSelector(
                    runemark,
                    tagRunemarksDiv[0],
                    "white");
            $(newDiv).find("img")[0].style.backgroundColor = "#b2221a";
            $(newDiv).find("input")[0].checked = true;
        }
    }
}

function readControls()
{
    var data = new Object;
    data.name = getName();
    data.imageUrl = getModelImage();
    data.imageProperties = getModelImageProperties();
    data.factionRunemark = getSelectedFactionRunemark();
    data.toughness = document.getElementById("toughness").value;
    data.wounds = document.getElementById("numWounds").value;
    data.move = document.getElementById("movement").value;
    data.pointCost = document.getElementById("pointCost").value;
    data.tagRunemarks = readTagRunemarks();
    data.weapon1 = readWeaponControls("#weapon1");
    data.weapon2 = readWeaponControls("#weapon2");

    return data;
}

function drawFactionRunemark(image)
{
    var position = scalePixelPosition({x: 67.5, y: 67.5});
    var size = scalePixelPosition({x: 190, y: 190});
    drawImageSrc(position, size, image);
}

function drawFactionWatermark(image)
{
    var position = scalePixelPosition({x: 975, y: 100});
    var size = scalePixelPosition({x: 800, y: 800});
    drawImageSrc(position, size, image);
}

render = function(fighterData) {
    drawBackground();
    drawModel(fighterData.imageUrl, fighterData.imageProperties);
    drawFactionRunemark(fighterData.factionRunemark);

    if (document.getElementById("addWatermark").checked)
    {
        drawFactionWatermark(fighterData.factionRunemark);
    }

    getContext().font = "92px RodchenkoCTT";
    getContext().fillStyle = "white";
    getContext().textBaseline = "middle";
    getContext().textAlign = "left";

    drawMove(fighterData.move);
    drawWounds(fighterData.wounds);

    getContext().textBaseline = "middle";
    getContext().textAlign = "right";

    drawToughness(fighterData.toughness);

    getContext().textBaseline = "middle";
    getContext().textAlign = "center";

    drawPointCost(fighterData.pointCost);

    getContext().font = "70px RodchenkoCTT";
    getContext().textBaseline = "top";
    getContext().textAlign = "left";
    getContext().fillStyle = "black";

    if (fighterData.weapon1.enabled && fighterData.weapon2.enabled)
    {
        drawWeapon(fighterData.weapon1, {x: 50, y: 750}); // Default was x:29, y:397
        drawWeapon(fighterData.weapon2, {x: 50, y: 950}); // Default was x:29, y:564
    }
    else if (fighterData.weapon1.enabled)
    {
        drawWeapon(fighterData.weapon1, {x: 50, y: 850}); // Default was x:29, y:463
    }
    else if (fighterData.weapon2.enabled)
    {
        drawWeapon(fighterData.weapon2, {x: 50, y: 850}); // Default was x:29, y:463
    }
    for (i = 0; i < fighterData.tagRunemarks.length; i++)
    {
        drawTagRunemark(i, fighterData.tagRunemarks[i]);
    }
}

function writeControls(fighterData)
{
    setName(fighterData.name);
    setModelImage(fighterData.imageUrl);
    setModelImageProperties(fighterData.imageProperties);
    setSelectedFactionRunemark(fighterData.factionRunemark);
    $("#toughness")[0].value = fighterData.toughness;
    $("#numWounds")[0].value = fighterData.wounds;
    $("#movement")[0].value = fighterData.move;
    $("#pointCost")[0].value = fighterData.pointCost;
    setSelectedTagRunemarks(fighterData.tagRunemarks);
    writeWeaponControls("#weapon1", fighterData.weapon1, "weapon1");
    writeWeaponControls("#weapon2", fighterData.weapon2, "weapon2");
}

function defaultFighterData() {
    var fighterData = new Object;
    fighterData.name = 'Default';
    fighterData.imageUrl = null;
    fighterData.imageProperties = getDefaultModelImageProperties();
    fighterData.factionRunemark = 'runemarks/white/factions/iron-golem.svg';
    fighterData.toughness = 4;
    fighterData.wounds = 15;
    fighterData.move = 5;
    fighterData.pointCost = 125;
    fighterData.tagRunemarks = new Array;
    fighterData.tagRunemarks.push('runemarks/black/fighters/berserker.svg');
    fighterData.weapon1 = getDefaultWeaponData1();
    fighterData.weapon2 = getDefaultWeaponData2();
    return fighterData;
}

function saveFighterDataMap(newMap)
{
    window.localStorage.setItem("fighterDataMap", JSON.stringify(newMap));
}

function loadFighterDataMap()
{
    var storage = window.localStorage.getItem("fighterDataMap");
    if (storage != null)
    {
        return JSON.parse(storage);
    }
    // Set up the map.
    var map = new Object;
    map["Default"] = defaultFighterData();
    saveFighterDataMap(map);
    return map;
}

function loadLatestFighterData()
{
    var latestFighterName = window.localStorage.getItem("latestFighterName");
    if (latestFighterName == null)
    {
        latestFighterName = "Default";
    }

    console.log("Loading '" + latestFighterName + "'...");

    var data = loadFighterData(latestFighterName);

    if (data)
    {
        console.log("Loaded data:");
        console.log(data);
    }
    else
    {
        console.log("Failed to load a fighter data.");
    }

    return data;
}

function saveLatestFighterData()
{
    var fighterData = readControls();
    if (!fighterData.name)
    {
        return;
    }

    window.localStorage.setItem("latestFighterName", fighterData.name);
    saveFighterData(fighterData);
}

function loadFighterData(fighterDataName)
{
    if (!fighterDataName)
    {
        return null;
    }

    var map = loadFighterDataMap();
    if (map[fighterDataName])
    {
        return map[fighterDataName];
    }

    return null;
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL;
}

function onload2promise(obj){
    return new Promise((resolve, reject) => {
        obj.onload = () => resolve(obj);
        obj.onerror = reject;
    });
}

async function getBase64ImgFromUrl(imgUrl){
    let img = new Image();
    let imgpromise = onload2promise(img); // see comment of T S why you should do it this way.
    img.src = imgUrl;
    await imgpromise;
    var imgData = getBase64Image(img);
    return imgData;
}

async function handleImageUrlFromDisk(imageUrl)
{
    if (imageUrl &&
        imageUrl.startsWith("blob:"))
    {
        // The image was loaded from disk. So we can load it later, we need to stringify it.
        imageUrl = await getBase64ImgFromUrl(imageUrl);
    }

    return imageUrl;
}

async function saveFighterData(fighterData)
{
    var finishSaving = function()
    {
        var map = loadFighterDataMap();
        map[fighterData.name] = fighterData;
        window.localStorage.setItem("fighterDataMap", JSON.stringify(map));
    };

    if (fighterData != null &&
        fighterData.name)
    {
        // handle images we may have loaded from disk...
        fighterData.imageUrl = await handleImageUrlFromDisk(fighterData.imageUrl);
        fighterData.factionRunemark = await handleImageUrlFromDisk(fighterData.factionRunemark);
        for (i = 0; i < fighterData.tagRunemarks.length; i++)
        {
            fighterData.tagRunemarks[i] = await handleImageUrlFromDisk(fighterData.tagRunemarks[i]);
        }
        fighterData.weapon1.runemark = await handleImageUrlFromDisk(fighterData.weapon1.runemark);
        fighterData.weapon2.runemark = await handleImageUrlFromDisk(fighterData.weapon2.runemark);

        finishSaving();
    }
}

function getLatestFighterDataName()
{
    return "latestFighterData";
}

window.onload = function() {
    //window.localStorage.clear();
    var fighterData = loadLatestFighterData();
    writeControls(fighterData);
    render(fighterData);
    refreshSaveSlots();
}

onAnyChange = function() {
    var fighterData = readControls();
    render(fighterData);
    saveLatestFighterData();
}

function onWeaponControlsToggled(weaponCheckbox) {
    var controlsDiv = $(weaponCheckbox.parentNode).find("#weaponInputs")[0];
    controlsDiv.style.display = weaponCheckbox.checked ? "block" : "none";

    onAnyChange();
}

onWeaponMinRangeChanged = function(minRange) {
    var maxRange = $(minRange.parentNode).find("#rangeMax")[0];
    maxRange.value = Math.max(minRange.value, maxRange.value);

    onAnyChange();
}

onWeaponMaxRangeChanged = function(maxRange) {
    var minRange = $(maxRange.parentNode).find("#rangeMin")[0];
    minRange.value = Math.min(maxRange.value, minRange.value);

    onAnyChange();
}

onRunemarkSelectionChanged = function(radioButton, backgroundColor)
{
    var radioSection = radioButton.parentNode.parentNode;
    var allRadioButtons = $('input', radioSection);

    for (i = 0; i < allRadioButtons.length; i++)
    {
        getImage(getLabel(allRadioButtons[i])).style.backgroundColor = backgroundColor;
    }

    getImage(getLabel(radioButton)).style.backgroundColor = "#b2221a";

    onAnyChange();
}

onTagRunemarkSelectionChanged = function(checkbox, backgroundColor)
{
    getImage(getLabel(checkbox)).style.backgroundColor = checkbox.checked ? "#b2221a" : backgroundColor;

    onAnyChange();
}

addToImageRadioSelector = function(imageSrc, imageSelector, radioGroupName, bgColor)
{
    var div = document.createElement('div');
    div.setAttribute('class', 'mr-0');
    div.innerHTML = `
        <label for="${ radioGroupName }-${ imageSrc }"><img src="${ imageSrc }" width="50" height="50" alt="" style="background-color:${ bgColor };"></label>
        <input type="radio" style="display:none;" name="${ radioGroupName }" id="${ radioGroupName }-${ imageSrc }" onchange="onRunemarkSelectionChanged(this, '${ bgColor }')">
    `;
    imageSelector.appendChild(div);
    return div;
}

onFactionRunemarkFileSelect = function()
{
    var imageSelect = $("#additionalFactionMarkSelect")[0];
    var selectGrid = $("#factionRunemarkSelect")[0];

    for (i = 0; i < imageSelect.files.length; i++)
    {
        addToImageRadioSelector(URL.createObjectURL(imageSelect.files[i]), selectGrid, "faction", "black");
    }
}

onWeaponRunemarkFileSelect = function(input, weaponName)
{
    var grid = $(input.parentNode).find("#weaponRunemarkSelect")[0];

    for (i = 0; i < input.files.length; i++)
    {
        addToImageRadioSelector(URL.createObjectURL(input.files[i]), grid, weaponName, "white");
    }
}

function addToImageCheckboxSelector(imgSrc, grid, bgColor)
{
    var div = document.createElement('div');
    div.setAttribute('class', 'mr-0');
    div.innerHTML = `
    <label for="checkbox-${ imgSrc }">
        <img src="${ imgSrc }" width="50" height="50" alt="" style="background-color:${ bgColor };">
    </label>
    <input type="checkbox" style="display:none;" id="checkbox-${ imgSrc }" onchange="onTagRunemarkSelectionChanged(this, '${ bgColor }')">
    `;
    grid.appendChild(div);
    return div;
}

function onTagRunemarkFileSelect()
{
    var imageSelect = $("#additionalTagMarkSelect")[0];
    var selectGrid = $("#tagRunemarkSelect")[0];

    for (i = 0; i < imageSelect.files.length; i++)
    {
        addToImageCheckboxSelector(URL.createObjectURL(imageSelect.files[i]), selectGrid, "white");
    }
}

function onClearCache()
{
    window.localStorage.clear();
    location.reload();
    return false;
}

function onResetToDefault()
{
    var fighterData = defaultFighterData();
    writeControls(fighterData);
    render(fighterData);
}

function refreshSaveSlots()
{
    // Remove all
    $('select').children('option').remove();

    var fighterDataName = readControls().name;

    var map = loadFighterDataMap();

    for (let [key, value] of Object.entries(map)) {
        var selected = false;
        if (fighterDataName &&
            key == fighterDataName)
        {
            selected = true;
        }
        var newOption = new Option(key, key, selected, selected);
        $('#saveSlotsSelect').append(newOption);
    }
}

function onSaveClicked()
{
    var fighterData = readControls();
    console.log("Saving '" + fighterData.name + "'...");
    saveFighterData(fighterData);
    refreshSaveSlots();
}

function onLoadClicked()
{
    var fighterDataName = $('#saveSlotsSelect').find(":selected").text();
    console.log("Loading '" + fighterDataName + "'...");
    fighterData = loadFighterData(fighterDataName);
    writeControls(fighterData);
    render(fighterData);
    refreshSaveSlots();
}

function onDeleteClicked()
{
    var fighterDataName = $('#saveSlotsSelect').find(":selected").text();

    console.log("Deleting '" + fighterDataName + "'...");

    var map = loadFighterDataMap();
    delete map[fighterDataName];

    saveFighterDataMap(map);

    refreshSaveSlots();
}
