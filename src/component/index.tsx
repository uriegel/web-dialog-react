import React from 'react'
import ReactDOM from 'react-dom/client'
import { DialogBox } from 'web-dialog-box'
export { Result } from 'web-dialog-box'

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
    inputSpellCheck?: boolean
    fullscreen?: boolean
    dontUseApp?: boolean
    extended?: ()=>JSX.Element
}

var lastActive: HTMLElement| null = null

export const showDialog = async (settings: Settings) => {
    lastActive = document.activeElement as HTMLElement
    const dialog = new DialogBox()
    if (settings.extended) {
        const extended = document.createElement("div")
        extended.id = "extended"
        const root = ReactDOM.createRoot(extended)
        root.render(
            <React.StrictMode>
                { settings.extended() }
            </React.StrictMode>
        )
        dialog.appendChild(extended)
    }
    const parent = settings.dontUseApp
        ? document.body
        : document.getElementsByClassName("App")[0]
    parent?.appendChild(dialog)

    dialog.addEventListener("dialogClosed", () => {
        dialog.remove()
        lastActive?.focus()
    })

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
        disableInputSpellCheck: !settings.inputSpellCheck,
        fullscreen: settings.fullscreen,
        extended: settings.extended ? "extended" : undefined
    })    
    return res
}

