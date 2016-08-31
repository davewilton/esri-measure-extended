var allTestFiles = [];
// var TEST_REGEXP = /test.*\.js$/;
var TEST_REGEXP = /.*Spec\.js$/;

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
        allTestFiles.push(file);
    }
});

var dojoConfig = {
    packages: [
        {
            name:"app",
            location:"/base"
        }, {
            name: 'esri',
            location: 'http://js.arcgis.com/3.17/esri'
        }, {
            name: 'dojo',
            location: 'http://js.arcgis.com/3.17/dojo/'
        }, {
            name: 'dojox',
            location: 'http://js.arcgis.com/3.17/dojox'
        }, {
            name: 'dijit',
            location: 'http://js.arcgis.com/3.17/dijit'
        }
    ],
    async: true
};


/**
 * This function must be defined and is called back by the dojo adapter
  * @returns {string} a list of dojo spec/test modules to register with your testing framework
 */
window.__karma__.dojoStart = function(){
    return allTestFiles;
}