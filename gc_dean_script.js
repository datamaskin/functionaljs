/**
 * David Brown 12/06/17
 */


var app = angular.module('gc_dean', ['ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.pagination', 'ui.grid.selection', 'ui.grid.expandable' ,'ui.grid.autoResize', 'ui.grid.autoFitColumns', 'ui.grid.edit', 'ui.bootstrap', 'LocalStorageModule', 'angularLoad']);

var origdata = null;

app.controller('GCDeanController', GCDeanController);

app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('gradeChange')
        .setStorageCookieDomain('') // localhost
        .setNotify(true, true)
});

app.directive('convertToYesNo', function () {

    return {
        require: 'ngModel',
        link: function($scope, element, attrs, ngModel) {

            // console.debug(`convertToYesNo element: ${element[0].value}`);
            // console.dir(attrs);
            var _data = $scope.col.grid.options.data;
            // console.debug("_data:...");
            // console.dir(_data);
            var _rows = $scope.grid.rows;
            // console.debug("_rows...");
            // console.dir(_rows);

            /*$scope.getRowIndex = function (row, grid) {
                var rowIndex = -1;
                console.debug("getRowIndex:");
                console.debug(`row.entity.UIN: ${row.entity.UIN}`);
                console.debug("grid:...");
                console.dir(grid);

                console.debug("grid body, renderedColumns[8].uid");
                console.dir(grid.renderContainers.body);
                console.dir(grid.renderContainers.body.renderedColumns[8]);

                for (var i = 0; i < grid.parentRow.entity.STUDENTS.length; i++) {
                    console.debug("grid.parentRow.entity.STUDENTS...");
                    console.dir(grid.parentRow.entity.STUDENTS);
                    if (grid.parentRow.entity.STUDENTS[i].UIN === row.entity.UIN) {
                        rowIndex = i;
                        break;
                    }
                }
                return rowIndex;
            };*/

            $scope.getRowIndex = function (row) {
                var rowIndex = [];
                console.debug("getRowIndex:");
                // console.debug(`row.entity.UIN: ${row.entity.UIN}`);
                // console.debug("grid:...");
                // console.dir(grid);

                // console.debug("grid body, renderedColumns[8].uid");
                // console.dir(grid.renderContainers.body);
                // console.dir(grid.renderContainers.body.renderedColumns[8]);

                for (var i = 0; i < origdata.length; i++) {
                    for (var j = 0; j < origdata[i]['STUDENTS'].length; j++)
                    // console.debug(`origdata[${i}].STUDENTS...`);
                    // console.dir(origdata[i]['STUDENTS'][j]);
                    // console.debug("row:");
                    // console.dir(row);
                    if (origdata[i]['STUDENTS'][j].UIN === row.entity.UIN) {
                        rowIndex.push(i);
                        rowIndex.push(j);
                        break;
                    }
                }
                return rowIndex;
            };

            ngModel.$parsers.push(function(val) { // assign the dropdown selection
                console.log("parsers push val: " + val);
                // console.debug("origdata:...");
                // console.dir(origdata);

                if (val === 'Y') {
                    // console.debug("col.grid.rows[]:");
                    // console.dir($scope.col.grid.rows);
                    // console.debug("$scope.row, $scope.grid");
                    // console.dir($scope.row);
                    var index = $scope.getRowIndex($scope.row);
                    // console.debug(`Y/N index: ${index[0]},${index[1]}`);
                    if (index[0] >= 0 && index[1] >= 0 && origdata[index[0]]['STUDENTS'][index[1]].APPROVAL_TYPE === 'DEAN') {
                        origdata[index[0]]['STUDENTS'][index[1]].DEAN_DECISION_DESCR = 'Approved';
                        origdata[index[0]]['STUDENTS'][index[1]].DEAN_DECISION_CODE = val;
                    } else if ( index[0] >= 0 && index[1] >= 0 && origdata[index[0]]['STUDENTS'][index[1]].APPROVAL_TYPE === 'DEPT_HEAD') {
                        origdata[index[0]]['STUDENTS'][index[1]].DH_DECISION_DESCR = 'Approved';
                        origdata[index[0]]['STUDENTS'][index[1]].DH_DECISION_CODE = val;
                    }

                    return 'Approved';
                } else if (val === 'N') {
                    // console.debug("col.grid.rows[]:...");
                    // console.dir($scope.col.grid.rows);
                    index = $scope.getRowIndex($scope.row);
                    // console.debug("$scope.row, $scope.grid");
                    // console.dir($scope.row);
                    // console.debug(`Y/N index: ${index[0]},${index[1]}`);

                    if (index[0] >= 0 && index[1] >= 0 && origdata[index[0]]['STUDENTS'][index[1]].APPROVAL_TYPE === 'DEAN') {
                        origdata[index[0]]['STUDENTS'][index[1]].DEAN_DECISION_DESCR = 'Rejected';
                        origdata[index[0]]['STUDENTS'][index[1]].DEAN_DECISION_CODE = val;
                    } else if (index[0] >= 0 && index[1] >= 0 && origdata[index[0]]['STUDENTS'][index[1]].APPROVAL_TYPE === 'DEPT_HEAD') {
                        origdata[index[0]]['STUDENTS'][index[1]].DH_DECISION_DESCR = 'Rejected';
                        origdata[index[0]]['STUDENTS'][index[1]].DH_DECISION_CODE = val;
                    }
                    return 'Rejected';
                }
            });

            ngModel.$formatters.push(function() { // assign the ng-model model.id
                return element[0].value;
            });

        }
    };
});


app.directive('convertPDC', function () {

    return {
        link: function ($scope, element, attrs) {

            // console.log("convertPDC element...");
            // console.dir(element);
            // console.log("Attributes:...")
            // console.dir(attrs);
            var _data = $scope.col.grid.options.data;
            // console.log("_data:");
            // console.dir(_data);
            var _rows = $scope.grid.rows;
            // console.log("_rows...");
            // console.dir(_rows);
            for (var i in _data) {
                if (_data[i]['STATUS'] === 'P') {
                    _data[i]['STATUS'] = 'Pending';
                } else if (_data[i]['STATUS'] === 'D') {
                    _data[i]['STATUS'] = 'Dean approval';
                } else if (_data[i]['STATUS'] === 'C') {
                    _data[i]['STATUS'] = 'Complete';
                }
            }
        }
    };
});

app.directive('fetchGeneric', function () { // not used here just in case...
   return {
       link: function ($scope, element, attrs) {
           // console.log("fetchGeneric: element, attrs...");
           // console.dir(element);
           // console.dir(attrs);
           var _data = $scope.col.grid.options.data;
           // console.log("_data...");
           // console.dir(_data);
           // console.dir($scope.col.grid);
           // console.dir($scope.col.grid.api);
           // console.dir($scope.col.grid.options);
       }
   };
});


