import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './DialogBox.css'
import { DialogHandle, DialogResult, Settings } from '.'
import DialogBox, { DialogBoxHandle } from './DialogBox'

const DialogContainer = forwardRef<DialogHandle>((_, ref) => {
    
    const [show, setShow] = useState(false)
    const [hidden, setHidden] = useState(true)
   
    const settings = useRef<Settings>({ text: "" })
    const callback = useRef<(show: boolean)=>void | null>(null)
    const lastActive = useRef<HTMLElement | null>(null)
    const resolveResult = useRef<((result: DialogResult) => void) | null>(null)

    const dialogBox = useRef<DialogBoxHandle>(null)

    useImperativeHandle(ref, () => ({
        async show(settingsValue: Settings) {
            settings.current = settingsValue
            callback.current?.(true)
            setShow(true)
            const result = await new Promise<DialogResult>(res => resolveResult.current = res)
            callback.current?.(false)
            return result
        },
        close() {
            dialogBox.current?.close()
        },
        setCallback(cb: (show: boolean) => void) {
            callback.current = cb
        }
    }))

    const close = () => setHidden(true)

    if (show && !lastActive.current)
        lastActive.current = document.activeElement as HTMLElement
    else if (!show && lastActive.current) {
        lastActive.current?.focus()
        lastActive.current = null
    }

    useEffect(() => {
        if (show) 
            setTimeout(() => setHidden(false), 50)
    }, [show])
    
    const setResult = (result: DialogResult) => {
        if (resolveResult.current) {
            resolveResult.current(result)
            resolveResult.current = null
        }
    }

    return show ? (
        <div className={`wdr--dialogroot${hidden ? " hidden" : ""}`} >
            <DialogBox ref={dialogBox} hidden={hidden} setShow={setShow} setResult={setResult} close={close} text={settings.current.text} btnCancel={settings.current.btnCancel}
                btnNo={settings.current.btnNo} btnOk={settings.current.btnOk} btnYes={settings.current.btnYes} 
                defBtnNo={settings.current.defBtnNo} defBtnOk={settings.current.defBtnOk} defBtnYes={settings.current.defBtnYes}
                btnOkText={settings.current.btnOkText} btnYesText={settings.current.btnYesText} btnNoText={settings.current.btnNoText}
                fullscreen={settings.current.fullscreen} inputSelectRange={settings.current.inputSelectRange} inputSpellCheck={settings.current.inputSpellCheck}
                inputText={settings.current.inputText} slide={settings.current.slide}
                extension={settings.current.extension} onExtensionChanged={settings.current.onExtensionChanged} extensionProps={settings.current.extensionProps}
            />
        </div>
    ) : null
})

export default DialogContainer
