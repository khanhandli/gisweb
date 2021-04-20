$("#document").ready(function () {
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

	

	var map = new ol.Map({
		target: 'map',
		layers: [vung,duong,diem],
		view : new ol.View({
			projection: projection
		})
	})


	map.getView().fit(bounds, map.getSize());
})
