import { DialogBox } from 'web-dialog-box'

interface Settings {
    text: string
    btnOk?: boolean
    btnCancel?: boolean
    btnYes?: boolean
    btnNo?: boolean
    defBtnOk?: boolean;
    defBtnYes?: boolean;
    defBtnNo?: boolean;
    defBtnCancel?: boolean;
    slide?: boolean
    slideReverse?: boolean
    inputText?: string
    inputSelectRange?: number[]
    fullscreen?: boolean
}

export const showDialog = async (settings: Settings) => {
    const dialog = new DialogBox()
    document.body.appendChild(dialog)

    dialog.addEventListener("dialogClosed", dialog.remove)

    const res = await dialog.show({
        text: settings.text,
        slide: settings.slide,
        slideReverse: settings.slideReverse,
        btnOk: settings.btnOk,
        btnCancel: settings.btnCancel,
        btnYes: settings.btnYes,
        btnNo: settings.btnNo,
        defBtnOk: settings.defBtnOk,
        defBtnCancel: settings.defBtnCancel,
        inputText: settings.inputText,
        inputSelectRange: settings.inputSelectRange,
        fullscreen: settings.fullscreen
    })    
    
    return res
}

