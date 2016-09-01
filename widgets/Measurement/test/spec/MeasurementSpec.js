define([
  'app/widgets/Measurement/Measurement',
  'esri/map',
  'dojo/dom-construct',
  'dojo/_base/lang'

], function (
  WidgetUnderTest,
  Map,
  domConstruct,
  lang
) {
    describe('app/widgets/Measurement', function () {
      var widget;
      var destroy = function (widget) {
        if (widget && widget.destroyRecursive) {
          widget.destroyRecursive();
          widget = null;
        }
      };

      beforeEach(function (done) {
        // init map. I don't really want to use a map in tests but as the esri measure widget requires it I don't think I can get away from it
        var mapOptions = {
          basemap: 'topo',
          center: [-122.45, 37.75],
          zoom: 13,
          sliderStyle: 'small'
        };

        var map = new Map(domConstruct.create('div', null, document.body), mapOptions);
        map.on('load', lang.hitch(this, function (m) {
          // init widget
          widget = new WidgetUnderTest({ map: map }, domConstruct.create('div', null, document.body));
          widget.startup();
          done();
        }));

      });

      afterEach(function () {
        destroy(widget);
      });

      describe('Sanity', function () {
        it('should create a Measurement', function () {
          expect(widget).to.not.be.an("undefined");
        });
      });


      describe('measure lines', function () {


        it('should log an exception if there is an error on startup and not throw error', function () {
          var err = new ReferenceError('This is a bad function.');
          widget._addLabels = function () { throw err; };
          expect(widget._init).not.to.throw(err);
        });

        it('should add two divs for display of results', function () {
          expect(widget.resultSegmentDiv).to.not.be.an("null");
          expect(widget.resultMouseSegmentDiv).to.not.be.an("null");
        });

        it('two points should be measured', function () {
          var length = widget._createAndMeasureLine([55, 55], [60, 60]);
          assert.equal(length.toPrecision(2), 0.0070);
        });

        it('two points should be measured when the map is not Web Mercator', function () {
          widget.map.spatialReference.isWebMercator = function () { return false; };
          var length = widget._createAndMeasureLine([55, 55], [60, 60]);
          assert.equal(length.toPrecision(2), 0.0071);
        });

        it('format numbers for display', function () {
          var disp = widget._formatNumberForDisplay(10);
          assert.equal("10.00", disp);
        });

        it('should only work on distance', function () {
          widget.activeTool = "test";
          var val = widget.calcDistance({});
          assert.equal(val, false);
          val = widget.calcMouseDistance({});
          assert.equal(val, false);
        });

        it('Map point should be stored when in distance mode but it should not calculate length (it needs two points)', function () {
          widget.activeTool = "distance";
          var val = widget.calcDistance({ mapPoint: {} });
          assert.equal(val, false);
        });

        it('Mouse distance only requires one point in the array and the passed in point', function () {
          widget.activeTool = "distance";
          var val = widget.calcMouseDistance({ mapPoint: {} });
          assert.equal(val, true);
        });

        it('Mouse distance should not store that point in the array', function () {
          widget.activeTool = "distance";
          var countBefore = widget.arrMeasurePoints.length;
          var val = widget.calcMouseDistance({ mapPoint: {} });
          assert.equal(val, true);
          assert.equal(countBefore, widget.arrMeasurePoints.length);
        });

        it('Map point should be stored when in distance mode and it will calculate length', function () {
          widget.activeTool = "distance";
          var val = widget.calcDistance({ mapPoint: {} });
          assert.equal(val, true);
        });

        it('Check two map points are in the array', function () {
          assert.equal(widget.arrMeasurePoints.length, 2);
        });

        it('Check that the result is displayed for last segment', function () {
          widget._unitDropDown.label = "kilometers";
          widget._displaySegmentResult(10);
          assert.equal(widget.resultSegmentDiv.innerHTML, "Last Segment length: 10.00 kilometers");
        });

        it('Check that the result is displayed for last mouse segment', function () {
          widget._unitDropDown.label = "kilometers";
          widget._displayMouseSegmentResult(10);
          assert.equal(widget.resultMouseSegmentDiv.innerHTML, "Segment length: 10.00 kilometers");
        });

        it('should create the three labels created when mouse mode', function () {
          widget.totalLengthLabel = null;
          widget.resultMouseSegmentDiv = null;
          widget.resultSegmentDiv = null;
          widget._addLabels();

          expect(widget.totalLengthLabel).to.not.be.an("null");
          expect(widget.resultMouseSegmentDiv).to.not.be.an("null");
          expect(widget.resultSegmentDiv).to.not.be.an("null");

        });

        it('should create the three labels created when mouse mode', function () {
          widget.mouseMoveMeasure = false;
          widget.totalLengthLabel = null;
          widget.resultMouseSegmentDiv = null;
          widget.resultSegmentDiv = null;
          widget._addLabels();

          expect(widget.totalLengthLabel).to.not.be.an("null");
          expect(widget.resultMouseSegmentDiv).to.be.an("null");
          expect(widget.resultSegmentDiv).to.not.be.an("null");

        });

        it("should show/hide the total length label when in distance mode ", function () {
          widget._onMeasureModeChangeExt({ toolName: 'distance' });
          assert.equal(widget.totalLengthLabel.innerHTML, "Total Length: ");
          widget._onMeasureModeChangeExt({ toolName: 'area' });
          assert.equal(widget.totalLengthLabel.innerHTML, "");
          widget._onMeasureModeChangeExt({ toolName: 'distance' }); //switch it back just to be sure
          assert.equal(widget.totalLengthLabel.innerHTML, "Total Length: ");
        });

        it("should clear the array of points when measure ends", function () {
          widget._onMeasureEndExt();
          assert.equal(widget.arrMeasurePoints.length, 0);
        });

      });

    });
  });
