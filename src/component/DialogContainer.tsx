import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './DialogBox.css'
import { DialogHandle, DialogResult, Settings } from '.'
import DialogBox, { DialogBoxHandle } from './DialogBox'

const DialogContainer = forwardRef<DialogHandle>((_, ref) => {
    
    const [show, setShow] = useState(false)
    const [hidden, setHidden] = useState(true)
   
    const settings = useRef<Settings>({ text: "" })
    const lastActive = useRef<HTMLElement | null>(null)
    const resolveResult = useRef<((result: DialogResult) => void) | null>(null)

    const dialogBox = useRef<DialogBoxHandle>(null)

    useImperativeHandle(ref, () => ({
        async showDialog<T>(settingsValue: Settings, makeResult?: (res: DialogResult) => T) {
            settings.current = settingsValue
            setShow(true)
            const result = await new Promise<DialogResult>(res => resolveResult.current = res)
            return (makeResult?.(result) ?? result) as T
        },
        close() {
            dialogBox.current?.close()
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
            setHidden(false)
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
                btnNo={settings.current.btnNo} btnOk={settings.current.btnOk} btnYes={settings.current.btnYes} defBtnCancel={settings.current.defBtnCancel}
                defBtnNo={settings.current.defBtnNo} defBtnOk={settings.current.defBtnOk} defBtnYes={settings.current.defBtnYes}
                btnOkText={settings.current.btnOkText} btnCancelText={settings.current.btnCancelText} btnYesText={settings.current.btnYesText} btnNoText={settings.current.btnNoText}
                fullscreen={settings.current.fullscreen} inputSelectRange={settings.current.inputSelectRange} inputSpellCheck={settings.current.inputSpellCheck}
                inputText={settings.current.inputText} slide={settings.current.slide}
                extension={settings.current.extension} onExtensionChanged={settings.current.onExtensionChanged} extensionProps={settings.current.extensionProps}
            />
        </div>
    ) : null
})

export default DialogContainer
