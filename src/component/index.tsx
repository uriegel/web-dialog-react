import React, { createContext, useEffect, useRef, useState } from 'react'
import './DialogBox.css'
import { AsyncResult, Result } from 'functional-extensions'
import DialogContainer from './DialogContainer'

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
    defBtnOk?: boolean
    defBtnYes?: boolean
    defBtnNo?: boolean
    defBtnCancel?: boolean
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
    onExtensionChanged?: (t: any) => void
    extensionProps?: any
}

export enum ResultType {
    Ok,
    Yes,
    No,
    Cancel
} 

export type DialogResult = {
    result: ResultType
    input?: string
    props?: any
}

export type DialogHandle = {
    show: (settings: Settings) => Promise<DialogResult>
    showDialog: <T, TE>(settings: Settings, makeResult: (res: DialogResult)=>Result<T, TE>)=>AsyncResult<T, TE>
    close: ()=>void
}

type WithDialogProps = {
    children: JSX.Element
}

export const DialogContext = createContext(null as any as DialogHandle)

const WithDialog = ({ children }: WithDialogProps) => {
    
    const dialog = useRef<DialogHandle>(null)
    const [dialogHandle, setDialogHandle] = useState(null as any as DialogHandle)

    useEffect(() => setDialogHandle(dialog.current!), [dialog])

    return (
        <DialogContext.Provider value={dialogHandle}>
            <>
                {children}
                <DialogContainer ref={dialog} />
            </>
        </DialogContext.Provider>
    )
}

export default WithDialog
