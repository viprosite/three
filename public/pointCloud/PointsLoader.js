var requestKV;
var importMesh = function (url) {
    if (url == null) return;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200 || xhr.status === 304) {
            zip.loadAsync(xhr.response, { checkCRC32: true }).then(res => {
                for (let key in res.files) {
                    res.file(res.files[key].name).async('arraybuffer')
                        .then(content => {
                            var points = new Float32Array(content);
                            var geom = new THREE.Geometry();
                            var c = 0, y = 0;
                            var rowSig = 9999999;//行标记9999999
                            var ver = points[0];//点云版本
                            var bt = points[1];//缩放比率
                            var cx = points[2];//受电弓开口方向, 0为开口, 1为闭口
                            var cz = points[3];//中心点z
                            var cbt = bt / 2;
                            var ccc = ver >99 ?1.8:0.6 / bt;
                            for (var i = 4; i < points.length; i++) {
                                if (points[i] != rowSig) {
                                    geom.vertices.push(new THREE.Vector3(points[i + 0], -points[i + 1], y * ccc));
                                    c = points[i + 1] * cbt % 360;
                                    geom.colors.push(new THREE.Color('hsl(' + c + ', 100%, 50%)'));
                                    i++;
                                } else {
                                    y++;
                                }
                            }
                            var cloud = new THREE.Points(geom, material);
                            scene.add(cloud);

                            if (ver >99) {
                                //受电弓画十字
                                //var z = url.indexOf("_1.asd") == -1 ? 300 : 1650;
                                mackCross(new THREE.Vector3(0, 0, 0));

                                cloud.translateY(100);
                                //移动受电弓点云位置
                                if (cx == 0) {
                                    cloud.rotateY(3.16);
                                    cloud.translateZ(-400);
                                    cloud.translateX(-50);
                                }
                                else {
                                    cloud.translateZ(-2400);
                                    cloud.translateX(0);
                                }
                                if (requestKV.pianyi != "") {
                                    var info1 = new Array();
                                    info1.push("中心线偏移(mm):" + requestKV.pianyi);
                                    if (requestKV.qingJiao != undefined)
                                        info1.push("弓头倾斜(°):" + requestKV.qingJiao);
                                    loadDefect(document.getElementById("canvas"), info1, 78, 50, 2);
                                }

                                if (requestKV.thickness != "") {
                                    var info2 = new Array();
                                    info2.push("最小剩余厚度(mm):" + requestKV.thickness);
                                    loadDefect(document.getElementById("canvas"), info2, parseInt(requestKV.weiZhi), 60, 50);
                                }
                            } else {
                                cloud.translateZ(80);
                                cloud.translateY(200);
                                //camera.position.set(0, 200, 200);
                                cloud.translateX(-150);
                                cloud.rotateY(1.55);
                            }
                        })
                }
            }).catch(err => {
                console.log(err)
            });
        };
    }
    xhr.send();
}

//画十字
var mackCross = function (vector3) {
    var geom = new THREE.Geometry();
    var z = 0;
    for (var i = -800; i < 800; i++) {
        geom.vertices.push(new THREE.Vector3(i, 0, z));
        geom.colors.push(new THREE.Color(0xffffff, 1.0));
    }
    for (var i = -350; i < 350; i++) {
        geom.vertices.push(new THREE.Vector3(0, i, z));
        geom.colors.push(new THREE.Color(0xffffff, 1.0));
    }
    crossMaterial = new THREE.PointsMaterial({ size: 3, vertexColors: true, color: 0xffffff });
    var cross = new THREE.Points(geom, crossMaterial);
    cross.target = vector3;
    scene.add(cross);
}


//加载文字
var loadDefect = function (canvas, params, x, y, z) {
    let ctx = canvas.getContext('2d')
    //加载图片
    var img = new Image(500,300);
    img.src = "/config/123.png";
    //img.src = "textures/123.png";
    //图片加载完成后
    img.onload = function () {
        //创建图形画刷，模式为repeat
        var pattern = ctx.createPattern(img, "repeat");
        ctx.fillStyle = pattern;

        //绘制矩形，使用画刷填充
        ctx.fillRect(0, 0, 500, 300);

        //ctx.fillRect(0, 0, 300, 90);
        //设置文字
        ctx.fillStyle = "#fff";
        ctx.font = 'normal 36pt "宋体"'
        for (j = 0, len = params.length; j < len; j++) {
            ctx.fillText(params[j], 15, 70 * (j + 1));
        }

        //let textWord = ''
        ////文字换行
        //let len = parseInt(textWord.length / 10)
        //for (let i = 0; i < (len + 1); i++) {
        //    let space = 10
        //    if (i === len) {
        //        space = textWord.length - len * 10
        //    }
        //    //console.log('len+' + len, 'space+' + space)
        //    let word = textWord.substr(i * 10, space)
        //    ctx.fillText(word, 5, 10 * (i + 1))
        //}
        //生成图片
        let url = canvas.toDataURL('image/png');

        //将图片构建到纹理中
        let geometry1 = new THREE.PlaneGeometry(600, 300);
        let texture = THREE.ImageUtils.loadTexture(url, null, function (t) { });

        let material1 = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            opacity: 1,
            transparent: true,
        });

        let rect = new THREE.Mesh(geometry1, material1)
        rect.position.set(x, y, z);
        scene.add(rect);
    }
}
    var getQueryStringByName = function (name) {
        var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
}