GCDeanController.$inject = ['$scope', '$http', '$log', '$window', '$rootScope'];
function GCDeanController($scope, $http, $log, $window, $rootScope) {
    var vm = this;

    function rowTemplate() {
        return '<div ng-dblclick="grid.appScope.rowDblClick(row)" >' +
            '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
            '</div>';
    }

    $scope.rowHeight = 35;  // row height defined within the grid options, probably should use a variable so
                            // only a single location ever needs updating
    $scope.headerRowHeight = 35;  // header height defined within the grid options
    $scope.footerRowHeight = 35;  // footer row height
    // vm.editRow = RowEditor.editRow;
    $scope.stu_id = 1714888;
    $rootScope.studentFound = false;

    $scope.gridOptions = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        rowHeight: $scope.rowHeight,
        rowTemplate: rowTemplate(),
        columnDefs: [
            {
                field: 'SPRIDEN_LAST_NAME',
                displayName: 'Last name',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true,
            },
            {
                field: 'SPRIDEN_FIRST_NAME',
                displayName: 'First name',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true
            },
            {
                field: 'SPRIDEN_PIDM',
                displayName: 'Pidm',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true
            },
            {
                field: 'SPRIDEN_ID',
                displayName: 'Pidm',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true
            },
            {
                field: 'TERMCODE',
                displayName: 'Term code',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true
            },
            {
                field: 'SUBJECTCODE',
                displayName: 'Subject code',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true
            },
            {
                field: 'COURSENUMBER',
                displayName: 'Course number',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true
            },
            {
                field: 'CRN',
                displayName: 'CRN',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true
            },
            {
                field: 'COURSETITLE',
                displayName: 'Course title',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true
            },
            {
                field: 'MIDTERMGRADE',
                displayName: 'Midterm grade',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true
            },
            {
                field: 'FINALGRADE',
                displayName: 'Final grade',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true
            },
            {
                field: 'CREDITHOURS',
                displayName: 'Credit hours',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true
            },
            {
                field: 'SLEVEL',
                displayName: 'S level',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true
            },
            {
                field: 'POT',
                displayName: 'POT',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true
            },
            {
                field: 'SHRTCKG_FINAL_GRDE_CHG_DATE',
                displayName: 'Grade change date',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true
            },
            {
                field: 'SHRTCKG_GMOD_CODE',
                displayName: 'GMOD Code',
                enableSorting: true,
                enableCellEdit: true,
                visible: true,
                allowCellFocus: true
            }
        ]
    };


    $scope.getTableHeight = function() {
        //console.log("getTableHeight called" )
        var recordCount = 0;
        // console.log("getTableHeight");
        if ($scope.gridOptions.data.length === undefined || $scope.gridOptions.data.length === '') {
            //console.log("getTableHeight no data..." )
            // bail if the length is undefined (i.e., no data available yet)
            return;
        }

        // setup the initial values
        $scope.gridHeight = $scope.rowHeight + $scope.headerRowHeight + 17;  // the 17 is an attempt to compensate for browsers
        // running on Windows where they display a horizontal scrollbar
        // towards the bottom of the grid
        $scope.viewSize  = $window.innerHeight;  // grab the number of pixels available in the window
        // may need to use document body clientHeight to better handle
        // zooming on mobile devices


        //console.debug('inner height: '+$scope.viewSize);
        //console.debug('client height: '+$document[0].body.clientHeight);
        $scope.maxGridHeight = $scope.viewSize - 300;  // the space available for our grid in pixels is the available space
        //   less 300, an approximation of how much space is used by the page
        //   header, footer and other non-grid elements


        //  determine how much space the grid would need to display all of the available records
        $scope.gridHeightRequested = $scope.gridOptions.data.length * $scope.rowHeight + $scope.headerRowHeight + 17;

        //console.debug("max grid height: "+$scope.maxGridHeight);
        //console.debug("grid height requested: "+$scope.gridHeightRequested);


        // set the grid height to always be smaller than the window size
        if ($scope.gridHeightRequested > $scope.maxGridHeight) {
            // use all of the available space
            $scope.gridHeight = $scope.maxGridHeight;
        } else {
            //  we have fewer rows in the grid than can fill up the window
            //  just go with enough space to display those rows
            $scope.gridHeight = $scope.gridHeightRequested;
        }

        // get an integer that represents the number of rows to display that can fit in the
        //   determined grid height size
        $scope.numOfGridRows = Math.floor(($scope.gridHeight-$scope.headerRowHeight-17)/$scope.rowHeight);


        if ($scope.numOfGridRows < 0) {
            // if the value is negative, then there is not enough pixels within the calculated
            //  grid height to display any data rows.  set the grid height to zero and hide the grid
            //console.debug('# of grid rows <= to zero: '+$scope.numOfGridRows)
            $scope.gridHeight = 200;  // setting to zero will hide the grid
            $scope.numOfGridRows = 1;  //  setting to 1 instead of zero makes the pagination controls happier even
            //  if we won't be displaying anything
        } else if ($scope.numOfGridRows == 0) {
            // if the number of grid rows is zero, prepare to possibly hide the grid
            //$scope.gridHeight = 0;
        }

        $scope.gridOptions.paginationPageSizes = [$scope.numOfGridRows];  // set to just the one value
        // it no longer makes sense to have a dropdown with options
        //  since the grid height is dynamic
        $scope.gridOptions.paginationPageSize = $scope.numOfGridRows;

        //console.debug("set pageSizes to: "+$scope.numOfGridRows);

        //if ($scope.gridHeight < 90 || $scope.pageSizes == 0) {
        //  if we have 3 or more rows to display yet the number of grid rows to show at a time
        //   is 2 or less, the user has a really small screen.  hide the grid, this won't work
        if ($scope.numOfGridRows <= 2 && $scope.gridOptions.data.length > 2) {
            $scope.showGrid = false;
        } else {
            $scope.showGrid = true;
        }

        // return the calculated grid height
        // console.log("grid height: " + vm.gridHeight);
        //console.log("getTableHeight ending: "+ $scope.gridHeight)
        return $scope.gridHeight+"px";

    };


    $scope.getTableWidth = function() {
        var screenWidth = $window.innerWidth;   // may need to switch to document body clientWidth to better
                                                // handle zooming on mobile devices

        // console.log('inner width: '+screenWidth);

        if ($scope.gridOptions.data.length === undefined || $scope.gridOptions.data.length === '') {
            // bail if the length is undefined (i.e., no data available yet)
            return;
        }

        if (screenWidth >=2600) {
            // either a large screen tablet or desktop
            //  don't fill the browser width with the table, limit its width
            return 2000+"px"
        } else {
            //  essentially 100% but leaving a little bit more of a border hence the 20
            return $window.innerWidth - 20 + "px";
        }

    };

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $log.debug("onRegisterApi:");
        // console.dir(gridApi);

        $scope.gridApi = gridApi;
        $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            var msg = 'row selected ' + row.isSelected;
            $log.log(msg);
        });

        $scope.gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
            var msg = 'rows changed ' + rows.length;
            $log.log(msg);
        });

    };

    /*$http.get('/HowdyCustomApp/ssb/gradechange/gradechangeroster')
        .success(function(response) {
            console.debug("performing get data");
            $scope.gridOptions.data= response;

            console.debug("Data received from DB: "+response);
            console.debug("done retrieving data");
        }).error(function (response) {
        console.error("An error on fetching gradechange data...");
    });*/

    $scope.$on('enterKeyDetectedBroadcast', function(event, args) {
        // listens for an enterKeyDetectedBroadcast event generated by the user hitting the Enter key
        $log.debug("GCDeanController: enter key detected ");
        $log.debug("Row received: " + args);

        vm.editRow($scope.gridOptions, args);
    });

    $scope.rowDblClick = function (row) {

        $log.debug("rowDblClick.row: ");
        console.dir(row);

        // vm.editRow($scope.gridOptions, row);
    };

    function _studentFound(stu_id, inst_id) {
        console.log("studentFound: " + stu_id);
        $http({ url: '/HowdyCustomApp/ssb/gradeChange/getStudentRecord',
            method: 'get',
            params: {studPIDM: stu_id, instPIDM: inst_id}})
            .success(function(response) {
                console.log("studentFound get data: " + stu_id);
                console.log("response: " + JSON.stringify(response));
                $scope.gridOptions.data = response;
                console.log("done retrieving data");
                $rootScope.studentFound = true;
            }).error(function (response) {
            console.error("An error on fetching student search data...");
            $rootScope.studentFound = false;
        });
    }

    $scope.text = '';

    $scope.submit = function() {
        if ($scope.stu_id) {
            // console.log("submit:");
            // console.log("stu_id: " + $scope.stu_id);
            _studentFound($scope.stu_id);
        }
    };

}

