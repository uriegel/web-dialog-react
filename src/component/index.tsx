import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './Dialog.css'

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

    const settings = useRef<Settings>({ text: "" })
    
    const dialogRef = useRef<HTMLDivElement>(null)
    const btnOkRef = useRef<HTMLDivElement>(null)
    const btnYesRef = useRef<HTMLDivElement>(null)
    const btnCancelRef = useRef<HTMLDivElement>(null)
    const btnNoRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
        async show(settingsValue: Settings) {
            settings.current = settingsValue
            setShow(true)
            setText(settings.current.text)
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

    const onYes = () => close()

    const onCancel = () => close()

    const onNo = () => close()

    useEffect(() => { if (show) setHidden(false) },
        [show])
    
    useEffect(() => {
        const focusables = [
            btnOkRef.current, btnYesRef.current, btnCancelRef.current, btnNoRef.current
        ].filter(n => n != null)
        console.log("focusables", focusables)
        focusables[0]?.focus()
    }, [dialogRef.current])
    
    const onKeyDown = (evt: React.KeyboardEvent) => {
        switch (evt.code) {
            case "Tab": 
                // const setFocus = () => {
                //     this.focusIndex = evt.shiftKey ? this.focusIndex - 1 : this.focusIndex + 1
                //     if (this.focusIndex >= this.focusables.length)
                //         this.focusIndex = 0
                //     if (this.focusIndex < 0)
                //         this.focusIndex = this.focusables.length - 1
                //     const element = this.focusables[this.focusIndex]
                //     if (!(element as any).disabled) {
                //         element.focus()
                //         return true
                //     }
                //     return false
                // }
                // while (!setFocus());
                break
            case "Enter": 
                //if (this.defBtn && !this.buttonHasFocus) {
                //     const result = 
                //         this.defBtn == this.btnOk
                //         ? Result.Ok
                //         : this.defBtn == this.btnYes
                //         ? Result.Yes
                //         : this.defBtn == this.btnNo
                //         ? Result.No
                //         : Result.Cancel
                //     this.closeDialog(result)
                //}
                break
            case "Escape":
                if (btnCancelRef.current || !btnNoRef.current) 
                     close()
                break            
            default:
                return
        }
        evt.preventDefault()
        evt.stopPropagation()            
    }
    
    return show ? (
        <div ref={dialogRef} className={`wdr--dialogroot${hidden ? " hidden" : ""}`} onKeyDown={onKeyDown}>
            <div className='wdr--fader' onTransitionEnd={onFaderTransitionEnd}></div>
            <div className='wdr--container'>
                <div className='wdr--dialog'>
                    <div className='wdr--content'>
                        <p>{text}</p>
                    </div>
                    <div className='wdr--buttons-container'>
                        <div className='wdr--buttons'>
                            {settings.current.btnOk ? (
                                <div className={`wdr--button${settings.current.defBtnOk ? " default" : ""}`}
                                    ref={btnOkRef} tabIndex={1} onClick={onOk}>
                                        OK
                                </div>)
                                : (<></>)}
                            {settings.current.btnYes ? (
                                <div className={`wdr--button${settings.current.defBtnYes ? " default" : ""}`}
                                    ref={btnYesRef} tabIndex={1} onClick={onYes}>
                                    Ja
                                </div>)
                                : (<></>)}
                            {settings.current.btnCancel ? (
                                <div className={`wdr--button${settings.current.defBtnCancel ? " default" : ""}`}
                                    ref={btnCancelRef} tabIndex={2} onClick={onCancel}>
                                    Abbrechen
                                </div>)
                                : (<></>)}
                            {settings.current.btnNo ? (
                                <div className={`wdr--button${settings.current.defBtnNo ? " default" : ""}`}
                                    ref={btnNoRef} tabIndex={3} onClick={onNo}>
                                    Nein
                                </div>)
                                : (<></>)}
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

//TODO tab control
//TODO results
//TODO slide