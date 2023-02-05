import { DialogBox } from 'web-dialog-box'

export const showDialog = async () => {
    const dialog = new DialogBox()
    document.body.appendChild(dialog)

    dialog.addEventListener("dialogClosed", () => {
        console.log("Dialog closed now")
        dialog.remove()
    })

    const res = await dialog.show({
        text: "Standard",
        btnOk: true,
        btnCancel: true
    })    
    
    console.log("Dialog closed", res)
}