app.controller('DeanController', DeanController, ['$scope', '$filter', '$timeout']);
DeanController.$inject = ['$scope', '$http', '$log', '$window', '$rootScope', 'localStorageService', '$timeout', '$filter', '$templateCache', 'angularLoad'];
function DeanController($scope, $http, $log, $window, $rootScope, localStorageService, $timeout, $filter, $templateCache, angularLoad) {
    var vm = this;

    /*$templateCache.put('ui-grid/expandableRow',
        "<div ng-if=\"!row.groupHeader==true\"><div class=\"ng-scope ui-grid-icon-blank\"><i ng-class=\"{ 'ui-grid-icon-blank' : !row.isExpanded, 'ui-grid-icon-blank' : row.isExpanded }\" ng-click=\"grid.api.expandable.toggleAllRows()\">"
    );*/

    // console.log("vm:...");
    // console.dir(vm);

    var scount = 0;

    if(localStorageService.isSupported) {
        // console.debug("Localstorage is supported");
        var storageType = localStorageService.getStorageType(); //e.g localStorage
        // console.debug("storageType: " + storageType); // localStorage
    }

    // angularLoad.loadScript('https://github.com/infinitered/ramdasauce/blob/master/dist/ramdasauce.js').then(function() {
    /*angularLoad.loadScript('./ramdasauce.js').then(function() {
        console.debug("angularLoad ramdasauce.js loaded successfully...");
    }).catch(function() {
        console.debug("angularLoad had a problem loading ramdasauce.js...");
    });*/

    $rootScope.model = { id: 'NA'};

    var commentCellTemplate = '<div class="block"><input type="text" ng-class="input" ng-model="MODEL_COL_FIELD"></div>';
    // var deanCommentCellTemplate = '<div class="block"><input type="text" ng-class="input" ng-model="MODEL_COL_FIELD"></div>';
    var statusCellTemplate = '<div class="block" convert-p-d-c><input ng-class="input" type="text" ng-model="MODEL_COL_FIELD" ng-readonly="true" style="border: 0"></div>';

    $scope.rowHeight = 35;  // row height defined within the grid options, probably should use a variable so
                            // only a single location ever needs updating
    $scope.headerRowHeight = 35;  // header height defined within the grid options
    $scope.footerRowHeight = 35;  // footer row height
    // vm.editRow = RowEditor.editRow;

    $scope.gridOptions = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        rowHeight: $scope.rowHeight,
        expandableRowTemplate: '../gradeChange/html/expandableRowTemplate.html',
        expandableRowHeight: 150,
        //subGridVariable will be available in subGrid scope
        expandableRowScope: {
            // subGridVariable: 'subGridScopeVariable'
            _update: function(srcObj, destObj) {
                for (var i = 0; i<srcObj.length; i++) {
                    for (var _key in destObj) {
                        if(destObj.hasOwnProperty(_key) && srcObj[i].hasOwnProperty(_key)) {
                            destObj[_key] = srcObj[i][_key];
                        }
                    }
                    $scope.students.push(destObj);
                }
            }
        },
        columnDefs: [
            {
                field: 'TERM',
                displayName: 'Term',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true,
                width: "*"
            },
            {
                field: 'TERM_DESCR',
                displayName: 'Term Desc',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true,
                width: "*"
            },
            {
                field: 'CRN',
                displayName: 'CRN',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true,
                width: "*"
            },
            {
                field: 'COURSE_DESCR',
                displayName: 'CRSE',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true,
                width: "*"
            },
            {
                field: 'COURSE_TITLE',
                displayName: 'Crse Title',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true,
                width: "*"
            },
            {
                field: 'NUM_ATHLETES',
                displayName: '# Athl',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true,
                width: "*"
            },
            {
                field: 'NUM_DEG_CANDIDATES',
                displayName: '# Deg Cand',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true,
                width: "*"
            },
            {
                field: 'NUM_STUDENTS',
                displayName: '# Stdt',
                enableSorting: true,
                enableCellEdit: false,
                allowCellFocus: true,
                width: "*"
            }
        ]
    };

    $scope.getTableHeight = function() {
        // console.log("getTableHeight called" );
        var recordCount = 0;
        // console.log("getTableHeight");
        if ($scope.gridOptions.data === undefined || $scope.gridOptions.data.length === undefined || $scope.gridOptions.data.length === '') {
            console.log("getTableHeight no data..." )
            // bail if the length is undefined (i.e., no data available yet)
            return;
        }

        // setup the initial values
        $scope.gridHeight = $scope.rowHeight + $scope.headerRowHeight + 17;  // the 17 is an attempt to compensate for browsers
        // running on Windows where they display a horizontal scrollbar
        // towards the bottom of the grid
        $scope.viewSize  = $window.innerHeight;  // grab the number of pixels available in the window
        // may need to use document body clientHeight to better handle
        // zooming on mobile devices


        //console.debug('inner height: '+$scope.viewSize);
        //console.debug('client height: '+$document[0].body.clientHeight);
        $scope.maxGridHeight = $scope.viewSize - 300;  // the space available for our grid in pixels is the available space
        //   less 300, an approximation of how much space is used by the page
        //   header, footer and other non-grid elements

        // console.debug("Visible rows: " + $scope.gridApi.core.getVisibleRows($scope.gridApi.grid).length);
        // console.debug("$scope.studentrowsexpanded: " + $scope.studentexpandedrows);
        // console.debug("$scope.gridApi.grid:...");
        // console.dir($scope.gridApi.grid);
        /*if ($scope.gridApi.grid.rows !== undefined)
            for (var r in $scope.gridApi.grid.rows) {
                if ($scope.gridApi.grid.rows[r].isExpanded !== undefined) {
                    console.debug("Row: " + r + " is expanded: " + $scope.gridApi.grid.rows[r].isExpanded);
                    if (!$scope.gridApi.grid.rows[r].isExpanded) {
                        $scope.studentexpandedrows -= Number($scope.gridApi.grid.rows[r].entity.NUM_STUDENTS);
                    }
                }
            }*/

        //  determine how much space the grid would need to display all of the available records
        if ($scope.gridApi.core.getVisibleRows($scope.gridApi.grid).length > 0) {
            $scope.gridHeightRequested = ($scope.studentexpandedrows +
                $scope.gridApi.core.getVisibleRows($scope.gridApi.grid).length+1) *
                $scope.rowHeight + 2*$scope.headerRowHeight + 17;
        }

        // console.debug("max grid height: "+$scope.maxGridHeight);
        // console.debug("grid height requested: "+$scope.gridHeightRequested);


        // set the grid height to always be smaller than the window size
        if ($scope.gridHeightRequested > $scope.maxGridHeight) {
            // use all of the available space
            $scope.gridHeight = $scope.maxGridHeight;
        } else {
            //  we have fewer rows in the grid than can fill up the window
            //  just go with enough space to display those rows
            $scope.gridHeight = $scope.gridHeightRequested;
        }

        // get an integer that represents the number of rows to display that can fit in the
        //   determined grid height size
        $scope.numOfGridRows = Math.floor(($scope.gridHeight-$scope.headerRowHeight-17)/$scope.rowHeight);


        if ($scope.numOfGridRows < 0) {
            // if the value is negative, then there is not enough pixels within the calculated
            //  grid height to display any data rows.  set the grid height to zero and hide the grid
            //console.debug('# of grid rows <= to zero: '+$scope.numOfGridRows)
            $scope.gridHeight = 200;  // setting to zero will hide the grid
            $scope.numOfGridRows = 1;  //  setting to 1 instead of zero makes the pagination controls happier even
            //  if we won't be displaying anything
        } else if ($scope.numOfGridRows == 0) {
            // if the number of grid rows is zero, prepare to possibly hide the grid
            //$scope.gridHeight = 0;
        }

        $scope.gridOptions.paginationPageSizes = [$scope.numOfGridRows];  // set to just the one value
        // it no longer makes sense to have a dropdown with options
        //  since the grid height is dynamic
        $scope.gridOptions.paginationPageSize = $scope.numOfGridRows;

        //console.debug("set pageSizes to: "+$scope.numOfGridRows);

        //if ($scope.gridHeight < 90 || $scope.pageSizes == 0) {
        //  if we have 3 or more rows to display yet the number of grid rows to show at a time
        //   is 2 or less, the user has a really small screen.  hide the grid, this won't work
        if ($scope.numOfGridRows <= 2 && $scope.gridOptions.data.length > 2) {
            $scope.showGrid = false;
        } else {
            $scope.showGrid = true;
        }

        // return the calculated grid height
        // console.log("grid height: " + vm.gridHeight);
        // console.log("getTableHeight ending: "+ $scope.gridHeight);
        return $scope.gridHeight+"px";

    };

    $scope.getTableWidth = function() {
        var screenWidth = $window.innerWidth;   // may need to switch to document body clientWidth to better
                                                // handle zooming on mobile devices

        // console.log('inner width: '+screenWidth);

        if ($scope.gridOptions.data === undefined || $scope.gridOptions.data.length === undefined || $scope.gridOptions.data.length === '') {
            // bail if the length is undefined (i.e., no data available yet)
            return;
        }

        if (screenWidth >=2600) {
            // either a large screen tablet or desktop
            //  don't fill the browser width with the table, limit its width
            return 2000+"px"
        } else {
            //  essentially 100% but leaving a little bit more of a border hence the 20
            return $window.innerWidth - 20 + "px";
        }

    };

    $scope.unbind = null;

    $http.get('/HowdyCustomApp/ssb/gradeChange/getGCHGRequests')
        .success(function(data) {
            // console.log("getGCHGRequests: performing get data");
            // console.log("clearAll variable...");
            $scope.clearAll = localStorageService.clearAll;
            // console.dir($scope.clearAll);
            for(var i = 0; i < data.length; i++) {
                // console.log("i: "+i+" "+JSON.stringify(data[i]));
                // console.log("i: "+i+" "+JSON.stringify(data[i]["STUDENTS"]));
                data[i].subGridOptions = {
                    appScopeProvider: $scope.subGridScope,
                    expandableRowHeight: 50,
                    enableExpandable: true,
                    expandableRowTemplate: '../gradeChange/html/expandableRowTemplate.html',
                    columnDefs: [
                        {name: "APPROVAL_TYPE", field: "APPROVAL_TYPE", displayName: "", visible: false},                               // 0
                        {name: "COLLEGE", field: "COLLEGE", displayName: "College", visible: false},                                    // 1
                        {name: "DEPARTMENT", field: "DEPARTMENT", displayName: "Dept.", visible: false},                                // 2
                        {name: "TERM", field: "TERM", displayName: "Term", visible: false},                                             // 3
                        {name: "CRN", field: "CRN", displayName: "CRN", visible: false},                                                // 4
                        {name: "STU_PIDM", field: "STU_PIDM", displayName: "PIDM", visible: false},                                     // 5
                        {name: "SWRCHGD_SEQ", field: "SWRCHGD_SEQ", displayName: "SEQ", visible: false},                                // 6
                        {name: "STUDENT_NAME", field:"STUDENT_NAME", displayName: "Student Name", pinnedLeft:true},                                      // 7
                        {name: "UIN", field:"UIN", displayName: "UIN"},                                                                 // 8
                        {name: "STU_COLL", field: "STU_COLL", displayName: "Stu. Coll.", visible: false},                               // 9
                        {name: "STU_LEVEL", field:"STU_LEVEL", displayName:"LEVEL"},                                                    // 10
                        {name: "ATHLETE", field:"ATHLETE", displayName:"Athlete"},                                                      // 11
                        {name: "DEGREE_CANDIDATE", field:"DEGREE_CANDIDATE", displayName:"Degree Candidate", width: "*"},               // 12
                        {name: "REQUEST_DATE", field: "REQUEST_DATE", displayName: "Request Date", visible: false},                     // 13
                        {name: "ENTERED_BY", field: "ENTERED_BY", displayName: "Entered by", visible: false},                           // 14
                        {name: "INSTRUCTOR", field: "INSTRUCTOR", displayName: "Instructor", visible: false},                           // 15
                        {name: "OLD_GRADE", field:"OLD_GRADE", displayName: "Old Grade"},                                               // 16
                        {name: "NEW_GRADE", field:"NEW_GRADE", displayName: "New Grade"},                                               // 17
                        {name: "CHANGE_REASON_CODE", field: "CHANGE_REASON_CODE", displayName: "Reason code", visible: false},          // 18
                        {name: "CHANGE_REASON_DESCR", field:"CHANGE_REASON_DESCR", displayName:"Reason for change"},                    // 19
                        {name: "DH_UPDATE_BY", field: "DH_UPDATE_BY", displayName: "Update by", visible: false},                        // 20
                        { // 21
                            name: "DH_DECISION_CODE",
                            field: "DH_DECISION_CODE",
                            displayName: "Decision code",
                            visible: false,
                            enableCellEdit: false,
                            allowCellFocus: true,
                            resizable: true
                        },
                        { // 22
                            name: "DH_DECISION_DESCR",
                            field: "DH_DECISION_DESCR",
                            displayName: "DH Decision",
                            visible: false,
                            enableCellEdit: false,
                            cellTemplate: '../gradeChange/html/select_decision.html',
                            allowCellFocus: true,
                            resizable: true
                        },
                        { // 23
                            name: "DH_COMMENT",
                            field: "DH_COMMENT",
                            displayName: "DH Comments",
                            visible: false,
                            cellTemplate: commentCellTemplate,
                            enableCellEdit: true,
                            allowCellFocus: true,
                            resizable: true
                        },
                        {name: "DH_UPDATE_DATE", field: "DH_UPDATE_DATE", displayName: "Updated", visible: false},                      // 24
                        {name: "REQUIRES_DEAN_APP", field: "REQUIRES_DEAN_APP", displayName: "Dean approval", visible: false},          // 25
                        { // 26
                            name:"DEAN_DECISION_CODE",
                            field:"DEAN_DECISION_CODE",
                            displayName:"Decision code",
                            enableCellEdit: false,
                            visible: false,
                            allowCellFocus: true,
                            resizable: true
                        },
                        { // 27
                            name:"DEAN_DECISION_DESCR",
                            field:"DEAN_DECISION_DESCR",
                            displayName:"Dean Decision",
                            enableCellEdit: true,
                            visible: false,
                            cellTemplate: '../gradeChange/html/select_decision.html',
                            allowCellFocus: true,
                            resizable: true
                        },
                        { // 28
                            name:"DEAN_COMMENT",
                            field: "DEAN_COMMENT",
                            displayName: "Dean Comments",
                            enableCellEdit: true,
                            visible: false,
                            cellTemplate: commentCellTemplate,
                            // cellTemplate: '../gradeChange/html/deanCommentCellTemplate.html',
                            // editableCellTemplate: '../gradeChange/html/deanCommentCellTemplate.html',
                            allowCellFocus: true,
                            resizable: true
                        },
                        { // 29
                            name: "STATUS",
                            field: "STATUS",
                            displayName: "Status",
                            visible: true,
                            resizable: true,
                            cellTemplate: statusCellTemplate,
                            enableCellEdit: false
                        },
                        {name: "DEAN_UPDATE_BY", field: "DEAN_UPDATE_BY", displayName: "Updated", visible: false, resizable: true},         // 30
                        {name: "COMPLETION_DATE", field: "COMPLETION_DATE", displayName: "Completion date", visible: false, resizable: true}// 31
                    ],
                    data: data[i]["STUDENTS"]
                };

            } // END FOR LOOP
            $scope.gridOptions.data = data;
            origdata = angular.copy($scope.gridOptions.data);
            console.debug("$scope.gridOptions.data on fetch .........................................");
            console.dir($scope.gridOptions.data);
            // console.debug(JSON.stringify($scope.gridOptions.data));
            console.debug("clearAll variable...");
            $scope.clearAll = localStorageService.clearAll;
            // console.dir($scope.clearAll);
            // console.debug("done retrieving data");
            /****************Test data to display the Dean and DEPH comments***************/
            // $scope.gridOptions.data[11]['STUDENTS'][0]['DEAN_COMMENT'] = 'Raghad approved';
            // $scope.gridOptions.data[11]['STUDENTS'][0]['DH_COMMENT'] = 'DH approved';
            // $scope.gridOptions.data[11]['STUDENTS'][2]['STUDENT_NAME'] = 'Yang, Tingli';
            // $scope.gridOptions.data[11]['STUDENTS'][2]['UIN'] = '822004665';
            $scope.switchVisibility();
            // console.debug('http get gridOptions.data and origdata...');

            // console.dir($scope.gridOptions.data);
            origdata = $scope.gridOptions.data;
            console.debug("http get origdata:...");
            console.dir(origdata);
            localStorageService.set('alldata', $scope.gridOptions.data);
            $scope.unbind = localStorageService.bind($scope, 'alldata');
            console.debug("alldata ($scope.gridOptions.data) LS set...");

        }).error(function (response) {
        console.error("An error on fetching Dean grade change data...");
    });

    $scope.edit = function (row) {
        console.log(row);
    };

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        console.log("onRegisterApi:...");
        // console.debug("gridApi:...");
        // console.dir(gridApi);


        $scope.gridApi = gridApi;
        console.debug("$scope.gridApi:...");
        console.dir($scope.gridApi);

        // gridApi.grid.appScope.yesno();
        // console.debug("gridOptions");
        // console.dir($scope.gridOptions);
        // console.debug("gridApi.options:...");
        // console.dir($scope.gridApi.options);
        gridApi.grid.appScope.getAllMethods();

        gridApi.grid.registerDataChangeCallback(function() {
            gridApi.expandable.expandAllRows();
            gridApi.expandable.collapseAllRows()
        });


        gridApi.expandable.on.rowExpandedStateChanged($scope, function(row){
            // console.debug("onRegisterApi.rowExpandedStateChanged row expanded height: " + row.expandedRowHeight);
            // console.debug("row:...");
            // console.dir(row);
            // console.debug("Expanded subGridOptions row height: " + row.entity.subGridOptions.expandableRowHeight);
            // console.debug("Students # of rows: " + row.entity['STUDENTS'].length);
            // $scope.studentexpandedrows = row.entity['STUDENTS'].length;

            // console.debug("Row is expanded: " + row.isExpanded);


            $scope.studentexpandedrows = Number(0);

            for (let r in row.grid.rows) {
                if (row.grid.rows[r].isExpanded !== undefined) {
                    // console.debug("Row: " + r + " is expanded: " + row.grid.rows[r].isExpanded);
                    // console.debug("Row: " + r + " is visible: " + row.grid.rows[r].visible);
                    // console.debug("# Student rows: " + row.grid.rows[r].entity.NUM_STUDENTS);
                    if (row.grid.rows[r].isExpanded) {
                        $scope.studentexpandedrows += Number(row.grid.rows[r].entity.NUM_STUDENTS);
                    }
                }
            }

            if (row.entity['STUDENTS'].length >= 1) {
                row.entity.subGridOptions.expandableRowHeight = row.entity['STUDENTS'].length*50;
                row.expandedRowHeight = row.entity.subGridOptions.expandableRowHeight;
            }
            // console.log("New expanded row height: " + row.expandedRowHeight);
        });

    };

    $scope.$on('enterKeyDetectedBroadcast', function(event, args) {
        // listens for an enterKeyDetectedBroadcast event generated by the user hitting the Enter key
        $log.log("GCDeanController: enter key detected ");
        $log.log("Row received: " + args);

        vm.editRow($scope.gridOptions, args);
    });

    $scope.rowDblClick = function (row) {

        console.log("rowDblClick.row: ");
        console.dir(row);

        vm.editRow($scope.subGridOptions, row);
    };

    $scope.update = function(srcObj, destObj) {
        for (var i = 0; i<srcObj.length; i++) {
            for (var _key in destObj) {
                if(destObj.hasOwnProperty(_key) && srcObj[i].hasOwnProperty(_key)) {
                    destObj[_key] = srcObj[i][_key];
                }
            }
            $scope.students.push(destObj);
        }
    };

    $scope.save = function () {

        // console.debug("Saved...");
        $scope.students = [];
        // console.debug("data.length: " + $scope.gridOptions.data.length);
        // console.debug("origdata...");
        // console.dir(origdata);
        // console.log("clearAll variable...");
        $scope.clearAll = localStorageService.clearAll;
        // console.dir($scope.clearAll);
        // console.debug("localStorage set/get.");
        var decisions = 0;
        var _message = "";
        var status = null;
        var rejections = 0;
        for (var i = 0; i<$scope.gridOptions.data.length; i++) {
            for (var j = 0; j < $scope.gridOptions.data[i]['STUDENTS'].length; j++) {
                // console.debug(`students key: ${j}`);
                // console.dir($scope.gridOptions.data[i]['STUDENTS'][j]);
                var _students_ = Object.assign($scope.gridOptions.data[i]['STUDENTS'][j]);

                if (_students_.APPROVAL_TYPE === 'DEPT_HEAD' && _students_.DH_DECISION_CODE !== '') {
                    localStorageService.set(decisions, $scope.gridOptions.data[i]['STUDENTS'][j]);
                    // console.debug(`localStorage get(${decisions})`);
                    // console.dir(localStorageService.get(decisions));
                    decisions++;

                    // console.debug("_students_");
                    // console.dir(_students_);
                    $scope.students.push(_students_);
                    // console.debug("$scope.students:...");
                    // console.dir($scope.students);
                    // console.debug("students STATUS:...");
                    // console.dir($scope.students[0]['STATUS']);

                    if (_students_.DH_DECISION_CODE === 'N' && _students_.DH_COMMENT === '') {
                        rejections++;
                        _students_.STATUS = 'Comment required on reject';
                        _message = rejections + ' approval rejections of: ' + decisions + ' decisions require a comment';
                        status = 'ERROR';
                    }

                    if ($scope.gridOptions.data[i]['STUDENTS'][j]['STATUS'].indexOf("reject") === -1) {
                        delete _students_.$$hashKey;
                        delete _students_.DEAN_DECISION_DESCR;
                        delete _students_.DEAN_DECISION_CODE;
                        delete _students_.DEAN_COMMENT;
                        delete _students_.DEAN_UPDATE_BY;
                        delete _students_.DEAN_UPDATE_DATE;
                        delete _students_.DH_DECISION_DESCR;
                        delete _students_.DH_UPDATE_BY;
                        delete _students_.DH_UPDATE_DATE;
                        delete _students_.REQUIRES_DEAN_APP;
                        delete _students_.COLLEGE;
                        delete _students_.DEPARTMENT;
                        delete _students_.STUDENT_NAME;
                        delete _students_.UIN;
                        delete _students_.STU_COLL;
                        delete _students_.STU_LEVEL;
                        delete _students_.ATHLETE;
                        delete _students_.DEGREE_CANDIDATE;
                        delete _students_.REQUEST_DATE;
                        delete _students_.ENTERED_BY;
                        delete _students_.INSTRUCTOR;
                        delete _students_.OLD_GRADE;
                        delete _students_.NEW_GRADE;
                        delete _students_.CHANGE_REASON_CODE;
                        delete _students_.CHANGE_REASON_DESCR;
                        delete _students_.STATUS;
                        delete _students_.COMPLETION_DATE;
                    }
                } else if (_students_.APPROVAL_TYPE === 'DEAN' && _students_.DEAN_DECISION_CODE !== '') {
                    localStorageService.set(decisions, $scope.gridOptions.data[i]['STUDENTS'][j]);
                    // console.debug(`localStorage get(${$scope.decisions})`);
                    // console.dir(localStorageService.get($scope.decisions));
                    decisions++;

                    // console.debug("_students_...");
                    // console.dir(_students_);
                    $scope.students.push(_students_);

                    if (_students_.DEAN_DECISION_CODE === 'N' && _students_.DEAN_COMMENT === '') {
                        rejections++;
                        _students_.STATUS = 'Comment required on reject';
                        _message = rejections + ' approval rejections of: ' + decisions + ' decisions require a comment';
                        status = 'ERROR';
                    }

                    if ($scope.gridOptions.data[i]['STUDENTS']['STATUS'].indexOf("reject") === -1) {
                        delete _students_.$$hashKey;
                        delete _students_.DH_DECISION_DESCR;
                        delete _students_.DH_DECISION_CODE;
                        // delete _students_.DH_COMMENT;
                        delete _students_.DH_UPDATE_BY;
                        delete _students_.DEAN_UPDATE_BY;
                        delete _students_.DEAN_UPDATE_DATE;
                        delete _students_.DEAN_DECISION_DESCR;
                        delete _students_.DH_UPDATE_BY;
                        delete _students_.DH_UPDATE_DATE;
                        delete _students_.REQUIRES_DEAN_APP;
                        delete _students_.COLLEGE;
                        delete _students_.DEPARTMENT;
                        delete _students_.STUDENT_NAME;
                        delete _students_.UIN;
                        delete _students_.STU_COLL;
                        delete _students_.STU_LEVEL;
                        delete _students_.ATHLETE;
                        delete _students_.DEGREE_CANDIDATE;
                        delete _students_.REQUEST_DATE;
                        delete _students_.ENTERED_BY;
                        delete _students_.INSTRUCTOR;
                        delete _students_.OLD_GRADE;
                        delete _students_.NEW_GRADE;
                        delete _students_.CHANGE_REASON_CODE;
                        delete _students_.CHANGE_REASON_DESCR;
                        delete _students_.STATUS;
                        delete _students_.COMPLETION_DATE;
                    }
                }
            }
        }

        // console.log("Fetch all the keys...");
        var gcKeys = localStorageService.keys();
        // console.dir(gcKeys);

        // var _gc = localStorageService.get(gcKeys[0]);
        /*for (var x = 0; x < gcKeys.length; x++) {
            var _gc = localStorageService.get(gcKeys[x]);
            $scope.students_.push(_gc);
            // console.dir(_gc);
        }*/
        /*console.log("Students array restore...");
        for (var y in $scope.students_) {
            console.dir($scope.students_[y]);
            console.debug("Student name["+y+"]: " + $scope.students_[y]['STUDENT_NAME']);
            console.debug("Student PIDM "+y+"]: " + $scope.students_[y]['STU_PIDM']);
        }*/
        /*console.log("Get all keys:...");
        for (var gck in gcKeys) {
            if (gcKeys.hasOwnProperty(gck)) {
                var _gc = localStorageService.get(gck);
                console.dir(_gc);
            }
        }*/

        // console.log("students:...");
        // $scope.students[0]['SWRCHGD_SEQ'] = '99';

        var json = JSON.stringify($scope.students);
        // console.debug("$scope.students json:...");
        // console.debug(json);
        // console.log("$scope.students:...");
        // console.dir($scope.students);
        // console.debug(`_message: ${_message}`);
        // console.debug(`_message.indexOf(reject): ${_message.indexOf("reject")}`);
        if (_message.indexOf("reject") === -1) {
            $http.post('/HowdyCustomApp/ssb/gradeChange/putUpdGrchApprovals', json).success(
                function (response) {
                    // console.log("response:...");
                    // console.dir(response);
                    // response[0]['RESULTS_ARRAY'][0]['ERROR_MSG'] = 'ORA-9999999';
                    var _json = JSON.stringify(response[0]);
                    var error_msg = null;
                    // if (JSON.parse(_json)['RESULTS_ARRAY'][0]['ERROR_MSG'] !== undefined && JSON.parse(_json)['RESULTS_ARRAY'][0]['ERROR_MSG'] !== null)
                    //     error_msg = JSON.parse(_json)['RESULTS_ARRAY'][0]['ERROR_MSG'];
                    // console.log("response._json:...");
                    // console.log(_json);
                    // console.log("STU_PIDM: " + JSON.parse(_json)['RESULTS_ARRAY'][0]['STU_PIDM']);
                    status = JSON.parse(_json)['STATUS'];
                    // console.debug("status: " + status);

                    _message = JSON.parse(_json)['MESSAGE'];
                    // console.debug("message: " + _message);
                    var _results = JSON.parse(_json)['RESULTS_ARRAY'];
                    if (error_msg !== undefined || error_msg !== null)
                        console.log("error_msg: " + error_msg);
                    // console.log("Results length: " + _results.length);

                    if (status === "SUCCESS") {
                        var n = new Notification({
                            message: _message,
                            type: 'success',
                            flash: true,
                            model: null,
                            attribute: ''
                        });
                        notifications.addNotification(n);
                    } else if (status === "ERROR") {
                        n = new Notification({
                            message: _message,
                            type: 'failure',
                            flash: true,
                            model: null,
                            attribute: ''
                        });
                        notifications.addNotification(n);
                    }

                    for (var u in _results) {
                        var done = false;
                        for (var i = 0; i<$scope.gridOptions.data.length && !done; i++) {
                            for (var j = 0; j < $scope.gridOptions.data[i]['STUDENTS'].length; j++) {
                                // console.log("STATUS:...");
                                // console.dir($scope.gridOptions.data[i]['STUDENTS'][j]['STATUS']);
                                // console.log("STU_PIDM");
                                // console.dir($scope.gridOptions.data[i]['STUDENTS'][j]['STU_PIDM']);
                                // console.debug(`STUDENTS[${i}]`);
                                // console.dir($scope.gridOptions.data[i]);
                                if ($scope.gridOptions.data[i]['STUDENTS'].hasOwnProperty(j)
                                    && _results.hasOwnProperty(u)
                                    && _results[u] !== undefined
                                    && _results[u] !== null
                                    && _results[u]['ERROR_MSG'] !== undefined
                                    && _results[u]['ERROR_MSG'] !== null
                                    && _results[u]['ERROR_MSG'] !== ''
                                    && _results[u]['STU_PIDM'] === $scope.gridOptions.data[i]['STUDENTS'][j]['STU_PIDM']
                                    && !done) {
                                    // console.log("STU_PIDMs equal");
                                    $scope.gridOptions.data[i]['STUDENTS'][j]['STATUS'] = _results[u]['ERROR_MSG'];

                                    var errtmp = localStorageService.get(gcKeys[u]);
                                    // console.debug("errtmp: ");
                                    // console.dir(errtmp);
                                    $scope.gridOptions.data[i]['STUDENTS'][j]['STUDENT_NAME'] = errtmp['STUDENT_NAME'];
                                    $scope.gridOptions.data[i]['STUDENTS'][j]['UIN'] = errtmp['UIN'];
                                    $scope.gridOptions.data[i]['STUDENTS'][j]['STU_LEVEL'] = errtmp['STU_LEVEL'];
                                    $scope.gridOptions.data[i]['STUDENTS'][j]['ATHLETE'] = errtmp['ATHLETE'];
                                    $scope.gridOptions.data[i]['STUDENTS'][j]['DEGREE_CANDIDATE'] = errtmp['DEGREE_CANDIDATE'];
                                    $scope.gridOptions.data[i]['STUDENTS'][j]['OLD_GRADE'] = errtmp['OLD_GRADE'];
                                    $scope.gridOptions.data[i]['STUDENTS'][j]['NEW_GRADE'] = errtmp['NEW_GRADE'];
                                    $scope.gridOptions.data[i]['STUDENTS'][j]['CHANGE_REASON_DESCR'] = errtmp['CHANGE_REASON_DESCR'];

                                    console.log(`Status: ${$scope.gridOptions.data[i]['STUDENTS'][j]['STATUS']}`);
                                    console.log(`Student name: ${$scope.gridOptions.data[i]['STUDENTS'][j]['STUDENT_NAME']}`);
                                    done = true;
                                } else if (_results[u]['STU_PIDM'] === $scope.gridOptions.data[i]['STUDENTS'][j]['STU_PIDM']
                                    && !done) {
                                    // console.debug("STU_PIDMs equal");
                                    // console.debug(`origdata STATUS and grid data STATUS: ${origdata[i]['STUDENTS'][j]['STATUS']}`);
                                    if (!$scope.gridOptions.data[i]['STUDENTS'][j]['STATUS'] !== 'Comment required on reject')
                                        $scope.gridOptions.data[i]['STUDENTS'][j]['STATUS'] = 'Successful update';
                                    var noerrtmp = localStorageService.get(gcKeys[u]);
                                    // console.debug("noerrtmp:...");
                                    // console.dir(noerrtmp);
                                    $scope.gridOptions.data[i]['STUDENTS'][j]['STUDENT_NAME'] = noerrtmp['STUDENT_NAME'];
                                    $scope.gridOptions.data[i]['STUDENTS'][j]['UIN'] = noerrtmp['UIN'];
                                    $scope.gridOptions.data[i]['STUDENTS'][j]['STU_LEVEL'] = noerrtmp['STU_LEVEL'];
                                    $scope.gridOptions.data[i]['STUDENTS'][j]['ATHLETE'] = noerrtmp['ATHLETE'];
                                    $scope.gridOptions.data[i]['STUDENTS'][j]['DEGREE_CANDIDATE'] = noerrtmp['DEGREE_CANDIDATE'];
                                    $scope.gridOptions.data[i]['STUDENTS'][j]['OLD_GRADE'] = noerrtmp['OLD_GRADE'];
                                    $scope.gridOptions.data[i]['STUDENTS'][j]['NEW_GRADE'] = noerrtmp['NEW_GRADE'];
                                    $scope.gridOptions.data[i]['STUDENTS'][j]['CHANGE_REASON_DESCR'] = noerrtmp['CHANGE_REASON_DESCR'];
                                    // console.debug(`Status: ${$scope.gridOptions.data[i]['STUDENTS'][j]['STATUS']}`);
                                    // console.debug(`Student name: ${$scope.gridOptions.data[i]['STUDENTS'][j]['STUDENT_NAME']}`);
                                    done = true;
                                }
                            }
                        }
                    }

                    console.debug("clearAll variable...");
                    $scope.clearAll = localStorageService.clearAll;
                    // console.dir($scope.clearAll);
                }
            );
        }

        if (_message.indexOf("reject") !== -1) {
            if (status === "SUCCESS") {
                var n = new Notification({
                    message: _message,
                    type: 'success',
                    flash: true,
                    model: null,
                    attribute: ''
                });
                notifications.addNotification(n);
            } else if (status === "ERROR") {
                n = new Notification({
                    message: _message,
                    type: 'failure',
                    flash: true,
                    model: null,
                    attribute: ''
                });
                notifications.addNotification(n);
            }
            angular.copy(localStorageService.get('alldata'), origdata);
            $scope.gridOptions.data = origdata;
            // console.debug("second notification $scope.gridOptions.data:...");
            // console.dir($scope.gridOptions.data);

        }

        /**************************************************************************/

        $scope.clearAll = localStorageService.clearAll;
        // console.log("clearAll variable...");
        // console.dir($scope.clearAll);
    };

    $scope.switchVisibility = function () {
        console.log("Switch visibility...");
        // console.log("subGridOptions: ");
        // console.dir($scope.gridOptions.data[0].subGridOptions.columnDefs);

        for (var i = 0; i<$scope.gridOptions.data.length; i++) {
            for (var j = 0; j <  $scope.gridOptions.data[i]['STUDENTS'].length; j++) {
                if ($scope.gridOptions.data[i]['STUDENTS'][j]['APPROVAL_TYPE'] === 'DEPT_HEAD') {
                    $scope.gridOptions.data[i].subGridOptions.columnDefs[22].visible = true; // DEPH description
                    $scope.gridOptions.data[i].subGridOptions.columnDefs[23].visible = true; // DEPH comment
                    $scope.gridOptions.data[i].subGridOptions.columnDefs[27].visible = false; // Dean description
                    $scope.gridOptions.data[i].subGridOptions.columnDefs[28].visible = false; // Dean comment
                } else if ($scope.gridOptions.data[i]['STUDENTS'][j]['APPROVAL_TYPE'] === 'DEAN') {
                    $scope.gridOptions.data[i].subGridOptions.columnDefs[27].visible = true; // Dean description
                    $scope.gridOptions.data[i].subGridOptions.columnDefs[28].visible = true; // Dean comment
                    $scope.gridOptions.data[i].subGridOptions.columnDefs[22].visible = false; // DEPH description
                    $scope.gridOptions.data[i].subGridOptions.columnDefs[23].visible = true; // DEPH comment
                    $scope.gridOptions.data[i].subGridOptions.columnDefs[23].enableCellEdit = false; // DEPH comment
                    $scope.gridOptions.data[i].subGridOptions.columnDefs[23].cellTemplate = '<div class="block"><input type="text" ng-class="input" ng-model="MODEL_COL_FIELD" ng-readonly="true" style="border: 0"></div>'; // DEPH comment

                }
            }
        }
    };

    $scope.subGridScope = { // returns original get JSON as POST
        _update: function(srcObj, destObj) {
            // console.log("$scope.subGridScope: destObj and srcObj");
            // console.dir(destObj);
            // console.dir(srcObj);
        }
    };

    $scope.methods = [];
    $scope.getAllMethods = function() {

        console.log("getAllMethods()...")
        // console.log($scope);

        var props = Object.getOwnPropertyNames($scope);

        for (var i = 0; i < props.length; i++) {
            if (typeof($scope[props[i]]) === 'function') {
                $scope.methods.push({ 'name': props[i], 'function': $scope[props[i]].toString()})
            }
        }
        console.dir($scope.methods);
    };

    $scope.yesno = function () {
        console.log("yesno clicked...");
        console.log("$scope.model.id: " + $scope.model.id);
        // console.dir($scope);
        // console.log("element: " + element[0]);
    };

    $scope._visibility = function () {
        console.log("visibility changed:");
    };

    $scope.filterGrid1 = [];
    $scope.filterGrid2 = [];

    var _search = '';

    /************************************************************/
    const rejectIndexed = R.addIndex(R.reject);
    const containsIndex = R.curry((indexes, val, index) => R.contains(index, indexes));
    const omitIndexes = R.curry((indexes, list) => rejectIndexed(containsIndex(indexes), list));
    const paths = R.curry((paths, obj) => R.ap([R.path(R.__, obj)], paths));

    const dotPath = R.useWith(R.path, [R.split('.')]);
    const propsDotPath = R.useWith(R.ap, [R.map(dotPath), R.of]);
    const mapIndexed = R.addIndex(R.map);
    const lookup = R.flip(R.prop);
    const isNotNil = R.complement(R.isNil);
    const isNotEqual = R.complement(R.equals);
    const isNotEmpty = R.complement(R.isEmpty);
    const size = R.pipe(R.values, R.length);
    const isNotUndefined = R.complement(Ramdasauce.isUndefined);
    var groupObjBy = curry(pipe(
        // Call groupBy with the object as pairs, passing only the value to the key function
        R.useWith(R.groupBy, [R.useWith(R.__, [R.last]), toPairs]),
        R.map(fromPairs)
    ));

    var diffObjs = pipe(
        R.useWith(R.mergeWith(R.merge), [R.map(R.objOf("leftValue")), R.map(R.objOf("rightValue"))]),
        groupObjBy(cond([
            [
                R.both(R.has("leftValue"), R.has("rightValue")),
                R.pipe(R.values, R.ifElse(R.apply(R.equals), R.always("common"), R.always("difference")))
            ],
            [R.has("leftValue"), R.always("onlyOnLeft")],
            [R.has("rightValue"), R.always("onlyOnRight")],
        ])),
        R.evolve({
            common: R.map(R.prop("leftValue")),
            onlyOnLeft: R.map(R.prop("leftValue")),
            onlyOnRight: R.map(R.prop("rightValue"))
        })
    );


    /************************************************************/

    const removeName = (name, objs) => R.map(
        R.evolve({STUDENTS: xs => removeName(name, xs)}),
        R.reject(R.propEq('STUDENT_NAME', name), objs)
    );

    const removeUIN = (uin, objs) => R.map(
        R.evolve({STUDENTS: xs => removeUIN(uin, xs)}),
        R.reject(R.propEq('UIN', uin), objs)
    );

    const removeTERM = (term, objs) => R.map(
        R.evolve({STUDENTS: xs => removeTERM(term, xs)}),
        R.reject(R.propEq('TERM', term), objs)
    );

    const findByCourseDesc = R.compose(
        R.ap(R.__, R.keys),
        R.o(R.find),
        R.o(R.__, R.flip(R.prop)),
        R.o,
        R.propEq('COURSE_DESCR')
    );

    let m;
    const isMatch = function matchesRegexStr(regex, str) {
        var found = false;
        m = regex.exec(str);
        if (m !== undefined && m !== null) {

            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            m.forEach((match, groupIndex) => {
                console.debug(`Found match, group ${groupIndex}: ${match}`);
                found = true;
            });
            return found;
        }
    };

    const goodStr = R.both(isNotNil, isNotEmpty);

    $scope.refreshData = function (termObj, data) {

        console.log("refreshData filterGrid1.data...");
        $scope.filterGrid1.data = data;
        console.dir($scope.filterGrid1.data);

        const datasize = size($scope.filterGrid1.data);
        const datarange = R.range(0, datasize);
        const rangeList = mapIndexed((val, idx) => idx + '.STUDENTS', datarange);
        const studentPath = propsDotPath(rangeList, $scope.filterGrid1.data);
        const studentLev1 = R.unnest(studentPath);
        console.debug("studentLev1...");
        console.dir(studentLev1);

        const names = R.map(R.prop("STUDENT_NAME"), studentLev1);
        const uins = R.map(R.prop("UIN"), studentLev1);

        const _names = R.map(R.toLower, names);
        for (var s = 0; s < _names.length; s++) {
            _names[s] = R.replace(/,/g, '', _names[s]);
        }
        const namesObj = R.zipObj(_names, names);
        console.debug("namesObj...");
        console.dir(namesObj);
        const cache = lookup(namesObj);

        var options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 2,
            keys: [
                "STUDENTS.STUDENT_NAME",
                "STUDENTS.UIN",
                "STUDENTS.CHANGE_REASON_DESCR",
                "STUDENTS.COURSE_TITLE",
                "STUDENTS.CRN",
                "STUDENTS.TERM",
                "TERM_DESCR",
                "COURSE_DESCR"
            ]
        };

        var options_score = {
            shouldSort: true,
            includeScore: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 2,
            keys: [
                "STUDENTS.STUDENT_NAME",
                "STUDENTS.UIN",
                "STUDENTS.CHANGE_REASON_DESCR",
                "STUDENTS.COURSE_TITLE",
                "STUDENTS.CRN",
                "STUDENTS.TERM",
                "TERM_DESCR",
                "COURSE_DESCR"
            ]
        };

        var tokenize_scores = {
            shouldSort: true,
            tokenize: true,
            includeScore: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 2,
            keys: [
                "STUDENTS.STUDENT_NAME",
                "STUDENTS.UIN",
                "STUDENTS.CHANGE_REASON_DESCR",
                "STUDENTS.CRN",
                "STUDENTS.TERM",
                "TERM_DESCR",
                "COURSE_DESCR",
                "COURSE_TITLE"
            ]
        };

        var tokenize = {
            shouldSort: true,
            tokenize: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 2,
            keys: [
                "STUDENTS.STUDENT_NAME",
                "STUDENTS.UIN",
                "STUDENTS.CHANGE_REASON_DESCR",
                "STUDENTS.CRN",
                "STUDENTS.TERM",
                "TERM_DESCR",
                "COURSE_DESCR",
                "COURSE_TITLE"
            ]
        };

        var fuse_scores = new Fuse($scope.filterGrid1.data, options_score);
        var fuse = new Fuse($scope.filterGrid1.data, options);
        var fuse_tokens_scores = new Fuse($scope.filterGrid1.data, tokenize_scores);
        var fuse_tokens = new Fuse($scope.filterGrid1.data, tokenize);

        while (termObj) {
            var oSearchArray = termObj.split(' ');
            console.debug("termObj...");
            localStorageService.set("filterGridData", $scope.filterGrid1.data);
            _search = oSearchArray[0].toString();

            var xscores = [];
            var _xscores = [];
            var wscores = [];
            var tokens = [];
            var diffs = {};
            var scores = [];
            var _scores = [];
            var _tokens = [];
            var tokens_ = [];

            if (scount > 1) {
                console.debug("Fuse result...");
                xscores = fuse.search(_search);
                console.debug("xscores:...");
                console.dir(xscores);

                wscores = fuse_scores.search(_search);
                console.debug("wscores:...");
                console.dir(wscores);

                tokens = fuse_tokens.search(_search);
                console.debug("tokens:...");
                console.dir(tokens);

                _tokens = fuse_tokens_scores.search(_search);
                console.debug("_tokens:...");
                console.dir(_tokens);

                scores = R.pluck('score')(wscores);
                console.debug("scores:...");
                console.dir(scores);

                _scores = R.pluck('score')(_tokens);
                console.debug("_scores:...");
                console.dir(_scores);

                var indices = [];
                var _indices = [];
                for (var i = 1; i < size(scores); i++) {
                    if (R.lt(scores[0], scores[i])) {
                        indices.push(i);
                    }
                }

                for (var j = 1; j < size(_scores); j++) {
                    if (R.lt(_scores[0], _scores[j])) {
                        _indices.push(j);
                    }
                }

                _xscores = omitIndexes(indices, xscores);
                tokens_ = omitIndexes(_indices, tokens);
                console.debug("_xscores:...");
                console.dir(_xscores);
                console.debug("tokens_:...");
                console.dir(tokens_);

                var removedItems = null;

                /**
                 * else if (isStrContained(_search, _xscores[0].STUDENTS[k].UIN)) {
                            removedItems = removedItems(_xscores[0].STUDENTS[k].UIN, removedItems);
                        } else if (isStrContained(_search, _xscores[0].STUDENTS[k].CHANGE_REASON_DESCR)) {
                            removedItems = removedItems(_xscores[0].STUDENTS[k].CHANGE_REASON_DESCR, removedItems);
                        } else if (isStrContained(_search, _xscores[0].STUDENTS[k].CRN)) {
                            removedItems = removedItems(_xscores[0].STUDENTS[k].CRN, removedItems);
                        } else if (isStrContained(_search, _xscores[0].STUDENTS[k].TERM)) {
                            removedItems = removedItems(_xscores[0].STUDENTS[k].TERM, removedItems);
                        }
                 */


                var searchNotNumeric = R.not(prettycats.isNumericString(_search));

                const isStrContained = (asearch, aToken) => prettycats.isStringContaining(asearch, aToken);
                const isStrNumeric = (asearch, num) => prettycats.isNumericString(asearch, num);

                var _tokens_ = [];
                var numericstr = [];

                if (searchNotNumeric) {
                    _tokens_ = R.forEachObjIndexed(isStrContained, _xscores[0].STUDENTS);
                } else {
                    numericstr = R.forEachObjIndexed(isStrNumeric, _xscores[0].STUDENTS);
                }

                console.debug("_tokens_:...");
                console.dir(_tokens_);
                console.debug("numericstr:...");
                console.dir(numericstr);

                /*for (var k = 0; k < size(_xscores[0].STUDENTS); k++) {
                    if (isStrContained(_search, _xscores[0].STUDENTS[k].STUDENT_NAME)) {
                        removedItems = removeName(_xscores[0].STUDENTS[k].STUDENT_NAME, removedItems);
                    } else if (isStrContained(_search, _xscores[0].STUDENTS[k].CHANGE_REASON_DESCR)) {
                        removedItems = removedItems(_xscores[0].STUDENTS[k].CHANGE_REASON_DESCR, removedItems);
                    }
                }*/



                var isRemoved = R.complement(prettycats.isEmptyArray(removedItems));

                if (isRemoved) {
                    console.debug("removedItems");
                    console.dir(removedItems);
                }
            }

            // console.debug(JSON.stringify($scope.filterGrid1.data));

            console.debug("End If filterGrid1.data:...");

            console.dir($scope.filterGrid1.data);

            if (isNotEqual(size($scope.filterGrid1.data), size(origdata))) {
                console.debug("refreshData copy origdata to fiterGrid.data:...");
                angular.copy($scope.filterGrid1.data, origdata);
            }

            console.debug("End refreshData() original data:...");
            console.dir(origdata);
            oSearchArray.shift();
            termObj = (oSearchArray.length !== 0) ? oSearchArray.join(' ') : '';

        }
    };

    $scope._update = function(val) {

        $timeout(function() {
            $scope.refreshData(val, origdata);
            console.debug(`_update return refreshData val: ${val} count: ${scount}`);

        });
    };

    $scope.$watch('search', function (newVal) {
        if (newVal) {
            // console.debug("newVal: " + newVal);
            scount++;
            // console.debug(`$watch newVal: ${newVal}`);
            // console.debug('arguments length: ' + arguments[0].length);
            $scope.inputlength = arguments[0].length;
            $scope._update(newVal);

        } else {
            console.debug("$watch search copy alldata...");
            scount = 0;
            angular.copy(localStorageService.get('alldata'), origdata);
            $scope.gridApi.grid.registerDataChangeCallback(function() {
                $scope.gridApi.expandable.collapseAllRows();
            });
        }
    });

    $scope.gridOpts = {
        data: origdata
    };

    // $scope.expandableRowHeight *= ( 2 + $scope.students.length );

    /*$scope.expandCollapseRow = function($scope,$event){
        console.debug("expandableCollapseRow:...");
        $event.stopPropagation();
        $scope.expandableRowHeight *= ( 2 + $scope.students.length ) ;
        $scope.gridApi.expandable.toggleRowExpansion($scope.students);
    };*/
}


