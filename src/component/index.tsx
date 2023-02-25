import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './DialogBox.css'
import DialogBox from './DialogBox'

export interface Settings {
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

const Dialog = forwardRef<DialogHandle>((_, ref) => {
    
    const [show, setShow] = useState(false)
    const [hidden, setHidden] = useState(true)
   
    const settings = useRef<Settings>({ text: "" })
    const dialogRef = useRef<HTMLDivElement>(null)
    const lastActive = useRef<HTMLElement|null>(null)

    useImperativeHandle(ref, () => ({
        async show(settingsValue: Settings) {
            settings.current = settingsValue
            setShow(true)
            return false
        }
    }))

    const close = () => {
        setHidden(true)
    }

    if (show && !lastActive.current)
        lastActive.current = document.activeElement as HTMLElement
    else if (!show && lastActive.current) {
        lastActive.current?.focus()
        lastActive.current = null
    }

    useEffect(() => {
        if (show) 
            setHidden(false)
    },[show])
    
    return show ? (
        <div ref={dialogRef} className={`wdr--dialogroot${hidden ? " hidden" : ""}`} >
            <DialogBox hidden={hidden} setShow={setShow} close={close} text={settings.current.text} btnCancel={settings.current.btnCancel} btnNo={settings.current.btnNo} btnOk={settings.current.btnOk}
                btnYes={settings.current.btnYes} defBtnCancel={settings.current.defBtnCancel} defBtnNo={settings.current.defBtnNo} defBtnOk={settings.current.defBtnOk}
                defBtnYes={settings.current.defBtnYes} fullscreen={settings.current.fullscreen} inputSelectRange={settings.current.inputSelectRange} 
                inputSpellCheck={settings.current.inputSpellCheck} inputText={settings.current.inputText} slide={settings.current.slide} slideReverse={settings.current.slideReverse}
            />
        </div>
    ) : null
})

export default Dialog

//TODO results, enter, input, 2 dialogs
//TODO slide
//TODO fullscreen
//TODO extension