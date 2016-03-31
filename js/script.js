$(function() {
    var canvasWid = 0;
    var canvasHei = 0;
    var movX = 0;
    var movY = 0;
    var toColor = "";
    var pixelColor = "";
    var luaColor = "";
    var imgReady = false;
    var canvas = null;
    var context = null;
    var img;
    var scalebei = 1;
    var irealwidth;
    var irealheight;
    var scaleaddnums = 0;
    var scalejiannums = 0;
    var realImgData;
    var rotatePosX = 0;
    var rotatePosY = 0;
    var drawBox;
    var colorPexiLen = 0;
    var localMovX = 0;
    var localMovY = 0;
    var stop = false;
    var stColor = "";

    function stringToHex(str) { //16进制转换
        var fToColor = "";
        fToColor = str.toString(16);
        if (fToColor.length < 2) {
            fToColor = "0" + fToColor;
        }
        return fToColor;
    }

    function draw(img, WidX, HeiY) { //画布
        context = canvas.getContext("2d");
        context.drawImage(img, WidX, HeiY);
    }


    function hoverdrop(e, canvase) {
        $(".color-list").css({
            "border": "1px solid #333333",
            "box-shadow": "none"
        });
        $("div[data-dash-line]").show();
        var lineX = $("#drash-X");
        var lineY = $("#drash-Y");
        var colorInfo = $("#drsh-info");
        colorInfo.show();
        //鼠标移动拾取
        movX = e.offsetX - 2;
        movY = e.offsetY - 2;
        localMovX = movX;
        localMovY = movY;

        var canvasOffset = canvase.offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left) - 2;
        var canvasY = Math.floor(e.pageY - canvasOffset.top) - 2;
        // 获取该点像素的数据
        var imageData = context.getImageData(canvasX, canvasY, 1, 1);
        var pixel = imageData.data;
        var imagePeixData = context.getImageData(canvasX - 7, canvasY - 7, 15, 15);
        var imagePeix = imagePeixData.data;
        for (var c = 0; c < colorPexiLen; c++) {
            localpixelColor = "rgb(" + imagePeix[4 * c + 0] + "," + imagePeix[4 * c + 1] + "," + imagePeix[4 * c + 2] + ")";
            $("#color-peix").find("li").eq(c).css("background-color", localpixelColor);
        }
        pixelColor = "rgb(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + ")"; //rgb格式颜色
        luaColor = stringToHex(pixel[0]) + stringToHex(pixel[1]) + stringToHex(pixel[2]);
        stColor = luaColor;
        toColor = "#" + luaColor; //转化16进制颜色
        lineX.css("top", movY);
        lineY.css("left", movX);
        context.strokeStyle = "rgba(0,0,0,0.3)"; //浮动框
        context.fillStyle = "rgba(255,255,255,0.6)";
        context.font = "14px Arial";
        if (canvasWid - movX < 128 && movY > 48) { //判断光标离画布的距离调整浮动框位置，右下角
            colorInfo.css({
                "left": movX - 128,
                "top": movY - 38
            });
        } else if (canvasWid - movX > 128 && movY < 48) { //左上角
            colorInfo.css({
                "left": movX + 12,
                "top": movY + 12
            });

        } else if (canvasWid - movX < 128 && movY < 48) { //右上角
            colorInfo.css({
                "left": movX - 128,
                "top": movY + 12
            });
        } else { //正常
            colorInfo.css({
                "left": movX + 12,
                "top": movY - 38
            });
        }
        colorInfo.find(".color-info-text").text("X:" + movX + ",Y:" + movY);
        colorInfo.find(".color-info-box").css("background", toColor);
        $("div[data-piex-info]").text(movX + "," + movY + "," + pixelColor + " , " + toColor);
        //绘制十字线
    }

    function choutiBar() { //右侧颜色列表开关
        var listBox = $("aside[data-colorlist]");
        if (listBox.attr("data-hidden") == "true") {
            listBox.css("right", 0);
            listBox.attr("data-hidden", "false");
            $(".draw").css({
                "width": "calc(100% - 260px)"
            });
        } else {
            listBox.css("right", "-260px");
            listBox.attr("data-hidden", "true");
            $(".draw").css({
                "width": "100%"
            });
        }
    }

    function pushMyColor(key) { //添加颜色
        if (imgReady) {
            if (key) {
                if (stop) {
                    $("#color-list" + key).attr("data-has", "true");
                    $("#color-list" + key).find("input[data-color-input]").val(localMovX + ", " + localMovY + ", 0x" + stColor);
                    $("#color-list" + key).find("span[data-color-show]").css("background-color", "#" + stColor);
                } else {
                    $("#color-list" + key).attr("data-has", "true");
                    $("#color-list" + key).find("input[data-color-input]").val(movX + ", " + movY + ", 0x" + luaColor);
                    $("#color-list" + key).find("span[data-color-show]").css("background-color", "#" + luaColor);
                }
            }
        }

    }

    function transNum(key) { //检测0-9快捷键
        var listmun;
        switch (key) {
            case 49:
                listmun = 1;

                break;
            case 50:
                listmun = 2;
                break;
            case 51:
                listmun = 3;
                break;
            case 52:
                listmun = 4;
                break;
            case 53:
                listmun = 5;
                break;
            case 54:
                listmun = 6;
                break;
            case 55:
                listmun = 7;
                break;
            case 56:
                listmun = 8;
                break;
            case 57:
                listmun = 9;
                break;
            case 48:
                listmun = 10;
                break;
            default:
                listmun = false;
                break;
        };
        return listmun;
    }

    function clearColor($this) { //单个清除颜色
        $this.parent(".mycolorliin").attr("data-has", "false");
        $this.siblings("input[data-color-input]").val("");
        $this.siblings("span[data-color-show]").css("background-color", "");
    }

    function allClearColor() { //清除所有颜色
        $(".mycolorliin").attr("data-has", "false");
        $("input[data-color-input]").val("");
        $("span[data-color-show]").css("background-color", "");
    }

    function rotateImg(direction) {
        //最小与最大旋转方向，图片旋转4次后回到原方向  

        var min_step = 0;
        var max_step = 3;
        if (img == null) return;
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错  
        var height = img.height;
        var width = img.width;
        var step = img.getAttribute('step');
        if (step == null) {
            step = min_step;
        }
        if (direction == 'right') {
            step++;
            //旋转到原位置，即超过最大值  
            step > max_step && (step = min_step);
        } else {
            step--;
            step < min_step && (step = max_step);
        }
        img.setAttribute('step', step);
        //旋转角度以弧度值为参数  
        var degree = step * 90 * Math.PI / 180;
        switch (step) {
            case 0:
                canvas.width = width + 2;
                canvas.height = height + 2;
                rotatePosX = 0;
                rotatePosY = 0;
                break;
            case 1:
                canvas.width = height + 2;
                canvas.height = width + 2;
                context.rotate(degree);
                rotatePosX = 0;
                rotatePosY = -height;
                break;
            case 2:
                canvas.width = width + 2;
                canvas.height = height + 2;
                context.rotate(degree);
                rotatePosX = -width;
                rotatePosY = -height;
                break;
            case 3:
                canvas.width = height + 2;
                canvas.height = width + 2;
                context.rotate(degree);
                rotatePosX = -width;
                rotatePosY = 0;

                break;
        }
        drawBox.css({
            "width": canvas.width + "px",
            "height": canvas.height + "px"
        });
        draw(img, rotatePosX, rotatePosY);
        drawBox.width = canvas.width;
        drawBox.height = canvas.height;
        canvasWid = canvas.width;
        canvasHei = canvas.height;
    }

    function rotateType(dom) {
        var rotatetype = dom.id;
        var type;
        if (rotatetype == "sclea-left") {
            type = "left"
        } else if (rotatetype == "sclea-right") {
            type = "right"
        }
        return type;
    }

    function toscript() {
        var scriptTypeOne = "";
        var scriptTypeTwo = "";
        var scriptTypeThree = "";
        var scriptArr = [];
        var ColorArr = [];
        var eachColorArr = [];
        var scriptDom = $("li[data-has=true]").find("input[data-color-input]");
        for (var i = 0; i < scriptDom.length; i++) {
            var scriptColorArr = $(scriptDom[i]).val();
            eachColorArr = scriptColorArr.split(",");
            ColorArr.push(eachColorArr);
            scriptArr.push(scriptColorArr);
            scriptTypeOne += "{" + scriptColorArr + "},"
            scriptTypeTwo += "isColor( " + scriptColorArr + ", 85) and ";

        }
        for (var j = 0; j < ColorArr.length; j++) {
            if (j + 1 < ColorArr.length) {
                var chax = ColorArr[j + 1][0] - ColorArr[0][0];
                var chay = ColorArr[j + 1][1] - ColorArr[0][1];
                var chaColor = ColorArr[j + 1][2];
                scriptTypeThree += chax + "|" + chay + "|" + chaColor + ",";
            }
        }

        scriptTypeThree = "x,y = findMultiColorInRegionFuzzy(" + ColorArr[0][2] + ", " + scriptTypeThree.substring(0, scriptTypeThree.length - 2) + ", 90, 0, 0, 0, 0)";
        scriptTypeOne = "{" + scriptTypeOne.substring(0, scriptTypeOne.length - 1) + "}";
        scriptTypeTwo = "if (" + scriptTypeTwo.substring(0, scriptTypeTwo.length - 4) + ") then";
        $("#data-copy1").val(scriptTypeOne);
        $("#data-copy2").val(scriptTypeTwo);
        $("#data-copy3").val(scriptTypeThree);
    }

    function fundClearColor(li) {
        $(".color-list").css({
            "border": "1px solid #333333",
            "box-shadow": "none"
        });
        li.css({
            "border": "2px solid #ff0000",
            "box-shadow": "0 0 2px #000 inset"
        });
        var localx = (li.attr("data-x")) - 8;
        var localy = (li.attr("data-y")) - 8;
        localMovX = localx + movX;
        localMovY = localy + movY;
        var liBg = li.css("background-color");
        stColor = transColor(liBg);
        $("div[data-piex-info]").text(localMovX + "," + localMovY + "," + liBg + " , #" + stColor);
    }

    function transColor(rgb) {
        var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        delete(parts[0]);
        for (var i = 1; i <= 3; ++i) {
            parts[i] = parseInt(parts[i]).toString(16);
            if (parts[i].length == 1) parts[i] = '0' + parts[i];
        }
        var hexString = parts.join(''); // "0070ff"
        return hexString;
    }


    $(document).ready(function() {
        $("#fileUpload").change(function(obj, evt) {
            var reader = new FileReader();
            reader.readAsDataURL(this.files[0]);
            reader.onload = function(e) {
                img = new Image();
                img.src = e.target.result;

                setTimeout(function() {
                    var imgWid = img.width + 2;
                    var imgHei = img.height + 2;
                    imgReady = img.complete;
                    canvas = document.getElementById("canvas");
                    drawBox = $("#draw-box");
                    canvasWid = img.width;
                    canvasHei = img.height;
                    var step = img.getAttribute('step');
                    canvas.setAttribute("width", imgWid + "px");
                    canvas.setAttribute("height", imgHei + "px");
                    drawBox.css({
                        "width": imgWid + "px",
                        "height": imgHei + "px"
                    });
                    draw(img, 0, 0);
                }, 500);
            }
        });

        var colorPexiBox = $("#color-peix");
        var colorPexiLi = "";
        colorPexiLen = 225;
        for (var i = 0; i < colorPexiLen; i++) {
            var localY = Math.floor(i / 15 + 1);
            var localX = Math.floor((i - 15 * (localY - 1) + 1));
            colorPexiLi += '<li class="color-list" data-y=' + localY + ' data-x=' + localX + '></li>'
        }
        colorPexiBox.html(colorPexiLi);

        $(document).keydown(function(even) {
            var keyCode = even.keyCode;
            var keyNum = transNum(keyCode);
            if (keyNum && even.shiftKey == false) {
                pushMyColor(keyNum);
            } else if (keyCode == 82 && even.ctrlKey) {
                choutiBar();
                even.preventDefault();
                return false;
            } else if (keyCode == 83 && even.ctrlKey) {
                $(".stop-draw").toggle(function() {
                    if (stop) {
                        stop = false;
                    } else {
                        stop = true;
                    }
                });
                even.preventDefault();
                return false;
            } else if (keyNum && even.shiftKey) {
                var $this = $("#color-list" + keyNum).find("span[data-clear-color]");
                clearColor($this);
                even.preventDefault();
                return false;
            }
        })
        $("#list-color-btn").click(function() {
            choutiBar();
        });
        $("span[data-clear-color]").click(function() {
            var $this = $(this);
            clearColor($this);
        });
        $("div[data-clear-all]").click(function() {
            allClearColor();
        });
        //      $("div[data-jiajian]").click(function(even) {
        //          var typeNum = scaletype(even);
        //          if (context) {
        //              scleat(typeNum);1
        //          }
        //      });
        $("div[data-rotate]").click(function() {
            rotateImg(rotateType(this))

        });
        $("#canvas").mousemove(function(e) {
            var $this = $(this);
            hoverdrop(e, $this);
        });
        $("div[data-scprit]").click(function() {
            toscript();
        });

        $(".color-list").click(function(e) {
            fundClearColor($(this));
        })
    });
})