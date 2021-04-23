$("#document").ready(function () {
	//5. Tao cua so hien thi thuoc tinh
	var container = document.getElementById('popup');
	var content = document.getElementById('popup-content');
	var closer = document.getElementById('popup-closer');

	var overlay = new ol.Overlay(({
		element: container,
		autoPan: true,
		autoPanAnimation: {
			duration: 250
		}
	}));

	var shouldUpdate = true;
	var center = [564429.04, 2317738.2];
	var zoom = 16.56631263565161;
	var rotation = 0;

	closer.onclick = function() {
		overlay.setPosition(undefined);
		closer.blur();
		return false;
	}
	
	console.log('tét')
	///hien thi lop ban do len web
	var format = "image/png"
	var bounds = [564178.2984813827,2317461.9513460337,564518.2767810355,2318018.0536381397]
	var vung = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			ratio: 1,
			url: 'http://localhost:8081/geoserver/nhuygis/wms',
			params: {
				'FORMAT': format,
				'VERSION': '1.1.0',
				STYLES: '',
				LAYERS: 'nhuygis:camhoangdc_1'
			}
		})
	});

	var duong = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			ratio: 1,
			url: 'http://localhost:8081/geoserver/nhuygis/wms',
			params: {
				'FORMAT': format,
				'VERSION': '1.1.0',
				STYLES: '',
				LAYERS: 'nhuygis:camhoanggt_1'
			}
		})
	});

	var diem = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			ratio: 1,
			url: 'http://localhost:8081/geoserver/nhuygis/wms',
			params: {
				'FORMAT': format,
				'VERSION': '1.1.0',
				STYLES: '',
				LAYERS: 'nhuygis:camhoangub_1'
			}
		})
	});

	var projection = new ol.proj.Projection({
		code: 'EPSG: 3405',
		units: 'm',
		axisOrientation: 'neu'
	})

	var view = new ol.View({
		projection: projection,
		center: center,
		zoom: zoom,
		rotation: rotation
	})

	var map = new ol.Map({
		target: 'map',
		layers: [vung,duong,diem],
		overlays:[overlay],
		view: view
	})


	map.getView().fit(bounds, map.getSize());
	
//code tim kiem doi tuong
	if(window.location.hash !== '') {
		var hash = window.location.hash.replace('#map=', '');
		var parts = hash.split('/');

		if(parts.length === 4) {
			zoom = parseInt(parts[0], 10);
			center = [
				parseFloat(parts[1]),
				parseFloat(parts[2])
			];
			rotation = parseFloat(parts[3]);
		}
	}
	// Hiển thị nổi bật đối tượng được chọn dang vùng: 
	var styles = {
		'MultiPolygon': new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'red',
				width: 5
			})
		})
	};

	var styleFunction = function(feature) {
		return styles[feature.getGeometry().getType()];
	};

	var vectorLayer = new ol.layer.Vector({
		style: styleFunction
	});

	map.addLayer(vectorLayer);


	//hieenr thij

	// var vectorSource = new ol.source.Vector({
	// 	features: (new ol.format.GeoJSON()).readFeatures(n)
	// })
	// vectorLayer.setSource(vectorSource)
	

	//Lấy thông tin khi click chuột
	map.on('singleclick', function (evt) {
		var view = map.getView();
		var viewResolution = view.getResolution();
		var source = vung.getSource();
		var url = source.getFeatureInfoUrl(evt.coordinate, viewResolution, view.getProjection(), {'INFO_FORMAT': 'application/json', 'FEATURE_COUNT':50})
		console.log({url})
		console.log('hehehi0000')

		if(url) {
			$.ajax({
				type: "POST",
				url: url,
				contentType: "application/json; charset=utf-8",
				dataType: 'json',
				success: function(n) {
					var content  = "<table>";
					for(var i = 0; i < n.features.length; i++) {
						var feature = n.features[i];
						var featureAttr = feature.properties;
						content += "<tr><td>Loại Đất:" + featureAttr["txtmemo"]
						+"</td><td>Diện Tích:" + featureAttr["shape_area"]
						+"</td></tr>"
					}

					content += "</table>";
					// $("#info").html(content);
					// 5. Sửa lịa bài 3 thay info thành popup-content
					$("#popup-content").html(content);
					overlay.setPosition(evt.coordinate)

					// 4. Hieenr thi noi bat doi tuong duocj chon dang vung: camhoangdc
					var vectorSource = new ol.source.Vector({
						features: (new ol.format.GeoJSON()).readFeatures(n)

					})
					vectorLayer.setSource(vectorSource)

				}
			})
		}
	});


	var updatePermalink = function() {
		if(!shouldUpdate) {
			// do not update the url when the view was changed 
			shouldUpdate = true;
			return;
		}

		var center = view.getCenter();
		var hash = '#map=' +
			view.getZoom() + '/' +
			Math.round(center[0] * 100) / 100 + '/' +
			Math.round(center[1] * 100) / 100 + '/' +
			view.getRotation();
		var state = {
			zoom: view.getZoom(),
			center: view.getCenter(),
			rotation: view.getRotation()
		};

		window.history.pushState(state, 'map', hash);
	};

	map.on('moveend', updatePermalink);

	window.addEventListener('popstate', function(event) {
		if(event.state === null) {
			return;
		}

		map.getView().setCenter(event.state.center);
		map.getView().setZoom(event.state.zoom);
		map.getView().setRotation(event.state.rotation);
		shouldUpdate = false;
	});

	function di_den_diem(x, y ) {
		var vi_tri = ol.proj.fromLonLat([x, y], projection);
		view.animate({
			center: vi_tri,
			duration: 2000,
			zoom: 20
		})
	}


	///taoj check box
	$("#checkvung").change(function() {
		if($("#checkvung").is(":checked")) {
			vung.setVisible(true)
		}
		else {
			vung.setVisible(false)
		}
	});

	$("#checkduong").change(function() {
		if($("#checkduong").is(":checked")) {
			duong.setVisible(true)
		}
		else {
			duong.setVisible(false)
		}
	});

	$("#checkdiem").change(function() {
		if($("#checkdiem").is(":checked")) {
			diem.setVisible(true)
		}
		else {
			diem.setVisible(false)
		}
	});

	

	//tao popup

})
