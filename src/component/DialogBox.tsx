import React, { useEffect, useRef, useState } from "react"
import { DialogResult, Result, Slide } from "."
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
    slide?: Slide
    inputText?: string
    inputSelectRange?: number[]
    inputSpellCheck?: boolean
    fullscreen?: boolean
    extension?: ()=>JSX.Element
}

const DialogBox = ({ hidden, setShow, setResult, close, text, btnOk, btnCancel, btnNo, btnYes, defBtnCancel, defBtnNo, defBtnOk, defBtnYes,
    inputText, inputSpellCheck, inputSelectRange, slide, fullscreen, extension }: DialogBoxProps) => {

    const dialog = useRef<HTMLDivElement>(null)

    const focusables = useRef<HTMLElement[]>([])
    const focusIndex = useRef(0)
    const dialogResult = useRef<DialogResult>({result: Result.Cancel})

    const [textValue, setTextValue] = useState(inputText || "")
    const [buttonFocused, setButtonFocused] = useState(false)
    const [slideControl, setSlideControl] = useState(slide)

    const input = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (dialog.current) {
            const buttons = [...dialog.current.querySelectorAll(".wdr--button")] as HTMLElement[]
            focusables.current = input.current ? [input.current as HTMLElement].concat(buttons) : buttons
            focusIndex.current = 0
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
            console.log("Guten Abend")
            setTimeout(() => setResult(dialogResult.current))
        }
    }

    const onOk = () => {
        dialogResult.current = { result: Result.Ok, input: textValue }
        setSlideControl(slide)
        close()
    }
    const onYes = () => {
        dialogResult.current = { result: Result.Yes, input: textValue }
        setSlideControl(slide)
        close()
    }
    const onCancel = () =>{
        dialogResult.current = { result: Result.Cancel }
        setSlideControl(slide)
        close()
    }
    const onNo = () => {
        dialogResult.current = { result: Result.No }
        setSlideControl(slide)
        close()
    }

    const selectInput = () => input.current?.select()

    const focusCurrent = () => {
        const setFocus = () => {
            if (focusIndex.current >= focusables.current.length)
                focusIndex.current = 0
            if (focusIndex.current < 0)
                focusIndex.current = focusables.current.length - 1
            const element = focusables.current[focusIndex.current]
            if (!(element as any).disabled) {
                element.focus()
                return true
            }
            return false
        }
        while (!setFocus());
    }  

    const onKeyDown = (evt: React.KeyboardEvent) => {
        switch (evt.code) {
            case "Tab": 
                focusIndex.current = evt.shiftKey ? focusIndex.current - 1 : focusIndex.current + 1
                focusCurrent()
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
                        { extension ? extension() : null }
                    </div>
                    <div>
                        <div className={`wdr--buttons${buttonFocused ? " buttonFocused" : ""}`}>
                            { btnOk ? (
                                <div className={`wdr--button${defBtnOk ? " default" : ""}`}
                                        tabIndex={1} onClick={onOk}>
                                    OK
                                </div>)
                                : null
                            }
                            { btnYes ? (
                                <div className={`wdr--button${defBtnYes ? " default" : ""}`}
                                    tabIndex={1} onClick={onYes}>   
                                    Ja
                                </div>)
                                : null
                            }
                            { btnNo ? (
                                <div className={`wdr--button${defBtnNo ? " default" : ""}`}
                                        tabIndex={2} onClick={onNo}>
                                    Nein
                                </div>)
                                : null
                            }
                            { btnCancel ? (
                                <div className={`wdr--button${defBtnCancel ? " default" : ""}`}
                                        tabIndex={3} onClick={onCancel}>
                                    Abbrechen
                                </div>)
                                : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DialogBox