define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/dom-construct',
  'dojo/number',

  'esri/dijit/Measurement',
  'esri/geometry/Polyline',
  'esri/geometry/geometryEngine'
], function (
  declare,
  lang,
  domConstruct,
  Number,
  esriMeasurement,
  Polyline,
  GeometryEngine
) {
    return declare([esriMeasurement], {
      // description:
      //  extends esri's measure tool to add last segment and current segment properties

      //store our array of points as the user clicks
      arrMeasurePoints: [],
      //set this to false if you do not want to show the distance as the mouse moves. 
      mouseMoveMeasure: true,
      //div to display the results of the last segment measured
      resultMouseSegmentDiv: null,
      //div to display the current segment length as the mouse moves


      postCreate: function () {

        this.inherited(arguments);
        this._init();
      },

      _init: function () {
        try {
          //add the labels to display the extra results
          this._addLabels();

          //hook into the measure and map listeners
          this._addlisteners();

        } catch (error) {
          console.error('app.Measurement::postCreate', error);
        }
      },

      _addlisteners: function () {

        //hook into the map click event
        this.map.on('click', lang.hitch(this, this.calcDistance));

        //hook in to clear the points on draw end
<<<<<<< HEAD
        this.own(this.on('tool-change', lang.hitch(this, function () {
          this.arrMeasurePoints = [];
          this.resultSegmentDiv.innerHTML = '&nbsp;';
          if (this.resultMouseSegmentDiv) {
            this.resultMouseSegmentDiv.innerHTML = '&nbsp;';
          }
        })));
        this.own(this.on('measure-end', lang.hitch(this, function () {
          this.arrMeasurePoints = [];
        })));

        if (this.mouseMoveMeasure) {
          this.own(this.map.on('mouse-move', lang.hitch(this, this.calcMouseDistance)));
        }
=======
        this.own(this.on("tool-change", lang.hitch(this, this._onMeasureModeChangeExt)));

        this.own(this.on("measure-end", lang.hitch(this, this._onMeasureEndExt)));

        if (this.mouseMoveMeasure) this.own(this.map.on('mouse-move', lang.hitch(this, this.calcMouseDistance)));
>>>>>>> origin/master

      },

      _addLabels: function () {
        //add a new div to contain our mouse segment length
        this.totalLengthLabel = domConstruct.create('div', { 'class': 'esriMeasurementResultTotal', innerHTML: 'Total Length: ', style: { display: "inline-block" } }, this.resultValueContainer.domNode, "first");
        //add a new div to contain our mouse segment length
        if (this.mouseMoveMeasure) {
          this.resultMouseSegmentDiv = domConstruct.create(
            'div', 
            { 'class': 'esriMeasurementResultSegment', innerHTML: '&nbsp;' }, 
            this.resultValueContainer.domNode);
        }
        //add a new div to contain our segment length
<<<<<<< HEAD
        this.resultSegmentDiv = domConstruct.create(
          'div', 
          { 'class': 'esriMeasurementResultSegment', innerHTML: '&nbsp;' }, 
          this.resultValueContainer.domNode);
=======
        this.resultSegmentDiv = domConstruct.create('div', { 'class': 'esriMeasurementResultSegment', innerHTML: '&nbsp;' }, this.resultValueContainer.domNode);
      },

      _onMeasureModeChangeExt: function (evt) {
        //fires when the mode changes
        this.arrMeasurePoints = [];
        this.resultSegmentDiv.innerHTML = "&nbsp;";
        if (this.resultMouseSegmentDiv) this.resultMouseSegmentDiv.innerHTML = "&nbsp;";
        this.totalLengthLabel.innerHTML = (evt.toolName === 'distance') ? "Total Length: " : "";
      },
>>>>>>> origin/master

      _onMeasureEndExt: function () {
        this.arrMeasurePoints = [];
      },

      calcDistance: function (evt) {

<<<<<<< HEAD
          //we are only going to do this for distance
          if (!this.activeTool || this.activeTool.toString().toLowerCase() !== 'distance') {
            return false;
          }
=======
        //we are only going to do this for distance
        if (!this.activeTool || this.activeTool.toString().toLowerCase() !== 'distance') return false;
>>>>>>> origin/master

        this.arrMeasurePoints.push(evt.mapPoint);

<<<<<<< HEAD
          //if we have more than two create a line and measure them
          if (this.arrMeasurePoints.length < 2) {
            return false;
          }

          var length = this._createAndMeasureLine(this.arrMeasurePoints[this.arrMeasurePoints.length - 2], 
          this.arrMeasurePoints[this.arrMeasurePoints.length - 1]);
=======
        //if we have more than two create a line and measure them
        if (this.arrMeasurePoints.length < 2) return false;

        var length = this._createAndMeasureLine(this.arrMeasurePoints[this.arrMeasurePoints.length - 2], this.arrMeasurePoints[this.arrMeasurePoints.length - 1]);
>>>>>>> origin/master

        this._displaySegmentResult(length);

        return true;

      },

      calcMouseDistance: function (evt) {

<<<<<<< HEAD
          //we are only going to do this for distance
          if (!this.activeTool || this.activeTool.toString().toLowerCase() !== 'distance') {
            return false;
          }

          if (this.arrMeasurePoints.length < 1) {
            return false;
          }
=======
        //we are only going to do this for distance
        if (!this.activeTool || this.activeTool.toString().toLowerCase() !== 'distance') return false;

        if (this.arrMeasurePoints.length < 1) return false;
>>>>>>> origin/master

        var length = this._createAndMeasureLine(this.arrMeasurePoints[this.arrMeasurePoints.length - 1], evt.mapPoint);

        this._displayMouseSegmentResult(length);

        return true;

      },

      _displaySegmentResult: function (length) {
        //format the number.
        length = this._formatNumberForDisplay(length);
<<<<<<< HEAD
        this.resultSegmentDiv.innerHTML = 'Last Segment lengh: ' + length + ' ' + this.getUnit();
=======
        this.resultSegmentDiv.innerHTML = "Last Segment length: " + length + " " + this.getUnit();
>>>>>>> origin/master
      },

      _displayMouseSegmentResult: function (length) {
        //format the number.
        length = this._formatNumberForDisplay(length);
<<<<<<< HEAD
        this.resultMouseSegmentDiv.innerHTML = 'Segment lengh: ' + length + ' ' + this.getUnit();
=======
        this.resultMouseSegmentDiv.innerHTML = "Segment length: " + length + " " + this.getUnit();
>>>>>>> origin/master
      },

      _formatNumberForDisplay: function (num) {
        return Number.format(num, { pattern: this.numberPattern + '0' });
      },

      _createAndMeasureLine: function (point1, point2) {

        var line = new Polyline(this.map.spatialReference);
        //use the last two points 
        line.addPath([point1, point2]);

        //now use the geometry engine to measure it's lengh
        //is it WGS-84 or Web Mercator Auxiliary Sphere? If so use geodesic
        //geodesicLength(geometry, unit)
        var unit = this.getUnit();
        if (!unit) {
          unit = 'kilometers';
        }
        unit = unit.toLowerCase().replace(' ', '-');
        var length;
        if (this.map.spatialReference.isWebMercator()) {
          length = GeometryEngine.geodesicLength(line, unit);
        } else {
          length = GeometryEngine.planarLength(line, unit);
        }

        return length;
      }

    });
  });