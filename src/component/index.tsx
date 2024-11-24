import React, { createContext, useEffect, useRef, useState } from 'react'
import './DialogBox.css'
import DialogContainer from './DialogContainer'

export enum Slide {
    None,
    Left,
    Right
}

export interface ExtensionProps {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?: (t: any) => void
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onExtensionChanged?: (t: any) => void
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    props?: any
}

export type DialogHandle = {
    showDialog: <T>(settings: Settings, makeResult?: (res: DialogResult)=>T)=>Promise<T>
    close: ()=>void
}

type WithDialogProps = {
    children: JSX.Element
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DialogContext = createContext(null as any as DialogHandle)

const WithDialog = ({ children }: WithDialogProps) => {
    
    const dialog = useRef<DialogHandle>(null)
    //eslint-disable-next-line @typescript-eslint/no-explicit-any    
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

// TODO dialog.showDialog => show
// TODO disable lint warnings
// TODO Cancel is Cross top right
// TODO 0-3 buttons with choosen text
// TODO Animation in Commander especially copy dialog
