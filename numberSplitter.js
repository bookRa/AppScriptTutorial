// Compiled using ts2gas 3.6.1 (TypeScript 3.8.3)
function onOpen() {
    var spreadsheet = SpreadsheetApp.getActive();
    var menuItems = [
        { name: 'Split Phone Numbers...', functionName: 'splitPhones' }
    ];
    spreadsheet.addMenu('PhoneNumber Hacks', menuItems);
}
var splitPhones = function () {
    var ui = SpreadsheetApp.getUi();
    var phoneResponse = ui.prompt("Enter Comma Seperated Values for the phone columns (Or leave blank to just map the data columns)");
    var phoneColumns = [];
    if (phoneResponse.getSelectedButton() !== ui.Button.CLOSE) {
        phoneColumns = phoneResponse.getResponseText().split(',').map(function (chars) { return chars.trim(); });
    }
    var infoColumns = []; // ['F', 'T', 'R']
    var infoResponse = ui.prompt("Enter Comma Seperated Values for the info you want");
    if (infoResponse.getSelectedButton() !== ui.Button.CLOSE) {
        infoColumns = infoResponse.getResponseText().split(',').map(function (chars) { return chars.trim(); });
    }
    var originalSheet = SpreadsheetApp.getActiveSheet();
    var splitSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Split Numbers');
    // Assume we have headers on our original
    var infoHeaders = infoColumns
        // ['F', 'T', 'R'] => [Range(F1), Range(T1), Range(R1)] => ["first name", "last name", "address"...]
        .map(function (letter) { return originalSheet.getRange(letter + "1"); })
        .map(function (range) { return range.getValue(); });
    infoHeaders.push("Phone");
    splitSheet.appendRow(infoHeaders);
    // for row in our sheet
    // get the row,
    // cycle through the phone columns
    // if that phone exists, copy our data columns + the phone colum to the new sheet
    var lastRow = originalSheet.getLastRow();
    var _loop_1 = function (row) {
        var infoData = infoColumns
            .map(function (letter) { return originalSheet.getRange("" + letter + row); })
            .map(function (range) { return range.getValue(); });
        for (var _i = 0, phoneColumns_1 = phoneColumns; _i < phoneColumns_1.length; _i++) {
            var phoneCol = phoneColumns_1[_i];
            var currNum = originalSheet.getRange("" + phoneCol + row);
            if (!currNum.isBlank()) {
                splitSheet.appendRow(infoData.concat(currNum.getValue()));
            }
        }
    };
    for (var row = 2; row <= lastRow; row++) {
        _loop_1(row);
    }
};
