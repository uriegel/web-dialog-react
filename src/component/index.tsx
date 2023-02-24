import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { DialogBox } from 'web-dialog-box'
import './Dialog.css'
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

export type DialogHandle = {
    show: (settings: Settings)=>Promise<boolean>
}

interface DialogProp {}

const Dialog = forwardRef<DialogHandle, DialogProp>(({ }, ref) => {
    
    const [show, setShow] = useState(false)
    const [hidden, setHidden] = useState(true)
    const [text, setText] = useState("")

    useImperativeHandle(ref, () => ({
        async show(settings: Settings) {
            setShow(true)
            setText(settings.text)
            return false
        }
    }))

    const onFaderTransitionEnd = () => {
        if (hidden)
            setShow(false)
    }

    const close = () => {
        setHidden(true)
    }

    const onOk = () => {
        close()
    }

    const onCancel = () => close()

    useEffect(() => { if (show) setHidden(false) },
        [show])
    
    return show ? (
        <div className={`wdr--dialogroot${hidden ? " hidden" : ""}`}>
            <div className='wdr--fader' onTransitionEnd={onFaderTransitionEnd}></div>
            <div className='wdr--container'>
                <div className='wdr--dialog'>
                    <div className='wdr--content'>
                        <p>{text}</p>
                    </div>
                    <div className='wdr--buttons-container'>
                        <div className='wdr--buttons'>
                            <div className='wdr--button' tabIndex={1} onClick={onOk}>OK</div>
                            <div className='wdr--button' tabIndex={2} onClick={onCancel}>Abbrechen</div> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null
})

export default Dialog

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

