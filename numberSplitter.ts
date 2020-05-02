function onOpen() {
    const spreadsheet = SpreadsheetApp.getActive()
    let menuItems = [
        { name: 'Split Phone Numbers...', functionName: 'splitPhones' }
    ]
    spreadsheet.addMenu('PhoneNumber Hacks', menuItems)
}

const splitPhones = () => {
    let ui = SpreadsheetApp.getUi()
    let phoneResponse = ui.prompt("Enter Comma Seperated Values for the phone columns (Or leave blank to just map the data columns)")
    let phoneColumns = []
    if (phoneResponse.getSelectedButton() !== ui.Button.CLOSE) {
        phoneColumns = phoneResponse.getResponseText().split(',').map(chars => chars.trim())
    }

    let infoColumns: string[] = [] // ['F', 'T', 'R']
    let infoResponse = ui.prompt("Enter Comma Seperated Values for the info you want")
    if (infoResponse.getSelectedButton() !== ui.Button.CLOSE) {
        infoColumns = infoResponse.getResponseText().split(',').map(chars => chars.trim())
    }

    let originalSheet = SpreadsheetApp.getActiveSheet()
    let splitSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Split Numbers')

    // Assume we have headers on our original
    const infoHeaders: string[] = infoColumns
        // ['F', 'T', 'R'] => [Range(F1), Range(T1), Range(R1)] => ["first name", "last name", "address"...]
        .map(letter => originalSheet.getRange(`${letter}1`))
        .map(range => range.getValue())
    infoHeaders.push("Phone")

    splitSheet.appendRow(infoHeaders)
    // for row in our sheet
    // get the row,
    // cycle through the phone columns
    // if that phone exists, copy our data columns + the phone colum to the new sheet

    const lastRow = originalSheet.getLastRow()

    for (let row = 2; row <= lastRow; row++) {
        let infoData = infoColumns
            .map(letter => originalSheet.getRange(`${letter}${row}`))
            .map(range => range.getValue())
        for (let phoneCol of phoneColumns) {
            let currNum = originalSheet.getRange(`${phoneCol}${row}`)
            if (!currNum.isBlank()) {
                splitSheet.appendRow(infoData.concat(currNum.getValue()))
            }

        }
    }
}