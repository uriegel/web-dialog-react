import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { DialogResult, ExtensionProps, ResultType, Slide } from "."
import "./DialogBox.css"

interface DialogBoxProps {
    hidden: boolean
    setShow: (show: boolean) => void
    setResult: (result: DialogResult) => void
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
    btnOkText?: string
    btnCancelText?: string
    btnYesText?: string
    btnNoText?: string
    slide?: Slide
    inputText?: string
    inputSelectRange?: number[]
    inputSpellCheck?: boolean
    fullscreen?: boolean
    extension?: (props: ExtensionProps) => JSX.Element
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onExtensionChanged?: (t: any) => void
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    extensionProps?: any
}

export type DialogBoxHandle = {
    close: ()=>void
}

const DialogBox = forwardRef<DialogBoxHandle, DialogBoxProps>(({ hidden, setShow, setResult, close, text, btnOk, btnCancel, btnNo, btnYes,
    defBtnCancel, defBtnNo, defBtnOk, defBtnYes, btnOkText, btnCancelText, btnNoText, btnYesText,
    inputText, inputSpellCheck, inputSelectRange, slide, fullscreen, extension, onExtensionChanged, extensionProps}, ref) => {

    const dialog = useRef<HTMLDivElement>(null)

    const focusables = useRef<HTMLElement[]>([])
    const focusIndex = useRef(0)
    const dialogResult = useRef<DialogResult>({result: ResultType.Cancel})

    const [textValue, setTextValue] = useState(inputText || "")
    const [buttonFocused, setButtonFocused] = useState(false)
    const [slideControl, setSlideControl] = useState(slide)

    const input = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
        close() {
            onOk()
        }
    }))

    useEffect(() => {
        if (dialog.current) {
            const buttons = [...dialog.current.querySelectorAll(".wdr--button")] as HTMLElement[]
            const extendedFocusables = extension ? [...dialog.current.querySelectorAll(".wdr-focusable")] as HTMLElement[] : []
            const inputs = input.current ? [input.current as HTMLElement] : []
            focusables.current = inputs.concat(extendedFocusables).concat(buttons)
            focusIndex.current = extendedFocusables.length == 0 && inputs.length == 0
                ? buttons.findIndex(n => n.className.includes("default"))
                : 0
            focusIndex.current = focusIndex.current != -1 ? focusIndex.current : 0
            setSlideControl(Slide.None)
            focusCurrent()
            if (inputSelectRange)
                input.current?.setSelectionRange(inputSelectRange[0], inputSelectRange[1])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, [dialog])

    const onFaderTransitionEnd = () => {
        if (hidden) {
            setShow(false)
            setTimeout(() => setResult(dialogResult.current))
        }
    }

    const slideEnd = (ok: boolean) => 
        setSlideControl(
            slide == Slide.Left
            ? ok ? Slide.Right : Slide.Left
            : slide == Slide.Right
            ? ok ? Slide.Left : Slide.Right
            : Slide.None)

    const onOk = () => {
        dialogResult.current = { result: ResultType.Ok, input: textValue, props: extensionProps }
        slideEnd(true)
        close()
    }
    const onYes = () => {
        dialogResult.current = { result: ResultType.Yes, input: textValue, props: extensionProps }
        slideEnd(true)
        close()
    }
    const onCancel = () =>{
        dialogResult.current = { result: ResultType.Cancel }
        slideEnd(false)
        close()
    }
    const onNo = () => {
        dialogResult.current = { result: ResultType.No }
        slideEnd(btnCancel ?? false)
        close()
    }

    const selectInput = () => input.current?.select()

    const focusCurrent = (reverse?: boolean) => {
        const setFocus = () => {
            if (focusIndex.current >= focusables.current.length)
                focusIndex.current = 0
            if (focusIndex.current < 0)
                focusIndex.current = focusables.current.length - 1
            const element = focusables.current[focusIndex.current]
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!(element as any).disabled) {
                element.focus()
                return true
            }
            focusIndex.current = reverse ? focusIndex.current - 1 : focusIndex.current + 1
            return false
        }
        while (!setFocus());
    }  

    const onKeyDown = (evt: React.KeyboardEvent) => {
        switch (evt.code) {
            case "Tab": 
                focusIndex.current = evt.shiftKey ? focusIndex.current - 1 : focusIndex.current + 1
                focusCurrent(evt.shiftKey)
                break
            case "Enter": 
                if (!buttonFocused) {
                    const element = focusables.current.find(n => n.classList.contains("default"))
                    if (element)
                        element.click()
                } else
                    focusables.current[focusIndex.current].click()
                break
            case "Escape":
                if (btnCancel || !btnNo) 
                    onCancel()
                break            
            default:
                return
        }
        evt.preventDefault()
        evt.stopPropagation()            
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setTextValue(e.target.value)

    const onFocus = () => {
        focusIndex.current = focusables.current.findIndex(n => n == document.activeElement)
        if (focusIndex.current == -1)
            focusIndex.current = 0
        setButtonFocused(focusables.current[focusIndex.current].classList.contains("wdr--button"))
    }

    return (
        <>
            <div className='wdr--fader' onTransitionEnd={onFaderTransitionEnd}></div>
            <div className={`wdr--container${
                    slideControl == Slide.Left
                    ? " leftTranslated"
                    : slideControl == Slide.Right
                    ? " rightTranslated"
                    : ""
                }`}
                onKeyDown={onKeyDown}>
                <div ref={dialog} className={`wdr--dialog${fullscreen ? " fullscreen" : ""}`} onFocus={onFocus}>
                    <div className='wdr--content'>
                        <p>{text}</p>
                        { inputText != undefined
                            ? (<input type={"text"} ref={input} className='wdr--input' spellCheck={inputSpellCheck == true} value={textValue} onChange={onInputChange}
                                onFocus={selectInput}></input>)
                            : null
                        }
                        {
                            extension 
                            ? extension({ onChange: onExtensionChanged, props: extensionProps })
                            :null
                        }
                    </div>
                    <div>
                        <div className={`wdr--buttons${buttonFocused ? " buttonFocused" : ""}`}>
                            { btnOk ? (
                                <div className={`wdr--button${defBtnOk ? " default" : ""}`}
                                        tabIndex={1} onClick={onOk}>
                                    { btnOkText || "OK" }
                                </div>)
                                : null
                            }
                            { btnYes ? (
                                <div className={`wdr--button${defBtnYes ? " default" : ""}`}
                                    tabIndex={1} onClick={onYes}>   
                                    { btnYesText || "Ja" }
                                </div>)
                                : null
                            }
                            { btnNo ? (
                                <div className={`wdr--button${defBtnNo ? " default" : ""}`}
                                        tabIndex={2} onClick={onNo}>
                                    { btnNoText || "Nein" }
                                </div>)
                                : null
                            }
                            { btnCancel ? (
                                <div className={`wdr--button${defBtnCancel ? " default" : ""}`}
                                        tabIndex={3} onClick={onCancel}>
                                    { btnCancelText || "Abbrechen" }
                                </div>)
                                : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})

export default DialogBox