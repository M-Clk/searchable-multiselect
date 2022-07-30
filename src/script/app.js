angular.module('searchable.multiselect', ["ui.bootstrap"])
    .directive("searchableMultiselect", function () {
        return {
            template: `<div class="dropdown searchable-multiselect" dropdown on-toggle="toggled(open)" is-open="isOpen">
            <a class="dropdown-toggle btn btn-default" data-toggle="dropdown" dropdown-toggle data-target="#"
               tooltip="{{ delimitedSelected() }}" ng-class="{'disabled': readOnly}">
                <span class="limit-ellipsis" ng-style="{ 'width' : width }">
                    <small ng-class="{'text-muted' :textMuted()}" style="font-size: {{getFontSize()}}">
                        {{ delimitedSelected() }}
                    </small>
                    <b class="caret" ng-if="!readOnly && allItems.length" style="margin-top:0;"></b>
                </span>
            </a>
            <ul ng-if="!readOnly && allItems.length" class="dropdown-menu dropdown-menu-form form-control" role="menu">
                <li ng-hide="hideSerachBox">
                    <div class="li-item">
                        <input type="text" class="form-control" ng-model="searchQuery" placeholder="Ara">
                        <i name="item-remove-button" class="fa fa-undo pull-right deselect-all text-danger"  title="Deselect All" ng-click="deselectAll($index)" ng-hide="singleSelection || hideDeselectAllButton"></i>
                    </div>
        
                </li>
                <li ng-repeat="item in allItems track by $index" ng-hide="searchQuery.length && getDisplayValueOfItem(item).toLowerCase().indexOf(searchQuery.toLowerCase()) < 0">
                    <div class="li-item" ng-class="{'alert alert-info': isItemSelected($index)}" ng-click="updateSelectedItems($index)">
                        <label name="item-display-value" class="checkbox "> {{ getDisplayValueOfItem(item) }} </label>
                        <i name="item-remove-button" class="fa fa-check-circle pull-right" ng-show="isItemSelected($index)"></i>
                    </div>
                </li>
            </ul>
        </div>`,
            restrict: 'E',
            scope: {
                displayAttr: '@?',
                displayTextOnEmpty: '@?',
                displayTextMaxLength: '@?',
                fontSize: '@?',
                allItems: '=',
                selectedItems: '=?',
                selectedItem: '=?ngModel',
                readOnly: '=?',
                hidePointsOnDisplay: '=?',
                singleSelection: '=?',
                delimiter: '=?',
                hideSerachBox: '=?',
                displayCallback: '&?',
                addItem: '&?',
                removeItem: '&?'
            },
            link: function (scope, element, attrs) {
                element.bind('click',
                    function (e) {
                        e.stopPropagation();
                    });
                if (scope.displayTextOnEmpty === undefined)
                    scope.displayTextOnEmpty = "No Selection";
                scope.width = element[0].getBoundingClientRect();
                scope.hidePointsOnDisplay = !angular.isUndefined(attrs.hidePointsOnDisplay) && (attrs.hidePointsOnDisplay == '' || scope.hidePointsOnDisplay);
                scope.hideSerachBox = !angular.isUndefined(attrs.hideSerachBox) && (attrs.hideSerachBox == '' || scope.hideSerachBox);
                scope.readOnly = !angular.isUndefined(attrs.readOnly) && (attrs.readOnly == '' || scope.readOnly);
                scope.singleSelection = !angular.isUndefined(attrs.singleSelection) && (attrs.singleSelection == '' || scope.singleSelection);

                scope.delimiter = !angular.isUndefined(attrs.delimiter) ? scope.delimiter : ',';

                scope.getFontSize = function () {
                    return (!angular.isUndefined(attrs.fontSize) ? scope.fontSize : '10') + 'pt';
                }

                scope.updateSelectedItems = function (index) {
                    var selectedIndex = -1;
                    for (var i = 0; !angular.isUndefined(scope.selectedItems) && i < scope.selectedItems.length; i++) {
                        if (scope.getDisplayValueOfItem(scope.selectedItems[i]).toLowerCase() === scope.getDisplayValueOfItemByIndex(index).toLowerCase()) {
                            selectedIndex = i;
                            break;
                        }
                    }
                    if (scope.singleSelection)
                        scope.changeSingleSelectedItem(scope.allItems[index]);
                    else if (selectedIndex >= 0 && !angular.isUndefined(scope.selectedItems[selectedIndex]))
                        scope.removeItemInternal(selectedIndex);
                    else
                        scope.addItemInternal(scope.allItems[index]);
                };

                scope.isItemSelected = function (index) {
                    if (scope.singleSelection) {
                        if (angular.isUndefined(scope.selectedItem))
                            return false;
                        return scope.getDisplayValueOfItem(scope.selectedItem).toUpperCase() ===
                            scope.getDisplayValueOfItemByIndex(index).toUpperCase();
                    }

                    if (angular.isUndefined(scope.selectedItems)) return false;
                    var tmpItem;
                    for (var i = 0; i < scope.selectedItems.length; i++) {
                        tmpItem = scope.selectedItems[i];
                        if (!angular.isUndefined(tmpItem) &&
                            scope.getDisplayValueOfItem(tmpItem).toUpperCase() ===
                            scope.getDisplayValueOfItemByIndex(index).toUpperCase()) {
                            return true;
                        }
                    }
                    return false;
                };

                scope.delimitedSelected = function () {
                    if (scope.singleSelection)
                        return scope.getDisplayValueOfItem(scope.selectedItem);
                    var list = "";
                    angular.forEach(scope.selectedItems,
                        function (item, index) {
                            var displayValue = scope.getDisplayValueOfItem(item);
                            var displayText = !angular.isUndefined(scope.displayTextMaxLength) &&
                                !angular.isUndefined(displayValue) &&
                                displayValue.length >
                                (Number(scope.displayTextMaxLength) + (scope.hidePointsOnDisplay ? 0 : 3))
                                ? displayValue.substr(0, Number(scope.displayTextMaxLength)) +
                                (scope.hidePointsOnDisplay ? '' : '...')
                                : displayValue;
                            list += displayText;
                            if (index < scope.selectedItems.length - 1) list += scope.delimiter;
                        });
                    return list.length
                        ? list
                        : scope.displayTextOnEmpty;
                }
                scope.changeSingleSelectedItem = function (newItem) {
                    scope.selectedItem = newItem;
                    scope.isOpen = false;
                }
                scope.addItemInternal = function (item) {
                    if (!angular.isUndefined(attrs.addItem)) {
                        scope.addItem({ item });
                        return;
                    };
                    scope.selectedItems.push(item);
                }

                scope.removeItemInternal = function (index) {
                    if (!angular.isUndefined(attrs.removeItem)) {
                        scope.removeItem({ index });
                        return;
                    }
                    scope.selectedItems.splice(index, 1);
                }

                scope.textMuted = function () {
                    return angular.isUndefined(scope.displayTextOnEmpty) && scope.delimitedSelected() === scope.displayTextOnEmpty;
                }
                scope.getDisplayValueOfItemByIndex = function (index) {
                    return scope.getDisplayValueOfItem(scope.allItems[index]);
                }
                scope.getDisplayValueOfItem = function (item) {
                    if (!angular.isUndefined(attrs.displayCallback))
                        return scope.displayCallback({ item });
                    return !angular.isUndefined(attrs.displayAttr)
                        ? item[scope.displayAttr]
                        : item;
                }

                scope.deselectAll = function () {
                    scope.selectedItems = [];
                }

            }
        }
    });