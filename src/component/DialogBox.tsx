import React, { useEffect } from "react"

interface DialogBoxProps {
    hidden: boolean
    setShow: (show: boolean) => void
    close:()=>void
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

const DialogBox = ({hidden, setShow, close, text, btnOk, btnCancel, btnNo, btnYes, defBtnCancel, defBtnNo, defBtnOk, defBtnYes }: DialogBoxProps) => {
    
    useEffect(() => {
        // TODO find all focusables when rendered first time
    //     const focusables = [
    //         btnOkRef.current, btnYesRef.current, btnCancelRef.current, btnNoRef.current
    //     ].filter(n => n != null)
    //     console.log("focusables", focusables)
    //     focusables[0]?.focus()
    }, [])

    const onFaderTransitionEnd = () => {
        if (hidden)
            setShow(false)
    }

    const onOk = () => {
        close()
    }

    const onYes = () => close()

    const onCancel = () => close()

    const onNo = () => close()

    const onKeyDown = (evt: React.KeyboardEvent) => {
        switch (evt.code) {
        //     case "Tab": 
        //         // const setFocus = () => {
        //         //     this.focusIndex = evt.shiftKey ? this.focusIndex - 1 : this.focusIndex + 1
        //         //     if (this.focusIndex >= this.focusables.length)
        //         //         this.focusIndex = 0
        //         //     if (this.focusIndex < 0)
        //         //         this.focusIndex = this.focusables.length - 1
        //         //     const element = this.focusables[this.focusIndex]
        //         //     if (!(element as any).disabled) {
        //         //         element.focus()
        //         //         return true
        //         //     }
        //         //     return false
        //         // }
        //         // while (!setFocus());
        //         break
        //     case "Enter": 
        //         //if (this.defBtn && !this.buttonHasFocus) {
        //         //     const result = 
        //         //         this.defBtn == this.btnOk
        //         //         ? Result.Ok
        //         //         : this.defBtn == this.btnYes
        //         //         ? Result.Yes
        //         //         : this.defBtn == this.btnNo
        //         //         ? Result.No
        //         //         : Result.Cancel
        //         //     this.closeDialog(result)
        //         //}
        //         break
            case "Escape":
                if (btnCancel || !btnNo) 
                     close()
                break            
            default:
                return
        }
        evt.preventDefault()
        evt.stopPropagation()            
    }

    return (
        <>
            <div className='wdr--fader' onTransitionEnd={onFaderTransitionEnd}></div>
            <div className='wdr--container' onKeyDown={onKeyDown}>
                <div className='wdr--dialog'>
                    <div className='wdr--content'>
                        <p>{text}</p>
                    </div>
                    <div className='wdr--buttons-container'>
                        <div className='wdr--buttons'>
                            {btnOk ? (
                                <div className={`wdr--button${defBtnOk ? " default" : ""}`}
                                        tabIndex={1} onClick={onOk}>
                                    OK
                                </div>)
                                : (<></>)}
                            {btnYes ? (
                                <div className={`wdr--button${defBtnYes ? " default" : ""}`}
                                    tabIndex={1} onClick={onYes}>
                                    Ja
                                </div>)
                                : (<></>)}
                            {btnCancel ? (
                                <div className={`wdr--button${defBtnCancel ? " default" : ""}`}
                                        tabIndex={2} onClick={onCancel}>
                                    Abbrechen
                                </div>)
                                : (<></>)}
                            {btnNo ? (
                                <div className={`wdr--button${defBtnNo ? " default" : ""}`}
                                        tabIndex={3} onClick={onNo}>
                                    Nein
                                </div>)
                                : (<></>)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DialogBox