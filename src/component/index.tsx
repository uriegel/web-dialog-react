import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './DialogBox.css'
import DialogBox, { DialogBoxHandle } from './DialogBox'

export enum Slide {
    None,
    Left,
    Right
}

export interface ExtensionProps {
    onChange?: (t: any) => void
    props?: any
}

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
    slide?: Slide
    inputText?: string
    inputSelectRange?: number[]
    inputSpellCheck?: boolean
    fullscreen?: boolean
    extension?: (props: ExtensionProps) => JSX.Element
    onExtensionChanged?: (t: any) => void
    extensionProps?: any
}

export enum Result {
    Ok,
    Yes,
    No,
    Cancel
} 

export type DialogResult = {
    result: Result
    input?: string
    props?: any
}

export type DialogHandle = {
    show: (settings: Settings)=>Promise<DialogResult>
    close: ()=>void
}

const Dialog = forwardRef<DialogHandle>((_, ref) => {
    
    const [show, setShow] = useState(false)
    const [hidden, setHidden] = useState(true)
   
    const settings = useRef<Settings>({ text: "" })
    const lastActive = useRef<HTMLElement | null>(null)
    const resolveResult = useRef<((result: DialogResult) => void) | null>(null)

    const dialogBox = useRef<DialogBoxHandle>(null)

    useImperativeHandle(ref, () => ({
        show(settingsValue: Settings) {
            settings.current = settingsValue
            setShow(true)
            return new Promise<DialogResult>(res => {
                resolveResult.current = res
            })
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
                fullscreen={settings.current.fullscreen} inputSelectRange={settings.current.inputSelectRange} inputSpellCheck={settings.current.inputSpellCheck}
                inputText={settings.current.inputText} slide={settings.current.slide}
                extension={settings.current.extension} onExtensionChanged={settings.current.onExtensionChanged} extensionProps={settings.current.extensionProps}
            />
        </div>
    ) : null
})

export default Dialog

