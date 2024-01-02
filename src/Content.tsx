import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { DialogContext, ExtensionProps, ResultType, Slide } from './component' 
import { Err, Ok, delayAsync } from 'functional-extensions'
import { Theme, themes } from './themes'

type ContentProps = {
    theme: Theme
    onThemeChanged: (theme:Theme)=>void
}

function Content({ theme, onThemeChanged}: ContentProps) {

    const onThemeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const theme = themes.find(n => n.name == e.target.value)!
        onThemeChanged(theme)
    }

    const dialog = useContext(DialogContext)

    console.log("dialog", dialog)

    const showStandardDialog = async () => {
        const res = await dialog.show({
            text: "Standard",
            btnOk: true,
            btnCancel: true,
            defBtnCancel: true
        })
        console.log("Dialog closed", res)
    }

    const autoCloseDialog = async () => {
        dialog.show({
            text: "Standard, closes after 10 s",
            btnCancel: true,
            defBtnCancel: true
        })
        await delayAsync(10000)
        // TODO callback for close!
        dialog.close()
    }
    
    const showSlideDialog = async () => {
        const res = await dialog.show({
            text: "Slide from left",
            slide: Slide.Left,
            btnOk: true,
            btnCancel: true
        })
        console.log("Dialog closed", res)
    }

    const showSlideReverseDialog = async () => {
        const res = await dialog.show({
            text: "Slide from right",
            slide: Slide.Right,
            btnOk: true,
            btnCancel: true
        })
        console.log("Dialog closed", res)
    }

    const show3ButtonsDialog = async () => {
        const res = await dialog.show({
            text: "3 Buttons",
            btnYes: true,
            btnNo: true,
            btnCancel: true
        })
        console.log("Dialog closed", res)
    }

    const customButtonTextsDialog = async () => {
        const res = await dialog.show({
            text: "3 Buttons",
            btnYes: true,
            btnYesText: "Yes",
            btnNo: true,
            btnNoText: "No",
            btnCancel: true,
            btnCancelText: "Cancel"
        })
        console.log("Dialog closed", res)
    }

    const showTextInputDialog = async () => {
        const res = dialog.showDialog<string, boolean>({
            text: "Text input:",
            inputText: "The text input",
            btnOk: true,
            btnCancel: true,
            defBtnCancel: true
        }, res => res.result == ResultType.Ok && res.input
            ? new Ok(res.input)
            : new Err(false))
        const rest = await res?.toResult()
        rest?.match(
            val => console.log("Chosen", val),
            () => console.log("cancelled"))
    }

    const showRenameDialog = async () => {
        const res = await dialog.show({
            text: "Rename File:",
            inputText: "Apocalypse Now.mp4",
            inputSelectRange: [0, 14],
            btnOk: true,
            btnCancel: true,
            defBtnOk: true
        })
        console.log("Dialog closed", res)
    }

    const showOkDialog = async () => {
        const res = await dialog.show({
            text: "Only Ok",
            btnOk: true
        })
        console.log("Dialog closed", res)
    }

    const showYesNoDialog = async () => {
        const res = await dialog.show({
            text: "Yes and No",
            btnYes: true,
            btnNo: true
        })
        console.log("Dialog closed", res)
    }

    const showFullScreenDialog = async () => {
        const res = await dialog.show({
            text: "Fullscreen dialog",
            btnOk: true,
            fullscreen: true,
            btnCancel: true
        })
        console.log("Dialog closed", res)
    }

    const ExtendedContentNoControls = () => (
        <>
            <p>Some extended content</p>
            <p>Some other extended content</p>
        </>
    )

    const ExtendedContent = ({onChange }: ExtensionProps) => {
        
        const [option1, setOption1] = useState(false)
        const [option2, setOption2] = useState(true)
        const [option3, setOption3] = useState(false)

        useEffect(() => {
            if (onChange)
                onChange({option1, option2, option3})
        })

        return (
            <>
                <div>
                    <input type="checkbox" onChange={e => setOption1(e.currentTarget.checked)} className="wdr-focusable" name="chkbx1" checked={option1} />
                    <label htmlFor="chkbx1">First option</label>
                </div>
                <div>
                    <input type="checkbox" onChange={e => setOption2(e.currentTarget.checked)} className="wdr-focusable" name="chkbx2" checked={option2} />
                    <label htmlFor="chkbx2">2nd option</label>
                </div>
                <div>
                    <input type="checkbox" className="wdr-focusable" disabled name="chkbx3" />
                    <label htmlFor="chkbx3">2nd option</label>
                </div>
                <div>
                    <input type="checkbox" onChange={e => setOption3(e.currentTarget.checked)} className="wdr-focusable" name="chkbx4" checked={option3} />
                    <label htmlFor="chkbx3">2nd option</label>
                </div>
            </>
        )
    }

    const ExtendedContentRes = ({props }: ExtensionProps) => {
        
        const [text, setText] = useState(props.text)
        const [active, setActive] = useState(props.active)

        const onText = (val: string) => {
            setText(val)
            props.text = val
        }

        const setOption = (val: boolean) => {
            setActive(val)
            props.active = val
        }

        return (
            <>
                <div>
                    <input type="text" onChange={e => onText(e.target.value)} className="wdr-focusable" value={text} />
                </div>
                <div>
                    <input type="checkbox" onChange={e => setOption(e.currentTarget.checked)} className="wdr-focusable" name="chkbx2" checked={active} />
                    <label htmlFor="chkbx2">option</label>
                </div>
            </>
        )
    }

    const showExtendedDialog = async () => {
        const res = await dialog.show({
            text: "Standard extended",
            btnOk: true,
            btnCancel: true,
            defBtnCancel: true,
            extension: ExtendedContent,
            onExtensionChanged: (val: any) => {
                console.log("On Changed", val)
            }
        })
        console.log("Dialog closed", res)
    }

    const showExtendedDialogRes = async () => {
        const res = await dialog.show({
            text: "Standard extended",
            btnOk: true,
            btnCancel: true,
            defBtnCancel: true,
            extension: ExtendedContentRes,
            extensionProps: { text: "The text", active: false }
        })
        console.log("Dialog closed", res)
    }
    

    const showExtendedInputDialog = async () => {
        const res = await dialog.show({
            text: "Standard extended",
            inputText: "The text input",
            btnOk: true,
            btnCancel: true,
            defBtnCancel: true,
            extension: ExtendedContent,
            onExtensionChanged: (val: any) => {
                console.log("On Changed", val)
            }
        })
        console.log("Dialog closed", res)
    }

    const showExtendedNoControlsDialog = async () => {
        const res = await dialog.show({
            text: "Standard extended no Controls",
            btnOk: true,
            btnCancel: true,
            defBtnCancel: true,
            extension: ExtendedContentNoControls
        })
        console.log("Dialog closed", res)
    }

    return (
        <>
            <select value={theme.name} onChange={onThemeChange}>
                {themes.map((n, i) => <option key={i}>{n.name}</option>) }
            </select>
            <h1>Dialog Box Component</h1>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                <button onClick={showStandardDialog}>Show Dialog</button> 
                <button onClick={showExtendedDialog}>Show Dialog Extended</button> 
                <button onClick={showExtendedDialogRes}>Show Dialog Extended with Result</button> 
                <button onClick={showExtendedInputDialog}>Show Dialog Input Extended</button> 
                <button onClick={showExtendedNoControlsDialog}>Show Dialog Extended no Controls</button> 
                <button onClick={showSlideDialog}>Slide Left</button> 
                <button onClick={showSlideReverseDialog}>Slide Right</button> 
                <button onClick={show3ButtonsDialog}>3 Buttons</button> 
                <button onClick={showTextInputDialog}>Text input</button> 
                <button onClick={showRenameDialog}>Rename file</button> 
                <button onClick={showOkDialog}>OK</button> 
                <button onClick={showYesNoDialog}>Ja Nein</button>
                <button onClick={showFullScreenDialog}>Fullscreen</button>
                <button onClick={autoCloseDialog}>Auto close</button>
                <button onClick={customButtonTextsDialog}>Custom Buttons</button>
            </p>
            <p>

                
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>			
        </>
	)
}

export default Content


